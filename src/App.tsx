import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RawMaterialsForm from './components/RawMaterialsForm';
import ProductForm from './components/ProductForm';
import ExpensesForm from './components/ExpensesForm';
import SalesForm from './components/SalesForm';
import { Product, RawMaterial, FixedExpense, VariableExpense, Sale } from './types';
import { 
  saveProducts, loadProducts, 
  saveRawMaterials, loadRawMaterials,
  saveFixedExpenses, loadFixedExpenses,
  saveVariableExpenses, loadVariableExpenses,
  saveSales, loadSales
} from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'insumos' | 'produtos' | 'despesas' | 'vendas'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    setProducts(loadProducts());
    setRawMaterials(loadRawMaterials());
    setFixedExpenses(loadFixedExpenses());
    setVariableExpenses(loadVariableExpenses());
    setSales(loadSales());
  }, []);

  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveRawMaterials(rawMaterials); }, [rawMaterials]);
  useEffect(() => { saveFixedExpenses(fixedExpenses); }, [fixedExpenses]);
  useEffect(() => { saveVariableExpenses(variableExpenses); }, [variableExpenses]);
  useEffect(() => { saveSales(sales); }, [sales]);

  // Handlers para produtos (existing)
  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, productData: Omit<Product, 'id' | 'createdAt'>) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...productData, lastModified: new Date() }
        : product
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Handlers para insumos (existing)
  const handleAddMaterial = (materialData: Omit<RawMaterial, 'id' | 'createdAt'>) => {
    const newMaterial: RawMaterial = {
      ...materialData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setRawMaterials([...rawMaterials, newMaterial]);
  };

  const handleUpdateMaterial = (id: string, materialData: Omit<RawMaterial, 'id' | 'createdAt'>) => {
    setRawMaterials(rawMaterials.map(material => 
      material.id === id 
        ? { ...material, ...materialData }
        : material
    ));
  };

  const handleDeleteMaterial = (id: string) => {
    setRawMaterials(rawMaterials.filter(material => material.id !== id));
  };

  // Handlers para despesas fixas (existing)
  const handleAddFixedExpense = (expenseData: Omit<FixedExpense, 'id' | 'createdAt'>) => {
    const newExpense: FixedExpense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFixedExpenses([...fixedExpenses, newExpense]);
  };

  const handleUpdateFixedExpense = (id: string, expenseData: Omit<FixedExpense, 'id' | 'createdAt'>) => {
    setFixedExpenses(fixedExpenses.map(expense => 
      expense.id === id 
        ? { ...expense, ...expenseData }
        : expense
    ));
  };

  const handleDeleteFixedExpense = (id: string) => {
    setFixedExpenses(fixedExpenses.filter(expense => expense.id !== id));
  };

  // Handlers para despesas variáveis (existing)
  const handleAddVariableExpense = (expenseData: Omit<VariableExpense, 'id' | 'createdAt'>) => {
    const newExpense: VariableExpense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setVariableExpenses([...variableExpenses, newExpense]);
  };

  const handleUpdateVariableExpense = (id: string, expenseData: Omit<VariableExpense, 'id' | 'createdAt'>) => {
    setVariableExpenses(variableExpenses.map(expense => 
      expense.id === id 
        ? { ...expense, ...expenseData }
        : expense
    ));
  };

  const handleDeleteVariableExpense = (id: string) => {
    setVariableExpenses(variableExpenses.filter(expense => expense.id !== id));
  };

  // Handlers para vendas (new)
  const handleAddSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSales([...sales, newSale]);
  };

  const handleUpdateSale = (id: string, saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    setSales(sales.map(sale => 
      sale.id === id 
        ? { ...sale, ...saleData }
        : sale
    ));
  };

  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard products={products} sales={sales} />;
      case 'insumos': 
        return <RawMaterialsForm 
          materials={rawMaterials} 
          onAddMaterial={handleAddMaterial} 
          onUpdateMaterial={handleUpdateMaterial} 
          onDeleteMaterial={handleDeleteMaterial} 
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
          onAddFixedExpense={handleAddFixedExpense}
          onUpdateFixedExpense={handleUpdateFixedExpense}
          onDeleteFixedExpense={handleDeleteFixedExpense}
          onAddVariableExpense={handleAddVariableExpense}
          onUpdateVariableExpense={handleUpdateVariableExpense}
          onDeleteVariableExpense={handleDeleteVariableExpense}
        />;
      case 'vendas': 
        return <SalesForm 
          sales={sales}
          onAddSale={handleAddSale}
          onUpdateSale={handleUpdateSale}
          onDeleteSale={handleDeleteSale}
        />;
      default: 
        return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;