import { createClient } from '@supabase/supabase-js';
import { AuthUser } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  companyName: string;
  phone: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  constructor() {
    // Carregar usuário logado do localStorage
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const savedUser = localStorage.getItem('foodcost_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  private saveUserToStorage(user: AuthUser) {
    localStorage.setItem('foodcost_user', JSON.stringify(user));
  }

  private clearUserFromStorage() {
    localStorage.removeItem('foodcost_user');
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Usuário não encontrado');
    
    // Buscar dados do cliente na tabela clients
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (clientError) throw new Error('Erro ao carregar dados do usuário');

    const authUser: AuthUser = {
      id: clientData.id,
      email: clientData.email,
      name: clientData.name,
      companyName: clientData.company_name,
      phone: clientData.phone
    };

    this.currentUser = authUser;
    this.saveUserToStorage(authUser);

    return authUser;
  }

  async register(data: RegisterData): Promise<AuthUser> {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Erro ao criar usuário');

    // 2. Criar registro na tabela clients
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert([{
        id: authData.user.id,
        email: data.email,
        name: data.name,
        company_name: data.companyName,
        phone: data.phone
      }])
      .select()
      .single();

    if (clientError) throw new Error('Erro ao salvar dados do usuário');

    const authUser: AuthUser = {
      id: clientData.id,
      email: clientData.email,
      name: clientData.name,
      companyName: clientData.company_name,
      phone: clientData.phone
    };

    this.currentUser = authUser;
    this.saveUserToStorage(authUser);

    return authUser;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    
    this.currentUser = null;
    this.clearUserFromStorage();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (this.currentUser) return this.currentUser;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: clientData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;

    const authUser: AuthUser = {
      id: clientData.id,
      email: clientData.email,
      name: clientData.name,
      companyName: clientData.company_name,
      phone: clientData.phone
    };

    this.currentUser = authUser;
    this.saveUserToStorage(authUser);

    return authUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

// Instância singleton
export const authService = new AuthService();
