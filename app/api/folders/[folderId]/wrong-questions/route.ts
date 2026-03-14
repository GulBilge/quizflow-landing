import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { quizService, QuizQuestion } from '@/lib/quizService';
import { getTranslations } from 'next-intl/server';

export const maxDuration = 60; // Just in case it takes a bit of time

export async function POST(
    request: Request,
    { params, locale }: { params: Promise<{ folderId: string }>; locale: string }
) {
    try {
        const t = await getTranslations({ locale, namespace: 'Library' });
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: t('unauthorized') }, { status: 401 });
        }

        const resolvedParams = await params;
        const folderId = resolvedParams.folderId;

        let clientDateStr = null;
        try {
            const body = await request.json();
            clientDateStr = body.clientDateStr;
        } catch (e) {
            // Ignore JSON parse errors
        }

        // Verify premium status
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', user.id)
            .single();

        if (!(profile as any)?.is_pro) {
            return NextResponse.json({ error: t('premium_required') }, { status: 403 });
        }

        // Fetch user_quizzes in this folder
        const query = supabase
            .from('user_quizzes' as any)
            .select('global_quiz_id, quizzes:global_quiz_id(content, title), user_folder_id')
            .eq('user_id', user.id);

        if (folderId === 'uncategorized') {
            query.is('user_folder_id', null);
        } else {
            query.eq('user_folder_id', folderId);
        }

        const { data: userQuizzes, error: uqError } = await query;

        if (uqError || !userQuizzes || userQuizzes.length === 0) {
            return NextResponse.json({ error: t('no_quizzes_found') }, { status: 404 });
        }

        const quizIds = userQuizzes.map((uq: any) => uq.global_quiz_id);

        // Fetch all attempts for these quizzes by this user
        const { data: attempts, error: attError } = await supabase
            .from('quiz_attempts' as any)
            .select('quiz_id, user_answers')
            .eq('user_id', user.id)
            .in('quiz_id', quizIds);

        if (attError || !attempts || attempts.length === 0) {
            return NextResponse.json({ error: t('no_quiz_attempts_found') }, { status: 404 });
        }

        // Map quiz_id to its content for quick lookup
        const quizContentMap = new Map<string, QuizQuestion[]>();
        userQuizzes.forEach((uq: any) => {
            if (uq.global_quiz_id && uq.quizzes?.content) {
                quizContentMap.set(uq.global_quiz_id, uq.quizzes.content);
            }
        });

        // Track wrong questions
        // We'll use the question text as a unique key to avoid duplicates
        const wrongQuestionsCounts = new Map<string, { count: number; question: QuizQuestion }>();

        for (const attempt of attempts) {
            const quizId = (attempt as any).quiz_id;
            const userAnswers = (attempt as any).user_answers as Record<string, number> | null;
            const content = quizContentMap.get(quizId);

            if (!userAnswers || !content) continue;

            for (const [indexStr, answerIndex] of Object.entries(userAnswers)) {
                const questionIndex = parseInt(indexStr, 10);
                const questionObj = content[questionIndex];

                if (!questionObj) continue;

                if (answerIndex !== questionObj.correctAnswer) {
                    // It's a wrong answer
                    const key = questionObj.question.trim().toLowerCase();
                    const existing = wrongQuestionsCounts.get(key);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        wrongQuestionsCounts.set(key, { count: 1, question: questionObj });
                    }
                }
            }
        }

        if (wrongQuestionsCounts.size === 0) {
            return NextResponse.json({ error: 'No wrong answers found' }, { status: 404 });
        }

        // Sort by most wrong
        const sortedWrongQuestions = Array.from(wrongQuestionsCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 20)
            .map(item => item.question);

        // Generate a unique hash for this combination
        const hashStr = `wrong_answers_${folderId}_${user.id}_${Date.now()}`;

        let customFolderName = "Genel";
        if (folderId !== 'uncategorized') {
            const { data: folderData } = await supabase.from('user_folders' as any).select('custom_name').eq('id', folderId).single();
            if (folderData) customFolderName = (folderData as any).custom_name;
        }

        const now = new Date();
        const fallbackYear = now.getFullYear();
        const fallbackMonth = String(now.getMonth() + 1).padStart(2, '0');
        const fallbackDay = String(now.getDate()).padStart(2, '0');
        const fallbackHours = String(now.getHours()).padStart(2, '0');
        const fallbackMinutes = String(now.getMinutes()).padStart(2, '0');

        const dateStr = clientDateStr || `${fallbackYear}-${fallbackMonth}-${fallbackDay} ${fallbackHours}-${fallbackMinutes}`;
        const title = `Güçlendiren Sorular: ${customFolderName} (${dateStr})`;

        const { data: newQuiz, error: insertError } = await supabase
            .from('quizzes')
            .insert({
                file_hash: hashStr,
                title,
                content: sortedWrongQuestions as any,
                created_by: user.id,
                question_count: sortedWrongQuestions.length,
                description: customFolderName,
            } as any)
            .select('id')
            .single();

        if (insertError) {
            console.error('Insert quizzes error:', insertError);
            return NextResponse.json({ error: 'Failed to create global quiz' }, { status: 500 });
        }

        const newQuizId = (newQuiz as any).id;

        // Ensure folder connection
        let globalFolderId: string | null = null;
        if (folderId !== 'uncategorized') {
            const { data: userFolder } = await supabase
                .from('user_folders' as any)
                .select('global_folder_id')
                .eq('id', folderId)
                .single();
            globalFolderId = (userFolder as any)?.global_folder_id || null;
        }

        const { error: libError } = await supabase
            .from('user_quizzes' as any)
            .upsert({
                user_id: user.id,
                global_quiz_id: newQuizId,
                user_folder_id: folderId === 'uncategorized' ? null : folderId,
                custom_title: title,
                last_accessed_at: new Date().toISOString(),
            } as any);

        if (libError) {
            console.error('Insert user_quizzes error:', libError);
            return NextResponse.json({ error: 'Failed to add quiz to library' }, { status: 500 });
        }

        if (globalFolderId) {
            await supabase
                .from('quiz_folders' as any)
                .upsert({
                    created_by: user.id,
                    quiz_id: newQuizId,
                    folder_id: globalFolderId
                } as any);
        }

        return NextResponse.json({ quizId: newQuizId });

    } catch (error: any) {
        console.error('Error generating wrong questions quiz:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
