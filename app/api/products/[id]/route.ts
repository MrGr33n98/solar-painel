import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
