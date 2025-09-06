import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatters";
import { useData } from "../hooks/useData";
import { Sale } from "../types";

export default function SalesForm() {
  const { sales, addSale, updateSale, deleteSale } = useData();

  // Filtrar vendas do mês selecionado (padrão: mês com vendas mais recentes)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Atualizar o mês selecionado quando as vendas carregarem
  useEffect(() => {
    if (sales.length > 0) {
      const mostRecentSale = sales[0]; // sales já vem ordenado por data desc
      const saleDate = new Date(mostRecentSale.sale_date);
      const recentMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, "0")}`;

      // Só atualizar se o mês atual não tem vendas
      const currentMonthHasSales = sales.some((sale) => {
        const currentSaleDate = new Date(sale.sale_date);
        const currentMonth = new Date();
        return (
          currentSaleDate.getMonth() === currentMonth.getMonth() &&
          currentSaleDate.getFullYear() === currentMonth.getFullYear()
        );
      });

      if (!currentMonthHasSales) {
        setSelectedMonth(recentMonth);
      }
    }
  }, [sales]);

  const getCurrentMonthSales = () => {
    const [year, month] = selectedMonth.split("-").map(Number);

    return sales.filter((sale) => {
      if (!sale.sale_date) return false;

      const saleDate = new Date(sale.sale_date);
      const saleMonth = saleDate.getMonth();
      const saleYear = saleDate.getFullYear();

      return saleMonth === month - 1 && saleYear === year;
    });
  };

  const currentMonthSales = getCurrentMonthSales();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    total_sales: "",
    number_of_orders: "",
    average_ticket: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      total_sales: "",
      number_of_orders: "",
      average_ticket: "",
      notes: "",
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.total_sales || !formData.number_of_orders) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const saleData = {
      sale_date: new Date(formData.date),
      total_sales: parseFloat(formData.total_sales),
      number_of_orders: parseInt(formData.number_of_orders),
      average_ticket: formData.average_ticket ? parseFloat(formData.average_ticket) : 0,
      notes: formData.notes || undefined,
    };

    try {
      if (editingId) {
        await updateSale(editingId, saleData);
      } else {
        await addSale(saleData);
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setFormData({
      date: new Date(sale.sale_date).toISOString().split("T")[0],
      total_sales: sale.total_sales.toString(),
      number_of_orders: sale.number_of_orders.toString(),
      average_ticket: sale.average_ticket.toString(),
      notes: sale.notes || "",
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      deleteSale(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(date));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{editingId ? "Editar Venda" : "Gerenciar Vendas"}</h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">
                Mostrando vendas de{" "}
                {new Date(selectedMonth + "-02").toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Selecionar mês:</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isAdding ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
            {isAdding ? "Cancelar" : "Nova Venda"}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total de Vendas (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_sales}
                  onChange={(e) => setFormData({ ...formData, total_sales: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Pedidos *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.number_of_orders}
                  onChange={(e) => setFormData({ ...formData, number_of_orders: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Médio (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.average_ticket}
                  onChange={(e) => setFormData({ ...formData, average_ticket: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Observações sobre a venda..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {editingId ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Histórico de Vendas</h3>
            <span className="text-sm text-gray-600">
              {currentMonthSales.length} venda{currentMonthSales.length !== 1 ? "s" : ""} este mês
            </span>
          </div>

          {currentMonthSales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhuma venda registrada este mês. Clique em "Nova Venda" para começar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedidos
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
                  {currentMonthSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(sale.sale_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(sale.total_sales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.number_of_orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(sale.average_ticket)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{sale.notes || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="text-blue-600 hover:text-blue-900 transition-colors">
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(sale.id)}
                            className="text-red-600 hover:text-red-900 transition-colors">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {currentMonthSales.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">
              Resumo do Mês (
              {new Date(selectedMonth + "-02").toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
              )
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(currentMonthSales.reduce((sum, sale) => sum + sale.total_sales, 0))}
                </p>
                <p className="text-sm text-blue-700">Total do Mês</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {currentMonthSales.reduce((sum, sale) => sum + sale.number_of_orders, 0)}
                </p>
                <p className="text-sm text-blue-700">Pedidos do Mês</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    currentMonthSales.reduce((sum, sale) => sum + sale.total_sales, 0) /
                      (currentMonthSales.reduce((sum, sale) => sum + sale.number_of_orders, 0) || 1)
                  )}
                </p>
                <p className="text-sm text-blue-700">Ticket Médio do Mês</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
