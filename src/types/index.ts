// =============================================
// MODELOS DE DADOS PRINCIPAIS
// (Correspondem às tabelas do banco de dados)
// =============================================

/**
 * Representa um cliente/usuário do sistema.
 */
export interface Client {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Representa um insumo ou matéria-prima.
 */
export interface RawMaterial {
  id: string;
  client_id: string;
  code: string;
  name: string;
  category: string;
  measurement_unit: string;
  unit_price: number;
  supplier?: string;
  minimum_stock: number;
  current_stock: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Representa a linha na tabela de junção, agora com o insumo aninhado.
 */
export interface ProductIngredient {
  id: string;
  product_id: string;
  raw_material_id: string;
  quantity: number;
  unit: string;
  total_cost: number;
  raw_materials: RawMaterial;
}

/**
 * Representa um produto final, com seus ingredientes e insumos aninhados.
 */
export interface Product {
  id: string;
  client_id: string;
  name: string;
  category: string;
  description?: string;
  portion_yield: number;
  portion_unit: string;
  selling_price: number;
  margin_percentage: number;

  created_at?: Date;
  last_modified?: Date;
  product_ingredients: ProductIngredient[];
}

/**
 * Representa um registro de vendas diárias.
 */
export interface Sale {
  id: string;
  client_id: string;
  sale_date: Date;
  total_sales: number;
  number_of_orders: number;
  average_ticket: number;
  notes?: string;
  created_at: Date;
}

/**
 * Representa uma despesa com valor e recorrência fixos.
 */
export interface FixedExpense {
  id: string;
  client_id: string;
  name: string;
  category: string;
  amount: number;
  frequency: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  due_date: number;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Representa uma despesa pontual ou com valor variável.
 */
export interface VariableExpense {
  id: string;
  client_id: string;
  name: string;
  category: string;
  amount: number;
  expense_date: Date;
  payment_method?: string;
  receipt?: string;
  description?: string;
  created_at: Date;
}

/**
 * Representa um registro de compra de insumos.
 */
export interface RawMaterialPurchase {
  id: string;
  client_id: string;
  raw_material_id: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  purchase_date: Date;
  supplier?: string;
  payment_method?: string;
  receipt?: string;
  notes?: string;
  created_at: Date;
}

/**
 * Representa os custos detalhados associados a um funcionário.
 */
export interface EmployeeCost {
  id: string;
  client_id: string;
  professional: string;
  hourly_cost: number;
  average_salary: number;
  benefits: number;
  fgts: number;
  vacation_allowance: number;
  vacation_bonus: number;
  fgts_vacation_bonus: number;
  thirteenth_salary: number;
  fgts_thirteenth: number;
  notice_period: number;
  fgts_notice_period: number;
  fgts_penalty: number;
  created_at: Date;
  updated_at: Date;
}

// =============================================
// TIPOS AUXILIARES E DE AUTENTICAÇÃO
// =============================================

/**
 * Representa os dados do usuário logado, sem informações sensíveis.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  phone?: string;
}
