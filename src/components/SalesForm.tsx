import React, { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { Sale } from '../types';

interface SalesFormProps {
  sales: Sale[];
  onAddSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  onUpdateSale: (id: string, sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  onDeleteSale: (id: string) => void;
}

export default function SalesForm({
  sales,
  onAddSale,
  onUpdateSale,
  onDeleteSale
}: SalesFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    date: new Date(),
    totalSales: 0,
    numberOfOrders: 0,
    averageTicket: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSale) {
      onUpdateSale(editingSale.id, formData);
      setEditingSale(null);
    } else {
      onAddSale(formData);
    }
    
    resetForm();
    setIsFormOpen(false);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      date: sale.date,
      totalSales: sale.totalSales,
      numberOfOrders: sale.numberOfOrders,
      averageTicket: sale.averageTicket,
      notes: sale.notes || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      onDeleteSale(id);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date(),
      totalSales: 0,
      numberOfOrders: 0,
      averageTicket: 0,
      notes: ''
    });
    setEditingSale(null);
  };

  const cancelEdit = () => {
    setEditingSale(null);
    resetForm();
    setIsFormOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cálculos para o resumo
  const getCurrentMonthSales = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && 
             saleDate.getFullYear() === currentYear;
    });
  };

  const getCurrentYearSales = () => {
    const currentYear = new Date().getFullYear();
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getFullYear() === currentYear;
    });
  };

  const currentMonthSales = getCurrentMonthSales();
  const currentYearSales = getCurrentYearSales();
  
  const totalMonthSales = currentMonthSales.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalYearSales = currentYearSales.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalMonthOrders = currentMonthSales.reduce((sum, sale) => sum + sale.numberOfOrders, 0);
  const totalYearOrders = currentYearSales.reduce((sum, sale) => sum + sale.numberOfOrders, 0);
  
  const averageMonthTicket = totalMonthOrders > 0 ? totalMonthSales / totalMonthOrders : 0;
  const averageYearTicket = totalYearOrders > 0 ? totalYearSales / totalYearOrders : 0;

  // Vendas por dia da semana
  const salesByWeekday = sales.reduce((acc, sale) => {
    const day = new Date(sale.date).toLocaleDateString('pt-BR', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + sale.totalSales;
    return acc;
  }, {} as Record<string, number>);

  const topWeekdays = Object.entries(salesByWeekday)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Vendas</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </button>
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Vendas Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalMonthSales)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Vendas Este Ano</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalYearSales)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pedidos Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalMonthOrders}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Ticket Médio Mensal</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averageMonthTicket)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top dias da semana */}
      {topWeekdays.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Melhores Dias da Semana</h3>
          <div className="space-y-3">
            {topWeekdays.map(([weekday, amount], index) => (
              <div key={weekday} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700 capitalize">{weekday}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(amount / Math.max(...Object.values(salesByWeekday))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-24 text-right">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSale ? 'Editar Venda' : 'Nova Venda'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Total de Vendas (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalSales}
                  onChange={(e) => {
                    const totalSales = parseFloat(e.target.value) || 0;
                    const numberOfOrders = formData.numberOfOrders;
                    const averageTicket = numberOfOrders > 0 ? totalSales / numberOfOrders : 0;
                    setFormData({
                      ...formData,
                      totalSales,
                      averageTicket: Math.round(averageTicket * 100) / 100
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Pedidos
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfOrders}
                  onChange={(e) => {
                    const numberOfOrders = parseInt(e.target.value) || 0;
                    const totalSales = formData.totalSales;
                    const averageTicket = numberOfOrders > 0 ? totalSales / numberOfOrders : 0;
                    setFormData({
                      ...formData,
                      numberOfOrders,
                      averageTicket: Math.round(averageTicket * 100) / 100
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Médio (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.averageTicket}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Calculado automaticamente</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Observações sobre o dia de vendas..."
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
                {editingSale ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Vendas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Vendas</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Vendas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(sale.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(sale.totalSales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.numberOfOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(sale.averageTicket)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sale.notes ? (
                      <span className="max-w-xs truncate block" title={sale.notes}>
                        {sale.notes}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
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
          
          {sales.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma venda registrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece registrando suas vendas diárias.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
