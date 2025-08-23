import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ChefHat, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  TrendingDown,
  PieChart,
  Activity,
  Users,
  ShoppingCart,
  Clock,
  Award
} from 'lucide-react';
import { Product, Sale, RawMaterial, FixedExpense, VariableExpense, RawMaterialPurchase } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  rawMaterials: RawMaterial[];
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  rawMaterialPurchases: RawMaterialPurchase[];
}

export default function Dashboard({ 
  products, 
  sales, 
  rawMaterials, 
  fixedExpenses, 
  variableExpenses, 
  rawMaterialPurchases 
}: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Data não disponível';
    return date.toLocaleDateString('pt-BR');
  };

  // =====================================================
  // CÁLCULOS FINANCEIROS AVANÇADOS
  // =====================================================

  // Vendas do mês atual
  const getCurrentMonthSales = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return sales.filter(sale => {
      if (!sale.saleDate) return false;
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && 
             saleDate.getFullYear() === currentYear;
    });
  };

  const getCurrentYearSales = () => {
    const currentYear = new Date().getFullYear();
    
    return sales.filter(sale => {
      if (!sale.saleDate) return false;
      const saleDate = new Date(sale.saleDate);
      return saleDate.getFullYear() === currentYear;
    });
  };

  const currentMonthSales = getCurrentMonthSales();
  const currentYearSales = getCurrentYearSales();
  
  const totalMonthSales = currentMonthSales.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalYearSales = currentYearSales.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalMonthOrders = currentMonthSales.reduce((sum, sale) => sum + sale.numberOfOrders, 0);
  
  const averageMonthTicket = totalMonthOrders > 0 ? totalMonthSales / totalMonthOrders : 0;

  // CMV (Custo das Mercadorias Vendidas) - Mês atual
  const calculateCMV = () => {
    let totalCMV = 0;
    
    // Para cada produto vendido, calcular o custo baseado nos ingredientes
    products.forEach(product => {
      if (product.ingredients && product.ingredients.length > 0) {
        const productCost = product.ingredients.reduce((sum, ingredient) => {
          return sum + ingredient.totalCost;
        }, 0);
        
        // Estimar vendas baseado no faturamento mensal e preço do produto
        if (product.sellingPrice > 0) {
          const estimatedSales = totalMonthSales / product.sellingPrice * 0.1; // Estimativa conservadora
          totalCMV += productCost * estimatedSales;
        }
      }
    });
    
    return totalCMV;
  };

  const monthlyCMV = calculateCMV();

  // CMO (Custos Operacionais Mensais)
  const calculateCMO = () => {
    let totalCMO = 0;
    
    // Despesas fixas mensais
    fixedExpenses.forEach(expense => {
      if (expense.isActive) {
        switch (expense.frequency) {
          case 'mensal':
            totalCMO += expense.amount;
            break;
          case 'trimestral':
            totalCMO += expense.amount / 3;
            break;
          case 'semestral':
            totalCMO += expense.amount / 6;
            break;
          case 'anual':
            totalCMO += expense.amount / 12;
            break;
        }
      }
    });
    
    // Despesas variáveis do mês atual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    variableExpenses.forEach(expense => {
      const expenseDate = new Date(expense.expenseDate);
      if (expenseDate.getMonth() === currentMonth && 
          expenseDate.getFullYear() === currentYear) {
        totalCMO += expense.amount;
      }
    });
    
    return totalCMO;
  };

  const monthlyCMO = calculateCMO();

  // Margem Bruta
  const grossMargin = totalMonthSales - monthlyCMV;
  const grossMarginPercentage = totalMonthSales > 0 ? (grossMargin / totalMonthSales) * 100 : 0;

  // Margem Operacional
  const operatingMargin = grossMargin - monthlyCMO;
  const operatingMarginPercentage = totalMonthSales > 0 ? (operatingMargin / totalMonthSales) * 100 : 0;

  // Rentabilidade
  const profitability = totalMonthSales > 0 ? (operatingMargin / totalMonthSales) * 100 : 0;

  // Break-even
  const breakEvenPoint = monthlyCMO / (grossMarginPercentage / 100);

  // =====================================================
  // ANÁLISES DE PRODUTOS
  // =====================================================

  const totalProducts = products.length;
  const productsByCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProductCategories = Object.entries(productsByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Produtos com maior margem
  const productsByMargin = products
    .filter(product => product.marginPercentage && product.marginPercentage > 0)
    .sort((a, b) => (b.marginPercentage || 0) - (a.marginPercentage || 0))
    .slice(0, 5);

  // Produtos com menor margem (atenção)
  const lowMarginProducts = products
    .filter(product => product.marginPercentage && product.marginPercentage < 30)
    .sort((a, b) => (a.marginPercentage || 0) - (b.marginPercentage || 0))
    .slice(0, 5);

  // =====================================================
  // ANÁLISES DE INSUMOS
  // =====================================================

  const totalRawMaterials = rawMaterials.length;
  const lowStockMaterials = rawMaterials.filter(material => 
    material.currentStock <= material.minimumStock
  );

  // Custo total de estoque
  const totalInventoryCost = rawMaterials.reduce((sum, material) => 
    sum + (material.currentStock * material.unitPrice), 0
  );

  // =====================================================
  // ANÁLISES DE VENDAS
  // =====================================================

  const recentProducts = products
    .filter(product => product.lastModified || product.createdAt)
    .sort((a, b) => {
      const dateA = new Date(b.lastModified || b.createdAt || 0).getTime();
      const dateB = new Date(a.lastModified || a.createdAt || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  const recentSales = sales
    .filter(sale => sale.saleDate)
    .sort((a, b) => {
      const dateA = new Date(b.saleDate || 0).getTime();
      const dateB = new Date(a.saleDate || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  // =====================================================
  // MÉTRICAS DE PERFORMANCE
  // =====================================================

  const getPerformanceColor = (value: number, target: number) => {
    if (value >= target) return 'text-green-600';
    if (value >= target * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (value: number, target: number) => {
    if (value >= target) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value >= target * 0.8) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="mt-2 text-gray-600">
          Visão completa das métricas financeiras do seu restaurante
        </p>
      </div>

      {/* ===================================================== */}
      {/* CARDS PRINCIPAIS - MÉTRICAS FINANCEIRAS */}
      {/* ===================================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faturamento Mensal */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturamento Mensal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthSales)}</p>
              <p className="text-xs text-gray-500">{totalMonthOrders} pedidos</p>
            </div>
          </div>
        </div>

        {/* CMV - Custo das Mercadorias Vendidas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CMV Mensal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyCMV)}</p>
              <p className="text-xs text-gray-500">
                {formatPercentage(totalMonthSales > 0 ? (monthlyCMV / totalMonthSales) * 100 : 0)} do faturamento
              </p>
            </div>
          </div>
        </div>

        {/* CMO - Custos Operacionais */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CMO Mensal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyCMO)}</p>
              <p className="text-xs text-gray-500">
                {formatPercentage(totalMonthSales > 0 ? (monthlyCMO / totalMonthSales) * 100 : 0)} do faturamento
              </p>
            </div>
          </div>
        </div>

        {/* Margem Operacional */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Margem Operacional</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(operatingMargin)}</p>
              <p className="text-xs text-gray-500">{formatPercentage(operatingMarginPercentage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ANÁLISE DETALHADA DE RENTABILIDADE */}
      {/* ===================================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Margem Bruta */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 text-green-600 mr-2" />
            Margem Bruta
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(grossMargin)}</p>
            <p className="text-lg text-gray-600">{formatPercentage(grossMarginPercentage)}</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(grossMarginPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Meta: 60% | Atual: {formatPercentage(grossMarginPercentage)}
              </p>
            </div>
          </div>
        </div>

        {/* Rentabilidade */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-blue-600 mr-2" />
            Rentabilidade
          </h3>
          <div className="text-center">
            <p className={`text-3xl font-bold ${getPerformanceColor(profitability, 15)}`}>
              {formatPercentage(profitability)}
            </p>
            <p className="text-lg text-gray-600">{formatCurrency(operatingMargin)}</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    profitability >= 15 ? 'bg-green-500' : 
                    profitability >= 10 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(profitability, 0), 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Meta: 15% | Atual: {formatPercentage(profitability)}
              </p>
            </div>
          </div>
        </div>

        {/* Break-even */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            Break-even
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(breakEvenPoint)}</p>
            <p className="text-lg text-gray-600">Faturamento necessário</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    totalMonthSales >= breakEvenPoint ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((totalMonthSales / breakEvenPoint) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {totalMonthSales >= breakEvenPoint ? '✅ Lucrativo' : '❌ Prejuízo'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ANÁLISE DE PRODUTOS E MARGENS */}
      {/* ===================================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos com Maior Margem */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            Produtos com Maior Margem
          </h3>
          {productsByMargin.length > 0 ? (
            <div className="space-y-3">
              {productsByMargin.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      {formatPercentage(product.marginPercentage || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(product.sellingPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">Nenhum produto com margem definida</p>
            </div>
          )}
        </div>

        {/* Produtos com Baixa Margem */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Produtos com Baixa Margem
          </h3>
          {lowMarginProducts.length > 0 ? (
            <div className="space-y-3">
              {lowMarginProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">
                      {formatPercentage(product.marginPercentage || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(product.sellingPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">Todos os produtos com margem adequada</p>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================== */}
      {/* ANÁLISE DE INSUMOS E ESTOQUE */}
      {/* ===================================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo de Insumos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            Resumo de Insumos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalRawMaterials}</p>
              <p className="text-sm text-gray-600">Total de Insumos</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{lowStockMaterials.length}</p>
              <p className="text-sm text-gray-600">Estoque Baixo</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInventoryCost)}</p>
              <p className="text-sm text-gray-600">Valor do Estoque</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(monthlyCMV)}</p>
              <p className="text-sm text-gray-600">CMV Mensal</p>
            </div>
          </div>
        </div>

        {/* Insumos com Estoque Baixo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Insumos com Estoque Baixo
          </h3>
          {lowStockMaterials.length > 0 ? (
            <div className="space-y-3">
              {lowStockMaterials.slice(0, 5).map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{material.name}</p>
                    <p className="text-xs text-gray-500">{material.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">
                      {material.currentStock} {material.measurementUnit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Mín: {material.minimumStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">Todos os insumos com estoque adequado</p>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================== */}
      {/* COMPARAÇÃO MENSAL E ANUAL */}
      {/* ===================================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Período */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            Vendas por Período
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Este Mês</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">{formatCurrency(totalMonthSales)}</span>
                <p className="text-xs text-gray-500">{totalMonthOrders} pedidos</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Este Ano</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">{formatCurrency(totalYearSales)}</span>
                <p className="text-xs text-gray-500">Total acumulado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Financeira */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 text-purple-600 mr-2" />
            Performance Financeira
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Ticket Médio</span>
              <div className="flex items-center">
                {getPerformanceIcon(averageMonthTicket, 25)}
                <span className="text-lg font-bold text-gray-900 ml-2">{formatCurrency(averageMonthTicket)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Margem Bruta</span>
              <div className="flex items-center">
                {getPerformanceIcon(grossMarginPercentage, 60)}
                <span className="text-lg font-bold text-gray-900 ml-2">{formatPercentage(grossMarginPercentage)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Rentabilidade</span>
              <div className="flex items-center">
                {getPerformanceIcon(profitability, 15)}
                <span className="text-lg font-bold text-gray-900 ml-2">{formatPercentage(profitability)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* PRODUTOS E VENDAS RECENTES */}
      {/* ===================================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Recentes */}
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
                    <div className="text-right">
                      <span className="text-sm text-gray-600">
                        {formatDate(product.lastModified || product.createdAt)}
                      </span>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(product.sellingPrice)}
                      </p>
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
        </div>

        {/* Vendas Recentes */}
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
                      <p className="text-sm font-medium text-gray-900">{formatDate(sale.saleDate)}</p>
                      <p className="text-xs text-gray-500">{sale.numberOfOrders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(sale.totalSales)}
                      </span>
                      <p className="text-xs text-gray-500">
                        Ticket: {formatCurrency(sale.averageTicket)}
                      </p>
                    </div>
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