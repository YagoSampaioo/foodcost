import React from "react";
import { Calculator, Package, ChefHat, DollarSign, TrendingUp, LogOut, User, Link, Users, Lock } from "lucide-react";
import { AuthUser } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: "dashboard" | "insumos" | "produtos" | "despesas" | "vendas" | "integracao" | "crm";
  onPageChange: (page: "dashboard" | "insumos" | "produtos" | "despesas" | "vendas" | "integracao" | "crm") => void;
  currentUser: AuthUser;
  onLogout: () => void;
}

export default function Layout({ children, currentPage, onPageChange, currentUser, onLogout }: LayoutProps) {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Calculator, blocked: false },
    { id: "insumos", label: "Insumos", icon: Package, blocked: false },
    { id: "produtos", label: "Produtos", icon: ChefHat, blocked: false },
    { id: "despesas", label: "Despesas", icon: DollarSign, blocked: false },
    { id: "vendas", label: "Vendas", icon: TrendingUp, blocked: false },
    { id: "integracao", label: "Integrações", icon: Link, blocked: false },
    { id: "crm", label: "CRM", icon: Users, blocked: true },
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

              if (item.blocked) {
                return (
                  <div
                    key={item.id}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg cursor-not-allowed opacity-60">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3 text-orange-400" />
                      <span className="text-orange-500">{item.label}</span>
                    </div>
                    <Lock className="h-4 w-4 text-orange-500" />
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}>
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info e logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.company_name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
}
