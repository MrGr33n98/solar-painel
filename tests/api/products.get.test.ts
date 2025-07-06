import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPrisma = {
  user: { findUnique: vi.fn() },
  product: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn() },
};

const supabaseMock = {
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => supabaseMock,
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrisma),
}));

const loadProductsRoute = async () => {
  const mod = await import('@/app/api/products/route');
  return mod.GET;
};

const loadProductByIdRoute = async () => {
  const mod = await import('@/app/api/products/[id]/route');
  return mod.GET;
};

beforeEach(() => {
  vi.resetModules();
  supabaseMock.auth.getUser.mockReset();
  mockPrisma.product.findMany.mockReset();
  mockPrisma.product.findUnique.mockReset();
});

describe('GET /api/products', () => {
  it('returns a list of products', async () => {
    const products = [{ id: 'p1', name: 'Solar' }];
    mockPrisma.product.findMany.mockResolvedValue(products);
    const GET = await loadProductsRoute();

    const response = await GET(new Request('http://localhost/api/products'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(products);
    expect(mockPrisma.product.findMany).toHaveBeenCalled();
  });

  it('handles prisma errors', async () => {
    mockPrisma.product.findMany.mockRejectedValue(new Error('fail'));
    const GET = await loadProductsRoute();

    const response = await GET(new Request('http://localhost/api/products'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch products');
  });
});

describe('GET /api/products/[id]', () => {
  it('returns a product by id', async () => {
    const product = { id: 'p1', name: 'Solar' };
    mockPrisma.product.findUnique.mockResolvedValue(product);
    const GET = await loadProductByIdRoute();

    const response = await GET(new Request('http://localhost/api/products/p1'), { params: { id: 'p1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(product);
    expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 'p1' } });
  });

  it('returns 404 when product not found', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);
    const GET = await loadProductByIdRoute();

    const response = await GET(new Request('http://localhost/api/products/p1'), { params: { id: 'p1' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Product not found');
  });

  it('handles prisma errors', async () => {
    mockPrisma.product.findUnique.mockRejectedValue(new Error('fail'));
    const GET = await loadProductByIdRoute();

    const response = await GET(new Request('http://localhost/api/products/p1'), { params: { id: 'p1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch product');
  });
});
