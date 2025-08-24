import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { FixedExpense, VariableExpense, RawMaterialPurchase, RawMaterial, EmployeeCost } from '../types';

interface ExpensesFormProps {
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  rawMaterialPurchases: RawMaterialPurchase[];
  rawMaterials: RawMaterial[];
  employeeCosts: EmployeeCost[];
  onAddFixedExpense: (expense: Omit<FixedExpense, 'id' | 'createdAt'>) => void;
  onUpdateFixedExpense: (id: string, expense: Omit<FixedExpense, 'id' | 'createdAt'>) => void;
  onDeleteFixedExpense: (id: string) => void;
  onAddVariableExpense: (expense: Omit<VariableExpense, 'id' | 'createdAt'>) => void;
  onUpdateVariableExpense: (id: string, expense: Omit<VariableExpense, 'id' | 'createdAt'>) => void;
  onDeleteVariableExpense: (id: string) => void;
  onAddRawMaterialPurchase: (purchase: Omit<RawMaterialPurchase, 'id' | 'createdAt'>) => void;
  onUpdateRawMaterialPurchase: (id: string, purchase: Omit<RawMaterialPurchase, 'id' | 'createdAt'>) => void;
  onDeleteRawMaterialPurchase: (id: string) => void;
  onAddRawMaterial: (rawMaterial: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddEmployeeCost: (employeeCost: Omit<EmployeeCost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateEmployeeCost: (id: string, employeeCost: Omit<EmployeeCost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteEmployeeCost: (id: string) => void;
}

export default function ExpensesForm({
  fixedExpenses,
  variableExpenses,
  rawMaterialPurchases,
  rawMaterials,
  employeeCosts,
  onAddFixedExpense,
  onUpdateFixedExpense,
  onDeleteFixedExpense,
  onAddVariableExpense,
  onUpdateVariableExpense,
  onDeleteVariableExpense,
  onAddRawMaterialPurchase,
  onUpdateRawMaterialPurchase,
  onDeleteRawMaterialPurchase,
  onAddRawMaterial,
  onAddEmployeeCost,
  onUpdateEmployeeCost,
  onDeleteEmployeeCost
}: ExpensesFormProps) {
  const [activeTab, setActiveTab] = useState<'fixed' | 'variable' | 'purchases' | 'employees'>('fixed');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FixedExpense | VariableExpense | RawMaterialPurchase | EmployeeCost | null>(null);
  const [isNewMaterialModalOpen, setIsNewMaterialModalOpen] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialDescription, setNewMaterialDescription] = useState('');
  const [newMaterialUnit, setNewMaterialUnit] = useState('un');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: 0,
    category: '',
    frequency: 'mensal' as 'mensal' | 'trimestral' | 'semestral' | 'anual',
    dueDate: 1,
    isActive: true,
    date: new Date(),
    paymentMethod: '',
    receipt: '',
    rawMaterialId: '',
    quantity: 0,
    unitPrice: 0,
    totalCost: 0,
    purchaseDate: new Date(),
    supplier: '',
    notes: '',
    // Campos para EmployeeCost
    professional: '',
    hourlyCost: 0,
    averageSalary: 0,
    benefits: 0,
    fgts: 0,
    vacationAllowance: 0,
    vacationBonus: 0,
    fgtsVacationBonus: 0,
    thirteenthSalary: 0,
    fgtsThirteenth: 0,
    noticePeriod: 0,
    fgtsNoticePeriod: 0,
    fgtsPenalty: 0
  });

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

  const measurementUnits = [
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'l', label: 'Litro (l)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'un', label: 'Unidade (un)' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'pct', label: 'Pacote (pct)' },
    { value: 'dz', label: 'Dúzia (dz)' },
    { value: 'm', label: 'Metro (m)' },
    { value: 'cm', label: 'Centímetro (cm)' }
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
    } else if (activeTab === 'variable') {
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
    } else if (activeTab === 'purchases') {
      if (editingExpense && 'rawMaterialId' in editingExpense) {
        onUpdateRawMaterialPurchase(editingExpense.id, {
          rawMaterialId: formData.rawMaterialId,
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          totalCost: formData.totalCost,
          purchaseDate: formData.purchaseDate,
          supplier: formData.supplier,
          paymentMethod: formData.paymentMethod,
          receipt: formData.receipt,
          notes: formData.notes
        });
      } else {
        onAddRawMaterialPurchase({
          rawMaterialId: formData.rawMaterialId,
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          totalCost: formData.totalCost,
          purchaseDate: formData.purchaseDate,
          supplier: formData.supplier,
          paymentMethod: formData.paymentMethod,
          receipt: formData.receipt,
          notes: formData.notes
        });
      }
    } else if (activeTab === 'employees') {
      if (editingExpense && 'professional' in editingExpense) {
        onUpdateEmployeeCost(editingExpense.id, {
          professional: formData.professional,
          hourlyCost: formData.hourlyCost,
          averageSalary: formData.averageSalary,
          benefits: formData.benefits,
          fgts: formData.fgts,
          vacationAllowance: formData.vacationAllowance,
          vacationBonus: formData.vacationBonus,
          fgtsVacationBonus: formData.fgtsVacationBonus,
          thirteenthSalary: formData.thirteenthSalary,
          fgtsThirteenth: formData.fgtsThirteenth,
          noticePeriod: formData.noticePeriod,
          fgtsNoticePeriod: formData.fgtsNoticePeriod,
          fgtsPenalty: formData.fgtsPenalty
        });
      } else {
        onAddEmployeeCost({
          professional: formData.professional,
          hourlyCost: formData.hourlyCost,
          averageSalary: formData.averageSalary,
          benefits: formData.benefits,
          fgts: formData.fgts,
          vacationAllowance: formData.vacationAllowance,
          vacationBonus: formData.vacationBonus,
          fgtsVacationBonus: formData.fgtsVacationBonus,
          thirteenthSalary: formData.thirteenthSalary,
          fgtsThirteenth: formData.fgtsThirteenth,
          noticePeriod: formData.noticePeriod,
          fgtsNoticePeriod: formData.fgtsNoticePeriod,
          fgtsPenalty: formData.fgtsPenalty
        });
      }
    }
    
    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (expense: FixedExpense | VariableExpense | RawMaterialPurchase) => {
    setEditingExpense(expense);
    
    if ('frequency' in expense) {
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
        receipt: '',
        rawMaterialId: '',
        quantity: 0,
        unitPrice: 0,
        totalCost: 0,
        purchaseDate: new Date(),
        supplier: '',
        notes: ''
      });
    } else if ('rawMaterialId' in expense) {
      setActiveTab('purchases');
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
        receipt: '',
        rawMaterialId: expense.rawMaterialId,
        quantity: expense.quantity,
        unitPrice: expense.unitPrice,
        totalCost: expense.totalCost,
        purchaseDate: expense.purchaseDate,
        supplier: expense.supplier,
        notes: expense.notes || ''
      });
    } else if ('professional' in expense) {
      setActiveTab('employees');
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
        receipt: '',
        rawMaterialId: '',
        quantity: 0,
        unitPrice: 0,
        totalCost: 0,
        purchaseDate: new Date(),
        supplier: '',
        notes: '',
        professional: expense.professional,
        hourlyCost: expense.hourlyCost,
        averageSalary: expense.averageSalary,
        benefits: expense.benefits,
        fgts: expense.fgts,
        vacationAllowance: expense.vacationAllowance,
        vacationBonus: expense.vacationBonus,
        fgtsVacationBonus: expense.fgtsVacationBonus,
        thirteenthSalary: expense.thirteenthSalary,
        fgtsThirteenth: expense.fgtsThirteenth,
        noticePeriod: expense.noticePeriod,
        fgtsNoticePeriod: expense.fgtsNoticePeriod,
        fgtsPenalty: expense.fgtsPenalty
      });
    } else {
      setActiveTab('variable');
      setFormData({
        name: expense.name,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        frequency: 'mensal',
        dueDate: 1,
        isActive: true,
        date: expense.expenseDate,
        paymentMethod: expense.paymentMethod,
        receipt: expense.receipt || '',
        rawMaterialId: '',
        quantity: 0,
        unitPrice: 0,
        totalCost: 0,
        purchaseDate: new Date(),
        supplier: '',
        notes: ''
      });
    }
    
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const expense = [...fixedExpenses, ...variableExpenses, ...rawMaterialPurchases, ...employeeCosts].find(e => e.id === id);
    if (!expense) return;

    if ('frequency' in expense) {
      if (window.confirm('Tem certeza que deseja excluir esta despesa fixa?')) {
        onDeleteFixedExpense(id);
      }
    } else if ('rawMaterialId' in expense) {
      if (window.confirm('Tem certeza que deseja excluir esta compra de insumo?')) {
        onDeleteRawMaterialPurchase(id);
      }
    } else if ('professional' in expense) {
      if (window.confirm('Tem certeza que deseja excluir este custo de funcionário?')) {
        onDeleteEmployeeCost(id);
      }
    } else {
      if (window.confirm('Tem certeza que deseja excluir esta despesa variável?')) {
        onDeleteVariableExpense(id);
      }
    }
  };

  const handleAddNewMaterial = () => {
    if (newMaterialName.trim()) {
      // Gerar um código único para o insumo
      const timestamp = Date.now();
      const code = `INS${timestamp}`;
      
      const materialData = {
        code: code,
        name: newMaterialName.trim(),
        category: 'Geral', // Categoria padrão
        measurementUnit: newMaterialUnit,
        unitPrice: 0,
        supplier: 'A definir',
        minimumStock: 0,
        currentStock: 0,
        clientId: '' // Será sobrescrito no App.tsx
      };
      
      console.log('Tentando adicionar insumo:', materialData);
      
      try {
        onAddRawMaterial(materialData);
        setNewMaterialName('');
        setNewMaterialDescription('');
        setNewMaterialUnit('un');
        setIsNewMaterialModalOpen(false);
      } catch (error) {
        console.error('Erro ao adicionar insumo:', error);
        alert('Erro ao adicionar insumo. Verifique o console para mais detalhes.');
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
      receipt: '',
      rawMaterialId: '',
      quantity: 0,
      unitPrice: 0,
      totalCost: 0,
      purchaseDate: new Date(),
      supplier: '',
      notes: '',
      // Campos para EmployeeCost
      professional: '',
      hourlyCost: 0,
      averageSalary: 0,
      benefits: 0,
      fgts: 0,
      vacationAllowance: 0,
      vacationBonus: 0,
      fgtsVacationBonus: 0,
      thirteenthSalary: 0,
      fgtsThirteenth: 0,
      noticePeriod: 0,
      fgtsNoticePeriod: 0,
      fgtsPenalty: 0
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

  const currentMonthVariableExpenses = getCurrentMonthVariableExpenses();
  const totalMonthVariableExpenses = currentMonthVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Despesas</h2>
        {(activeTab === 'fixed' || activeTab === 'variable') && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === 'fixed' ? 'Nova Despesa Fixa' : 'Nova Despesa Variável'}
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
                 {fixedExpenses.filter(e => e.isActive).length + variableExpenses.length + rawMaterialPurchases.length + employeeCosts.length}
               </span>
             </div>
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600">Total de Registros</p>
               <p className="text-2xl font-bold text-gray-900">
                 {fixedExpenses.filter(e => e.isActive).length + variableExpenses.length + rawMaterialPurchases.length + employeeCosts.length}
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
                         <button
               onClick={() => setActiveTab('purchases')}
               className={`py-4 px-1 border-b-2 font-medium text-sm ${
                 activeTab === 'purchases'
                   ? 'border-orange-500 text-orange-600'
                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
               }`}
             >
               <Package className="h-4 w-4 inline mr-2" />
               Compras de Insumos ({rawMaterialPurchases.length})
             </button>
             <button
               onClick={() => setActiveTab('employees')}
               className={`py-4 px-1 border-b-2 font-medium text-sm ${
                 activeTab === 'employees'
                   ? 'border-orange-500 text-orange-600'
                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
               }`}
             >
               <Users className="h-4 w-4 inline mr-2" />
               Custo de Funcionários ({employeeCosts.length})
             </button>
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="p-6">
          {activeTab === 'fixed' && (
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
                              ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
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
          )}

          {activeTab === 'variable' && (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

          {activeTab === 'purchases' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Compras de Insumos</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Nova Compra de Insumo
                  </button>
                  <button
                    onClick={() => setIsNewMaterialModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Insumo
                  </button>
                </div>
              </div>
              
              {/* Formulário de Nova Compra de Insumo - Aparece em cima */}
              {isFormOpen && activeTab === 'purchases' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    {editingExpense ? 'Editar Compra de Insumo' : 'Nova Compra de Insumo'}
                  </h4>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Insumo
                        </label>
                        <select
                          value={formData.rawMaterialId}
                          onChange={(e) => setFormData({...formData, rawMaterialId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        >
                          <option value="">Selecione um insumo</option>
                          {rawMaterials.map(material => (
                            <option key={material.id} value={material.id}>
                              {material.name} ({material.category})
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
                          value={formData.quantity === 0 ? '' : formData.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            const quantity = value === '' ? 0 : parseFloat(value) || 0;
                            const totalCost = quantity * formData.unitPrice;
                            setFormData({...formData, quantity, totalCost})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preço Unitário (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.unitPrice === 0 ? '' : formData.unitPrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            const unitPrice = value === '' ? 0 : parseFloat(value) || 0;
                            const totalCost = formData.quantity * unitPrice;
                            setFormData({...formData, unitPrice, totalCost})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custo Total (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.totalCost === 0 ? '' : formData.totalCost}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({...formData, totalCost: value === '' ? 0 : parseFloat(value) || 0})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data da Compra
                        </label>
                        <input
                          type="date"
                          value={formData.purchaseDate.toISOString().split('T')[0]}
                          onChange={(e) => setFormData({...formData, purchaseDate: new Date(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fornecedor
                        </label>
                        <input
                          type="text"
                          value={formData.supplier}
                          onChange={(e) => setFormData({...formData, supplier: e.target.value})}
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observações (opcional)
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Observações sobre a compra..."
                        />
                      </div>
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
                        placeholder="Descrição detalhada da compra..."
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
                      const material = rawMaterials.find(m => m.id === purchase.rawMaterialId);
                      return (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {material?.name || 'Insumo não encontrado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {material?.category || 'Categoria não definida'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.quantity} {material?.measurementUnit || 'un'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {purchase.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            R$ {purchase.totalCost.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(purchase.purchaseDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(purchase)}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(purchase.id)}
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
                
                {rawMaterialPurchases.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma compra de insumo registrada</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comece registrando suas compras de insumos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba: Custo de Funcionários */}
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Custo de Funcionários</h3>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Novo Custo de Funcionário
                </button>
              </div>

              {/* Formulário de Novo Custo de Funcionário - Aparece em cima */}
              {isFormOpen && activeTab === 'employees' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">
                    {editingExpense ? 'Editar Custo de Funcionário' : 'Novo Custo de Funcionário'}
                  </h4>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profissional
                        </label>
                        <input
                          type="text"
                          value={formData.professional}
                          onChange={(e) => setFormData({...formData, professional: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custo Hora (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.hourlyCost === 0 ? '' : formData.hourlyCost}
                          onChange={(e) => setFormData({...formData, hourlyCost: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Salário Médio (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.averageSalary === 0 ? '' : formData.averageSalary}
                          onChange={(e) => setFormData({...formData, averageSalary: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Encargos (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.benefits === 0 ? '' : formData.benefits}
                          onChange={(e) => setFormData({...formData, benefits: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FGTS (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgts === 0 ? '' : formData.fgts}
                          onChange={(e) => setFormData({...formData, fgts: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Férias 1/12 (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.vacationAllowance === 0 ? '' : formData.vacationAllowance}
                          onChange={(e) => setFormData({...formData, vacationAllowance: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          1/3 Férias (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.vacationBonus === 0 ? '' : formData.vacationBonus}
                          onChange={(e) => setFormData({...formData, vacationBonus: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FGTS Férias e 1/3 (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgtsVacationBonus === 0 ? '' : formData.fgtsVacationBonus}
                          onChange={(e) => setFormData({...formData, fgtsVacationBonus: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          13º Salário (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.thirteenthSalary === 0 ? '' : formData.thirteenthSalary}
                          onChange={(e) => setFormData({...formData, thirteenthSalary: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FGTS 13º Salário (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgtsThirteenth === 0 ? '' : formData.fgtsThirteenth}
                          onChange={(e) => setFormData({...formData, fgtsThirteenth: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aviso Prévio (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.noticePeriod === 0 ? '' : formData.noticePeriod}
                          onChange={(e) => setFormData({...formData, noticePeriod: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          FGTS Aviso Prévio (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgtsNoticePeriod === 0 ? '' : formData.fgtsNoticePeriod}
                          onChange={(e) => setFormData({...formData, fgtsNoticePeriod: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Multa FGTS (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fgtsPenalty === 0 ? '' : formData.fgtsPenalty}
                          onChange={(e) => setFormData({...formData, fgtsPenalty: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
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
                        {editingExpense ? 'Atualizar' : 'Cadastrar'}
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
                            R$ {employeeCost.hourlyCost.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.averageSalary.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.benefits.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.fgts.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.vacationAllowance.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.vacationBonus.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.fgtsVacationBonus.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.thirteenthSalary.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.fgtsThirteenth.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.noticePeriod.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.fgtsNoticePeriod.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {employeeCost.fgtsPenalty.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(employeeCost)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(employeeCost.id)}
                                className="text-red-600 hover:text-red-900"
                              >
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
                    <p className="mt-1 text-sm text-gray-500">
                      Comece registrando os custos dos seus funcionários.
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
            {editingExpense ? 'Editar' : 'Nova'} - {
              activeTab === 'fixed' ? 'Despesa Fixa' : 
              activeTab === 'variable' ? 'Despesa Variável' : 
              activeTab === 'purchases' ? 'Compra de Insumo' :
              'Custo de Funcionário'
            }
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
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
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

              {activeTab === 'fixed' && (
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
              )}

              {activeTab === 'variable' && (
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

      {/* Modal para Novo Insumo */}
      {isNewMaterialModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cadastrar Novo Insumo
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Insumo *
                </label>
                <input
                  type="text"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Farinha de Trigo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição detalhada do insumo"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade de Medida *
                </label>
                <select
                  value={newMaterialUnit}
                  onChange={(e) => setNewMaterialUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {measurementUnits.map(unit => (
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
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewMaterial}
                disabled={!newMaterialName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
