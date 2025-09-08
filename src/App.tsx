import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import RawMaterialsForm from "./components/RawMaterialsForm";
import ProductForm from "./components/ProductForm";
import ExpensesForm from "./components/ExpensesForm";
import SalesForm from "./components/SalesForm";
import IntegrationForm from "./components/IntegrationForm";
import Auth from "./components/Auth";

import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated, currentUser, logout } = useAuth();

  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "insumos" | "produtos" | "despesas" | "vendas" | "integracao"
  >("dashboard");

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("dashboard");
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "insumos":
        return <RawMaterialsForm />;
      case "produtos":
        return <ProductForm />;
      case "despesas":
        return <ExpensesForm />;
      case "vendas":
        return <SalesForm />;
      case "integracao":
        return <IntegrationForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={handlePageChange}
      currentUser={currentUser!} // currentUser agora é garantido que existe se autenticado
      onLogout={handleLogout}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
