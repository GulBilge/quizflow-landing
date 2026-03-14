import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutPage from '@/app/[locale]/checkout/page';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'tr',
}));

// Mock i18n routing
vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
    },
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ error: null }),
  })),
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both payment options', () => {
    render(<CheckoutPage />);
    
    // Check for translations keys (since we mocked them to return the key)
    expect(screen.getByText('shopier_title')).toBeDefined();
    expect(screen.getByText('bank_title')).toBeDefined();
  });

  it('opens the bank transfer modal when clicking "Havale Bilgileri"', async () => {
    render(<CheckoutPage />);
    
    const havaleBtn = screen.getByText('bank_btn');
    fireEvent.click(havaleBtn);
    
    expect(screen.getByText('modal_title')).toBeDefined();
    // Use getAllByText as the receiver name might appear multiple times
    expect(screen.getAllByText(/Bilge/)[0]).toBeDefined();
  });

  it('shows success state after confirming bank transfer', async () => {
    render(<CheckoutPage />);
    
    // Open modal
    fireEvent.click(screen.getByText('bank_btn'));
    
    // Click "Payment Made"
    const confirmBtn = screen.getByText('payment_done');
    fireEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(screen.getByText('success_title')).toBeDefined();
    });
  });

  it('redirects to Shopier when clicking "Shopier ile Öde"', async () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as any;

    render(<CheckoutPage />);
    
    const shopierBtn = screen.getByText('shopier_btn');
    fireEvent.click(shopierBtn);
    
    expect(window.location.href).toContain('shopier.com');
    
    window.location = originalLocation as any;
  });
});
