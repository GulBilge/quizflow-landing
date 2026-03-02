import { describe, it, expect } from 'vitest';
import { env } from './env';

describe('env', () => {
    it('should have required environment variables', () => {
        expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
        expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    });
});
