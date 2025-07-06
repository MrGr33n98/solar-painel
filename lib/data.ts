import { createClient } from './supabase/client'

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendorId: string;
  vendorName: string;
  images: string[];
  specifications: Record<string, string>;
  status: 'active' | 'pending' | 'inactive';
  stock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  // Brazilian specific fields
  cnpj?: string;
  inscricaoEstadual?: string;
  warranty: string;
  certification: string[];
}

export interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
  paymentMethod: string;
  trackingCode?: string;
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: Date
}

export interface Analytics {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentOrders: Order[];
  topProducts: Product[];
  vendorStats: {
    activeVendors: number;
    pendingApprovals: number;
    topVendors: Array<{
      id: string;
      name: string;
      revenue: number;
      orders: number;
    }>;
  };
}

export interface Company {
  id: string;
  vendorId: string;
  name: string;
  cnpj: string;
  inscricaoEstadual: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  phone: string;
  website?: string;
  description: string;
  logo?: string;
  certifications: string[];
  foundedYear: number;
  employeeCount: string;
  serviceAreas: string[];
}

// Data service using Supabase
export class DataService {
  private static instance: DataService
  private supabase = createClient()

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async getProducts(): Promise<Product[]> {
    const { data } = await this.supabase.from('Product').select('*')
    return (data as Product[]) || []
  }

  async getProductsByVendor(vendorId: string): Promise<Product[]> {
    const { data } = await this.supabase.from('Product').select('*').eq('vendorId', vendorId)
    return (data as Product[]) || []
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data } = await this.supabase.from('Product').select('*').eq('id', id).single()
    return (data as Product) || null
  }

  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders')
    if (!res.ok) return []
    return (await res.json()) as Order[]
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    const res = await fetch(`/api/orders?buyerId=${buyerId}`)
    if (!res.ok) return []
    return (await res.json()) as Order[]
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    const res = await fetch(`/api/orders?vendorId=${vendorId}`)
    if (!res.ok) return []
    return (await res.json()) as Order[]
  }

  async getCompanyByVendorId(vendorId: string): Promise<Company | null> {
    const { data } = await this.supabase.from('companies').select('*').eq('vendorId', vendorId).single()
    return (data as Company) || null
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('Product')
      .insert({ ...product })
      .select('*')
      .single()
    if (error) return null
    return data as Product
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('Product')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()
    if (error) return null
    return data as Product
  }

  async updateProductStatus(productId: string, status: Product['status']): Promise<void> {
    await this.supabase.from('Product').update({ status }).eq('id', productId)
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async getCart(): Promise<CartItem[]> {
    const res = await fetch('/api/cart')
    if (!res.ok) return []
    return (await res.json()) as CartItem[]
  }

  async addToCart(productId: string, quantity: number): Promise<CartItem | null> {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
    if (!res.ok) return null
    return (await res.json()) as CartItem
  }

  async updateCartItem(productId: string, quantity: number): Promise<void> {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
  }

  async removeCartItem(productId: string): Promise<void> {
    await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
  }

  async checkout(order: { shippingAddress: string; paymentMethod: string }): Promise<Order | null> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    if (!res.ok) return null
    return (await res.json()) as Order
  }

  async updateCompany(vendorId: string, updates: Partial<Company>): Promise<Company | null> {
    const { data, error } = await this.supabase
      .from('companies')
      .update(updates)
      .eq('vendorId', vendorId)
      .select('*')
      .single()
    if (error) return null
    return data as Company
  }

  async getAnalytics(): Promise<Analytics> {
    const { data: products } = await this.supabase.from('Product').select('*')
    const { data: orders } = await this.supabase.from('orders').select('*')
    const activeVendors = 0
    const pendingApprovals = 0

    return {
      totalUsers: 0,
      totalVendors: activeVendors,
      totalProducts: products?.length || 0,
      totalOrders: orders?.length || 0,
      totalRevenue: 0,
      monthlyGrowth: 0,
      recentOrders: (orders || []).slice(-5) as Order[],
      topProducts: (products || []).slice(0, 5) as Product[],
      vendorStats: {
        activeVendors,
        pendingApprovals,
        topVendors: []
      }
    }
  }

  // Brazilian currency formatting
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  // Brazilian date formatting
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  // Search products with Brazilian context
  async searchProducts(query: string, filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
    state?: string
    certification?: string
  } = {}): Promise<Product[]> {
    let qb = this.supabase.from('Product').select('*')

    if (query) {
      qb = qb.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (filters.category) {
      qb = qb.eq('category', filters.category)
    }

    if (filters.minPrice) {
      qb = qb.gte('price', filters.minPrice)
    }

    if (filters.maxPrice) {
      qb = qb.lte('price', filters.maxPrice)
    }

    const { data } = await qb
    return (data as Product[]) || []
  }
}