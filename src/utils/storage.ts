import { Product, RawMaterial, FixedExpense, VariableExpense, Sale } from '../types';

const PRODUCTS_STORAGE_KEY = 'foodcost_products';
const RAW_MATERIALS_STORAGE_KEY = 'foodcost_raw_materials';
const FIXED_EXPENSES_STORAGE_KEY = 'foodcost_fixed_expenses';
const VARIABLE_EXPENSES_STORAGE_KEY = 'foodcost_variable_expenses';
const SALES_STORAGE_KEY = 'foodcost_sales';

// Functions for products
export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

export function loadProducts(): Product[] {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (data) {
      const products = JSON.parse(data);
      return products.map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        lastModified: product.lastModified ? new Date(product.lastModified) : new Date()
      }));
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
  return [];
}

// Functions for raw materials
export function saveRawMaterials(materials: RawMaterial[]): void {
  try {
    localStorage.setItem(RAW_MATERIALS_STORAGE_KEY, JSON.stringify(materials));
  } catch (error) {
    console.error('Error saving raw materials:', error);
  }
}

export function loadRawMaterials(): RawMaterial[] {
  try {
    const data = localStorage.getItem(RAW_MATERIALS_STORAGE_KEY);
    if (data) {
      const materials = JSON.parse(data);
      return materials.map((material: any) => ({
        ...material,
        createdAt: new Date(material.createdAt),
        lastPurchaseDate: new Date(material.lastPurchaseDate)
      }));
    }
  } catch (error) {
    console.error('Error loading raw materials:', error);
  }
  return [];
}

// Functions for fixed expenses
export function saveFixedExpenses(expenses: FixedExpense[]): void {
  try {
    localStorage.setItem(FIXED_EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving fixed expenses:', error);
  }
}

export function loadFixedExpenses(): FixedExpense[] {
  try {
    const data = localStorage.getItem(FIXED_EXPENSES_STORAGE_KEY);
    if (data) {
      const expenses = JSON.parse(data);
      return expenses.map((expense: any) => ({
        ...expense,
        createdAt: new Date(expense.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading fixed expenses:', error);
  }
  return [];
}

// Functions for variable expenses
export function saveVariableExpenses(expenses: VariableExpense[]): void {
  try {
    localStorage.setItem(VARIABLE_EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving variable expenses:', error);
  }
}

export function loadVariableExpenses(): VariableExpense[] {
  try {
    const data = localStorage.getItem(VARIABLE_EXPENSES_STORAGE_KEY);
    if (data) {
      const expenses = JSON.parse(data);
      return expenses.map((expense: any) => ({
        ...expense,
        createdAt: new Date(expense.createdAt),
        date: new Date(expense.date)
      }));
    }
  } catch (error) {
    console.error('Error loading variable expenses:', error);
  }
  return [];
}

// Functions for sales
export function saveSales(sales: Sale[]): void {
  try {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sales:', error);
  }
}

export function loadSales(): Sale[] {
  try {
    const data = localStorage.getItem(SALES_STORAGE_KEY);
    if (data) {
      const sales = JSON.parse(data);
      return sales.map((sale: any) => ({
        ...sale,
        createdAt: new Date(sale.createdAt),
        date: new Date(sale.date)
      }));
    }
  } catch (error) {
    console.error('Error loading sales:', error);
  }
  return [];
}