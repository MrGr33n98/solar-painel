import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { ProductSchema } from '@/lib/schemas/product'; // Import ProductSchema
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    const products = await prisma.product.findMany({
      where,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch user role from your database (assuming User model has a 'role' field)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Forbidden: Only vendors can create products' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Add vendorId from authenticated user to the body for Zod validation
    const productData = { ...body, vendorId: user.id };

    // Validate product data using Zod schema
    const validatedData = ProductSchema.parse(productData);

    const newProduct = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        vendor: {
          connect: { id: validatedData.vendorId },
        },
        images: validatedData.images || [], // Use validated images or empty array
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

