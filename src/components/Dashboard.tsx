import React from 'react';
import { TrendingUp, Package, ChefHat, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Product, Sale } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

export default function Dashboard({ products, sales }: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  // Cálculos para produtos
  const totalProducts = products.length;
  const productsByCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProductCategories = Object.entries(productsByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Cálculos para vendas
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
  
  const averageMonthTicket = totalMonthOrders > 0 ? totalMonthSales / totalMonthOrders : 0;

  // Produtos recentes
  const recentProducts = products
    .sort((a, b) => new Date(b.lastModified || b.createdAt).getTime() - new Date(a.lastModified || a.createdAt).getTime())
    .slice(0, 5);

  // Vendas recentes
  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Visão geral do seu negócio de alimentação
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vendas Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthSales)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">{totalMonthOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageMonthTicket)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorias de produtos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias de Produtos</h3>
          {topProductCategories.length > 0 ? (
            <div className="space-y-3">
              {topProductCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(productsByCategory))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto cadastrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece cadastrando seus produtos.
              </p>
            </div>
          )}
        </div>

        {/* Vendas por período */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Período</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Este Mês</span>
              </div>
              <span className="text-lg font-bold text-green-600">{formatCurrency(totalMonthSales)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Este Ano</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(totalYearSales)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos e vendas recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Produtos Recentes</h3>
          </div>
          <div className="p-6">
            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDate(product.lastModified || product.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece cadastrando seus produtos.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Vendas recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vendas Recentes</h3>
          </div>
          <div className="p-6">
            {recentSales.length > 0 ? (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(sale.date)}</p>
                      <p className="text-xs text-gray-500">{sale.numberOfOrders} pedidos</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(sale.totalSales)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
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
    </div>
  );
}