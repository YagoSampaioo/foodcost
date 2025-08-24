export interface Ingredient {
  id: string;
  code: string;
  name: string;
  householdMeasure: string;
  measurementUnit: string;
  grossQuantity: number;
  netQuantity: number;
  correctionFactor: number;
  unitPrice: number; // R$ do KG/Litro/Unidade
  totalCost: number;
}

export interface Product {
  id: string;
  clientId: string;
  name: string;
  category: string;
  description?: string;
  portionYield: number;
  portionUnit: string;
  sellingPrice: number;
  marginPercentage?: number;
  ingredients?: Array<{
    rawMaterialId: string;
    quantity: number;
    unitPrice: number;
    totalCost: number;
  }>;
  lastModified: Date;
  createdAt: Date;
}

export interface CostCalculation {
  totalIngredientsCost: number;
  safetyMargin: number;
  costPerPortionOrKg: number;
  finalCost: number;
}

// Novos tipos para insumos
export interface RawMaterial {
  id: string;
  clientId: string;
  code: string;
  name: string;
  category: string;
  measurementUnit: string;
  unitPrice: number;
  supplier: string;
  minimumStock: number;
  currentStock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para despesas
export interface FixedExpense {
  id: string;
  clientId: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  dueDate: number; // Dia do mês
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VariableExpense {
  id: string;
  clientId: string;
  name: string;
  description: string;
  amount: number;
  expenseDate: Date;
  category: string;
  paymentMethod: string;
  receipt?: string;
  createdAt: Date;
}

// Novo tipo para compras de insumos
export interface RawMaterialPurchase {
  id: string;
  clientId: string;
  rawMaterialId: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  purchaseDate: Date;
  supplier: string;
  paymentMethod: string;
  receipt?: string;
  notes?: string;
  createdAt: Date;
}

// Novo tipo para custo de funcionários
export interface EmployeeCost {
  id: string;
  clientId: string;
  professional: string;
  hourlyCost: number;
  averageSalary: number;
  benefits: number; // Vale Transp, Refeição, Plano de Saúde, Seguro
  fgts: number;
  vacationAllowance: number; // Férias 1/12
  vacationBonus: number; // 1/3 Férias
  fgtsVacationBonus: number; // FGTS FÉRIAS e ADICIONAL DE 1/3
  thirteenthSalary: number; // 13 Salário
  fgtsThirteenth: number; // FGTS 13 Salário
  noticePeriod: number; // Aviso Prévio
  fgtsNoticePeriod: number; // FGTS Aviso Prévio
  fgtsPenalty: number; // Multa FGTS
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  clientId: string;
  saleDate: Date;
  totalSales: number;
  numberOfOrders: number;
  averageTicket: number;
  notes?: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  email: string;
  name: string;
  companyName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  companyName: string;
  phone?: string;
}