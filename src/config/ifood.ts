// Configurações da API do iFood
export const IFOOD_CONFIG = {
  // Credenciais fixas da API (usadas para todos os clientes)
  CLIENT_ID: 'acac8cf5-4e63-4433-950d-e1c79d76fa34',
  CLIENT_SECRET: 'gvlkvyr7204edc20ozpe5fyhhwhbvbfss4tb6fxbjvsxgd8cofix1a12j9urs94ohwpkf9wtjqjr7pj46oosd9cs6mcz97y9xqk',
  
  // URLs da API
  BASE_URL: 'https://merchant-api.ifood.com.br',
  AUTH_URL: 'https://merchant-api.ifood.com.br/oauth/token',
  
  // Escopos de permissão
  SCOPES: [
    'merchant.read',
    'financial.read'
  ],
  
  // Configurações de timeout
  TIMEOUT: 30000, // 30 segundos
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Tipos para a API do iFood
export interface IfoodSalesResponse {
  sales: IfoodSale[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface IfoodSale {
  id: string;
  merchantId: string;
  saleDate: string;
  totalAmount: number;
  commissionAmount: number;
  netAmount: number;
  paymentMethod: string;
  orderId?: string;
  customerName?: string;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface IfoodProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  images?: string[];
}

export interface IfoodAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
