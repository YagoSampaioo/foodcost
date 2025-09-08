import { apiClient } from "../config/axios";
import { IfoodSalesResponse } from "../types/ifood";

// Tipos para clareza
interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}
interface Merchant {
  id: string;
  name: string;
}

class IfoodService {
  private accessToken: string | null = null;

  constructor() {
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem("ifood_access_token");
    if (token) {
      this.accessToken = token;
    }
  }

  private setToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem("ifood_access_token", token);
  }

  private clearToken(): void {
    this.accessToken = null;
    localStorage.removeItem("ifood_access_token");
  }

  private getAuthHeader() {
    if (!this.accessToken) {
      throw new Error("Token de acesso do iFood não encontrado.");
    }
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  public isConnected(): boolean {
    return this.accessToken !== null;
  }

  public disconnect(): void {
    this.clearToken();
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await apiClient.post<AuthResponse>("/ifood/auth");
      if (response.data && response.data.accessToken) {
        this.setToken(response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao autenticar com a API iFood:", error);
      this.clearToken();
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await apiClient.get("/ifood/check", { headers: this.getAuthHeader() });
      return true;
    } catch (error) {
      console.error("Falha na verificação de conexão com o iFood:", error);
      return false;
    }
  }

  async getMerchants(): Promise<Merchant[]> {
    try {
      const response = await apiClient.get<Merchant[]>("/ifood/merchants", {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar merchants:", error);
      throw error;
    }
  }

  async getSales(
    merchantId: string,
    beginDate: string,
    endDate: string,
    page: number = 1
  ): Promise<IfoodSalesResponse[]> {
    try {
      const response = await apiClient.get(`/ifood/sales/${merchantId}`, {
        params: { beginDate, endDate, page },
        headers: this.getAuthHeader(),
      });
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar vendas do iFood:", error);
      throw error;
    }
  }

  async getCurrentMonthSales(merchantId: string): Promise<IfoodSalesResponse[]> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const beginDate = firstDayOfMonth.toISOString().split("T")[0];
    const endDate = lastDayOfMonth.toISOString().split("T")[0];

    return this.getSales(merchantId, beginDate, endDate, 1);
  }
  /* TODO's
  // TODO: para um endpoint de produtos - MODULO CATALOG
  async getProducts(merchantId: string, limit: number = 50, offset: number = 0): Promise<IfoodProduct[]> {
    try {
      // Supondo que você crie uma rota GET /ifood/merchants/:merchantId/products
      const response = await apiClient.get(`/ifood/merchants/${merchantId}/products`, {
        params: { limit, offset },
        headers: this.getAuthHeader(),
      });
      return response.data.products || [];
    } catch (error) {
      console.error("Erro ao buscar produtos do iFood:", error);
      throw error;
    }
  }

  // TODO: um endpoint de criar/atualizar produto - MODULO CATALOG
  async upsertProduct(merchantId: string, product: Partial<IfoodProduct>): Promise<IfoodProduct> {
    try {
      const method = product.id ? "put" : "post";
      const url = product.id
        ? `/ifood/merchants/${merchantId}/products/${product.id}`
        : `/ifood/merchants/${merchantId}/products`;

      const response = await apiClient[method](url, product, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar/atualizar produto no iFood:", error);
      throw error;
    }
  }

  // TODO: um endpoint de status de pedido - MODULO ORDER
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      // Supondo uma rota PATCH /ifood/orders/:orderId/status
      await apiClient.patch(
        `/ifood/orders/${orderId}/status`,
        { status },
        {
          headers: this.getAuthHeader(),
        }
      );
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido no iFood:", error);
      return false;
    }
  }
*/
}

export const ifoodService = new IfoodService();
