import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { FixedExpense, VariableExpense } from '../types';

interface ExpensesFormProps {
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  onAddFixedExpense: (expense: Omit<FixedExpense, 'id' | 'createdAt'>) => void;
  onUpdateFixedExpense: (id: string, expense: Omit<FixedExpense, 'id' | 'createdAt'>) => void;
  onDeleteFixedExpense: (id: string) => void;
  onAddVariableExpense: (expense: Omit<VariableExpense, 'id' | 'createdAt'>) => void;
  onUpdateVariableExpense: (id: string, expense: Omit<VariableExpense, 'id' | 'createdAt'>) => void;
  onDeleteVariableExpense: (id: string) => void;
}

export default function ExpensesForm({
  fixedExpenses,
  variableExpenses,
  onAddFixedExpense,
  onUpdateFixedExpense,
  onDeleteFixedExpense,
  onAddVariableExpense,
  onUpdateVariableExpense,
  onDeleteVariableExpense
}: ExpensesFormProps) {
  const [activeTab, setActiveTab] = useState<'fixed' | 'variable'>('fixed');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | VariableExpense | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: 0,
    category: '',
    // Campos específicos para despesas fixas
    frequency: 'mensal' as 'mensal' | 'trimestral' | 'semestral' | 'anual',
    dueDate: 1,
    isActive: true,
    // Campos específicos para despesas variáveis
    date: new Date(),
    paymentMethod: '',
    receipt: ''
  });

  const [categories, setCategories] = useState([
    'Aluguel', 'Funcionários', 'Energia', 'Água', 'Internet', 'Telefone',
    'Seguros', 'Impostos', 'Manutenção', 'Limpeza', 'Marketing', 'Transporte',
    'Insumos', 'Equipamentos', 'Multas', 'Emergências', 'Outros'
  ]);

  const frequencies = [
    { value: 'mensal', label: 'Mensal' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' }
  ];

  const paymentMethods = [
    'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 
    'Transferência', 'Boleto', 'Cheque', 'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'fixed') {
      if (editingExpense && 'frequency' in editingExpense) {
        onUpdateFixedExpense(editingExpense.id, {
          name: formData.name,
          description: formData.description,
          amount: formData.amount,
          category: formData.category,
          frequency: formData.frequency,
          dueDate: formData.dueDate,
          isActive: formData.isActive
        });
      } else {
        onAddFixedExpense({
          name: formData.name,
          description: formData.description,
          amount: formData.amount,
          category: formData.category,
          frequency: formData.frequency,
          dueDate: formData.dueDate,
          isActive: formData.isActive
        });
      }
    } else {
      if (editingExpense && 'date' in editingExpense) {
        onUpdateVariableExpense(editingExpense.id, {
          name: formData.name,
          description: formData.description,
          amount: formData.amount,
          category: formData.category,
          date: formData.date,
          paymentMethod: formData.paymentMethod,
          receipt: formData.receipt
        });
      } else {
        onAddVariableExpense({
          name: formData.name,
          description: formData.description,
          amount: formData.amount,
          category: formData.category,
          date: formData.date,
          paymentMethod: formData.paymentMethod,
          receipt: formData.receipt
        });
      }
    }
    
    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (expense: FixedExpense | VariableExpense) => {
    setEditingExpense(expense);
    
    if ('frequency' in expense) {
      // É uma despesa fixa
      setActiveTab('fixed');
      setFormData({
        name: expense.name,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        frequency: expense.frequency,
        dueDate: expense.dueDate,
        isActive: expense.isActive,
        date: new Date(),
        paymentMethod: '',
        receipt: ''
      });
    } else {
      // É uma despesa variável
      setActiveTab('variable');
      setFormData({
        name: expense.name,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        frequency: 'mensal',
        dueDate: 1,
        isActive: true,
        expenseDate: expense.expenseDate,
        paymentMethod: expense.paymentMethod,
        receipt: expense.receipt || ''
      });
    }
    
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const expense = [...fixedExpenses, ...variableExpenses].find(e => e.id === id);
    if (!expense) return;

    const isFixed = 'frequency' in expense;
    const message = isFixed ? 'esta despesa fixa' : 'esta despesa variável';
    
    if (window.confirm(`Tem certeza que deseja excluir ${message}?`)) {
      if (isFixed) {
        onDeleteFixedExpense(id);
      } else {
        onDeleteVariableExpense(id);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      amount: 0,
      category: '',
      frequency: 'mensal',
      dueDate: 1,
      isActive: true,
      date: new Date(),
      paymentMethod: '',
      receipt: ''
    });
    setEditingExpense(null);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    resetForm();
    setIsFormOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({...formData, category: newCategory.trim()});
      setNewCategory('');
      setIsCategoryModalOpen(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'create-new') {
      setIsCategoryModalOpen(true);
    } else {
      setFormData({...formData, category});
    }
  };

  const calculateAnnualCost = (expense: FixedExpense) => {
    switch (expense.frequency) {
      case 'mensal': return expense.amount * 12;
      case 'trimestral': return expense.amount * 4;
      case 'semestral': return expense.amount * 2;
      case 'anual': return expense.amount;
      default: return expense.amount;
    }
  };

  const totalAnnualFixedExpenses = fixedExpenses
    .filter(expense => expense.isActive)
    .reduce((sum, expense) => sum + calculateAnnualCost(expense), 0);

  const totalMonthlyFixedExpenses = totalAnnualFixedExpenses / 12;

  const getCurrentMonthVariableExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return variableExpenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  };

  const getCurrentYearVariableExpenses = () => {
    const currentYear = new Date().getFullYear();
    
    return variableExpenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate);
      return expenseDate.getFullYear() === currentYear;
    });
  };

  const currentMonthVariableExpenses = getCurrentMonthVariableExpenses();
  const currentYearVariableExpenses = getCurrentYearVariableExpenses();
  
  const totalMonthVariableExpenses = currentMonthVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalYearVariableExpenses = currentYearVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Despesas</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
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

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Despesas Fixas Mensais</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalMonthlyFixedExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Despesas Fixas Anuais</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalAnnualFixedExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Despesas Variáveis Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalMonthVariableExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">
                {fixedExpenses.filter(e => e.isActive).length + variableExpenses.length}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
              <p className="text-2xl font-bold text-gray-900">
                {fixedExpenses.filter(e => e.isActive).length + variableExpenses.length}
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
              onClick={() => setActiveTab('fixed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fixed'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Despesas Fixas ({fixedExpenses.filter(e => e.isActive).length})
            </button>
            <button
              onClick={() => setActiveTab('variable')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'variable'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Despesas Variáveis ({variableExpenses.length})
            </button>
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="p-6">
          {activeTab === 'fixed' ? (
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
                            {expense.description && (
                              <div className="text-sm text-gray-500">{expense.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {frequencies.find(f => f.value === expense.frequency)?.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.dueDate}º do mês
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {calculateAnnualCost(expense).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expense.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {expense.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
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
                    <p className="mt-1 text-sm text-gray-500">
                      Comece cadastrando suas despesas fixas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
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
                            {expense.description && (
                              <div className="text-sm text-gray-500">{expense.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(expense.expenseDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.paymentMethod}
                        </td>
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
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
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
                    <p className="mt-1 text-sm text-gray-500">
                      Comece cadastrando suas despesas variáveis.
                    </p>
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
            {editingExpense ? 'Editar Despesa' : 'Nova Despesa'} - {activeTab === 'fixed' ? 'Fixa' : 'Variável'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Despesa
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
                    Criar nova categoria
                  </option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount === 0 ? '' : formData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({...formData, amount: value === '' ? 0 : parseFloat(value) || 0})
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {activeTab === 'fixed' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequência
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      {frequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dia do Vencimento
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.dueDate === 1 ? '' : formData.dueDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, dueDate: value === '' ? 1 : parseInt(value) || 1})
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Despesa Ativa
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      value={formData.date.toISOString().split('T')[0]}
                      onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forma de Pagamento
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Selecione uma forma</option>
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
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
                      onChange={(e) => setFormData({...formData, receipt: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Número do recibo ou comprovante"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Descrição detalhada da despesa..."
              />
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
                {editingExpense ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

