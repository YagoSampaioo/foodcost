import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChefHat } from "lucide-react";
import { Product, ProductIngredient } from "../types";
import { formatNumber, formatSimpleCurrency, formatPercentage } from "../utils/formatters";
import { useData } from "../hooks/useData";
import { useAuth } from "../hooks/useAuth";

export default function ProductForm() {
  const {
    products,
    rawMaterials,
    rawMaterialPurchases = [],
    fixedExpenses = [],
    variableExpenses = [],
    sales = [],
    addProduct,
    updateProduct,
    deleteProduct,
    addIngredient,
    deleteIngredient,
  } = useData();
  const { currentUser } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Novo: estado simples para inputs de ingrediente (insumo + quantidade)
  const [newIngredient, setNewIngredient] = useState({
    raw_material_id: "",
    quantity: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    portion_yield: 1,
    portion_unit: "porções",
    selling_price: 0,
    margin_percentage: 30,
    product_ingredients: [] as ProductIngredient[],
  });

  // ===== Utilidades =====
  // Preço unitário da compra mais recente de um insumo
  const getLatestPurchasePrice = (rawMaterialId: string): number => {
    if (!rawMaterialPurchases || rawMaterialPurchases.length === 0) return 0;

    const materialPurchases = rawMaterialPurchases
      .filter((purchase) => (purchase.raw_material_id || purchase.raw_material_id) === rawMaterialId)
      .sort(
        (a, b) =>
          new Date(b.purchase_date || b.purchase_date).getTime() -
          new Date(a.purchase_date || a.purchase_date).getTime()
      );

    return materialPurchases.length > 0 ? materialPurchases[0].unit_price || 0 : 0;
  };

  // ===== Seleção de mês e despesas =====
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (sales && sales.length > 0) {
      const mostRecentSale = sales[0];
      const saleDate = new Date(mostRecentSale.sale_date || mostRecentSale.sale_date);
      return `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, "0")}`;
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const calculateExpensePercentages = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const targetMonth = month - 1;

    const monthlyRevenue = sales
      ? sales
          .filter((sale) => {
            if (!sale.sale_date && !sale.sale_date) return false;
            const saleDate = new Date(sale.sale_date || sale.sale_date);
            return saleDate.getMonth() === targetMonth && saleDate.getFullYear() === year;
          })
          .reduce((sum, sale) => sum + (sale.total_sales || sale.total_sales || 0), 0)
      : 0;

    const monthlyFixedExpenses = fixedExpenses
      ? fixedExpenses
          .filter((expense) => expense.is_active || expense.is_active)
          .reduce((sum, expense) => {
            const amount = expense.amount;
            const frequency = expense.frequency;
            switch (frequency) {
              case "mensal":
                return sum + amount;
              case "trimestral":
                return sum + amount / 3;
              case "semestral":
                return sum + amount / 6;
              case "anual":
                return sum + amount / 12;
              default:
                return sum + amount;
            }
          }, 0)
      : 0;

    const monthlyVariableExpenses = variableExpenses
      ? variableExpenses
          .filter((expense) => {
            if (!expense.expense_date && !expense.expense_date) return false;
            const expenseDate = new Date(expense.expense_date || expense.expense_date);
            return expenseDate.getMonth() === targetMonth && expenseDate.getFullYear() === year;
          })
          .reduce((sum, expense) => sum + expense.amount, 0)
      : 0;

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
      totalExpensesPercentage,
    };
  };

  const expenseData = calculateExpensePercentages();

  const getProductRecipeCost = (product: Product): number => {
    if (!product.product_ingredients || product.product_ingredients.length === 0) return 0;
    return product.product_ingredients.reduce((sum, ing) => {
      const quantity = ing.quantity || 0;
      const unitPrice = ing.raw_materials?.unit_price || 0;
      return sum + quantity * unitPrice;
    }, 0);
  };

  // Custo da receita do formulário (usa o preço mais recente de compra)
  const calculateRecipeCost = () => {
    return formData.product_ingredients.reduce((total, ingredient) => {
      const unitPrice = getLatestPurchasePrice(ingredient.raw_material_id);
      return total + ingredient.quantity * unitPrice;
    }, 0);
  };

  // Preço sugerido
  const calculateSuggestedPrice = () => {
    const recipeCost = calculateRecipeCost();
    const totalExpensePercentage = expenseData.totalExpensesPercentage / 100;

    if (recipeCost === 0) return 0;

    const basePrice = recipeCost / (1 - totalExpensePercentage);
    const priceWithMargin = basePrice * (1 + formData.margin_percentage / 100);

    return Math.round(priceWithMargin * 100) / 100;
  };

  const calculateProfit = () => {
    const recipeCost = calculateRecipeCost();
    let expensesCost = 0;
    if (expenseData.totalExpensesPercentage > 0) {
      expensesCost = (formData.selling_price * expenseData.totalExpensesPercentage) / 100;
    }
    const profit = formData.selling_price - recipeCost - expensesCost;
    return Math.round(profit * 100) / 100;
  };

  const recipeCost = calculateRecipeCost();
  const suggestedPrice = calculateSuggestedPrice();
  const profit = calculateProfit();

  // ===== Handlers =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const dataToUpdate = { ...formData } as any;
      delete dataToUpdate.product_ingredients; // ingredientes tratados à parte
      await updateProduct(editingProduct.id, dataToUpdate);
    } else {
      // cria o produto primeiro (sem os ingredientes)
      const { product_ingredients, ...productData } = formData as any;
      const created = await addProduct(productData as any); // DataContext deve retornar o produto criado
      if (created && created.id && product_ingredients?.length) {
        for (const ing of product_ingredients) {
          await addIngredient(created.id, {
            raw_material_id: ing.raw_material_id,
            quantity: ing.quantity,
            unit: ing.unit,
            total_cost: ing.total_cost,
          });
        }
      }
    }
    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      portion_yield: product.portion_yield,
      portion_unit: product.portion_unit,
      selling_price: product.selling_price,
      margin_percentage: product.margin_percentage,
      product_ingredients: product.product_ingredients || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProduct(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      portion_yield: 1,
      portion_unit: "porções",
      selling_price: 0,
      margin_percentage: 30,
      product_ingredients: [],
    });
    setEditingProduct(null);
    setNewIngredient({ raw_material_id: "", quantity: 0 });
  };

  // Adicionar ingrediente: agora chamado pelo botão "Adicionar" (sem modal)
  const handleAddIngredient = async () => {
    if (!newIngredient.raw_material_id || newIngredient.quantity <= 0) return;
    const selectedMaterial = rawMaterials.find((m) => m.id === newIngredient.raw_material_id);
    if (!selectedMaterial) return;

    const realUnitPrice = getLatestPurchasePrice(newIngredient.raw_material_id);

    const ingredientData: ProductIngredient = {
      id: (globalThis.crypto?.randomUUID?.() || `temp-${Math.random().toString(36).slice(2)}`) as string,
      product_id: editingProduct ? editingProduct.id : "temp",
      raw_material_id: newIngredient.raw_material_id,
      quantity: newIngredient.quantity,
      unit: selectedMaterial.measurement_unit,
      total_cost: newIngredient.quantity * realUnitPrice,
      raw_materials: selectedMaterial,
    };

    if (editingProduct) {
      // Se já está editando um produto existente, persiste no backend
      await addIngredient(editingProduct.id, {
        raw_material_id: ingredientData.raw_material_id,
        quantity: ingredientData.quantity,
        unit: ingredientData.unit,
        total_cost: ingredientData.total_cost,
      });
    } else {
      // Produto novo: apenas acumula localmente até salvar o produto
      setFormData((prev) => ({
        ...prev,
        product_ingredients: [...prev.product_ingredients, ingredientData],
      }));
    }

    setNewIngredient({ raw_material_id: "", quantity: 0 });
  };

  // Remover ingrediente: se já existe no backend, chama deleteIngredient; se é temporário, remove do estado
  const handleRemoveIngredient = async (ingredient: ProductIngredient) => {
    const isTemp = ingredient.product_id === "temp" || ingredient.id.startsWith("temp-");
    if (isTemp || !editingProduct) {
      setFormData((prev) => ({
        ...prev,
        product_ingredients: prev.product_ingredients.filter((ing) => ing.id !== ingredient.id),
      }));
    } else {
      if (window.confirm("Remover este ingrediente?")) {
        await deleteIngredient(ingredient.id);
      }
    }
  };

  // Mantém lista de ingredientes sincronizada ao editar após add/remove no backend
  useEffect(() => {
    if (editingProduct) {
      const updated = products.find((p) => p.id === editingProduct.id);
      if (updated) {
        setFormData((prev) => ({ ...prev, product_ingredients: updated.product_ingredients || [] }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const selectedMaterial = rawMaterials.find((m) => m.id === newIngredient.raw_material_id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Produtos</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Financeiro do Mês (
          {new Date(selectedMonth + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" })})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">R$ {formatNumber(expenseData.monthlyRevenue)}</div>
            <div className="text-sm text-gray-600">Faturamento Mensal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">R$ {formatNumber(expenseData.monthlyFixedExpenses)}</div>
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
          <label className="text-sm font-medium text-gray-700">Selecionar mês:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Como funciona:</strong> As porcentagens de despesas são calculadas automaticamente baseadas neste
            faturamento real. Use o seletor acima para analisar diferentes meses.
          </p>
          {expenseData.monthlyRevenue === 0 && (
            <p className="text-xs text-orange-600 mt-2">
              <strong>Atenção:</strong> Nenhuma venda foi registrada no mês selecionado. Usando estimativa baseada nas
              despesas para calcular porcentagens.
            </p>
          )}
        </div>
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProduct ? `Editando: ${editingProduct.name}` : "Novo Produto"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome do produto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Bolos, Salgados, Bebidas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do produto"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rendimento</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.portion_yield}
                  onChange={(e) => setFormData({ ...formData, portion_yield: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Rendimento</label>
                <input
                  type="text"
                  value={formData.portion_unit}
                  onChange={(e) => setFormData({ ...formData, portion_unit: e.target.value })}
                  placeholder="Ex: porções, unidades, kg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Ingredientes: agora disponível tanto na criação quanto na edição */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Ingredientes do Produto</h4>
              </div>

              {/* Linha de inclusão rápida (insumo + quantidade) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mb-4">
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insumo</label>
                  <select
                    value={newIngredient.raw_material_id}
                    onChange={(e) => setNewIngredient({ ...newIngredient, raw_material_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione um insumo</option>
                    {rawMaterials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newIngredient.quantity === 0 ? "" : newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="w-full flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar
                  </button>
                </div>
                {selectedMaterial && (
                  <div className="md:col-span-12 text-xs text-gray-500">
                    Unidade base: <strong>{selectedMaterial.measurement_unit}</strong> • Preço unitário atual: R${" "}
                    {formatSimpleCurrency(getLatestPurchasePrice(selectedMaterial.id))}
                  </div>
                )}
              </div>

              {/* Lista de ingredientes */}
              {formData.product_ingredients && formData.product_ingredients.length > 0 ? (
                <div className="space-y-3">
                  {formData.product_ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{ingredient.raw_materials?.name || "Insumo"}</div>
                        <div className="text-sm text-gray-500">
                          {ingredient.quantity} {ingredient.unit} × R${" "}
                          {formatSimpleCurrency(getLatestPurchasePrice(ingredient.raw_material_id))} = R${" "}
                          {formatSimpleCurrency(
                            ingredient.quantity * getLatestPurchasePrice(ingredient.raw_material_id)
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="text-red-600 hover:text-red-800 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">
                      Custo Total dos Insumos: R$ {formatSimpleCurrency(calculateRecipeCost())}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum insumo adicionado ainda.</p>
                  <p className="text-sm">Use os campos acima para adicionar.</p>
                </div>
              )}
            </div>

            {/* Preços e despesas */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Preços e Despesas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.selling_price === 0 ? "" : formData.selling_price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, selling_price: value === "" ? 0 : parseFloat(value) || 0 });
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
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>Custo dos Insumos: R$ {formatSimpleCurrency(recipeCost)}</div>
                      <div>% Despesas: {formatPercentage(expenseData.totalExpensesPercentage)}</div>
                      <div>Margem de Lucro: {formData.margin_percentage}%</div>
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
                  value={formData.margin_percentage}
                  onChange={(e) => setFormData({ ...formData, margin_percentage: parseFloat(e.target.value) || 0 })}
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
                    <div className={`${profit >= 0 ? "text-green-600" : "text-red-600"} font-medium`}>
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
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                {editingProduct ? "Atualizar Produto" : "Criar Produto"}
              </button>
            </div>
          </form>
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
                const productRecipeCost = getProductRecipeCost(product);
                const productExpensesCost = (product.selling_price || 0) * (expenseData.totalExpensesPercentage / 100);
                const productProfit = (product.selling_price || 0) - productRecipeCost - productExpensesCost;

                let productSuggestedPrice = 0;
                if (productRecipeCost > 0 && expenseData.totalExpensesPercentage < 100) {
                  const basePrice = productRecipeCost / (1 - expenseData.totalExpensesPercentage / 100);
                  productSuggestedPrice = basePrice * (1 + (product.margin_percentage || 30) / 100);
                } else if (product.selling_price > 0) {
                  productSuggestedPrice = (product.selling_price || 0) * (1 + (product.margin_percentage || 30) / 100);
                }

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id.slice(0, 8)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.portion_yield} {product.portion_unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {formatSimpleCurrency(productRecipeCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {formatSimpleCurrency(product.selling_price || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      R$ {formatSimpleCurrency(productSuggestedPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${productProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        R$ {formatSimpleCurrency(productProfit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(product)} className="text-orange-600 hover:text-orange-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
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
              <p className="mt-1 text-sm text-gray-500">Comece cadastrando seus produtos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
