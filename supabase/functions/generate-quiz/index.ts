// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument } from "https://esm.sh/pdf-lib";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// YARDIMCI FONKSİYON: Dosyayı Google'a Yükler
async function uploadToGemini(fileBuffer: ArrayBuffer, mimeType: string, apiKey: string) {
    const NUM_BYTES = fileBuffer.byteLength;

    // 1. Upload işlemini başlat (Resumable Upload)
    const startUploadUrl = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`;

    const initialRes = await fetch(startUploadUrl, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': NUM_BYTES.toString(),
            'X-Goog-Upload-Header-Content-Type': mimeType,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: { displayName: 'exam_doc.pdf' } }),
    });

    if (!initialRes.ok) throw new Error(`Upload Başlatılamadı: ${await initialRes.text()}`);

    const uploadUrl = initialRes.headers.get('x-goog-upload-url');
    if (!uploadUrl) throw new Error("Upload URL alınamadı.");

    // 2. Dosyanın kendisini (Binary olarak) gönder
    const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Length': NUM_BYTES.toString(),
            'X-Goog-Upload-Offset': '0',
            'X-Goog-Upload-Command': 'upload, finalize',
        },
        body: fileBuffer, // Base64 DEĞİL, direkt Buffer gönderiyoruz (Çok daha hızlı)
    });

    if (!uploadRes.ok) throw new Error(`Dosya Yüklenemedi: ${await uploadRes.text()}`);

    const fileInfo = await uploadRes.json();
    return fileInfo.file.uri; // Örn: https://generativelanguage.googleapis.com/v1beta/files/xxxx
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    // Değişkenleri dışarıda tanımla
    let adminClient: any;
    let targetFilePath: string | null = null;
    let uploadedFileUri: string | null = null; // Google'daki dosya URI'si

    try {
        const { filePath } = await req.json();
        targetFilePath = filePath;

        if (!filePath) throw new Error("FilePath eksik.");

        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

        // 1. Supabase'den Dosyayı İndir (User Yetkisiyle)
        const userSupabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        console.log(`Supabase'den indiriliyor: ${filePath}`);
        const { data: fileBlob, error: downloadError } = await userSupabase.storage
            .from('documents')
            .download(filePath);

        if (downloadError) throw new Error(`Download Error: ${downloadError.message}`);

        // 2. Google'a Upload Et (Base64 ile uğraşmıyoruz!)
        console.log("Google Gemini'ye yükleniyor...");
        const arrayBuffer = await fileBlob.arrayBuffer();

        // 2.5 LİMİT KONTROLLERİ (10MB ve 15 Sayfa)
        const MAX_MB = 10;
        const MAX_BYTES = MAX_MB * 1024 * 1024;

        if (arrayBuffer.byteLength > MAX_BYTES) {
            throw new Error(`Dosya boyutu çok büyük. Maksimum ${MAX_MB}MB yükleyebilirsiniz.`);
        }

        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        // if (pageCount > 15) {
        //   throw new Error(`Sayfa sayısı limiti aşıldı. Maksimum 15 sayfa yükleyebilirsiniz. (Yüklenen: ${pageCount})`);
        // }
        console.log(`PDF Kontrolü Başarılı: ${pageCount} sayfa, ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

        // Yardımcı fonksiyonu kullanıyoruz
        uploadedFileUri = await uploadToGemini(arrayBuffer, 'application/pdf', GEMINI_API_KEY!);
        console.log(`Dosya yüklendi. URI: ${uploadedFileUri}`);

        // 3. Prompt Hazırlığı (URI Kullanarak)
        // Model ismini de güncelledik (2.5-flash stabil olanı)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const prompt = `
      You are an expert Educational Content Processor with multilingual capabilities.

TASK: Analyze PDF, determine the appropriate mode, and extract/generate educational content WITH SMART METADATA.

═══════════════════════════════════════════════════════════════════════
DOCUMENT IDENTIFICATION (CRITICAL)
═══════════════════════════════════════════════════════════════════════
For every document, analyze the first 500 tokens and overall context to generate:

1. SMART TITLE (title):
   - Extract the explicit exam name/header if available (e.g., "2023 AÖF İktisat Final").
   - If not explicit, generate a descriptive 3-5 word title based on content (e.g., "Project Management Risk Principles").
   - Avoid generic names like "Scan_001" or "Unknown PDF".

2. TOPIC TAG (topic):
   - Determine the high-level subject matter (e.g., "History", "Computer Science", "Driving License", "Marketing").
   - This will be used for folder suggestion.
   - Keep topic names concise and generic (single word or 2-word max).

MODE AUTO-DETECTION:
1. Scan PDF content
2. If structured exam questions with options detected → EXTRACTION mode
3. If educational text/lecture notes detected → GENERATION mode
4. Return detected mode in output

═══════════════════════════════════════════════════════════════════════
MODE 1: EXTRACTION (Extract existing questions from exam PDFs)
═══════════════════════════════════════════════════════════════════════

RULES:
1. Copy question text verbatim from PDF
2. Extract ALL options exactly as formatted (2-10 options supported)
3. Detect answer key from PDF:
   - FOUND → use it (source: "pdf")
   - NOT FOUND → attempt to answer from knowledge (source: "ai") + add warning
   - CANNOT answer (image-dependent/subjective) → null (source: "manual") + add warning
4. Auto-detect document language → return ISO 639-1 code

VISUAL DETECTION:
Scan for image reference keywords by language:
- English: "figure", "diagram", "chart", "graph", "image above", "according to"
- Turkish: "görselde", "şekilde", "grafikte", "yukarıdaki", "tabloya göre"
- Spanish: "figura", "gráfico", "según la imagen"
- French: "figure", "graphique", "d'après"
- German: "Abbildung", "Grafik", "laut"
- Arabic: "الشكل", "الرسم", "المخطط"
- Chinese: "图", "图表", "如图"
- Other languages: similar contextual patterns

If detected → has_image: true + page_number

═══════════════════════════════════════════════════════════════════════
MODE 2: GENERATION (Create quiz from educational content)
═══════════════════════════════════════════════════════════════════════

RULES:
1. Read entire PDF content (max 15 pages)
2. Identify key concepts, facts, definitions, and learning objectives
3. Generate 2-20 questions based on content complexity:
   - Simple content (definitions, facts): 5-8 questions, 2-4 options
   - Medium content (concepts, processes): 10-15 questions, 4-5 options
   - Complex content (analysis, synthesis): 15-20 questions, 5-10 options

QUESTION QUALITY STANDARDS:
✓ Test understanding, not just memorization
✓ Cover different sections/topics from content
✓ Progress from easy → medium → hard
✓ Clear, unambiguous questions
✓ One definitively correct answer
✓ Plausible distractors (common misconceptions, similar concepts)

DIFFICULTY DISTRIBUTION:
- Easy (30%): Direct recall, definitions, basic facts
- Medium (50%): Application, understanding, relationships
- Hard (20%): Analysis, synthesis, critical thinking

ANSWER GENERATION:
- Correct answer: Directly from PDF content
- Distractors: Plausible but incorrect
  * Use common student misconceptions
  * Mix related but distinct concepts
  * Avoid obviously wrong options
- All options: Similar length and complexity

═══════════════════════════════════════════════════════════════════════
UNIVERSAL RULES (Both Modes)
═══════════════════════════════════════════════════════════════════════

LANGUAGE:
- Auto-detect from first 2-3 questions/paragraphs
- Use detected language for ALL outputs (questions, explanations, warnings, title)
- Return ISO 639-1 code (en/tr/es/fr/de/ar/zh/ja/ko/etc)

OPTION HANDLING:
- Support 2-10 options per question
- Preserve original format (A/B/C or 1/2/3 or I/II/III)
- Never assume 5 options

ANSWER RESOLUTION PRIORITY:
1. PDF answer key (if present) → source: "pdf"
2. AI knowledge (if answerable) → source: "ai" + warning "AI_GENERATED"
3. Cannot determine → source: "manual" + warning "NEEDS_MANUAL"

EXPLANATIONS:
- Write in detected language
- Max 2 sentences
- Focus on WHY answer is correct
- Academic tone

ERROR HANDLING:
- Malformed questions → skip + add to warnings
- Missing context → flag as manual
- Subjective questions → null + manual
- Image-dependent (cannot solve) → null + manual

TITLE GENERATION:

EXTRACTION MODE:
1. Scan PDF header/footer/first page for metadata:
   - Course/Subject name
   - Year (2024, 2025, etc.)
   - Term/Semester (Fall/Güz, Spring/Bahar, etc.)
   - Exam type (Final, Midterm/Vize, Quiz, etc.)

2. Generate title using priority system:
   Priority 1 (Full): "[Course] [Year] [Term] [Exam Type]"
   Priority 2 (Partial): "[Course] [Exam Type]"
   Priority 3 (Minimal): "[Course] Sınavı" or "[Course] Exam"
   Priority 4 (Generic): "Genel Sınav" or "General Exam"

3. Examples by language:
   - Turkish: "İşletme 2024 Güz Finali", "Matematik Vize", "Biyoloji Quiz"
   - English: "Business 2024 Fall Final", "Math Midterm", "Biology Quiz"
   - Spanish: "Negocios 2024 Otoño Final", "Matemáticas Parcial"
   - French: "Commerce 2024 Automne Final", "Mathématiques Partiel"
   - German: "Wirtschaft 2024 Herbst Abschlussprüfung"

GENERATION MODE:
1. Extract main topic from content (title/headings/chapter name)
2. Generate descriptive title pattern:
   Priority 1: "[Topic] - Practice Quiz" or "[Topic] - Alıştırma"
   Priority 2: "[Chapter/Section] - Quiz"
   Priority 3: "Alıştırma Testi" or "Practice Quiz"

3. Examples by language:
   - Turkish: "Hücre Biyolojisi - Alıştırma", "Osmanlı Tarihi - Quiz"
   - English: "Cell Biology - Practice Quiz", "Ottoman History - Quiz"
   - Spanish: "Biología Celular - Práctica", "Historia Otomana - Quiz"
   - French: "Biologie Cellulaire - Pratique", "Histoire Ottomane - Quiz"

TITLE RULES (Both Modes):
- Max 60 characters (filename compatibility)
- Use detected language consistently
- Avoid special characters: / \ : * ? " < > |
- Must be descriptive and informative
- If uncertain, prefer generic but clear title

OUTPUT JSON SCHEMA:
{
  "mode": "extraction" | "generation",
  "metadata": {
    "title": "Smart Generated Title String",
    "topic": "Suggested Folder/Category Name",
    "language": "ISO-639-1 code",
    "total_questions": 0,
    "source_pages": 0,
    "difficulty_distribution": {
      "easy": 0,
      "medium": 0,
      "hard": 0
    }
  },
  "title": "Generated title in detected language",
  "questions": [
    {
      "question": "Question text in detected language",
      "options": ["Option 1", "Option 2", "..."],
      "correctAnswer": 0,
      "explanation": "Brief reason in detected language (max 2 sentences)",
      "difficulty": "easy" | "medium" | "hard",
      "has_image": false,
      "page": 1,
      "answer_source": "pdf" | "ai" | "manual"
    }
  ],
  "warnings": [
    "Q1_P2: AI_GENERATED - No answer key found",
    "Q5_P7: NEEDS_MANUAL - Image required"
  ]
}

WARNING CODES:
- "AI_GENERATED": Answer generated from AI knowledge (no answer key in PDF)
- "NEEDS_MANUAL": Requires image/context/manual review
- "PARTIAL_OCR": OCR quality issues detected
- "SUBJECTIVE": Question is opinion-based
- "AMBIGUOUS": Multiple valid interpretations

VALIDATION CHECKLIST:
□ Mode correctly detected
□ "title" and "topic" fields are populated meaningfully in metadata
□ Language ISO code present
□ All questions have 2+ options
□ correctAnswer is valid index (0 to options.length-1) OR null
□ Explanations match detected language
□ No hallucinated content
□ Warnings are specific and actionable

GEMINI-SPECIFIC OPTIMIZATIONS:
- Leverage native PDF understanding
- Use full 1M context window for comprehensive analysis
- Return clean, valid JSON (JSON mode enabled)
- Be concise in explanations (token efficiency)

CRITICAL: Return ONLY valid JSON. No preamble, no markdown, no explanations outside JSON.
    `;

        console.log("AI İşlemi başlatılıyor...");
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        // DİKKAT: inline_data yerine file_data kullanıyoruz
                        {
                            file_data: {
                                mime_type: "application/pdf",
                                file_uri: uploadedFileUri
                            }
                        }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json",
                    temperature: 0.1
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini Error:", errText);
            throw new Error(`Gemini API Hatası: ${errText}`);
        }

        const aiData = await response.json();
        const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) throw new Error("AI yanıtı boş.");

        // JSON Temizliği
        const cleanJson = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

        // Profildeki sayacı artır
        const { data: { user } } = await userSupabase.auth.getUser();
        if (user) {
            adminClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            const { data: profile } = await adminClient
                .from('profiles')
                .select('monthly_upload_count')
                .eq('id', user.id)
                .single();

            if (profile) {
                await adminClient
                    .from('profiles')
                    .update({ monthly_upload_count: (profile.monthly_upload_count || 0) + 1 })
                    .eq('id', user.id);
            }
        }

        return new Response(JSON.stringify(cleanJson), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error("GENEL HATA:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });

    } finally {
        // TEMİZLİK İŞLEMLERİ

        // 1. Supabase'den sil (Admin yetkisiyle)
        if (targetFilePath) {
            adminClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );
            await adminClient.storage.from('documents').remove([targetFilePath]);
            console.log("Supabase dosyası silindi.");
        }

        // 2. (Opsiyonel) Google'dan dosyayı silmek istersen burada silebilirsin.
        // Ancak Flash dosyaları zaten 48 saat sonra otomatik silinir, o yüzden şart değil.
    }
});
