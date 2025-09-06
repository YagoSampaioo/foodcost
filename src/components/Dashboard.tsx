import {
  TrendingUp,
  Package,
  ChefHat,
  Calendar,
  BarChart3,
  Target,
  AlertTriangle,
  TrendingDown,
  PieChart,
  Activity,
  ShoppingCart,
  Award,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import { useData } from "../hooks/useData";

export default function Dashboard() {
  const { products, sales, rawMaterials, fixedExpenses, variableExpenses, employeeCosts } = useData();

  const safeEmployeeCosts = employeeCosts || [];

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Data não disponível";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  // =====================================================
  // CÁLCULOS FINANCEIROS AVANÇADOS
  // =====================================================

  const getCurrentMonthSales = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return sales.filter((sale) => {
      if (!sale.sale_date) return false;
      const saleDate = new Date(sale.sale_date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
  };

  const getCurrentYearSales = () => {
    const currentYear = new Date().getFullYear();

    return sales.filter((sale) => {
      if (!sale.sale_date) return false;
      const saleDate = new Date(sale.sale_date);
      return saleDate.getFullYear() === currentYear;
    });
  };

  const currentMonthSales = getCurrentMonthSales();
  const currentYearSales = getCurrentYearSales();

  const totalMonthSales = currentMonthSales.reduce((sum, sale) => sum + sale.total_sales, 0);
  const totalYearSales = currentYearSales.reduce((sum, sale) => sum + sale.total_sales, 0);
  const totalMonthOrders = currentMonthSales.reduce((sum, sale) => sum + sale.number_of_orders, 0);

  const averageMonthTicket = totalMonthOrders > 0 ? totalMonthSales / totalMonthOrders : 0;

  const getCurrentMonthVariableExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return variableExpenses.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  };

  const currentMonthVariableExpenses = getCurrentMonthVariableExpenses();

  const calculateCMV = () => {
    let totalCMV = 0;

    products.forEach((product) => {
      if (product.ingredients && product.ingredients.length > 0) {
        const productCost = product.ingredients.reduce((sum, ingredient) => {
          return sum + ingredient.total_cost;
        }, 0);

        if (product.selling_price > 0) {
          const estimatedSales = (totalMonthSales / product.selling_price) * 0.1;
          totalCMV += productCost * estimatedSales;
        }
      }
    });

    return totalCMV;
  };

  const monthlyCMV = calculateCMV();

  const calculateCMO = () => {
    let totalCMO = 0;

    fixedExpenses.forEach((expense) => {
      if (expense.is_active) {
        switch (expense.frequency) {
          case "mensal":
            totalCMO += expense.amount;
            break;
          case "trimestral":
            totalCMO += expense.amount / 3;
            break;
          case "semestral":
            totalCMO += expense.amount / 6;
            break;
          case "anual":
            totalCMO += expense.amount / 12;
            break;
        }
      }
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    variableExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.expense_date);
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        totalCMO += expense.amount;
      }
    });

    safeEmployeeCosts.forEach((employee) => {
      const monthlyEmployeeCost =
        employee.average_salary +
        employee.benefits +
        employee.fgts +
        employee.vacation_allowance +
        employee.vacation_bonus +
        employee.fgts_vacation_bonus +
        employee.thirteenth_salary +
        employee.fgts_thirteenth +
        employee.notice_period +
        employee.fgts_notice_period +
        employee.fgts_penalty;
      totalCMO += monthlyEmployeeCost;
    });

    return totalCMO;
  };

  const monthlyCMO = calculateCMO();
  const grossMargin = totalMonthSales - monthlyCMV;
  const grossmargin_percentage = totalMonthSales > 0 ? (grossMargin / totalMonthSales) * 100 : 0;
  const operatingMargin = grossMargin - monthlyCMO;
  const operatingmargin_percentage = totalMonthSales > 0 ? (operatingMargin / totalMonthSales) * 100 : 0;
  const profitability = totalMonthSales > 0 ? (operatingMargin / totalMonthSales) * 100 : 0;
  const breakEvenPoint = grossmargin_percentage > 0 ? monthlyCMO / (grossmargin_percentage / 100) : 0;

  const totalRawMaterials = rawMaterials.length;
  const lowStockMaterials = rawMaterials.filter(
    (material) => (material.current_stock || 0) <= (material.minimum_stock || 0)
  );

  const totalInventoryCost = rawMaterials.reduce(
    (sum, material) => sum + (material.current_stock || 0) * (material.unit_price || 0),
    0
  );

  const recentProducts = products
    .sort(
      (a, b) =>
        new Date(b.last_modified || b.created_at).getTime() - new Date(a.last_modified || a.created_at).getTime()
    )
    .slice(0, 5);

  const recentSales = sales
    .sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime())
    .slice(0, 5);

  const getPerformanceColor = (value: number, target: number) => {
    if (value >= target) return "text-green-600";
    if (value >= target * 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (value: number, target: number) => {
    if (value >= target) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value >= target * 0.8) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const calculateProductMargins = () => {
    return products
      .map((product) => {
        // Calcula o custo total dos ingredientes do produto
        const totalCost =
          product.ingredients?.reduce((sum, ingredient) => {
            return sum + (ingredient.total_cost || 0);
          }, 0) || 0;

        // Calcula a margem em valor e porcentagem
        const marginValue = (product.selling_price || 0) - totalCost;
        const margin_percentage = product.selling_price > 0 ? (marginValue / product.selling_price) * 100 : 0;

        return {
          ...product,
          total_cost: totalCost,
          margin_value: marginValue,
          margin_percentage: margin_percentage,
        };
      })
      .filter((product) => product.selling_price > 0); // Remove produtos sem preço definido
  };

  const productsWithMargins = calculateProductMargins();

  // Produtos com maior margem (top 5)
  const productsByMargin = productsWithMargins
    .sort((a, b) => (b.margin_percentage || 0) - (a.margin_percentage || 0))
    .slice(0, 5);

  // Produtos com baixa margem (menor que 40%)
  const lowMarginProducts = productsWithMargins
    .filter((product) => (product.margin_percentage || 0) < 40)
    .sort((a, b) => (a.margin_percentage || 0) - (b.margin_percentage || 0))
    .slice(0, 5);

  // =====================================================
  // PRODUTOS POR CATEGORIA (OPCIONAL - para análise adicional)
  // =====================================================

  const getProductsByCategory = () => {
    const categories = {};

    productsWithMargins.forEach((product) => {
      const category = product.category || "Sem categoria";
      if (!categories[category]) {
        categories[category] = {
          name: category,
          products: [],
          totalRevenue: 0,
          averageMargin: 0,
        };
      }
      categories[category].products.push(product);
    });

    // Calcula médias por categoria
    Object.values(categories).forEach((category) => {
      const totalMargin = category.products.reduce((sum, p) => sum + (p.margin_percentage || 0), 0);
      category.averageMargin = totalMargin / category.products.length;

      // Simula receita baseada no preço (você pode ajustar conforme seus dados reais de vendas)
      category.totalRevenue = category.products.reduce((sum, p) => sum + (p.selling_price || 0), 0);
    });

    return Object.values(categories);
  };

  const categoriesAnalysis = getProductsByCategory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="mt-2 text-gray-600">Visão completa das métricas financeiras do seu restaurante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Margem Operacional</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(operatingMargin)}</p>
              <p className="text-xs text-gray-500">{formatPercentage(operatingmargin_percentage)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* ... O restante do JSX continua o mesmo ...

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
            <p className="text-lg text-gray-600">{formatPercentage(grossmargin_percentage)}</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(grossmargin_percentage, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Meta: 60% | Atual: {formatPercentage(grossmargin_percentage)}
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
                    profitability >= 15 ? "bg-green-500" : profitability >= 10 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(Math.max(profitability, 0), 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Meta: 15% | Atual: {formatPercentage(profitability)}</p>
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
                    totalMonthSales >= breakEvenPoint ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min((totalMonthSales / breakEvenPoint) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {totalMonthSales >= breakEvenPoint ? "✅ Lucrativo" : "❌ Prejuízo"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* COMPOSIÇÃO DETALHADA DO CMO */}
      {/* ===================================================== */}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 text-orange-600 mr-2" />
          Composição do CMO (Custos Operacionais Mensais)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Despesas Fixas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Despesas Fixas</h4>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                fixedExpenses
                  .filter((expense) => expense.is_active)
                  .reduce((sum, expense) => {
                    switch (expense.frequency) {
                      case "mensal":
                        return sum + expense.amount;
                      case "trimestral":
                        return sum + expense.amount / 3;
                      case "semestral":
                        return sum + expense.amount / 6;
                      case "anual":
                        return sum + expense.amount / 12;
                      default:
                        return sum;
                    }
                  }, 0)
              )}
            </p>
            <p className="text-sm text-gray-500">{fixedExpenses.filter((e) => e.is_active).length} despesas ativas</p>
          </div>

          {/* Despesas Variáveis */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Despesas Variáveis</h4>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentMonthVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </p>
            <p className="text-sm text-gray-500">{currentMonthVariableExpenses.length} despesas este mês</p>
          </div>

          {/* Custos de Funcionários */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2">Custos de Funcionários</h4>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(
                safeEmployeeCosts.reduce(
                  (sum, employee) =>
                    sum +
                    employee.average_salary +
                    employee.benefits +
                    employee.fgts +
                    employee.vacation_allowance +
                    employee.vacation_bonus +
                    employee.fgts_vacation_bonus +
                    employee.thirteenth_salary +
                    employee.fgts_thirteenth +
                    employee.notice_period +
                    employee.fgts_notice_period +
                    employee.fgts_penalty,
                  0
                )
              )}
            </p>
            <p className="text-sm text-orange-700">{safeEmployeeCosts.length} funcionários</p>
          </div>
        </div>

        {/* Detalhamento dos Custos de Funcionários */}
        {safeEmployeeCosts.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Detalhamento por Funcionário</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Profissional</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Salário</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Encargos</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">FGTS</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Férias + 13º</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Mensal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {safeEmployeeCosts.map((employee) => {
                    const totalMonthly =
                      employee.average_salary +
                      employee.benefits +
                      employee.fgts +
                      employee.vacation_allowance +
                      employee.vacation_bonus +
                      employee.fgts_vacation_bonus +
                      employee.thirteenth_salary +
                      employee.fgts_thirteenth +
                      employee.notice_period +
                      employee.fgts_notice_period +
                      employee.fgts_penalty;

                    const fgtsTotal =
                      employee.fgts +
                      employee.fgts_vacation_bonus +
                      employee.fgts_thirteenth +
                      employee.fgts_notice_period +
                      employee.fgts_penalty;
                    const ferias13Total =
                      employee.vacation_allowance + employee.vacation_bonus + employee.thirteenth_salary;

                    return (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{employee.professional}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatCurrency(employee.average_salary)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatCurrency(employee.benefits)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatCurrency(fgtsTotal)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatCurrency(ferias13Total)}</td>
                        <td className="px-4 py-2 text-sm font-bold text-orange-600">{formatCurrency(totalMonthly)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                      {formatPercentage(product.margin_percentage || 0)}
                    </p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.selling_price)}</p>
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
                    <p className="text-sm font-bold text-red-600">{formatPercentage(product.margin_percentage || 0)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.selling_price)}</p>
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
                      {material.current_stock} {material.measurement_unit}
                    </p>
                    <p className="text-xs text-gray-500">Mín: {material.minimum_stock}</p>
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
                {getPerformanceIcon(grossmargin_percentage, 60)}
                <span className="text-lg font-bold text-gray-900 ml-2">{formatPercentage(grossmargin_percentage)}</span>
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
                        {formatDate(product.last_modified || product.created_at)}
                      </span>
                      <p className="text-xs text-gray-500">{formatCurrency(product.selling_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">Comece cadastrando seus produtos.</p>
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
                      <p className="text-sm font-medium text-gray-900">{formatDate(sale.sale_date)}</p>
                      <p className="text-xs text-gray-500">{sale.number_of_orders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(sale.total_sales)}</span>
                      <p className="text-xs text-gray-500">Ticket: {formatCurrency(sale.average_ticket)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma venda registrada</h3>
                <p className="mt-1 text-sm text-gray-500">Comece registrando suas vendas diárias.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
