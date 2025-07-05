export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'buyer' | 'vendor';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  company?: string;
  createdAt: Date;
  // Brazilian specific fields
  cpf?: string;
  cnpj?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    cep: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock authentication service with Brazilian users
export class AuthService {
  private static instance: AuthService;
  private users: User[] = [
    {
      id: '1',
      email: 'admin@solarhub.com.br',
      name: 'Administrador Sistema',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      cpf: '123.456.789-00'
    },
    {
      id: '2',
      email: 'joao.silva@email.com',
      name: 'João Silva',
      role: 'buyer',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      cpf: '987.654.321-00',
      phone: '(11) 99999-8888',
      address: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      }
    },
    {
      id: '3',
      email: 'vendedor@solarpro.com.br',
      name: 'Maria Santos',
      role: 'vendor',
      status: 'active',
      company: 'SolarPro Soluções Energéticas',
      createdAt: new Date('2024-01-10'),
      cnpj: '12.345.678/0001-90',
      phone: '(11) 99999-7777'
    },
    {
      id: '4',
      email: 'carlos@energiabrasil.com.br',
      name: 'Carlos Oliveira',
      role: 'vendor',
      status: 'pending',
      company: 'EnergiaBrasil Ltda',
      createdAt: new Date('2024-01-20'),
      cnpj: '98.765.432/0001-10',
      phone: '(21) 99999-6666'
    },
    {
      id: '5',
      email: 'ana.costa@email.com',
      name: 'Ana Costa',
      role: 'buyer',
      status: 'active',
      createdAt: new Date('2024-01-18'),
      cpf: '456.789.123-00',
      phone: '(21) 99999-5555',
      address: {
        street: 'Av. Energia Limpa, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        cep: '20000-000'
      }
    }
  ];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User | null> {
    // Mock authentication
    const user = this.users.find(u => u.email === email);
    if (user && password === 'password') {
      this.setCurrentUser(user);
      return user;
    }
    return null;
  }

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  setCurrentUser(user: User | null): void {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUsersByRole(role: User['role']): User[] {
    return this.users.filter(u => u.role === role);
  }

  updateUserStatus(userId: string, status: User['status']): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return null;
  }

  // Brazilian specific validations
  validateCPF(cpf: string): boolean {
    // Basic CPF validation (simplified)
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11;
  }

  validateCNPJ(cnpj: string): boolean {
    // Basic CNPJ validation (simplified)
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
  }

  formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}