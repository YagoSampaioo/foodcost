import { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { Product, RawMaterial, FixedExpense, VariableExpense, Sale, RawMaterialPurchase, EmployeeCost } from "../types";
import { apiService } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";

// Interface com todas as funções que os componentes vão precisar
interface DataContextType {
  loading: boolean;
  products: Product[];
  rawMaterials: RawMaterial[];
  sales: Sale[];
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  rawMaterialPurchases: RawMaterialPurchase[];
  employeeCosts: EmployeeCost[];

  // CRUD de Produtos
  addProduct: (data: Omit<Product, "id" | "created_at" | "last_modified" | "client_id">) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // CRUD de Insumos
  addRawMaterial: (data: Omit<RawMaterial, "id" | "created_at" | "updated_at" | "client_id">) => Promise<void>;

  // CRUD de Despesas Fixas
  addFixedExpense: (data: Omit<FixedExpense, "id" | "created_at" | "updated_at" | "client_id">) => Promise<void>;
  updateFixedExpense: (id: string, data: Partial<FixedExpense>) => Promise<void>;
  deleteFixedExpense: (id: string) => Promise<void>;

  // CRUD de Despesas Variáveis
  addVariableExpense: (data: Omit<VariableExpense, "id" | "created_at" | "client_id">) => Promise<void>;
  updateVariableExpense: (id: string, data: Partial<VariableExpense>) => Promise<void>;
  deleteVariableExpense: (id: string) => Promise<void>;

  // CRUD de Compras de Insumos
  addRawMaterialPurchase: (data: Omit<RawMaterialPurchase, "id" | "created_at" | "client_id">) => Promise<void>;
  updateRawMaterialPurchase: (id: string, data: Partial<RawMaterialPurchase>) => Promise<void>;
  deleteRawMaterialPurchase: (id: string) => Promise<void>;

  // CRUD de Custos de Funcionários
  addEmployeeCost: (data: Omit<EmployeeCost, "id" | "created_at" | "updated_at" | "client_id">) => Promise<void>;
  updateEmployeeCost: (id: string, data: Partial<EmployeeCost>) => Promise<void>;
  deleteEmployeeCost: (id: string) => Promise<void>;

  // CRUD de Vendas
  addSale: (data: Omit<Sale, "id" | "created_at" | "client_id">) => Promise<void>;
  updateSale: (id: string, data: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;

  addIngredient: (product_id: string, data: any) => Promise<void>;
  updateIngredient: (ingredientId: string, data: any) => Promise<void>;
  deleteIngredient: (ingredientId: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([]);
  const [rawMaterialPurchases, setRawMaterialPurchases] = useState<RawMaterialPurchase[]>([]);
  const [employeeCosts, setEmployeeCosts] = useState<EmployeeCost[]>([]);

  // Carregar todos os dados
  const fetchData = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const [
          productsData,
          rawMaterialsData,
          fixedExpensesData,
          variableExpensesData,
          rawMaterialPurchasesData,
          employeeCostsData,
          salesData,
        ] = await Promise.all([
          apiService.getProducts(),
          apiService.getRawMaterials(),
          apiService.getFixedExpenses(),
          apiService.getVariableExpenses(),
          apiService.getRawMaterialPurchases(),
          apiService.getEmployeeCosts(),
          apiService.getSales(),
        ]);
        setProducts(productsData || []);
        setRawMaterials(rawMaterialsData || []);
        setFixedExpenses(fixedExpensesData || []);
        setVariableExpenses(variableExpensesData || []);
        setRawMaterialPurchases(rawMaterialPurchasesData || []);
        setEmployeeCosts(employeeCostsData || []);
        setSales(salesData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setProducts([]);
      setRawMaterials([]);
      setSales([]);
      setFixedExpenses([]);
      setVariableExpenses([]);
      setRawMaterialPurchases([]);
      setEmployeeCosts([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Funções CRUD
  const getclient_id = () => {
    if (!currentUser) throw new Error("Usuário não autenticado");
    return currentUser.id;
  };

  // Produtos
  const addProduct = async (data: any) => {
    const newProduct = await apiService.createProduct({ ...data, client_id: getclient_id() });
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id: string, data: any) => {
    await apiService.updateProduct(id, data);
    fetchData(); // Re-fetch para garantir consistência
  };
  const deleteProduct = async (id: string) => {
    await apiService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Insumos
  const addRawMaterial = async (data: any) => {
    const newMaterial = await apiService.createRawMaterial({ ...data, client_id: getclient_id() });
    setRawMaterials((prev) => [newMaterial, ...prev]);
  };

  // Despesas Fixas
  const addFixedExpense = async (data: any) => {
    const newExpense = await apiService.createFixedExpense({ ...data, client_id: getclient_id() });
    setFixedExpenses((prev) => [newExpense, ...prev]);
  };
  const updateFixedExpense = async (id: string, data: any) => {
    await apiService.updateFixedExpense(id, data);
    fetchData();
  };
  const deleteFixedExpense = async (id: string) => {
    await apiService.deleteFixedExpense(id);
    setFixedExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Despesas Variáveis
  const addVariableExpense = async (data: any) => {
    const newExpense = await apiService.createVariableExpense({ ...data, client_id: getclient_id() });
    setVariableExpenses((prev) => [newExpense, ...prev]);
  };
  const updateVariableExpense = async (id: string, data: any) => {
    await apiService.updateVariableExpense(id, data);
    fetchData();
  };
  const deleteVariableExpense = async (id: string) => {
    await apiService.deleteVariableExpense(id);
    setVariableExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Compras de Insumos
  const addRawMaterialPurchase = async (data: any) => {
    const newPurchase = await apiService.createRawMaterialPurchase({ ...data, client_id: getclient_id() });
    setRawMaterialPurchases((prev) => [newPurchase, ...prev]);
  };
  const updateRawMaterialPurchase = async (id: string, data: any) => {
    await apiService.updateRawMaterialPurchase(id, data);
    fetchData();
  };
  const deleteRawMaterialPurchase = async (id: string) => {
    await apiService.deleteRawMaterialPurchase(id);
    setRawMaterialPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  // Custos de Funcionários
  const addEmployeeCost = async (data: any) => {
    const newCost = await apiService.createEmployeeCost({ ...data, client_id: getclient_id() });
    setEmployeeCosts((prev) => [newCost, ...prev]);
  };
  const updateEmployeeCost = async (id: string, data: any) => {
    await apiService.updateEmployeeCost(id, data);
    fetchData();
  };
  const deleteEmployeeCost = async (id: string) => {
    await apiService.deleteEmployeeCost(id);
    setEmployeeCosts((prev) => prev.filter((c) => c.id !== id));
  };

  // Vendas
  const addSale = async (data: any) => {
    const newSale = await apiService.createSale({ ...data, client_id: getclient_id() });
    setSales((prev) => [newSale, ...prev]);
  };
  const updateSale = async (id: string, data: any) => {
    await apiService.updateSale(id, data);
    fetchData();
  };
  const deleteSale = async (id: string) => {
    await apiService.deleteSale(id);
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const addIngredient = async (product_id: string, data: any) => {
    await apiService.addIngredientToProduct(product_id, data);
    fetchData(); // Recarrega todos os dados para garantir consistência
  };

  const updateIngredient = async (ingredientId: string, data: any) => {
    await apiService.updateProductIngredient(ingredientId, data);
    fetchData();
  };

  const deleteIngredient = async (ingredientId: string) => {
    await apiService.deleteProductIngredient(ingredientId);
    fetchData();
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        products,
        rawMaterials,
        sales,
        fixedExpenses,
        variableExpenses,
        rawMaterialPurchases,
        employeeCosts,
        addProduct,
        updateProduct,
        deleteProduct,
        addRawMaterial,
        addFixedExpense,
        updateFixedExpense,
        deleteFixedExpense,
        addVariableExpense,
        updateVariableExpense,
        deleteVariableExpense,
        addRawMaterialPurchase,
        updateRawMaterialPurchase,
        deleteRawMaterialPurchase,
        addEmployeeCost,
        updateEmployeeCost,
        deleteEmployeeCost,
        addSale,
        updateSale,
        deleteSale,
        addIngredient,
        updateIngredient,
        deleteIngredient,
      }}>
      {children}
    </DataContext.Provider>
  );
};
