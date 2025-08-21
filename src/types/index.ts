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
  code: string;
  name: string;
  category: string;
  portionYield: number;
  portionUnit: 'porções' | 'kg';
  ingredients: Ingredient[];
  sellingPrice: number;
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
  code: string;
  name: string;
  category: string;
  measurementUnit: string;
  unitPrice: number;
  supplier: string;
  minimumStock: number;
  currentStock: number;
  lastPurchaseDate: Date;
  createdAt: Date;
}

// Tipos para despesas
export interface FixedExpense {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  dueDate: number; // Dia do mês
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface VariableExpense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  paymentMethod: string;
  receipt?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  date: Date;
  totalSales: number;
  numberOfOrders: number;
  averageTicket: number;
  notes?: string;
  createdAt: Date;
}