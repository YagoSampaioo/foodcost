import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RawMaterialsForm from './components/RawMaterialsForm';
import ProductForm from './components/ProductForm';
import ExpensesForm from './components/ExpensesForm';
import SalesForm from './components/SalesForm';
import Auth from './components/Auth';
import { Product, RawMaterial, FixedExpense, VariableExpense, Sale, AuthUser, RawMaterialPurchase } from './types';
import { authService } from './services/authService';
import { supabaseService } from './services/supabaseService';

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'insumos' | 'produtos' | 'despesas' | 'vendas'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([]);
  const [rawMaterialPurchases, setRawMaterialPurchases] = useState<RawMaterialPurchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Verificar se usuário está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Carregar dados do Supabase quando usuário estiver autenticado
  useEffect(() => {
    const loadDataFromSupabase = async () => {
      if (currentUser) {
        try {
          // Limpar localStorage antigo para evitar conflitos
          localStorage.removeItem('foodcost_products');
          localStorage.removeItem('foodcost_raw_materials');
          localStorage.removeItem('foodcost_fixed_expenses');
          localStorage.removeItem('foodcost_variable_expenses');
          localStorage.removeItem('foodcost_sales');
          
          const [
            productsData,
            rawMaterialsData,
            fixedExpensesData,
            variableExpensesData,
            rawMaterialPurchasesData,
            salesData
          ] = await Promise.all([
            supabaseService.getProducts(currentUser.id),
            supabaseService.getRawMaterials(currentUser.id),
            supabaseService.getFixedExpenses(currentUser.id),
            supabaseService.getVariableExpenses(currentUser.id),
            supabaseService.getRawMaterialPurchases(currentUser.id),
            supabaseService.getSales(currentUser.id)
          ]);

          // Verificar se os dados estão corretos antes de definir
          const validProducts = productsData.filter(product => 
            product && typeof product === 'object'
          );
          const validRawMaterials = rawMaterialsData.filter(material => 
            material && typeof material === 'object'
          );
          const validFixedExpenses = fixedExpensesData.filter(expense => 
            expense && typeof expense === 'object'
          );
          const validVariableExpenses = variableExpensesData.filter(expense => 
            expense && typeof expense === 'object'
          );
          const validRawMaterialPurchases = rawMaterialPurchasesData.filter(purchase => 
            purchase && typeof purchase === 'object'
          );
          const validSales = salesData.filter(sale => 
            sale && typeof sale === 'object'
          );

          setProducts(validProducts);
          setRawMaterials(validRawMaterials);
          setFixedExpenses(validFixedExpenses);
          setVariableExpenses(validVariableExpenses);
          setRawMaterialPurchases(validRawMaterialPurchases);
          setSales(validSales);
        } catch (error) {
          console.error('Erro ao carregar dados do Supabase:', error);
        }
      }
    };

    loadDataFromSupabase();
  }, [currentUser]);

  // Handlers para produtos (Supabase)
  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'lastModified'>) => {
    if (!currentUser) return;
    
    try {
      const newProduct = await supabaseService.createProduct({
        ...productData,
        clientId: currentUser.id
      });
      setProducts([newProduct, ...products]);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  };

  const handleUpdateProduct = async (id: string, productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      await supabaseService.updateProduct(id, productData);
    setProducts(products.map(product => 
      product.id === id 
          ? { ...product, ...productData, lastModified: new Date() }
        : product
    ));
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await supabaseService.deleteProduct(id);
    setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  };

  // Handlers para insumos (Supabase)
  const handleAddMaterial = async (materialData: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;
    
    console.log('handleAddMaterial chamado com:', materialData);
    console.log('currentUser.id:', currentUser.id);
    
    try {
      const newMaterial = await supabaseService.createRawMaterial({
        ...materialData,
        clientId: currentUser.id
      });
      console.log('Insumo criado com sucesso:', newMaterial);
      setRawMaterials([newMaterial, ...rawMaterials]);
    } catch (error) {
      console.error('Erro ao criar insumo:', error);
      throw error;
    }
  };

  const handleUpdateMaterial = async (id: string, materialData: Partial<RawMaterial>) => {
    try {
      await supabaseService.updateRawMaterial(id, materialData);
      setRawMaterials(rawMaterials.map(material => 
        material.id === id 
          ? { ...material, ...materialData }
          : material
      ));
    } catch (error) {
      console.error('Erro ao atualizar insumo:', error);
      throw error;
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await supabaseService.deleteRawMaterial(id);
      setRawMaterials(rawMaterials.filter(material => material.id !== id));
    } catch (error) {
      console.error('Erro ao deletar insumo:', error);
      throw error;
    }
  };

  // Handlers para despesas fixas (Supabase)
  const handleAddFixedExpense = async (expenseData: Omit<FixedExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;
    
    try {
      const newExpense = await supabaseService.createFixedExpense({
        ...expenseData,
        clientId: currentUser.id
      });
      setFixedExpenses([newExpense, ...fixedExpenses]);
    } catch (error) {
      console.error('Erro ao criar despesa fixa:', error);
      throw error;
    }
  };

  const handleUpdateFixedExpense = async (id: string, expenseData: Partial<FixedExpense>) => {
    try {
      // Implementar updateFixedExpense no supabaseService
      setFixedExpenses(fixedExpenses.map(expense => 
        expense.id === id 
          ? { ...expense, ...expenseData }
          : expense
      ));
    } catch (error) {
      console.error('Erro ao atualizar despesa fixa:', error);
      throw error;
    }
  };

  const handleDeleteFixedExpense = async (id: string) => {
    try {
      // Implementar deleteFixedExpense no supabaseService
      setFixedExpenses(fixedExpenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Erro ao deletar despesa fixa:', error);
      throw error;
    }
  };

  // Handlers para despesas variáveis (Supabase)
  const handleAddVariableExpense = async (expenseData: Omit<VariableExpense, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    try {
      const newExpense = await supabaseService.createVariableExpense({
        ...expenseData,
        clientId: currentUser.id
      });
      setVariableExpenses([newExpense, ...variableExpenses]);
    } catch (error) {
      console.error('Erro ao criar despesa variável:', error);
      throw error;
    }
  };

  const handleUpdateVariableExpense = async (id: string, expenseData: Partial<VariableExpense>) => {
    try {
      // Implementar updateVariableExpense no supabaseService
      setVariableExpenses(variableExpenses.map(expense => 
        expense.id === id 
          ? { ...expense, ...expenseData }
          : expense
      ));
    } catch (error) {
      console.error('Erro ao atualizar despesa variável:', error);
      throw error;
    }
  };

  const handleDeleteVariableExpense = async (id: string) => {
    try {
      // Implementar deleteVariableExpense no supabaseService
      setVariableExpenses(variableExpenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Erro ao deletar despesa variável:', error);
      throw error;
    }
  };

  // Handlers para compras de insumos (Supabase)
  const handleAddRawMaterialPurchase = async (purchaseData: Omit<RawMaterialPurchase, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    try {
      const newPurchase = await supabaseService.createRawMaterialPurchase({
        ...purchaseData,
        clientId: currentUser.id
      });
      setRawMaterialPurchases([newPurchase, ...rawMaterialPurchases]);
    } catch (error) {
      console.error('Erro ao criar compra de insumo:', error);
      throw error;
    }
  };

  const handleUpdateRawMaterialPurchase = async (id: string, purchaseData: Partial<RawMaterialPurchase>) => {
    try {
      await supabaseService.updateRawMaterialPurchase(id, purchaseData);
      setRawMaterialPurchases(rawMaterialPurchases.map(purchase => 
        purchase.id === id 
          ? { ...purchase, ...purchaseData }
          : purchase
      ));
    } catch (error) {
      console.error('Erro ao atualizar compra de insumo:', error);
      throw error;
    }
  };

  const handleDeleteRawMaterialPurchase = async (id: string) => {
    try {
      await supabaseService.deleteRawMaterialPurchase(id);
      setRawMaterialPurchases(rawMaterialPurchases.filter(purchase => purchase.id !== id));
    } catch (error) {
      console.error('Erro ao deletar compra de insumo:', error);
      throw error;
    }
  };

  // Handlers para vendas (Supabase)
  const handleAddSale = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    try {
      const newSale = await supabaseService.createSale({
        ...saleData,
        clientId: currentUser.id
      });
      setSales([newSale, ...sales]);
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      throw error;
    }
  };

  const handleUpdateSale = async (id: string, saleData: Partial<Sale>) => {
    try {
      await supabaseService.updateSale(id, saleData);
      setSales(sales.map(sale => 
        sale.id === id 
          ? { ...sale, ...saleData }
          : sale
      ));
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      throw error;
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      await supabaseService.deleteSale(id);
      setSales(sales.filter(sale => sale.id !== id));
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
      throw error;
    }
  };

  // Handlers de autenticação
  const handleLogin = async (email: string, password: string) => {
    const user = await authService.login({ email, password });
    setCurrentUser(user);
  };



  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    // Limpar dados ao fazer logout
    setProducts([]);
    setRawMaterials([]);
    setFixedExpenses([]);
    setVariableExpenses([]);
    setRawMaterialPurchases([]);
    setSales([]);
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard 
          products={products} 
          sales={sales} 
          rawMaterials={rawMaterials}
          fixedExpenses={fixedExpenses}
          variableExpenses={variableExpenses}
          rawMaterialPurchases={rawMaterialPurchases}
        />;
      case 'insumos': 
        return <RawMaterialsForm 
          rawMaterials={rawMaterials}
          purchases={rawMaterialPurchases}
        />;
      case 'produtos': 
        return <ProductForm 
          products={products}
          rawMaterials={rawMaterials} 
          fixedExpenses={fixedExpenses}
          variableExpenses={variableExpenses}
          sales={sales}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />;
      case 'despesas': 
        return <ExpensesForm 
          fixedExpenses={fixedExpenses}
          variableExpenses={variableExpenses}
          rawMaterialPurchases={rawMaterialPurchases}
          rawMaterials={rawMaterials}
          onAddFixedExpense={handleAddFixedExpense}
          onUpdateFixedExpense={handleUpdateFixedExpense}
          onDeleteFixedExpense={handleDeleteFixedExpense}
          onAddVariableExpense={handleAddVariableExpense}
          onUpdateVariableExpense={handleUpdateVariableExpense}
          onDeleteVariableExpense={handleDeleteVariableExpense}
          onAddRawMaterialPurchase={handleAddRawMaterialPurchase}
          onUpdateRawMaterialPurchase={handleUpdateRawMaterialPurchase}
          onDeleteRawMaterialPurchase={handleDeleteRawMaterialPurchase}
          onAddRawMaterial={handleAddMaterial}
        />;
      case 'vendas': 
        return <SalesForm 
          sales={sales}
          onAddSale={handleAddSale}
          onUpdateSale={handleUpdateSale}
          onDeleteSale={handleDeleteSale}
        />;
      default: 
        return <Dashboard 
          products={products} 
          sales={sales} 
          rawMaterials={rawMaterials}
          fixedExpenses={fixedExpenses}
          variableExpenses={variableExpenses}
          rawMaterialPurchases={rawMaterialPurchases}
        />;
    }
  };

  // Loading inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://toyegzbckmtrvnfxbign.supabase.co/storage/v1/object/public/branding/logo.png" 
              alt="FoodCost Logo" 
              className="h-12 w-12 mr-3"
            />
            <h1 className="text-3xl font-bold text-gray-900">FoodCost</h1>
          </div>
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!currentUser) {
    return (
      <Auth 
        onLogin={handleLogin}
      />
    );
  }

  // Se estiver autenticado, mostrar aplicação principal
  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;