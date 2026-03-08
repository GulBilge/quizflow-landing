/**
 * quizService.ts
 *
 * Web equivalent of the mobile app's supabaseService.ts quiz-related functions.
 * Handles: hash lookup, quiz save, folder management, library management, localStorage cache.
 *
 * DB Schema (aligned with mobile app — run schema_migration.sql first):
 *   quizzes          — global pool (file_hash unique)
 *   quiz_folders     — global log of quiz→folder links
 *   folders          — global folder pool
 *   user_quizzes     — user's personal library (global_quiz_id FK, user_folder_id FK, custom_title)
 *   user_folders     — user's personal folder links (global_folder_id FK, custom_name)
 *   v_user_library   — view combining the above
 *
 * NOTE: Supabase calls on user_quizzes and user_folders use `(supabase as any)` because
 * database.types.ts still reflects the pre-migration schema. Regenerate types after running
 * schema_migration.sql to remove these casts.
 */

import { createClient } from '@/utils/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number | null;
    explanation: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    has_image?: boolean;
    page?: number;
    answer_source?: 'pdf' | 'ai' | 'manual';
}

export interface LocalQuizCache {
    id: string;
    title: string;
    file_hash: string;
    question_count: number;
    questions: QuizQuestion[];
    created_at: string;
}

// ─── LocalStorage Cache ───────────────────────────────────────────────────────

const QUIZ_CACHE_PREFIX = 'qf_quiz_'; // Key: `qf_quiz_${hash}` → JSON

export const localCache = {
    getQuiz(hash: string): LocalQuizCache | null {
        try {
            const raw = localStorage.getItem(QUIZ_CACHE_PREFIX + hash);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
    saveQuiz(hash: string, quiz: LocalQuizCache): void {
        try {
            localStorage.setItem(QUIZ_CACHE_PREFIX + hash, JSON.stringify(quiz));
        } catch (e) {
            console.warn('[Cache] Could not save quiz:', e);
        }
    },
    removeQuiz(hash: string): void {
        try {
            localStorage.removeItem(QUIZ_CACHE_PREFIX + hash);
        } catch { /* ignore */ }
    },
};

// ─── Core Service ─────────────────────────────────────────────────────────────

export const quizService = {

    /** Adım 1: LocalStorage cache kontrolü */
    getLocalQuiz(hash: string): LocalQuizCache | null {
        return localCache.getQuiz(hash);
    },

    /** Hash ile global quizzes tablosunu sorgula. Mobil: getQuizByHash */
    async getQuizByHash(hash: string): Promise<{ id: string; title: string; file_hash: string; question_count: number | null; content: QuizQuestion[] } | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('quizzes')
            .select('id, title, file_hash, question_count, content')
            .eq('file_hash', hash)
            .maybeSingle();

        if (error) {
            console.error('[quizService] getQuizByHash error:', error);
            return null;
        }
        return (data as any) ?? null;
    },

    /** Kullanıcı kütüphanesinde var mı? Varsa last_accessed_at güncelle. */
    async checkUserLibrary(quizId: string, userId: string): Promise<boolean> {
        const supabase = createClient();
        const db = supabase as any;

        const { data } = await db
            .from('user_quizzes')
            .select('id')
            .eq('user_id', userId)
            .eq('global_quiz_id', quizId)
            .maybeSingle();

        if (data) {
            await db
                .from('user_quizzes')
                .update({ last_accessed_at: new Date().toISOString() })
                .match({ user_id: userId, global_quiz_id: quizId });
            return true;
        }
        return false;
    },

    /** Klasör bul veya oluştur. Mobil: findOrCreateFolder */
    async findOrCreateFolder(topicName: string, userId: string): Promise<string | null> {
        const supabase = createClient();
        const db = supabase as any;

        // 1. Kullanıcının personal klasöründe bu isim var mı?
        const { data: userLibFolder } = await db
            .from('user_folders')
            .select('global_folder_id')
            .eq('user_id', userId)
            .eq('custom_name', topicName)
            .not('global_folder_id', 'is', null)
            .limit(1)
            .maybeSingle();

        if (userLibFolder?.global_folder_id) return userLibFolder.global_folder_id;

        // 2. Global folders'da bu isim var mı?
        const { data: existing } = await supabase
            .from('folders')
            .select('id')
            .eq('name', topicName)
            .maybeSingle();

        if ((existing as any)?.id) return (existing as any).id;

        // 3. Yoksa yeni global klasör oluştur
        const { data: newFolder, error } = await supabase
            .from('folders')
            .insert({ name: topicName, created_by: userId } as any)
            .select('id')
            .single();

        if (error) {
            if (error.code === '23505') {
                // Race condition: başka biri aynı anda ekledi
                const { data: retry } = await supabase
                    .from('folders').select('id').eq('name', topicName).maybeSingle();
                return (retry as any)?.id ?? null;
            }
            console.error('[quizService] findOrCreateFolder error:', error);
            return null;
        }
        return (newFolder as any).id;
    },

    /** user_folders tablosuna klasör bağlantısı ekle/güncelle. Döner: user_folders.id */
    async upsertUserFolder(userId: string, globalFolderId: string, customName: string): Promise<string | null> {
        const supabase = createClient();
        const db = supabase as any;

        const { data, error } = await db
            .from('user_folders')
            .upsert(
                { user_id: userId, global_folder_id: globalFolderId, custom_name: customName },
                { onConflict: 'user_id, global_folder_id' }
            )
            .select('id')
            .single();

        if (error) {
            console.error('[quizService] upsertUserFolder error:', error);
            return null;
        }
        return data?.id ?? null;
    },

    /** Mevcut quiz'i kütüphaneye ekle (folder kalıtımıyla). Mobil: addQuizToLibrary */
    async addQuizToLibrary(quizId: string, userId: string): Promise<boolean> {
        const supabase = createClient();
        const db = supabase as any;

        // 1. Quiz başlığı
        const { data: quizData, error: quizError } = await supabase
            .from('quizzes').select('title').eq('id', quizId).single();

        if (quizError || !quizData) {
            console.error('[quizService] addQuizToLibrary: quiz not found', quizError);
            return false;
        }

        // 2. Folder kalıtımı: quiz_folders → folders
        let globalFolderId: string | null = null;
        let folderName: string | null = null;

        const { data: qfData } = await supabase
            .from('quiz_folders').select('folder_id').eq('quiz_id', quizId).limit(1).maybeSingle();

        if ((qfData as any)?.folder_id) {
            globalFolderId = (qfData as any).folder_id;
            const { data: fData } = await supabase
                .from('folders').select('name').eq('id', globalFolderId!).maybeSingle();
            folderName = (fData as any)?.name ?? null;
        }

        // 3. user_folders bağla
        let userFolderId: string | null = null;
        if (globalFolderId) {
            userFolderId = await quizService.upsertUserFolder(userId, globalFolderId, folderName ?? 'Genel');
        }

        // 4. user_quizzes'e upsert
        const { error: libError } = await db
            .from('user_quizzes')
            .upsert(
                {
                    user_id: userId,
                    global_quiz_id: quizId,
                    user_folder_id: userFolderId,
                    custom_title: (quizData as any).title,
                    last_accessed_at: new Date().toISOString(),
                },
                { onConflict: 'user_id, global_quiz_id' }
            );

        if (libError) {
            console.error('[quizService] addQuizToLibrary upsert error:', libError);
            return false;
        }
        return true;
    },

    /**
     * Ana fonksiyon: AI ile oluşturulan quiz'i DB'ye kaydet.
     * Tam akış (Mobil: saveQuizToDatabase):
     *   quizzes insert (race-condition safe)
     *   → findOrCreateFolder
     *   → user_folders upsert
     *   → user_quizzes upsert
     *   → quiz_folders log
     *   → localStorage cache
     *
     * @returns quiz ID or null on failure
     */
    async saveQuizToDatabase(params: {
        title: string;
        fileHash: string;
        questions: QuizQuestion[];
        topicName?: string;
        userId: string;
    }): Promise<string | null> {
        const supabase = createClient();
        const db = supabase as any;
        const { title, fileHash, questions, topicName, userId } = params;

        try {
            // 1. Global'de var mı?
            let quizId: string | null = null;
            const existing = await quizService.getQuizByHash(fileHash);
            quizId = existing?.id ?? null;

            // 1.5 Kullanıcı zaten sahip mi?
            if (quizId) {
                const alreadyInLib = await quizService.checkUserLibrary(quizId, userId);
                if (alreadyInLib) return quizId; // last_accessed_at güncellendi, yeterli
            }

            // 2. Yeni quiz ekle
            if (!quizId) {
                const { data: newQuiz, error: insertError } = await (supabase as any)
                    .from('quizzes')
                    .insert({
                        file_hash: fileHash,
                        title,
                        content: questions as any,
                        created_by: userId,
                        question_count: questions.length,
                        description: topicName ?? null,
                    })
                    .select('id')
                    .single();

                if (insertError) {
                    if (insertError.code === '23505') {
                        // Race condition: aynı anda başka biri eklediyse
                        const retry = await quizService.getQuizByHash(fileHash);
                        if (retry) quizId = retry.id;
                    } else {
                        console.error('[quizService] quizzes insert error:', insertError);
                        throw insertError;
                    }
                } else {
                    quizId = (newQuiz as any).id;
                }
            }

            if (!quizId) throw new Error('Quiz ID alınamadı.');

            // 3. Klasör bul/oluştur
            let globalFolderId: string | null = null;
            let resolvedFolderName = topicName ?? 'Genel';

            if (topicName && topicName.trim().length > 0) {
                globalFolderId = await quizService.findOrCreateFolder(topicName.trim(), userId);
            } else {
                // Fallback: global quiz'in önceki klasör bağlantısına bak
                const { data: globalLink } = await supabase
                    .from('quiz_folders').select('folder_id').eq('quiz_id', quizId).limit(1).maybeSingle();

                if ((globalLink as any)?.folder_id) {
                    globalFolderId = (globalLink as any).folder_id;
                    const { data: fData } = await supabase
                        .from('folders').select('name').eq('id', globalFolderId!).maybeSingle();
                    if ((fData as any)?.name) resolvedFolderName = (fData as any).name;
                }
            }

            // 4. user_folders ekle/güncelle
            let userFolderId: string | null = null;
            if (globalFolderId) {
                userFolderId = await quizService.upsertUserFolder(userId, globalFolderId, resolvedFolderName);
            }

            // 5. user_quizzes'e ekle
            const { error: libError } = await db
                .from('user_quizzes')
                .upsert(
                    {
                        user_id: userId,
                        global_quiz_id: quizId,
                        user_folder_id: userFolderId,
                        custom_title: title,
                        last_accessed_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id, global_quiz_id' }
                );

            if (libError) throw libError;

            // 6. quiz_folders global log (creation-only, immutable)
            if (globalFolderId) {
                await supabase
                    .from('quiz_folders')
                    .upsert(
                        { created_by: userId, quiz_id: quizId, folder_id: globalFolderId } as any,
                        { onConflict: 'created_by, quiz_id, folder_id' }
                    );
            }

            // 7. LocalStorage cache
            localCache.saveQuiz(fileHash, {
                id: quizId,
                title,
                file_hash: fileHash,
                question_count: questions.length,
                questions,
                created_at: new Date().toISOString(),
            });

            return quizId;

        } catch (error) {
            console.error('[quizService] saveQuizToDatabase error:', error);
            return null;
        }
    },
};
