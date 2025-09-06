import { apiClient } from "../config/axios";
import { RawMaterial, Product, FixedExpense, VariableExpense, Sale, EmployeeCost, RawMaterialPurchase } from "../types";

export const apiService = {
  // --- Raw Materials ---
  getRawMaterials: async (): Promise<RawMaterial[]> => {
    const response = await apiClient.get("/supabase/raw-materials");
    return response.data;
  },
  createRawMaterial: async (material: Omit<RawMaterial, "id" | "created_at" | "updatedAt">): Promise<RawMaterial> => {
    const response = await apiClient.post("/supabase/raw-materials", material);
    return response.data;
  },
  updateRawMaterial: async (id: string, material: Partial<RawMaterial>): Promise<void> => {
    await apiClient.put(`/supabase/raw-materials/${id}`, material);
  },
  deleteRawMaterial: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/raw-materials/${id}`);
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get("/supabase/products");
    return response.data;
  },
  createProduct: async (product: Omit<Product, "id" | "created_at" | "last_modified">): Promise<Product> => {
    const response = await apiClient.post("/supabase/products", product);
    return response.data;
  },
  updateProduct: async (id: string, product: Partial<Product>): Promise<void> => {
    await apiClient.put(`/supabase/products/${id}`, product);
  },
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/products/${id}`);
  },

  // --- Fixed Expenses ---
  getFixedExpenses: async (): Promise<FixedExpense[]> => {
    const response = await apiClient.get("/supabase/fixed-expenses");
    return response.data;
  },
  createFixedExpense: async (expense: Omit<FixedExpense, "id" | "created_at" | "updatedAt">): Promise<FixedExpense> => {
    const response = await apiClient.post("/supabase/fixed-expenses", expense);
    return response.data;
  },
  updateFixedExpense: async (id: string, expense: Partial<FixedExpense>): Promise<void> => {
    await apiClient.put(`/supabase/fixed-expenses/${id}`, expense);
  },
  deleteFixedExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/fixed-expenses/${id}`);
  },

  // --- Variable Expenses ---
  getVariableExpenses: async (): Promise<VariableExpense[]> => {
    const response = await apiClient.get("/supabase/variable-expenses");
    return response.data;
  },
  createVariableExpense: async (expense: Omit<VariableExpense, "id" | "created_at">): Promise<VariableExpense> => {
    const response = await apiClient.post("/supabase/variable-expenses", expense);
    return response.data;
  },
  updateVariableExpense: async (id: string, expense: Partial<VariableExpense>): Promise<void> => {
    await apiClient.put(`/supabase/variable-expenses/${id}`, expense);
  },
  deleteVariableExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/variable-expenses/${id}`);
  },

  // --- Sales ---
  getSales: async (): Promise<Sale[]> => {
    const response = await apiClient.get("/supabase/sales");
    return response.data.map((sale: any) => ({ ...sale, saleDate: new Date(sale.saleDate) }));
  },
  createSale: async (sale: Omit<Sale, "id" | "created_at">): Promise<Sale> => {
    const response = await apiClient.post("/supabase/sales", sale);
    return { ...response.data, saleDate: new Date(response.data.saleDate) };
  },
  updateSale: async (id: string, sale: Partial<Sale>): Promise<void> => {
    await apiClient.put(`/supabase/sales/${id}`, sale);
  },
  deleteSale: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/sales/${id}`);
  },

  // --- Raw Material Purchases ---
  getRawMaterialPurchases: async (): Promise<RawMaterialPurchase[]> => {
    const response = await apiClient.get("/supabase/raw-material-purchases");
    return response.data.map((p: any) => ({ ...p, purchaseDate: new Date(p.purchaseDate) }));
  },
  createRawMaterialPurchase: async (
    purchase: Omit<RawMaterialPurchase, "id" | "created_at">
  ): Promise<RawMaterialPurchase> => {
    const response = await apiClient.post("/supabase/raw-material-purchases", purchase);
    return { ...response.data, purchaseDate: new Date(response.data.purchaseDate) };
  },
  updateRawMaterialPurchase: async (id: string, purchase: Partial<RawMaterialPurchase>): Promise<void> => {
    await apiClient.put(`/supabase/raw-material-purchases/${id}`, purchase);
  },
  deleteRawMaterialPurchase: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/raw-material-purchases/${id}`);
  },

  // --- Employee Costs ---
  getEmployeeCosts: async (): Promise<EmployeeCost[]> => {
    const response = await apiClient.get("/supabase/employee-costs");
    return response.data;
  },
  createEmployeeCost: async (cost: Omit<EmployeeCost, "id" | "created_at" | "updatedAt">): Promise<EmployeeCost> => {
    const response = await apiClient.post("/supabase/employee-costs", cost);
    return response.data;
  },
  updateEmployeeCost: async (id: string, cost: Partial<EmployeeCost>): Promise<void> => {
    await apiClient.put(`/supabase/employee-costs/${id}`, cost);
  },
  deleteEmployeeCost: async (id: string): Promise<void> => {
    await apiClient.delete(`/supabase/employee-costs/${id}`);
  },
  // --- Product Ingredients ---
  addIngredientToProduct: async (product_id: string, ingredientData: any): Promise<any> => {
    const response = await apiClient.post(`/supabase/products/${product_id}/ingredients`, ingredientData);
    return response.data;
  },

  updateProductIngredient: async (ingredientId: string, ingredientData: any): Promise<any> => {
    const response = await apiClient.put(`/supabase/ingredients/${ingredientId}`, ingredientData);
    return response.data;
  },

  deleteProductIngredient: async (ingredientId: string): Promise<void> => {
    await apiClient.delete(`/supabase/ingredients/${ingredientId}`);
  },
};
