import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, DollarSign, TrendingUp, Package, Users } from "lucide-react";
import { FixedExpense, VariableExpense, RawMaterialPurchase, EmployeeCost } from "../types";
import { formatSimpleCurrency } from "../utils/formatters";
import { useData } from "../hooks/useData";

export default function ExpensesForm() {
  const {
    fixedExpenses,
    variableExpenses,
    rawMaterialPurchases,
    rawMaterials,
    employeeCosts,
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
    addVariableExpense,
    updateVariableExpense,
    deleteVariableExpense,
    addRawMaterialPurchase,
    updateRawMaterialPurchase,
    deleteRawMaterialPurchase,
    addRawMaterial,
    addEmployeeCost,
    updateEmployeeCost,
    deleteEmployeeCost,
  } = useData();

  const [activeTab, setActiveTab] = useState<"fixed" | "variable" | "purchases" | "employees">("fixed");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<
    FixedExpense | VariableExpense | RawMaterialPurchase | EmployeeCost | null
  >(null);
  const [isNewMaterialModalOpen, setIsNewMaterialModalOpen] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialDescription, setNewMaterialDescription] = useState("");
  const [newMaterialUnit, setNewMaterialUnit] = useState("un");

  // O estado do formulário interno continua camelCase por convenção do React
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: 0,
    category: "",
    frequency: "mensal" as "mensal" | "trimestral" | "semestral" | "anual",
    due_date: 1,
    is_active: true,
    expense_date: new Date(),
    payment_method: "",
    receipt: "",
    raw_material_id: "",
    quantity: 0,
    unit_price: 0,
    total_cost: 0,
    purchase_date: new Date(),
    supplier: "",
    notes: "",
    professional: "",
    hourly_cost: 0,
    average_salary: 0,
    benefits: 0,
    fgts: 0,
    vacation_allowance: 0,
    vacation_bonus: 0,
    fgts_vacation_bonus: 0,
    thirteenth_salary: 0,
    fgts_thirteenth: 0,
    notice_period: 0,
    fgts_notice_period: 0,
    fgts_penalty: 0,
  });

  const frequencies = [
    { value: "mensal", label: "Mensal" },
    { value: "trimestral", label: "Trimestral" },
    { value: "semestral", label: "Semestral" },
    { value: "anual", label: "Anual" },
  ];

  const payment_methods = [
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito",
    "PIX",
    "Transferência",
    "Boleto",
    "Cheque",
    "Outros",
  ];

  const measurement_units = [
    { value: "kg", label: "Quilograma (kg)" },
    { value: "g", label: "Grama (g)" },
    { value: "l", label: "Litro (l)" },
    { value: "ml", label: "Mililitro (ml)" },
    { value: "un", label: "Unidade (un)" },
    { value: "cx", label: "Caixa (cx)" },
    { value: "pct", label: "Pacote (pct)" },
    { value: "dz", label: "Dúzia (dz)" },
    { value: "m", label: "Metro (m)" },
    { value: "cm", label: "Centímetro (cm)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "fixed") {
      const data = {
        name: formData.name,
        category: formData.category,
        amount: formData.amount,
        frequency: formData.frequency,
        due_date: formData.due_date,
        description: formData.description,
        is_active: formData.is_active,
      };
      if (editingExpense) {
        updateFixedExpense(editingExpense.id, data);
      } else {
        addFixedExpense(data);
      }
    } else if (activeTab === "variable") {
      const data = {
        name: formData.name,
        category: formData.category,
        amount: formData.amount,
        expense_date: formData.expense_date,
        payment_method: formData.payment_method,
        receipt: formData.receipt,
        description: formData.description,
      };
      if (editingExpense) {
        updateVariableExpense(editingExpense.id, data);
      } else {
        addVariableExpense(data);
      }
    } else if (activeTab === "purchases") {
      const data = {
        raw_material_id: formData.raw_material_id,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
        total_cost: formData.total_cost,
        purchase_date: formData.purchase_date,
        supplier: formData.supplier,
        payment_method: formData.payment_method,
        receipt: formData.receipt,
        notes: formData.notes,
      };
      if (editingExpense) {
        updateRawMaterialPurchase(editingExpense.id, data);
      } else {
        addRawMaterialPurchase(data);
      }
    } else if (activeTab === "employees") {
      const data = {
        professional: formData.professional,
        hourly_cost: formData.hourly_cost,
        average_salary: formData.average_salary,
        benefits: formData.benefits,
        fgts: formData.fgts,
        vacation_allowance: formData.vacation_allowance,
        vacation_bonus: formData.vacation_bonus,
        fgts_vacation_bonus: formData.fgts_vacation_bonus,
        thirteenth_salary: formData.thirteenth_salary,
        fgts_thirteenth: formData.fgts_thirteenth,
        notice_period: formData.notice_period,
        fgts_notice_period: formData.fgts_notice_period,
        fgts_penalty: formData.fgts_penalty,
      };
      if (editingExpense) {
        updateEmployeeCost(editingExpense.id, data);
      } else {
        addEmployeeCost(data);
      }
    }

    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    // Popula o formulário com os dados do item a ser editado
    if ("frequency" in expense) {
      setActiveTab("fixed");
      setFormData((prev) => ({ ...prev, ...expense }));
    } else if ("raw_material_id" in expense) {
      setActiveTab("purchases");
      setFormData((prev) => ({ ...prev, ...expense, notes: expense.notes || "" }));
    } else if ("professional" in expense) {
      setActiveTab("employees");
      setFormData((prev) => ({ ...prev, ...expense }));
    } else {
      setActiveTab("variable");
      setFormData((prev) => ({ ...prev, ...expense, receipt: expense.receipt || "" }));
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const expense = [...fixedExpenses, ...variableExpenses, ...rawMaterialPurchases, ...employeeCosts].find(
      (e) => e.id === id
    );
    if (!expense) return;

    if ("frequency" in expense) {
      if (window.confirm("Tem certeza que deseja excluir esta despesa fixa?")) {
        deleteFixedExpense(id);
      }
    } else if ("raw_material_id" in expense) {
      if (window.confirm("Tem certeza que deseja excluir esta compra de insumo?")) {
        deleteRawMaterialPurchase(id);
      }
    } else if ("professional" in expense) {
      if (window.confirm("Tem certeza que deseja excluir este custo de funcionário?")) {
        deleteEmployeeCost(id);
      }
    } else {
      if (window.confirm("Tem certeza que deseja excluir esta despesa variável?")) {
        deleteVariableExpense(id);
      }
    }
  };

  const handleAddNewMaterial = () => {
    if (newMaterialName.trim()) {
      const timestamp = Date.now();
      const code = `INS${timestamp}`;
      const materialData = {
        code: code,
        name: newMaterialName.trim(),
        category: "Geral",
        measurement_unit: newMaterialUnit,
        unit_price: 0,
        supplier: "A definir",
        minimum_stock: 0,
        current_stock: 0,
      };

      try {
        addRawMaterial(materialData);
        setNewMaterialName("");
        setNewMaterialDescription("");
        setNewMaterialUnit("un");
        setIsNewMaterialModalOpen(false);
      } catch (error) {
        console.error("Erro ao adicionar insumo:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      amount: 0,
      category: "",
      frequency: "mensal",
      due_date: 1,
      is_active: true,
      expense_date: new Date(),
      payment_method: "",
      receipt: "",
      raw_material_id: "",
      quantity: 0,
      unit_price: 0,
      total_cost: 0,
      purchase_date: new Date(),
      supplier: "",
      notes: "",
      professional: "",
      hourly_cost: 0,
      average_salary: 0,
      benefits: 0,
      fgts: 0,
      vacation_allowance: 0,
      vacation_bonus: 0,
      fgts_vacation_bonus: 0,
      thirteenth_salary: 0,
      fgts_thirteenth: 0,
      notice_period: 0,
      fgts_notice_period: 0,
      fgts_penalty: 0,
    });
    setEditingExpense(null);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    resetForm();
    setIsFormOpen(false);
  };

  const calculateAnnualCost = (expense: FixedExpense) => {
    switch (expense.frequency) {
      case "mensal":
        return expense.amount * 12;
      case "trimestral":
        return expense.amount * 4;
      case "semestral":
        return expense.amount * 2;
      case "anual":
        return expense.amount;
      default:
        return expense.amount;
    }
  };

  const totalAnnualFixedExpenses = fixedExpenses
    .filter((expense) => expense.is_active)
    .reduce((sum, expense) => sum + calculateAnnualCost(expense), 0);

  const totalMonthlyFixedExpenses = totalAnnualFixedExpenses / 12;

  const getCurrentMonthVariableExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return variableExpenses.filter((expense) => {
      const expense_date = new Date(expense.expense_date);
      return expense_date.getMonth() === currentMonth && expense_date.getFullYear() === currentYear;
    });
  };

  const currentMonthVariableExpenses = getCurrentMonthVariableExpenses();
  const totalMonthVariableExpenses = currentMonthVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Despesas</h2>
        {(activeTab === "fixed" || activeTab === "variable") && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "fixed" ? "Nova Despesa Fixa" : "Nova Despesa Variável"}
          </button>
        )}
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Despesas Fixas Mensais</p>
              <p className="text-2xl font-bold text-gray-900">R$ {formatSimpleCurrency(totalMonthlyFixedExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Despesas Fixas Anuais</p>
              <p className="text-2xl font-bold text-gray-900">R$ {formatSimpleCurrency(totalAnnualFixedExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Despesas Variáveis Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">R$ {formatSimpleCurrency(totalMonthVariableExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">
                {fixedExpenses.filter((e) => e.is_active).length +
                  variableExpenses.length +
                  rawMaterialPurchases.length +
                  employeeCosts.length}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold text-gray-900">
                {fixedExpenses.filter((e) => e.is_active).length +
                  variableExpenses.length +
                  rawMaterialPurchases.length +
                  employeeCosts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("fixed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "fixed"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Despesas Fixas ({fixedExpenses.filter((e) => e.is_active).length})
            </button>
            <button
              onClick={() => setActiveTab("variable")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "variable"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Despesas Variáveis ({variableExpenses.length})
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "purchases"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <Package className="h-4 w-4 inline mr-2" />
              Compras de Insumos ({rawMaterialPurchases.length})
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "employees"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <Users className="h-4 w-4 inline mr-2" />
              Custo de Funcionários ({employeeCosts.length})
            </button>
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="p-6">
          {activeTab === "fixed" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Despesas Fixas</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequência
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo Anual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fixedExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{expense.name}</div>
                            {expense.description && <div className="text-sm text-gray-500">{expense.description}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {formatSimpleCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {frequencies.find((f) => f.value === expense.frequency)?.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.due_date}º do mês
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {formatSimpleCurrency(calculateAnnualCost(expense))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              expense.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                            {expense.is_active ? "Ativa" : "Inativa"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-orange-600 hover:text-orange-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {fixedExpenses.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma despesa fixa cadastrada</h3>
                    <p className="mt-1 text-sm text-gray-500">Comece cadastrando suas despesas fixas.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "variable" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Despesas Variáveis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pagamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recibo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variableExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{expense.name}</div>
                            {expense.description && <div className="text-sm text-gray-500">{expense.description}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {formatSimpleCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(expense.expense_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.payment_method}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.receipt ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {expense.receipt}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-orange-600 hover:text-orange-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {variableExpenses.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma despesa variável cadastrada</h3>
                    <p className="mt-1 text-sm text-gray-500">Comece cadastrando suas despesas variáveis.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "purchases" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Compras de Insumos</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Plus className="h-4 w-4" />
                    Nova Compra de Insumo
                  </button>
                  <button
                    onClick={() => setIsNewMaterialModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                    <Plus className="h-4 w-4" />
                    Novo Insumo
                  </button>
                </div>
              </div>

              {/* Formulário de Nova Compra de Insumo - Aparece em cima */}
              {isFormOpen && activeTab === "purchases" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    {editingExpense ? "Editar Compra de Insumo" : "Nova Compra de Insumo"}
                  </h4>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insumo</label>
                        <select
                          value={formData.raw_material_id}
                          onChange={(e) => setFormData({ ...formData, raw_material_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required>
                          <option value="">Selecione um insumo</option>
                          {rawMaterials.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name} ({material.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.quantity === 0 ? "" : formData.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            const quantity = value === "" ? 0 : parseFloat(value) || 0;
                            const total_cost = quantity * formData.unit_price;
                            setFormData({ ...formData, quantity, total_cost });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.unit_price === 0 ? "" : formData.unit_price}
                          onChange={(e) => {
                            const value = e.target.value;
                            const unit_price = value === "" ? 0 : parseFloat(value) || 0;
                            const total_cost = formData.quantity * unit_price;
                            setFormData({ ...formData, unit_price, total_cost });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo Total (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.total_cost === 0 ? "" : formData.total_cost}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, total_cost: value === "" ? 0 : parseFloat(value) || 0 });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra</label>
                        <input
                          type="date"
                          value={formData.purchase_date.toISOString().split("T")[0]}
                          onChange={(e) => setFormData({ ...formData, purchase_date: new Date(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                        <input
                          type="text"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                        <select
                          value={formData.payment_method}
                          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required>
                          <option value="">Selecione uma forma</option>
                          {payment_methods.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número do Recibo (opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.receipt}
                          onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Número do recibo ou comprovante"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Observações sobre a compra..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Descrição detalhada da compra..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        {editingExpense ? "Atualizar" : "Cadastrar"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insumo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Compra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fornecedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pagamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rawMaterialPurchases.map((purchase) => {
                      const material = rawMaterials.find((m) => m.id === purchase.raw_material_id);
                      return (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {material?.name || "Insumo não encontrado"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {material?.category || "Categoria não definida"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.quantity} {material?.measurement_unit || "un"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(purchase.unit_price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            R$ {formatSimpleCurrency(purchase.total_cost)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(purchase.purchase_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.supplier}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.payment_method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(purchase)}
                                className="text-orange-600 hover:text-orange-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(purchase.id)}
                                className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {rawMaterialPurchases.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma compra de insumo registrada</h3>
                    <p className="mt-1 text-sm text-gray-500">Comece registrando suas compras de insumos.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba: Custo de Funcionários */}
          {activeTab === "employees" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Custo de Funcionários</h3>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                  <Plus className="h-4 w-4" />
                  Novo Custo de Funcionário
                </button>
              </div>

              {/* Formulário de Novo Custo de Funcionário - Aparece em cima */}
              {isFormOpen && activeTab === "employees" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    {editingExpense ? "Editar Custo de Funcionário" : "Novo Custo de Funcionário"}
                  </h4>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                        <input
                          type="text"
                          value={formData.professional}
                          onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo Hora (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.hourly_cost === 0 ? "" : formData.hourly_cost}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hourly_cost: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salário Médio (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.average_salary === 0 ? "" : formData.average_salary}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              average_salary: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Encargos (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.benefits === 0 ? "" : formData.benefits}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              benefits: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FGTS (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgts === 0 ? "" : formData.fgts}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fgts: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Férias 1/12 (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.vacation_allowance === 0 ? "" : formData.vacation_allowance}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vacation_allowance: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">1/3 Férias (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.vacation_bonus === 0 ? "" : formData.vacation_bonus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vacation_bonus: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FGTS Férias e 1/3 (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgts_vacation_bonus === 0 ? "" : formData.fgts_vacation_bonus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fgts_vacation_bonus: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">13º Salário (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.thirteenth_salary === 0 ? "" : formData.thirteenth_salary}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              thirteenth_salary: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FGTS 13º Salário (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgts_thirteenth === 0 ? "" : formData.fgts_thirteenth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fgts_thirteenth: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aviso Prévio (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.notice_period === 0 ? "" : formData.notice_period}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              notice_period: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FGTS Aviso Prévio (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgts_notice_period === 0 ? "" : formData.fgts_notice_period}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fgts_notice_period: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Multa FGTS (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgts_penalty === 0 ? "" : formData.fgts_penalty}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fgts_penalty: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        {editingExpense ? "Atualizar" : "Cadastrar"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tabela de Custos de Funcionários */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profissional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salário Médio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Encargos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FGTS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Férias 1/12
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        1/3 Férias
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FGTS Férias
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        13º Salário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FGTS 13º
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aviso Prévio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FGTS Aviso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Multa FGTS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeCosts.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="px-6 py-4 text-center text-gray-500">
                          Nenhum custo de funcionário registrado
                        </td>
                      </tr>
                    ) : (
                      employeeCosts.map((employeeCost) => (
                        <tr key={employeeCost.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {employeeCost.professional}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.hourly_cost)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.average_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.benefits)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.fgts)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.vacation_allowance)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.vacation_bonus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.fgts_vacation_bonus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.thirteenth_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.fgts_thirteenth)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.notice_period)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.fgts_notice_period)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {formatSimpleCurrency(employeeCost.fgts_penalty)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(employeeCost)}
                                className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(employeeCost.id)}
                                className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {employeeCosts.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum custo de funcionário registrado</h3>
                    <p className="mt-1 text-sm text-gray-500">Comece registrando os custos dos seus funcionários.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingExpense ? "Editar" : "Nova"} -{" "}
            {activeTab === "fixed"
              ? "Despesa Fixa"
              : activeTab === "variable"
              ? "Despesa Variável"
              : activeTab === "purchases"
              ? "Compra de Insumo"
              : "Custo de Funcionário"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Despesa</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount === 0 ? "" : formData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, amount: value === "" ? 0 : parseFloat(value) || 0 });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {activeTab === "fixed" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required>
                      {frequencies.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dia do Vencimento</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={formData.due_date === 1 ? "" : formData.due_date}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, due_date: value === "" ? 1 : parseInt(value) || 1 });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Despesa Ativa
                    </label>
                  </div>
                </>
              )}

              {activeTab === "variable" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={formData.expense_date.toISOString().split("T")[0]}
                      onChange={(e) => setFormData({ ...formData, expense_date: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required>
                      <option value="">Selecione uma forma</option>
                      {payment_methods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número do Recibo (opcional)</label>
                    <input
                      type="text"
                      value={formData.receipt}
                      onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Número do recibo ou comprovante"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Descrição detalhada da despesa..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                {editingExpense ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para Novo Insumo */}
      {isNewMaterialModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cadastrar Novo Insumo</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Insumo *</label>
                <input
                  type="text"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Farinha de Trigo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                <textarea
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição detalhada do insumo"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida *</label>
                <select
                  value={newMaterialUnit}
                  onChange={(e) => setNewMaterialUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required>
                  {measurement_units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsNewMaterialModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleAddNewMaterial}
                disabled={!newMaterialName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
