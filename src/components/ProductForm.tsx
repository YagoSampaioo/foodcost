import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChefHat, X } from 'lucide-react';
import { Product, Ingredient, RawMaterial, FixedExpense, VariableExpense, Sale } from '../types';

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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>({
    code: '',
    name: '',
    category: '',
    portionYield: 1,
    portionUnit: 'porções' as 'porções' | 'kg',
    ingredients: [] as Ingredient[],
    sellingPrice: 0
  });

  const [newIngredient, setNewIngredient] = useState({
    materialId: '',
    quantity: 0
  });

  const [categories, setCategories] = useState([
    'Pratos Principais', 'Acompanhamentos', 'Sobremesas', 'Bebidas', 'Entradas', 'Saladas', 'Sopas', 'Outros'
  ]);

  // Cálculo automático das despesas baseado no faturamento mensal
  const calculateExpensePercentages = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Faturamento do mês atual
    const monthlyRevenue = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && 
             saleDate.getFullYear() === currentYear;
    }).reduce((sum, sale) => sum + sale.totalSales, 0);
    
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
    
    // Despesas variáveis do mês atual
    const monthlyVariableExpenses = variableExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    // Total de despesas mensais
    const totalMonthlyExpenses = monthlyFixedExpenses + monthlyVariableExpenses;
    
    // Cálculo das porcentagens
    const fixedExpensesPercentage = monthlyRevenue > 0 ? (monthlyFixedExpenses / monthlyRevenue) * 100 : 0;
    const variableExpensesPercentage = monthlyRevenue > 0 ? (monthlyVariableExpenses / monthlyRevenue) * 100 : 0;
    const totalExpensesPercentage = fixedExpensesPercentage + variableExpensesPercentage;
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
      setEditingProduct(null);
    } else {
      onAddProduct(formData);
    }
    
    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      portionYield: product.portionYield,
      portionUnit: product.portionUnit,
      ingredients: product.ingredients,
      sellingPrice: product.sellingPrice
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      onDeleteProduct(id);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      category: '',
      portionYield: 1,
      portionUnit: 'porções' as 'porções' | 'kg',
      ingredients: [] as Ingredient[],
      sellingPrice: 0
    });
    setEditingProduct(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    resetForm();
    setIsFormOpen(false);
  };

  const addIngredient = () => {
    if (!newIngredient.materialId || newIngredient.quantity <= 0) return;

    const material = rawMaterials.find(m => m.id === newIngredient.materialId);
    if (!material) return;

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      code: material.code,
      name: material.name,
      householdMeasure: `${newIngredient.quantity} ${material.measurementUnit}`,
      measurementUnit: material.measurementUnit,
      grossQuantity: newIngredient.quantity,
      netQuantity: newIngredient.quantity,
      correctionFactor: 1,
      unitPrice: material.unitPrice,
      totalCost: material.unitPrice * newIngredient.quantity
    };

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ingredient]
    });
    setNewIngredient({
      materialId: '',
      quantity: 0
    });
  };

  const removeIngredient = (ingredientId: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.id !== ingredientId)
    });
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'create-new') {
      setIsCategoryModalOpen(true);
    } else {
      setFormData({...formData, category});
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({...formData, category: newCategory.trim()});
      setNewCategory('');
      setIsCategoryModalOpen(false);
    }
  };

  // Cálculos para o produto
  const calculateRecipeCost = () => {
    return formData.ingredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
  };

  const calculateSuggestedPrice = () => {
    const recipeCost = calculateRecipeCost();
    const totalExpensePercentage = expenseData.totalExpensesPercentage / 100;
    
    if (totalExpensePercentage >= 1) return 0; // Evita divisão por zero ou valores negativos
    
    // Fórmula: Preço Sugerido = Custo dos Insumos / (1 - %Total de Despesas)
    const suggestedPrice = recipeCost / (1 - totalExpensePercentage);
    return Math.round(suggestedPrice * 100) / 100;
  };

  const calculateProfit = () => {
    const recipeCost = calculateRecipeCost();
    const fixedExpensesCost = (formData.sellingPrice * expenseData.fixedExpensesPercentage) / 100;
    const variableExpensesCost = (formData.sellingPrice * expenseData.variableExpensesPercentage) / 100;
    return formData.sellingPrice - recipeCost - fixedExpensesCost - variableExpensesCost;
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

      {/* Modal para criar categoria */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Nova Categoria</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Digite o nome da categoria"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setNewCategory('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo das despesas mensais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Resumo Financeiro do Mês</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">Faturamento Mensal:</span>
            <div className="text-lg font-bold text-green-600">
              R$ {expenseData.monthlyRevenue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">Despesas Fixas:</span>
            <div className="text-lg font-bold text-red-600">
              R$ {expenseData.monthlyFixedExpenses.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">Despesas Variáveis:</span>
            <div className="text-lg font-bold text-red-600">
              R$ {expenseData.monthlyVariableExpenses.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-blue-600 font-medium">% Total Despesas:</span>
            <div className="text-lg font-bold text-orange-600">
              {expenseData.totalExpensesPercentage.toFixed(1)}%
            </div>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-3">
          💡 As porcentagens de despesas são calculadas automaticamente baseadas no faturamento real do mês
        </p>
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
                  Código
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
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
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="create-new" className="font-semibold text-orange-600 border-t border-gray-200">
                    ➕ Criar nova categoria
                  </option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                    value={formData.portionYield}
                    onChange={(e) => setFormData({...formData, portionYield: parseFloat(e.target.value) || 0})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <select
                    value={formData.portionUnit}
                    onChange={(e) => setFormData({...formData, portionUnit: e.target.value as 'porções' | 'kg'})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="porções">porções</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Adicionar ingrediente */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Adicionar Ingrediente</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insumo
                  </label>
                  <select
                    value={newIngredient.materialId}
                    onChange={(e) => setNewIngredient({...newIngredient, materialId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Adicionar Insumo
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de ingredientes */}
            {formData.ingredients.length > 0 && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Ingredientes do Produto</h4>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-gray-500 ml-2">
                          {ingredient.grossQuantity} {ingredient.measurementUnit} 
                          (R$ {ingredient.totalCost.toFixed(2)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Sugerido (R$)
                  </label>
                  <input
                    type="number"
                    value={suggestedPrice}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Para ficar no 0 a 0 com custos</p>
                </div>
              </div>

              {/* Resumo financeiro do produto */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-3">📊 Análise Financeira do Produto</h5>
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
                    💡 Baseado no faturamento mensal de R$ {expenseData.monthlyRevenue.toFixed(2)} e despesas totais de {expenseData.totalExpensesPercentage.toFixed(1)}%
                  </div>
                </div>
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
                const productRecipeCost = product.ingredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
                const productProfit = (product.sellingPrice || 0) - productRecipeCost -
                  ((product.sellingPrice || 0) * expenseData.fixedExpensesPercentage / 100) -
                  ((product.sellingPrice || 0) * expenseData.variableExpensesPercentage / 100);
                
                const productSuggestedPrice = productRecipeCost / (1 - (expenseData.totalExpensesPercentage / 100));

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.code}</div>
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