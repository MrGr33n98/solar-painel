import { createClient } from './supabase/client'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'buyer' | 'vendor'
  status: 'active' | 'pending' | 'inactive'
  avatar?: string
  company?: string
  createdAt: Date
  // Brazilian specific fields
  cpf?: string
  cnpj?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    cep: string
  }
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export class AuthService {
  private static instance: AuthService;
  private supabase = createClient()

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error || !data.user) {
      return null
    }

    const { data: profile } = await this.supabase
      .from('User')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (!profile) {
      return null
    }

    const user: User = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role.toLowerCase(),
      status: profile.status || 'active',
      avatar: profile.avatar || undefined,
      company: profile.company || undefined,
      createdAt: new Date(profile.createdAt),
      cpf: profile.cpf || undefined,
      cnpj: profile.cnpj || undefined,
      phone: profile.phone || undefined,
      address: profile.address || undefined,
    }

    this.setCurrentUser(user)
    return user
  }

  async register(userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User | null> {
    const { email, password, name, role } = userData
    const { data, error } = await this.supabase.auth.signUp({ email, password })
    if (error || !data.user) {
      return null
    }

    const { data: profile, error: insertError } = await this.supabase
      .from('User')
      .insert({ id: data.user.id, email, name, role: role.toUpperCase() })
      .select('*')
      .single()

    if (insertError || !profile) {
      return null
    }

    const user: User = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role.toLowerCase(),
      status: profile.status || 'active',
      createdAt: new Date(profile.createdAt),
    }

    this.setCurrentUser(user)
    return user
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser')
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  setCurrentUser(user: User | null): void {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('currentUser')
      }
    }
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut()
    this.setCurrentUser(null)
  }

  async getAllUsers(): Promise<User[]> {
    const { data } = await this.supabase.from('User').select('*')
    return (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role.toLowerCase(),
      status: u.status || 'active',
      createdAt: new Date(u.createdAt),
    }))
  }

  async getUsersByRole(role: User['role']): Promise<User[]> {
    const { data } = await this.supabase
      .from('User')
      .select('*')
      .eq('role', role.toUpperCase())
    return (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role.toLowerCase(),
      status: u.status || 'active',
      createdAt: new Date(u.createdAt),
    }))
  }

  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    await this.supabase
      .from('User')
      .update({ status })
      .eq('id', userId)
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('User')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single()

    if (error || !data) {
      return null
    }

    const user: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role.toLowerCase(),
      status: data.status || 'active',
      createdAt: new Date(data.createdAt),
      avatar: data.avatar || undefined,
      company: data.company || undefined,
      cpf: data.cpf || undefined,
      cnpj: data.cnpj || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
    }

    this.setCurrentUser(user)
    return user
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