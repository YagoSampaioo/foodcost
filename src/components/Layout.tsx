import React from 'react';
import { Calculator, Package, ChefHat, DollarSign, TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'insumos' | 'produtos' | 'despesas' | 'vendas';
  onPageChange: (page: 'dashboard' | 'insumos' | 'produtos' | 'despesas' | 'vendas') => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calculator },
    { id: 'insumos', label: 'Insumos', icon: Package },
    { id: 'produtos', label: 'Produtos', icon: ChefHat },
    { id: 'despesas', label: 'Despesas', icon: DollarSign },
    { id: 'vendas', label: 'Vendas', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="https://toyegzbckmtrvnfxbign.supabase.co/storage/v1/object/public/branding/logo.png" 
              alt="FoodCost Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-900">FoodCost</h1>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}