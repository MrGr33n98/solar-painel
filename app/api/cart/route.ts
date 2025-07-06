import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true } })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, quantity } = await request.json()
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { quantity },
    create: { userId: user.id, productId, quantity },
    include: { product: true }
  })
  return NextResponse.json(item, { status: 201 })
}

export async function PUT(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, quantity } = await request.json()
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: user.id, productId } },
    data: { quantity },
    include: { product: true }
  })

  return NextResponse.json(item)
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  await prisma.cartItem.delete({
    where: { userId_productId: { userId: user.id, productId } },
  })
  return NextResponse.json({ success: true })
}
