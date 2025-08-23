import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChefHat } from 'lucide-react';
import { Product, RawMaterial, FixedExpense, VariableExpense, Sale } from '../types';

interface ProductFormProps {
  products: Product[];
  rawMaterials: RawMaterial[];
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  sales: Sale[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, product: Omit<Product, 'id' | 'createdAt'>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductForm({
  products,
  rawMaterials,
  fixedExpenses,
  variableExpenses,
  sales,
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
    measurementUnit: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    portionYield: 1,
    portionUnit: 'porções',
    sellingPrice: 0,
    marginPercentage: 30, // Porcentagem padrão de margem
    ingredients: [] as Array<{
      rawMaterialId: string;
      quantity: number;
      unitPrice: number;
      totalCost: number;
    }>
  });

  // Removido: newIngredient não é mais necessário



  // Estado para seleção de mês (igual ao da página de vendas)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Se há vendas, usar a data da venda mais recente
    if (sales.length > 0) {
      const mostRecentSale = sales[0]; // sales já vem ordenado por data desc
      const saleDate = new Date(mostRecentSale.saleDate);
      return `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
    }
    
    // Senão, usar mês atual
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Atualizar o mês selecionado quando as vendas carregarem
  useEffect(() => {
    if (sales.length > 0) {
      const mostRecentSale = sales[0]; // sales já vem ordenado por data desc
      const saleDate = new Date(mostRecentSale.saleDate);
      const recentMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Só atualizar se o mês atual não tem vendas
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

  // Cálculo automático das despesas baseado no faturamento mensal
  const calculateExpensePercentages = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const targetMonth = month - 1; // getMonth() retorna 0-11
    
    // Faturamento do mês selecionado baseado nas vendas registradas
    const monthlyRevenue = sales.filter(sale => {
      if (!sale.saleDate) return false;
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === targetMonth && 
             saleDate.getFullYear() === year;
    }).reduce((sum, sale) => sum + (sale.totalSales || 0), 0);
    
    // Despesas fixas mensais (convertendo para mensal se necessário)
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
    
    // Despesas variáveis do mês selecionado
    const monthlyVariableExpenses = variableExpenses.filter(expense => {
      if (!expense.expenseDate) return false;
      const expenseDate = new Date(expense.expenseDate);
      return expenseDate.getMonth() === targetMonth && 
             expenseDate.getFullYear() === year;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    // Total de despesas mensais
    const totalMonthlyExpenses = monthlyFixedExpenses + monthlyVariableExpenses;
    
    // Cálculo das porcentagens baseado no faturamento mensal
    let fixedExpensesPercentage = 0;
    let variableExpensesPercentage = 0;
    let totalExpensesPercentage = 0;
    
    if (monthlyRevenue > 0) {
      fixedExpensesPercentage = (monthlyFixedExpenses / monthlyRevenue) * 100;
      variableExpensesPercentage = (monthlyVariableExpenses / monthlyRevenue) * 100;
      totalExpensesPercentage = fixedExpensesPercentage + variableExpensesPercentage;
    } else {
      // Se não há faturamento, usar despesas totais como base de cálculo
      const totalExpenses = totalMonthlyExpenses;
      if (totalExpenses > 0) {
        // Calcular baseado em um faturamento estimado mínimo
        const estimatedRevenue = totalExpenses * 2; // Estimativa de faturamento 2x as despesas
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
      // Aqui você pode adicionar uma notificação de erro para o usuário
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
        // Aqui você pode adicionar uma notificação de erro para o usuário
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
      ingredients: []
    });
    setEditingProduct(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    resetForm();
    setIsFormOpen(false);
  };

  // Removido: funções de ingredientes não são mais necessárias

  const handleProductNameSelect = (productName: string) => {
    if (productName === 'create-new') {
      setFormData({...formData, name: 'create-new'});
    } else {
      setFormData({...formData, name: productName});
    }
  };



  const handleAddIngredient = () => {
    if (newIngredient.rawMaterialId && newIngredient.quantity > 0) {
      const selectedMaterial = rawMaterials.find(m => m.id === newIngredient.rawMaterialId);
      if (selectedMaterial) {
        const totalCost = selectedMaterial.unitPrice * newIngredient.quantity;
        const ingredient = {
          rawMaterialId: newIngredient.rawMaterialId,
          quantity: newIngredient.quantity,
          unitPrice: selectedMaterial.unitPrice,
          totalCost: totalCost
        };
        
        setFormData({
          ...formData,
          ingredients: [...formData.ingredients, ingredient]
        });
        
        setNewIngredient({
          rawMaterialId: '',
          quantity: 0,
          measurementUnit: ''
        });
        setIsIngredientsModalOpen(false);
      }
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: updatedIngredients
    });
  };

  // Cálculo do custo dos ingredientes do produto
  const calculateRecipeCost = () => {
    if (!formData.ingredients || formData.ingredients.length === 0) {
      return 0;
    }
    
    return formData.ingredients.reduce((total, ingredient) => {
      return total + ingredient.totalCost;
    }, 0);
  };

  const calculateSuggestedPrice = () => {
    const recipeCost = calculateRecipeCost();
    const totalExpensePercentage = expenseData.totalExpensesPercentage / 100;
    
    // Se não há custo de insumos, usar o preço de venda como base
    if (recipeCost <= 0) {
      if (formData.sellingPrice > 0) {
        // Calcular baseado no preço de venda + margem
        return formData.sellingPrice * (1 + (formData.marginPercentage / 100));
      }
      return 0;
    }
    
    // Se as despesas são 100% ou mais, não é possível calcular
    if (totalExpensePercentage >= 1) {
      // Calcular baseado apenas no custo + margem
      return recipeCost * (1 + (formData.marginPercentage / 100));
    }
    
    // NOVA FÓRMULA: Preço Sugerido = (Custo dos Insumos + %Despesas) + Margem de Lucro
    // 1. Calcular custo total (insumos + despesas)
    const basePrice = recipeCost / (1 - totalExpensePercentage);
    
    // 2. Adicionar margem de lucro sobre o custo total
    const priceWithMargin = basePrice * (1 + (formData.marginPercentage / 100));
    
    return Math.round(priceWithMargin * 100) / 100;
  };

  const calculateProfit = () => {
    const recipeCost = calculateRecipeCost();
    
    // Calcular custo das despesas baseado no preço de venda
    let expensesCost = 0;
    if (expenseData.totalExpensesPercentage > 0) {
      expensesCost = (formData.sellingPrice * expenseData.totalExpensesPercentage) / 100;
    }
    
    // Lucro = Preço de Venda - Custo dos Insumos - Custo das Despesas
    const profit = formData.sellingPrice - recipeCost - expensesCost;
    
    return Math.round(profit * 100) / 100;
  };

  const recipeCost = calculateRecipeCost();
  const suggestedPrice = calculateSuggestedPrice();
  const profit = calculateProfit();

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
                  {rawMaterials.map(material => (
                    <option key={material.id} value={material.id}>
                      {material.name} - R$ {material.unitPrice.toFixed(2)}/{material.measurementUnit}
                    </option>
                  ))}
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
                  <span className="px-3 py-2 text-gray-500 bg-gray-100 rounded-md">
                    {newIngredient.measurementUnit || 'unidade'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsIngredientsModalOpen(false);
                    setNewIngredient({
                      rawMaterialId: '',
                      quantity: 0,
                      measurementUnit: ''
                    });
                  }}
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

      {/* Resumo das despesas mensais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-900">
            Resumo Financeiro do Mês ({new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-xs text-blue-700 font-medium">Selecionar mês:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">Faturamento Mensal:</span>
            <div className="text-lg font-bold text-green-600">
              R$ {expenseData.monthlyRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Da página Vendas
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">Despesas Fixas:</span>
            <div className="text-lg font-bold text-red-600">
              R$ {expenseData.monthlyFixedExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Mensalizado
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">Despesas Variáveis:</span>
            <div className="text-lg font-bold text-red-600">
              R$ {expenseData.monthlyVariableExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Do mês atual
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">% Total Despesas:</span>
            <div className="text-lg font-bold text-orange-600">
              {expenseData.totalExpensesPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {expenseData.monthlyRevenue > 0 ? 'Baseado no faturamento' : 'Estimativa calculada'}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Como funciona:</strong> O faturamento é captado da página <strong>Vendas</strong> 
            (campo "Total de Vendas" de cada dia do mês selecionado). As despesas são calculadas automaticamente 
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
            </label>
            <input
              type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
            </label>
            <input
              type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

                        <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <select
                  value={formData.name}
                  onChange={(e) => handleProductNameSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecione um produto existente ou digite um novo</option>
                  <option value="create-new" className="font-semibold text-orange-600 border-t border-gray-200">
                    Criar novo produto
                  </option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>{product.name}</option>
                  ))}
                </select>
                {formData.name === 'create-new' && (
                  <input
                    type="text"
                    placeholder="Digite o nome do novo produto"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
              Rendimento
            </label>
                <div className="flex space-x-2">
            <input
              type="number"
              step="0.1"
                    min="0"
                    value={formData.portionYield === 0 ? '' : formData.portionYield}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, portionYield: value === '' ? 0 : parseFloat(value) || 0})
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
            <select
                    value={formData.portionUnit}
                    onChange={(e) => setFormData({...formData, portionUnit: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="porções">porções</option>
                    <option value="kg">kg</option>
                    <option value="unidades">unidades</option>
                    <option value="litros">litros</option>
            </select>
          </div>
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
                            {ingredient.quantity} {material?.measurementUnit} × R$ {ingredient.unitPrice.toFixed(2)} = R$ {ingredient.totalCost.toFixed(2)}
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
                      Custo Total dos Insumos: R$ {calculateRecipeCost().toFixed(2)}
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
                <p className="text-xs text-blue-800 font-medium mb-1">📊 Como é calculado:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• <strong>Custo dos Insumos:</strong> R$ {recipeCost.toFixed(2)}</div>
                  <div>• <strong>% Despesas:</strong> {expenseData.totalExpensesPercentage.toFixed(1)}%</div>
                  <div>• <strong>Margem de Lucro:</strong> {formData.marginPercentage}%</div>
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <strong>Fórmula:</strong> (Custos + Despesas) × (1 + {formData.marginPercentage}%)
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div>
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
                  placeholder="30"
                />
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800 font-medium mb-1">💡 Margem de Lucro:</p>
                  <p className="text-xs text-green-700">
                    Esta porcentagem será <strong>adicionada</strong> ao custo total (insumos + despesas) 
                    para calcular o preço sugerido. Exemplo: se custos + despesas = R$ 10,00 e margem = 30%, 
                    o preço sugerido será R$ 13,00.
                  </p>
                </div>
            </div>

              {/* Resumo financeiro do produto */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-sm font-medium text-blue-900">Análise Financeira do Produto</h5>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Mês: {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Custo dos Insumos:</span>
                    <span className="ml-2 font-medium">R$ {recipeCost.toFixed(2)}</span>
                  </div>
            <div>
                    <span className="text-gray-600">% Despesas Fixas:</span>
                    <span className="ml-2 font-medium text-blue-600">{expenseData.fixedExpensesPercentage.toFixed(1)}%</span>
            </div>
            <div>
                    <span className="text-gray-600">% Despesas Variáveis:</span>
                    <span className="ml-2 font-medium text-blue-600">{expenseData.variableExpensesPercentage.toFixed(1)}%</span>
            </div>
                  <div>
                    <span className="text-gray-600">Lucro/Prejuízo:</span>
                    <span className={`ml-2 font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {profit.toFixed(2)}
                    </span>
          </div>
        </div>
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Margem de Lucro:</span>
                    <span className={`text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.sellingPrice > 0 ? ((profit / formData.sellingPrice) * 100).toFixed(1) : '0'}%
                    </span>
            </div>
                                    <div className="mt-2 text-xs text-gray-500">
                    Baseado no faturamento de {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}: R$ {expenseData.monthlyRevenue.toFixed(2)} (da página Vendas) e despesas totais de {expenseData.totalExpensesPercentage.toFixed(1)}%
                  </div>
        </div>
        <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
          <strong>ℹ️ Nota:</strong> Esta análise é baseada nos dados de vendas e despesas de {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}. 
          Use o seletor de mês no resumo financeiro acima para analisar diferentes períodos.
        </div>
      </div>

              {/* Recomendação de Margem */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="text-sm font-medium text-yellow-800 mb-2">💡 Recomendação de Margem de Lucro</h5>
                <p className="text-sm text-yellow-700">
                  Para produtos de alimentação, a <strong>margem de lucro recomendada é entre 25% a 35%</strong> sobre o custo total. 
                  Esta margem garante uma rentabilidade saudável considerando:
                </p>
                <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                  <li>• <strong>25%:</strong> Margem mínima para cobrir custos operacionais</li>
                  <li>• <strong>30%:</strong> Margem ideal para lucro sustentável</li>
                  <li>• <strong>35%:</strong> Margem alta para produtos premium</li>
                  <li>• <strong>40%+:</strong> Apenas para produtos exclusivos</li>
                </ul>
                <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
                  <strong>📊 Exemplo prático:</strong> Se custos + despesas = R$ 10,00 e margem = 30%, 
                  o preço sugerido será R$ 13,00 (R$ 10,00 + 30% = R$ 13,00).
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
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
                  {editingProduct ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Lista de produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Produtos Cadastrados</h3>
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
                
                // Calcular lucro do produto
                const productExpensesCost = (product.sellingPrice || 0) * (expenseData.totalExpensesPercentage / 100);
                const productProfit = (product.sellingPrice || 0) - productRecipeCost - productExpensesCost;
                
                // Calcular preço sugerido
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
                      R$ {productRecipeCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {(product.sellingPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      R$ {productSuggestedPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${productProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {productProfit.toFixed(2)}
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