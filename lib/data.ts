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

// Mock data service with Brazilian context
export class DataService {
  private static instance: DataService;
  private products: Product[] = [
    {
      id: '1',
      name: 'Painel Solar Monocristalino 450W',
      description: 'Painel solar de alta eficiência com tecnologia PERC e garantia de 25 anos',
      price: 899.99,
      category: 'Painéis Solares',
      vendorId: '3',
      vendorName: 'SolarPro Soluções',
      images: ['https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg'],
      specifications: {
        'Potência': '450W',
        'Eficiência': '21%',
        'Dimensões': '2108 x 1048 x 40mm',
        'Peso': '22.5kg',
        'Tipo de Célula': 'Monocristalino PERC',
        'Tolerância de Potência': '+3/-0%'
      },
      status: 'active',
      stock: 150,
      rating: 4.8,
      reviews: 42,
      createdAt: new Date('2024-01-20'),
      warranty: '25 anos para potência, 12 anos para produto',
      certification: ['INMETRO', 'IEC 61215', 'IEC 61730']
    },
    {
      id: '2',
      name: 'Inversor String 5kW Trifásico',
      description: 'Inversor string com monitoramento WiFi e proteções avançadas',
      price: 3299.99,
      category: 'Inversores',
      vendorId: '3',
      vendorName: 'SolarPro Soluções',
      images: ['https://images.pexels.com/photos/9875398/pexels-photo-9875398.jpeg'],
      specifications: {
        'Potência Nominal': '5kW',
        'Eficiência Máxima': '97.5%',
        'Tensão de Entrada': '150-1000V',
        'Corrente Máxima': '12.5A',
        'Proteção': 'IP65',
        'Monitoramento': 'WiFi integrado'
      },
      status: 'active',
      stock: 75,
      rating: 4.6,
      reviews: 28,
      createdAt: new Date('2024-01-22'),
      warranty: '10 anos',
      certification: ['INMETRO', 'ABNT NBR 16149']
    },
    {
      id: '3',
      name: 'Bateria de Lítio 10kWh',
      description: 'Sistema de armazenamento residencial com BMS integrado',
      price: 15999.99,
      category: 'Baterias',
      vendorId: '4',
      vendorName: 'EnergiaBrasil Ltda',
      images: ['https://images.pexels.com/photos/9875432/pexels-photo-9875432.jpeg'],
      specifications: {
        'Capacidade': '10kWh',
        'Tensão Nominal': '51.2V',
        'Ciclos de Vida': '6000+ ciclos',
        'Profundidade de Descarga': '95%',
        'Temperatura de Operação': '-10°C a +50°C',
        'Comunicação': 'CAN/RS485'
      },
      status: 'active',
      stock: 25,
      rating: 4.7,
      reviews: 15,
      createdAt: new Date('2024-01-25'),
      warranty: '10 anos',
      certification: ['INMETRO', 'UN38.3']
    },
    {
      id: '4',
      name: 'Kit Instalação Residencial 5kWp',
      description: 'Kit completo para instalação residencial incluindo estruturas e cabeamento',
      price: 12999.99,
      category: 'Kits Completos',
      vendorId: '3',
      vendorName: 'SolarPro Soluções',
      images: ['https://images.pexels.com/photos/9875445/pexels-photo-9875445.jpeg'],
      specifications: {
        'Potência Total': '5kWp',
        'Painéis Inclusos': '11x 450W',
        'Inversor': '1x 5kW',
        'Estrutura': 'Alumínio anodizado',
        'Cabeamento': 'CC e CA inclusos',
        'Proteções': 'String box e DPS'
      },
      status: 'pending',
      stock: 30,
      rating: 4.9,
      reviews: 8,
      createdAt: new Date('2024-01-28'),
      warranty: '25 anos painéis, 10 anos inversor',
      certification: ['INMETRO', 'Conjunto certificado']
    }
  ];

  private orders: Order[] = [
    {
      id: 'ORD-001',
      buyerId: '2',
      vendorId: '3',
      products: [
        {
          productId: '1',
          name: 'Painel Solar Monocristalino 450W',
          quantity: 10,
          price: 899.99
        }
      ],
      total: 8999.90,
      status: 'pending',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      shippingAddress: 'Rua das Flores, 123 - Vila Solar, São Paulo - SP, 01234-567',
      paymentMethod: 'PIX'
    },
    {
      id: 'ORD-002',
      buyerId: '5',
      vendorId: '3',
      products: [
        {
          productId: '2',
          name: 'Inversor String 5kW Trifásico',
          quantity: 2,
          price: 3299.99
        }
      ],
      total: 6599.98,
      status: 'confirmed',
      createdAt: new Date('2024-01-26'),
      updatedAt: new Date('2024-01-26'),
      shippingAddress: 'Av. Energia Limpa, 456 - Centro, Rio de Janeiro - RJ, 20000-000',
      paymentMethod: 'Cartão de Crédito',
      trackingCode: 'BR123456789'
    }
  ];

  private companies: Company[] = [
    {
      id: '1',
      vendorId: '3',
      name: 'SolarPro Soluções Energéticas Ltda',
      cnpj: '12.345.678/0001-90',
      inscricaoEstadual: '123.456.789.123',
      address: 'Rua da Energia Solar, 100',
      city: 'São Paulo',
      state: 'SP',
      cep: '01234-567',
      phone: '(11) 99999-9999',
      website: 'www.solarpro.com.br',
      description: 'Especializada em soluções completas de energia solar fotovoltaica para residências e empresas.',
      certifications: ['INMETRO', 'ABNT', 'Qualivolt'],
      foundedYear: 2018,
      employeeCount: '50-100',
      serviceAreas: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais']
    }
  ];

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProductsByVendor(vendorId: string): Product[] {
    return this.products.filter(p => p.vendorId === vendorId);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrdersByBuyer(buyerId: string): Order[] {
    return this.orders.filter(o => o.buyerId === buyerId);
  }

  getOrdersByVendor(vendorId: string): Order[] {
    return this.orders.filter(o => o.vendorId === vendorId);
  }

  getCompanyByVendorId(vendorId: string): Company | undefined {
    return this.companies.find(c => c.vendorId === vendorId);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      return this.products[index];
    }
    return null;
  }

  updateProductStatus(productId: string, status: Product['status']): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.status = status;
    }
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
    }
  }

  updateCompany(vendorId: string, updates: Partial<Company>): Company | null {
    const index = this.companies.findIndex(c => c.vendorId === vendorId);
    if (index !== -1) {
      this.companies[index] = { ...this.companies[index], ...updates };
      return this.companies[index];
    }
    return null;
  }

  getAnalytics(): Analytics {
    const activeVendors = this.companies.length;
    const pendingApprovals = 3; // Mock data
    
    return {
      totalUsers: 1248,
      totalVendors: 87,
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalRevenue: 485000,
      monthlyGrowth: 15.8,
      recentOrders: this.orders.slice(-5),
      topProducts: this.products.slice(0, 5),
      vendorStats: {
        activeVendors,
        pendingApprovals,
        topVendors: [
          { id: '3', name: 'SolarPro Soluções', revenue: 125000, orders: 45 },
          { id: '4', name: 'EnergiaBrasil Ltda', revenue: 98000, orders: 32 },
          { id: '5', name: 'Sol & Energia', revenue: 76000, orders: 28 }
        ]
      }
    };
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
  searchProducts(query: string, filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    state?: string;
    certification?: string;
  } = {}): Product[] {
    return this.products.filter(product => {
      const matchesQuery = !query || 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.vendorName.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                          (!filters.maxPrice || product.price <= filters.maxPrice);
      const matchesCertification = !filters.certification || 
        product.certification.includes(filters.certification);

      return matchesQuery && matchesCategory && matchesPrice && matchesCertification && product.status === 'active';
    });
  }
}