import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import QRCode from "qrcode";

if (typeof window !== "undefined") {
    (pdfMake as any).vfs = pdfFonts && (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : undefined;
}

export interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface QuizData {
    title: string;
    content: Question[];
}

// PDF generation parameters
export const generateQuizPDF = async (
    quiz: QuizData, 
    quizId?: string,
    locale: string = 'tr'
): Promise<string | null> => {
    const shuffle = false;
    const includeAnswerKey = true;
    // Generate QR code data URL — links to the quiz import page when scanned
    const qrUrl = quizId
        ? `https://quizyen.com/${locale}/quiz-import?id=${quizId}`
        : `https://quizyen.com/${locale}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, { width: 80, margin: 1 });

    const questionsToUse = quiz.content;

    const watermarkText = "Quizyen ile Hazırlandı / Prepared By Quizyen";
    const smallWatermarkText = "Quizyen ile Hazırlandı / Prepared By Quizyen";

    // Build the document definition
    const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        
        // Header containing the QR code and small watermark
        header: function(currentPage: number, pageCount: number, pageSize: any) {
            return {
                columns: [
                    {
                        text: smallWatermarkText,
                        color: '#cbd5e1', // slate-300
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

        // Footer containing small watermarks
        footer: function(currentPage: number, pageCount: number) {
            const pageText = locale === 'tr' ? 'Sayfa' : 'Page';
            const rightsText = locale === 'tr' ? 'Her hakkı saklıdır.' : 'All rights reserved.';
            return {
                columns: [
                    {
                        text: smallWatermarkText, // Left bottom
                        color: '#cbd5e1',
                        fontSize: 6,
                        opacity: 0.5,
                        alignment: 'left',
                        margin: [40, 0, 0, 0]
                    },
                    {
                        text: `${pageText} ${currentPage} / ${pageCount}`,
                        alignment: 'center',
                        color: '#64748b',
                        fontSize: 10
                    },
                    {
                        text: rightsText, // Right bottom
                        color: '#94a3b8',
                        fontSize: 8,
                        alignment: 'right',
                        margin: [0, 0, 40, 0]
                    }
                ]
            };
        },

        content: [
            // Title
            {
                text: quiz.title,
                fontSize: 24,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 20],
                color: '#1e293b' // slate-800
            }
        ],

        styles: {
            questionText: {
                fontSize: 14,
                bold: true,
                margin: [0, 15, 0, 8],
                color: '#0f172a' // slate-900
            },
            optionText: {
                fontSize: 12,
                margin: [20, 4, 0, 4],
                color: '#334155' // slate-700
            },
            questionWatermark: {
                fontSize: 5,
                color: '#e2e8f0', // slate-200 (çok daha silik)
                opacity: 0.4,
                margin: [0, 2, 0, 0],
                alignment: 'right'
            }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    // Add questions to content
    questionsToUse.forEach((q, index) => {
        // Add Question text
        docDefinition.content.push({
            text: `${index + 1}. ${q.question}`,
            style: 'questionText'
        });

        // Add Options
        const labels = ['A)', 'B)', 'C)', 'D)', 'E)'];
        q.options.forEach((opt, optIndex) => {
            docDefinition.content.push({
                text: `${labels[optIndex]} ${opt}`,
                style: 'optionText'
            });
        });

        // Add inside-question watermark
        docDefinition.content.push({
            text: smallWatermarkText,
            style: 'questionWatermark'
        });
    });

    // Answer Key
    if (includeAnswerKey && questionsToUse.length > 0) {
        const answerKeyTitle = locale === 'tr' ? 'Cevap Anahtarı' : 'Answer Key';
        docDefinition.content.push({
            text: answerKeyTitle,
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

    // Generate and download
    return new Promise<string | null>((resolve) => {
        const pdf = pdfMake.createPdf(docDefinition);
        pdf.download(`${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_quiz.pdf`);
        resolve(undefined as any);
    });
};
