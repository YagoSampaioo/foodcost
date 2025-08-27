import { IFOOD_CONFIG, IfoodSalesResponse, IfoodSale, IfoodProduct, IfoodAuthResponse } from '../config/ifood';

class IfoodService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  /**
   * Autentica com a API do iFood usando OAuth2 através do proxy local
   */
  async authenticate(clientId: string, clientSecret: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/ifood/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          clientSecret
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na autenticação: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const authData: IfoodAuthResponse = await response.json();
      
      this.accessToken = authData.access_token;
      this.tokenExpiry = Date.now() + (authData.expires_in * 1000);
      
      // Salvar token no localStorage para persistência
      localStorage.setItem('ifood_access_token', this.accessToken);
      localStorage.setItem('ifood_token_expiry', this.tokenExpiry.toString());
      
      return true;
    } catch (error) {
      console.error('Erro na autenticação com iFood:', error);
      return false;
    }
  }

  /**
   * Verifica se o token está válido e renova se necessário
   */
  private async ensureValidToken(): Promise<boolean> {
    // Verificar se o token expirou
    if (this.tokenExpiry && Date.now() >= this.tokenExpiry) {
      this.accessToken = null;
      this.tokenExpiry = null;
    }

    // Tentar recuperar token do localStorage
    if (!this.accessToken) {
      const storedToken = localStorage.getItem('ifood_access_token');
      const storedExpiry = localStorage.getItem('ifood_token_expiry');
      
      if (storedToken && storedExpiry) {
        const expiry = parseInt(storedExpiry);
        if (Date.now() < expiry) {
          this.accessToken = storedToken;
          this.tokenExpiry = expiry;
        } else {
          localStorage.removeItem('ifood_access_token');
          localStorage.removeItem('ifood_token_expiry');
        }
      }
    }

    // Se ainda não tem token válido, tentar autenticar
    if (!this.accessToken) {
      return await this.authenticate(IFOOD_CONFIG.CLIENT_ID, IFOOD_CONFIG.CLIENT_SECRET);
    }

    return true;
  }

  /**
   * Faz uma requisição autenticada para a API do iFood através do proxy local
   */
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!(await this.ensureValidToken())) {
      throw new Error('Falha na autenticação com iFood');
    }

    // Mapear endpoints para rotas do proxy
    let proxyUrl = '';
    let method = options.method || 'GET';
    
    if (endpoint.includes('/financial/v3.0/merchants/')) {
      // Endpoint de vendas
      const merchantId = endpoint.match(/\/merchants\/([^\/]+)/)?.[1];
      const params = new URLSearchParams(endpoint.split('?')[1] || '');
      proxyUrl = `http://localhost:3001/api/ifood/sales/${merchantId}?${params.toString()}`;
    } else if (endpoint === '/merchant') {
      // Endpoint de verificação de conexão
      proxyUrl = 'http://localhost:3001/api/ifood/check';
    } else {
      // Para outros endpoints, usar diretamente
      proxyUrl = `${IFOOD_CONFIG.BASE_URL}${endpoint}`;
    }

    const response = await fetch(proxyUrl, {
      ...options,
      method,
      headers: {
        ...IFOOD_CONFIG.DEFAULT_HEADERS,
        'Authorization': `Bearer ${this.accessToken}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro na requisição para iFood: ${response.status} - ${errorData.error || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Busca vendas do iFood para um merchant específico
   */
  async getSales(merchantId: string, beginDate: string, endDate: string, page: number = 1): Promise<IfoodSale[]> {
    try {
      const response: IfoodSalesResponse = await this.makeAuthenticatedRequest(
        `/financial/v3.0/merchants/${merchantId}/sales?beginSalesDate=${beginDate}&endSalesDate=${endDate}&page=${page}`
      );
      return response.sales || [];
    } catch (error) {
      console.error('Erro ao buscar vendas do iFood:', error);
      return [];
    }
  }

  /**
   * Busca vendas do mês atual para um merchant específico
   */
  async getCurrentMonthSales(merchantId: string): Promise<IfoodSale[]> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const beginDate = firstDayOfMonth.toISOString().split('T')[0];
    const endDate = lastDayOfMonth.toISOString().split('T')[0];
    
    return this.getSales(merchantId, beginDate, endDate, 1);
  }

  /**
   * Busca produtos do iFood
   */
  async getProducts(limit: number = 50, offset: number = 0): Promise<IfoodProduct[]> {
    try {
      const response = await this.makeAuthenticatedRequest(
        `/products?limit=${limit}&offset=${offset}`
      );
      return response.products || [];
    } catch (error) {
      console.error('Erro ao buscar produtos do iFood:', error);
      return [];
    }
  }

  /**
   * Cria ou atualiza um produto no iFood
   */
  async upsertProduct(product: Partial<IfoodProduct>): Promise<IfoodProduct | null> {
    try {
      const method = product.id ? 'PUT' : 'POST';
      const endpoint = product.id ? `/products/${product.id}` : '/products';
      
      const response = await this.makeAuthenticatedRequest(endpoint, {
        method,
        body: JSON.stringify(product)
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao criar/atualizar produto no iFood:', error);
      return null;
    }
  }

  /**
   * Atualiza o status de um pedido no iFood
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      await this.makeAuthenticatedRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido no iFood:', error);
      return false;
    }
  }

  /**
   * Verifica o status da conexão com iFood
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.makeAuthenticatedRequest('/merchant');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Desconecta do iFood (limpa tokens)
   */
  disconnect(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('ifood_access_token');
    localStorage.removeItem('ifood_token_expiry');
  }

  /**
   * Verifica se está conectado ao iFood
   */
  isConnected(): boolean {
    return this.accessToken !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }
}

// Exportar uma instância singleton
export const ifoodService = new IfoodService();
