import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChefHat } from 'lucide-react';
import { Product, RawMaterial, FixedExpense, VariableExpense, Sale, RawMaterialPurchase, AuthUser } from '../types';
import { formatNumber, formatSimpleCurrency, formatPercentage } from '../utils/formatters';

interface ProductFormProps {
  products: Product[];
  rawMaterials: RawMaterial[];
  rawMaterialPurchases: RawMaterialPurchase[];
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  sales: Sale[];
  currentUser: AuthUser | null;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, product: Omit<Product, 'id' | 'createdAt'>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductForm({
  products,
  rawMaterials,
  rawMaterialPurchases,
  fixedExpenses,
  variableExpenses,
  sales,
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  
  const [newIngredient, setNewIngredient] = useState({
    rawMaterialId: '',
    quantity: 0,
    measurementUnit: '',
    selectedUnit: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    portionYield: 1,
    portionUnit: 'porções',
    sellingPrice: 0,
    marginPercentage: 30,
    clientId: currentUser?.id || '',
    lastModified: new Date(),
    ingredients: [] as Array<{
      rawMaterialId: string;
      quantity: number;
      unitPrice: number;
      totalCost: number;
    }>
  });

  // Função para converter unidades de medida
  const convertUnit = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return value;
    
    // Conversões de peso
    if (fromUnit === 'kg' && toUnit === 'g') return value * 1000;
    if (fromUnit === 'g' && toUnit === 'kg') return value / 1000;
    if (fromUnit === 'kg' && toUnit === 'mg') return value * 1000000;
    if (fromUnit === 'mg' && toUnit === 'kg') return value / 1000000;
    if (fromUnit === 'g' && toUnit === 'mg') return value * 1000;
    if (fromUnit === 'mg' && toUnit === 'g') return value / 1000;
    
    // Conversões de volume
    if (fromUnit === 'l' && toUnit === 'ml') return value * 1000;
    if (fromUnit === 'ml' && toUnit === 'l') return value / 1000;
    if (fromUnit === 'l' && toUnit === 'cl') return value * 100;
    if (fromUnit === 'cl' && toUnit === 'l') return value / 100;
    
    // Conversões de comprimento
    if (fromUnit === 'm' && toUnit === 'cm') return value * 100;
    if (fromUnit === 'cm' && toUnit === 'm') return value / 100;
    if (fromUnit === 'm' && toUnit === 'mm') return value * 1000;
    if (fromUnit === 'mm' && toUnit === 'm') return value / 1000;
    
    return value;
  };

  // Função para obter apenas insumos que foram comprados (têm histórico de compras)
  const getPurchasedMaterials = () => {
    if (!rawMaterialPurchases || rawMaterialPurchases.length === 0) {
      return [];
    }
    
    const purchasedMaterialIds = [...new Set(rawMaterialPurchases.map(purchase => purchase.rawMaterialId))];
    return rawMaterials.filter(material => purchasedMaterialIds.includes(material.id));
  };

  // Função para obter o preço unitário real da compra mais recente de um insumo
  const getLatestPurchasePrice = (rawMaterialId: string): number => {
    if (!rawMaterialPurchases || rawMaterialPurchases.length === 0) {
      return 0;
    }
    
    const materialPurchases = rawMaterialPurchases
      .filter(purchase => purchase.rawMaterialId === rawMaterialId)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    
    return materialPurchases.length > 0 ? materialPurchases[0].unitPrice : 0;
  };

  // Função para obter unidades disponíveis baseadas na unidade do insumo
  const getAvailableUnits = (baseUnit: string): string[] => {
    const unitGroups = {
      weight: ['kg', 'g', 'mg'],
      volume: ['l', 'ml', 'cl'],
      length: ['m', 'cm', 'mm'],
      unit: ['unidade', 'pç', 'kg', 'g', 'l', 'ml']
    };
    
    let group = 'unit';
    if (['kg', 'g', 'mg'].includes(baseUnit)) group = 'weight';
    else if (['l', 'ml', 'cl'].includes(baseUnit)) group = 'volume';
    else if (['m', 'cm', 'mm'].includes(baseUnit)) group = 'length';
    
    return unitGroups[group as keyof typeof unitGroups];
  };

  // Estado para seleção de mês
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (sales.length > 0) {
      const mostRecentSale = sales[0];
      const saleDate = new Date(mostRecentSale.saleDate);
      return `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
    }
    
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Atualizar o mês selecionado quando as vendas carregarem
  useEffect(() => {
    if (sales.length > 0) {
      const mostRecentSale = sales[0];
      const saleDate = new Date(mostRecentSale.saleDate);
      const recentMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      
      const currentMonthHasSales = sales.some(sale => {
        const currentSaleDate = new Date(sale.saleDate);
        const currentMonth = new Date();
        return currentSaleDate.getMonth() === currentMonth.getMonth() && 
               currentSaleDate.getFullYear() === currentMonth.getFullYear();
      });
      
      if (!currentMonthHasSales) {
        setSelectedMonth(recentMonth);
      }
    }
  }, [sales]);

  // Atualizar clientId quando currentUser mudar
  useEffect(() => {
    if (currentUser?.id) {
      setFormData(prev => ({
        ...prev,
        clientId: currentUser.id
      }));
    }
  }, [currentUser]);

  // Cálculo automático das despesas baseado no faturamento mensal
  const calculateExpensePercentages = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const targetMonth = month - 1;
    
    const monthlyRevenue = sales.filter(sale => {
      if (!sale.saleDate) return false;
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === targetMonth && 
             saleDate.getFullYear() === year;
    }).reduce((sum, sale) => sum + (sale.totalSales || 0), 0);
    
    const monthlyFixedExpenses = fixedExpenses
      .filter(expense => expense.isActive)
      .reduce((sum, expense) => {
        switch (expense.frequency) {
          case 'mensal': return sum + expense.amount;
          case 'trimestral': return sum + (expense.amount / 3);
          case 'semestral': return sum + (expense.amount / 6);
          case 'anual': return sum + (expense.amount / 12);
          default: return sum + expense.amount;
        }
      }, 0);
    
    const monthlyVariableExpenses = variableExpenses.filter(expense => {
      if (!expense.expenseDate) return false;
      const expenseDate = new Date(expense.expenseDate);
      return expenseDate.getMonth() === targetMonth && 
             expenseDate.getFullYear() === year;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalMonthlyExpenses = monthlyFixedExpenses + monthlyVariableExpenses;
    
    let fixedExpensesPercentage = 0;
    let variableExpensesPercentage = 0;
    let totalExpensesPercentage = 0;
    
    if (monthlyRevenue > 0) {
      fixedExpensesPercentage = (monthlyFixedExpenses / monthlyRevenue) * 100;
      variableExpensesPercentage = (monthlyVariableExpenses / monthlyRevenue) * 100;
      totalExpensesPercentage = fixedExpensesPercentage + variableExpensesPercentage;
    } else {
      const totalExpenses = totalMonthlyExpenses;
      if (totalExpenses > 0) {
        const estimatedRevenue = totalExpenses * 2;
        fixedExpensesPercentage = (monthlyFixedExpenses / estimatedRevenue) * 100;
        variableExpensesPercentage = (monthlyVariableExpenses / estimatedRevenue) * 100;
        totalExpensesPercentage = fixedExpensesPercentage + variableExpensesPercentage;
      }
    }
    
    return {
      monthlyRevenue,
      monthlyFixedExpenses,
      monthlyVariableExpenses,
      totalMonthlyExpenses,
      fixedExpensesPercentage,
      variableExpensesPercentage,
      totalExpensesPercentage
    };
  };

  const expenseData = calculateExpensePercentages();

  // Calcular custo da receita
  const calculateRecipeCost = () => {
    return formData.ingredients.reduce((total, ingredient) => total + ingredient.totalCost, 0);
  };

  // Calcular preço sugerido
  const calculateSuggestedPrice = () => {
    const recipeCost = calculateRecipeCost();
    const totalExpensePercentage = expenseData.totalExpensesPercentage / 100;
    
    if (recipeCost === 0) return 0;
    
    const basePrice = recipeCost / (1 - totalExpensePercentage);
    const priceWithMargin = basePrice * (1 + (formData.marginPercentage / 100));
    
    return Math.round(priceWithMargin * 100) / 100;
  };

  const calculateProfit = () => {
    const recipeCost = calculateRecipeCost();
    
    let expensesCost = 0;
    if (expenseData.totalExpensesPercentage > 0) {
      expensesCost = (formData.sellingPrice * expenseData.totalExpensesPercentage) / 100;
    }
    
    const profit = formData.sellingPrice - recipeCost - expensesCost;
    return Math.round(profit * 100) / 100;
  };

  const recipeCost = calculateRecipeCost();
  const suggestedPrice = calculateSuggestedPrice();
  const profit = calculateProfit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, formData);
        setEditingProduct(null);
      } else {
        await onAddProduct(formData);
      }
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      portionYield: product.portionYield,
      portionUnit: product.portionUnit,
      sellingPrice: product.sellingPrice,
      marginPercentage: product.marginPercentage || 30,
      clientId: currentUser?.id || '',
      lastModified: new Date(),
      ingredients: product.ingredients || []
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await onDeleteProduct(id);
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      portionYield: 1,
      portionUnit: 'porções',
      sellingPrice: 0,
      marginPercentage: 30,
      clientId: currentUser?.id || '',
      lastModified: new Date(),
      ingredients: []
    });
    setEditingProduct(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    resetForm();
    setIsFormOpen(false);
  };

  const handleAddIngredient = () => {
    if (newIngredient.rawMaterialId && newIngredient.quantity > 0) {
      const selectedMaterial = rawMaterials.find(m => m.id === newIngredient.rawMaterialId);
      if (selectedMaterial) {
        const realUnitPrice = getLatestPurchasePrice(newIngredient.rawMaterialId);
        
        const convertedQuantity = convertUnit(
          newIngredient.quantity, 
          newIngredient.selectedUnit || selectedMaterial.measurementUnit, 
          selectedMaterial.measurementUnit
        );
        
        const totalCost = realUnitPrice * convertedQuantity;
        const ingredient = {
          rawMaterialId: newIngredient.rawMaterialId,
          quantity: newIngredient.quantity,
          selectedUnit: newIngredient.selectedUnit || selectedMaterial.measurementUnit,
          baseUnit: selectedMaterial.measurementUnit,
          unitPrice: realUnitPrice,
          totalCost: totalCost
        };
        
        setFormData({
          ...formData,
          ingredients: [...formData.ingredients, ingredient]
        });
        
        setNewIngredient({
          rawMaterialId: '',
          quantity: 0,
          measurementUnit: '',
          selectedUnit: ''
        });
        
        setIsIngredientsModalOpen(false);
      }
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Financeiro do Mês ({new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {formatNumber(expenseData.monthlyRevenue)}
            </div>
            <div className="text-sm text-gray-600">Faturamento Mensal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              R$ {formatNumber(expenseData.monthlyFixedExpenses)}
            </div>
            <div className="text-sm text-gray-600">Despesas Fixas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              R$ {formatNumber(expenseData.monthlyVariableExpenses)}
            </div>
            <div className="text-sm text-gray-600">Despesas Variáveis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(expenseData.totalExpensesPercentage)}
            </div>
            <div className="text-sm text-gray-600">% Total Despesas</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Selecionar mês:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Como funciona:</strong> As porcentagens de despesas são calculadas automaticamente 
            baseadas neste faturamento real. Use o seletor acima para analisar diferentes meses.
          </p>
          {expenseData.monthlyRevenue === 0 && (
            <p className="text-xs text-orange-600 mt-2">
              <strong>Atenção:</strong> Nenhuma venda foi registrada no mês selecionado. 
              Usando estimativa baseada nas despesas para calcular porcentagens.
            </p>
          )}
        </div>
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Digite o nome do produto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            {/* Sistema de Ingredientes */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Ingredientes do Produto</h4>
                <button
                  type="button"
                  onClick={() => setIsIngredientsModalOpen(true)}
                  className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Insumo
                </button>
              </div>
              
              {/* Lista de ingredientes */}
              {formData.ingredients.length > 0 ? (
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => {
                    const material = rawMaterials.find(m => m.id === ingredient.rawMaterialId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {material?.name || 'Insumo não encontrado'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ingredient.quantity} {(ingredient as any).selectedUnit || material?.measurementUnit} × R$ {formatSimpleCurrency(ingredient.unitPrice)} = R$ {formatSimpleCurrency(ingredient.totalCost)}
                            {(ingredient as any).selectedUnit && (ingredient as any).selectedUnit !== material?.measurementUnit && (
                              <span className="text-blue-600 ml-2">
                                (convertido de {(ingredient as any).selectedUnit} para {material?.measurementUnit})
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">
                      Custo Total dos Insumos: R$ {formatSimpleCurrency(calculateRecipeCost())}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum insumo adicionado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar Insumo" para começar.</p>
                </div>
              )}
            </div>

            {/* Preços e despesas */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Preços e Despesas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor de Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice === 0 ? '' : formData.sellingPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, sellingPrice: value === '' ? 0 : parseFloat(value) || 0})
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Sugerido (R$) <span className="text-orange-600">*Calculado Automaticamente</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={suggestedPrice}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                      readOnly
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-400 text-sm">🔒</span>
                    </div>
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>Custo dos Insumos: R$ {formatSimpleCurrency(recipeCost)}</div>
                      <div>% Despesas: {formatPercentage(expenseData.totalExpensesPercentage)}</div>
                      <div>Margem de Lucro: {formData.marginPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentagem de Margem de Lucro (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.marginPercentage}
                  onChange={(e) => setFormData({...formData, marginPercentage: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Resumo do produto */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Resumo do Produto</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Custo dos Insumos:</span>
                    <div className="font-medium">R$ {formatSimpleCurrency(recipeCost)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Preço Sugerido:</span>
                    <div className="font-medium text-green-600">R$ {formatSimpleCurrency(suggestedPrice)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Lucro Estimado:</span>
                    <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {formatSimpleCurrency(profit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para adicionar ingredientes */}
      {isIngredientsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Insumo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insumo
                </label>
                <select
                  value={newIngredient.rawMaterialId}
                  onChange={(e) => {
                    const material = rawMaterials.find(m => m.id === e.target.value);
                    setNewIngredient({
                      ...newIngredient,
                      rawMaterialId: e.target.value,
                      measurementUnit: material?.measurementUnit || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecione um insumo</option>
                  {getPurchasedMaterials().map(material => {
                    const realPrice = getLatestPurchasePrice(material.id);
                    return (
                      <option key={material.id} value={material.id}>
                        {material.name} - R$ {formatSimpleCurrency(realPrice)}/{material.measurementUnit}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newIngredient.quantity === 0 ? '' : newIngredient.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewIngredient({
                        ...newIngredient,
                        quantity: value === '' ? 0 : parseFloat(value) || 0
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <select
                    value={newIngredient.selectedUnit || newIngredient.measurementUnit}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      selectedUnit: e.target.value
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {(() => {
                      const material = rawMaterials.find(m => m.id === newIngredient.rawMaterialId);
                      if (!material) return [];
                      return getAvailableUnits(material.measurementUnit).map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ));
                    })()}
                  </select>
                </div>
                {newIngredient.selectedUnit && newIngredient.selectedUnit !== newIngredient.measurementUnit && (
                  <p className="text-xs text-blue-600 mt-1">
                    Convertendo de {newIngredient.selectedUnit} para {newIngredient.measurementUnit}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsIngredientsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Produtos Cadastrados</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo Insumos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço de Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Sugerido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lucro/Prejuízo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const productRecipeCost = (product.ingredients || []).reduce((total, ingredient) => {
                  return total + ingredient.totalCost;
                }, 0);
                
                const productExpensesCost = (product.sellingPrice || 0) * (expenseData.totalExpensesPercentage / 100);
                const productProfit = (product.sellingPrice || 0) - productRecipeCost - productExpensesCost;
                
                let productSuggestedPrice = 0;
                if (productRecipeCost > 0 && expenseData.totalExpensesPercentage < 100) {
                  const basePrice = productRecipeCost / (1 - (expenseData.totalExpensesPercentage / 100));
                  productSuggestedPrice = basePrice * (1 + ((product.marginPercentage || 30) / 100));
                } else if (product.sellingPrice > 0) {
                  productSuggestedPrice = (product.sellingPrice || 0) * (1 + ((product.marginPercentage || 30) / 100));
                }

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id.slice(0, 8)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.portionYield} {product.portionUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {formatSimpleCurrency(productRecipeCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {formatSimpleCurrency(product.sellingPrice || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      R$ {formatSimpleCurrency(productSuggestedPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${productProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {formatSimpleCurrency(productProfit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto cadastrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece cadastrando seus produtos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}