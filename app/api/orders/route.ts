import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const buyerId = searchParams.get('buyerId')
  const vendorId = searchParams.get('vendorId')
  const where: any = {}
  if (buyerId) where.buyerId = buyerId
  if (vendorId) where.vendorId = vendorId
  const orders = await prisma.order.findMany({ where })
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { shippingAddress, paymentMethod } = await request.json()
  const items = await prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true } })
  if (items.length === 0) return NextResponse.json({ error: 'Cart empty' }, { status: 400 })
  const products = items.map(i => ({
    productId: i.productId,
    name: i.product.name,
    quantity: i.quantity,
    price: i.product.price,
  }))
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const vendorId = items[0].product.vendorId
  const order = await prisma.order.create({
    data: { buyerId: user.id, vendorId, products, total, shippingAddress, paymentMethod }
  })
  await prisma.cartItem.deleteMany({ where: { userId: user.id } })
  return NextResponse.json(order, { status: 201 })
}
