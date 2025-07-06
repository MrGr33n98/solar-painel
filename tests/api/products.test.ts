import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma = {
  user: { findUnique: vi.fn() },
  product: { create: vi.fn(), findMany: vi.fn() },
};

const supabaseMock = {
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => supabaseMock,
}));

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

const loadRoute = async () => {
  const mod = await import('@/app/api/products/route');
  return mod.POST;
};

beforeEach(() => {
  vi.resetModules();
  supabaseMock.auth.getUser.mockReset();
  mockPrisma.user.findUnique.mockReset();
  mockPrisma.product.create.mockReset();
});

describe('POST /api/products', () => {
  it('rejects unauthorized users', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const POST = await loadRoute();

    const response = await POST(new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('rejects non-vendor users', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'BUYER' });
    const POST = await loadRoute();

    const response = await POST(new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Forbidden: Only vendors can create products');
  });

  it('validates request body with Zod', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'VENDOR' });
    const POST = await loadRoute();

    const body = { name: 'ab', description: 'short', price: -1 };
    const response = await POST(new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Validation failed');
    expect(Array.isArray(data.details)).toBe(true);
  });

  it('creates product for vendor with valid data', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'cklm5d72f000001b3l2951d72' } } });
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'VENDOR' });
    mockPrisma.product.create.mockResolvedValue({
      id: 'p1',
      name: 'Solar',
      description: 'Great solar panel product',
      price: 100,
      vendorId: 'cklm5d72f000001b3l2951d72',
      images: [],
    });
    const POST = await loadRoute();

    const body = { name: 'Solar', description: 'Great solar panel product', price: 100, images: [] };
    const response = await POST(new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }));

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.id).toBe('p1');
    expect(mockPrisma.product.create).toHaveBeenCalled();
  });
});
