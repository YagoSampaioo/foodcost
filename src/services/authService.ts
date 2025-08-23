import { createClient } from '@supabase/supabase-js';
import { AuthUser } from '../types';
import { config } from '../config/env';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

interface LoginCredentials {
  email: string;
  password: string;
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
    try {
      console.log('Tentando fazer login com:', credentials.email);
      
      // Buscar usuário diretamente na tabela clients
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', credentials.email)
        .eq('password_hash', credentials.password)
        .eq('is_active', true)
        .single();

      if (clientError) {
        console.error('Erro ao buscar dados do cliente:', clientError);
        if (clientError.code === 'PGRST116') {
          throw new Error('Email ou senha incorretos');
        }
        throw new Error('Erro ao carregar dados do usuário: ' + clientError.message);
      }

      if (!clientData) {
        console.error('Dados do cliente não encontrados');
        throw new Error('Email ou senha incorretos');
      }

      console.log('Dados do cliente encontrados:', clientData);

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
    } catch (error) {
      console.error('Erro completo no login:', error);
      throw error;
    }
  }



  async logout() {
    // Limpar dados locais
    this.currentUser = null;
    this.clearUserFromStorage();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (this.currentUser) return this.currentUser;

    // Se não há usuário em memória, retornar null
    // O usuário precisará fazer login novamente
    return null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

// Instância singleton
export const authService = new AuthService();
