import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as payPost } from '@/app/api/shopier/pay/route';
import { POST as callbackPost } from '@/app/api/shopier/callback/route';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// Mock Supabase
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/utils/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/utils/env', () => ({
  getURL: () => 'http://localhost:3000',
}));

describe('Shopier API Routes', () => {
  const mockShopierApiKey = 'test-api-key';
  const mockShopierApiSecret = 'test-api-secret';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SHOPIER_API_KEY = mockShopierApiKey;
    process.env.SHOPIER_API_SECRET = mockShopierApiSecret;
  });

  describe('POST /api/shopier/pay', () => {
    it('should return 401 if user is not authenticated', async () => {
      (createClient as any).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      });

      const req = new Request('http://localhost:3000/api/shopier/pay', { method: 'POST' });
      const res = await payPost(req);
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 200 with form HTML if successful', async () => {
      (createClient as any).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123', email: 'test@example.com' } } }),
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { email: 'test@example.com', full_name: 'Test User' } }),
      });

      const req = new Request('http://localhost:3000/api/shopier/pay', { method: 'POST' });
      const res = await payPost(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.form).toContain('<form action="https://www.shopier.com/ShowProduct/api/pay4.php"');
      expect(data.form).toContain('name="API_KEY" value="' + mockShopierApiKey + '"');
      expect(data.form).toContain('name="USER_ID" value="user-123"');
    });
  });

  describe('POST /api/shopier/callback', () => {
    it('should return 401 if signature is invalid', async () => {
      const formData = new FormData();
      formData.append('res_sig', 'invalid-signature');
      formData.append('random_nr', '123456');
      formData.append('platform_order_id', 'PREMIUM_user-123_123456');

      const req = new Request('http://localhost:3000/api/shopier/callback', {
        method: 'POST',
        body: formData,
      });

      const res = await callbackPost(req);
      expect(res.status).toBe(401);
      const text = await res.text();
      expect(text).toBe('Invalid signature');
    });

    it('should return 200 and update profile if signature and status are successful', async () => {
      const crypto = await import('crypto');
      const random_nr = '123456';
      const platform_order_id = 'PREMIUM_user-123_123456';
      const res_sig = crypto.default
        .createHmac('sha256', mockShopierApiSecret)
        .update(`${random_nr}${platform_order_id}`)
        .digest('base64');

      const formData = new FormData();
      formData.append('res_sig', res_sig);
      formData.append('random_nr', random_nr);
      formData.append('platform_order_id', platform_order_id);
      formData.append('status', 'success');

      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });

      (createAdminClient as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          update: mockUpdate,
        }),
      });
      mockUpdate.mockReturnValue({ eq: mockEq });

      const req = new Request('http://localhost:3000/api/shopier/callback', {
        method: 'POST',
        body: formData,
      });

      const res = await callbackPost(req);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe('OK');

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        is_pro: true,
        subscription_status: 'active',
        payment_method: 'shopier',
      }));
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
    });
  });
});
