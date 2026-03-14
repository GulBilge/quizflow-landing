import { vi } from 'vitest';

// 1. Mock next/navigation FIRST
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { 
    const err = new Error(`REDIRECT:${url}`);
    (err as any).digest = 'NEXT_REDIRECT';
    throw err;
  }),
}));

// 2. Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}));

// 3. Mock Supabase Server Client
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

// 4. Mock QuizImportClient
vi.mock('@/app/[locale]/quiz-import/QuizImportClient', () => ({
  default: () => null,
}));

import { describe, it, expect, beforeEach } from 'vitest';
import QuizImportPage from '@/app/[locale]/quiz-import/page';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

describe('QuizImportPage Logic', () => {
    const mockSupabase = {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn(),
        limit: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        single: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (createClient as any).mockResolvedValue(mockSupabase);
        
        // Mock default behaviors
        mockSupabase.from.mockReturnThis();
        mockSupabase.select.mockReturnThis();
        mockSupabase.eq.mockReturnThis();
        mockSupabase.limit.mockReturnThis();
        mockSupabase.upsert.mockReturnThis();
    });

    it('redirects to home if quizId is missing', async () => {
        const params = Promise.resolve({ locale: 'tr' });
        const searchParams = Promise.resolve({});
        
        await expect(QuizImportPage({ params, searchParams })).rejects.toThrow('REDIRECT:/tr');
    });

    it('adds quiz to library and redirects to player when user is logged in', async () => {
        const quizId = 'quiz-123';
        const userId = 'user-456';
        const folderId = 'folder-789';

        // 1. Mock quiz existence check
        mockSupabase.maybeSingle.mockResolvedValueOnce({ 
            data: { id: quizId, title: 'Test Quiz' },
            error: null
        });

        // 2. Mock user session
        mockSupabase.auth.getUser.mockResolvedValue({ 
            data: { user: { id: userId } },
            error: null
        });

        // 3. Mock folder link resolve (quiz_folders)
        mockSupabase.maybeSingle.mockResolvedValueOnce({ 
            data: { folder_id: folderId },
            error: null
        });

        // 4. Mock folder name fetch (folders)
        mockSupabase.maybeSingle.mockResolvedValueOnce({ 
            data: { name: 'Math' },
            error: null
        });

        // 5. Mock user_folders upsert result chain (first call)
        // 6. Mock user_quizzes upsert (second call)
        mockSupabase.upsert
            .mockImplementationOnce(() => mockSupabase) // 1st call for user_folders
            .mockResolvedValueOnce({ error: null });     // 2nd call for user_quizzes

        mockSupabase.select.mockReturnThis();
        mockSupabase.single.mockResolvedValueOnce({ 
            data: { id: 'user-folder-001' },
            error: null
        });

        await expect(QuizImportPage({ 
            params: Promise.resolve({ locale: 'tr' }), 
            searchParams: Promise.resolve({ id: quizId }) 
        })).rejects.toThrow('REDIRECT:/tr/dashboard/quiz/quiz-123');

        // Verify the upsert call for user_quizzes
        expect(mockSupabase.from).toHaveBeenCalledWith('user_quizzes');
        expect(mockSupabase.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                user_id: userId,
                global_quiz_id: quizId,
                custom_title: 'Test Quiz',
            }),
            { onConflict: 'user_id, global_quiz_id' }
        );
    });

    it('renders QuizImportClient when user is not logged in', async () => {
        const quizId = 'quiz-123';

        // Mock quiz existence
        mockSupabase.maybeSingle.mockResolvedValueOnce({ 
            data: { id: quizId, title: 'Test Quiz' },
            error: null
        });

        // Mock NO user session
        mockSupabase.auth.getUser.mockResolvedValue({ 
            data: { user: null },
            error: null
        });

        const result = await QuizImportPage({ 
            params: Promise.resolve({ locale: 'tr' }), 
            searchParams: Promise.resolve({ id: quizId }) 
        });

        // If not logged in, it should return the client component
        expect(result).toBeDefined();
        // and should NOT have redirected to dashboard
        expect(redirect).not.toHaveBeenCalledWith(expect.stringContaining('/dashboard/quiz/'));
    });
});
