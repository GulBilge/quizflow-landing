import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import QRCode from "qrcode";

// Initialize pdfMake with vfs_fonts - this is needed for pdfmake to have access to default fonts
if (pdfFonts && (pdfFonts as any).pdfMake) {
    (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
}

const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { quiz_id, locale = 'tr' } = body;

        if (!quiz_id) {
            return NextResponse.json({ error: "quiz_id is required" }, { status:400 });
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Always include answer key and never shuffle for PDF downloads
        const shuffle = false;
        const include_answer_key = true;

        // Initialize Supabase client with the user's JWT
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            }
        );

        // 1. Fetch User Profile to check Premium status
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("is_pro")
            .eq("id", user.id)
            .single();

        if (!profile?.is_pro) {
            return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
        }

        // 2. Fetch Quiz Data
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('title, content')
            .eq('id', quiz_id)
            .single();

        if (quizError || !quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        // 3. Generate QR Code
        const qrUrl = `https://quizyen.com/${locale}/quiz-import?id=${quiz_id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, { width: 80, margin: 1 });

        const questionsToUse = shuffle ? shuffleArray(quiz.content as any[]) : (quiz.content as any[]);

        const smallWatermarkText = "Quizyen ile Hazırlandı / Prepared By Quizyen";

        // 4. Build PDF Document Definition (Mirrors utils/pdfGenerator.ts)
        const docDefinition: any = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            header: function(currentPage: number, pageCount: number) {
                return {
                    columns: [
                        {
                            text: smallWatermarkText,
                            color: '#cbd5e1',
                            fontSize: 6,
                            opacity: 0.5,
                            margin: [40, 20, 0, 0],
                            alignment: 'left'
                        },
                        {
                            image: qrCodeDataUrl,
                            width: 50,
                            alignment: 'right',
                            margin: [0, 10, 40, 0]
                        }
                    ]
                };
            },
            footer: function(currentPage: number, pageCount: number) {
                return {
                    columns: [
                        {
                            text: smallWatermarkText,
                            color: '#cbd5e1',
                            fontSize: 6,
                            opacity: 0.5,
                            alignment: 'left',
                            margin: [40, 0, 0, 0]
                        },
                        {
                            text: `Sayfa ${currentPage} / ${pageCount}`,
                            alignment: 'center',
                            color: '#64748b',
                            fontSize: 10
                        },
                        {
                            text: 'Her hakkı saklıdır.',
                            color: '#94a3b8',
                            fontSize: 8,
                            alignment: 'right',
                            margin: [0, 0, 40, 0]
                        }
                    ]
                };
            },
            content: [
                {
                    text: quiz.title,
                    fontSize: 24,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 20],
                    color: '#1e293b'
                }
            ],
            styles: {
                questionText: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 8],
                    color: '#0f172a'
                },
                optionText: {
                    fontSize: 12,
                    margin: [20, 4, 0, 4],
                    color: '#334155'
                },
                questionWatermark: {
                    fontSize: 5,
                    color: '#e2e8f0',
                    opacity: 0.4,
                    margin: [0, 2, 0, 0],
                    alignment: 'right'
                }
            },
            defaultStyle: {
                font: 'Roboto'
            }
        };

        questionsToUse.forEach((q, index) => {
            docDefinition.content.push({
                text: `${index + 1}. ${q.question}`,
                style: 'questionText'
            });

            const labels = ['A)', 'B)', 'C)', 'D)', 'E)'];
            q.options.forEach((opt: string, optIndex: number) => {
                docDefinition.content.push({
                    text: `${labels[optIndex]} ${opt}`,
                    style: 'optionText'
                });
            });

            docDefinition.content.push({
                text: smallWatermarkText,
                style: 'questionWatermark'
            });
        });

        if (include_answer_key && questionsToUse.length > 0) {
            docDefinition.content.push({
                text: 'Cevap Anahtarı',
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 40, 0, 20],
                pageBreak: 'before',
                color: '#1e293b'
            });

            const answersBody: any[][] = [];
            const columns = 5;
            for (let i = 0; i < questionsToUse.length; i += columns) {
                const row = [];
                for (let j = 0; j < columns; j++) {
                    if (i + j < questionsToUse.length) {
                        const q = questionsToUse[i + j];
                        const labels = ['A', 'B', 'C', 'D', 'E'];
                        const correctLabel = labels[q.correctAnswer];
                        row.push({ text: `${i + j + 1}. ${correctLabel}`, margin: [0, 5, 0, 5], alignment: 'center', bold: true, fontSize: 12, color: '#334155' });
                    } else {
                        row.push({ text: '', margin: [0, 5, 0, 5] });
                    }
                }
                answersBody.push(row);
            }

            docDefinition.content.push({
                table: {
                    widths: Array(columns).fill('*'),
                    body: answersBody
                },
                layout: 'noBorders',
                margin: [20, 0, 20, 0]
            });
        }

        // 5. Generate PDF Buffer
        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const pdfDoc = pdfMake.createPdf(docDefinition);
            pdfDoc.getBuffer((buffer: Buffer) => {
                resolve(buffer);
            });
        });

        // 6. Return Response
        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="quiz.pdf"`,
            },
        });

    } catch (error: any) {
        console.error("PDF Generate Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
