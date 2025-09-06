import React, { useState, useEffect } from "react";
import {
  Link,
  Settings,
  Smartphone,
  Store,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  Lock,
  Loader,
} from "lucide-react";
import { useIfood } from "../hooks/useIfood";

export default function IntegrationForm() {
  const { status, merchants, sales, loading, error, connect, disconnect, fetchSales } = useIfood();

  const [activeTab, setActiveTab] = useState<"overview" | "ifood" | "crm" | "other">("overview");
  const [merchantIdInput, setMerchantIdInput] = useState<string>("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>("");
  const [dateRange, setDateRange] = useState({ beginDate: "", endDate: "" });

  useEffect(() => {
    if (merchants.length > 0 && !selectedMerchantId) {
      setSelectedMerchantId(merchants[0].id);
    }
  }, [merchants, selectedMerchantId]);

  const handleIfoodConnect = () => {
    connect();
  };

  const handleIfoodDisconnect = () => {
    disconnect();
  };

  const handleSearchSales = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchantId || !dateRange.beginDate || !dateRange.endDate) {
      alert("Por favor, selecione uma loja e o período de datas.");
      return;
    }
    await fetchSales(selectedMerchantId, dateRange.beginDate, dateRange.endDate);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "connecting":
        return <Loader className="h-5 w-5 text-orange-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "connecting":
        return "Conectando...";
      case "error":
        return "Erro na conexão";
      default:
        return "Desconectado";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "connecting":
        return "text-orange-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Link className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Integrações</h2>
            <p className="text-gray-600">Conecte seu sistema com aplicativos externos</p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab("ifood")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ifood"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              iFood
            </button>
            <button
              onClick={() => setActiveTab("crm")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "crm"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              CRM
            </button>
            <button
              onClick={() => setActiveTab("other")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "other"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Outras Integrações
            </button>
          </nav>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">iFood</h3>
                      <p className="text-sm text-gray-600">Delivery de comida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Sincronize vendas financeiras e relatórios com a plataforma iFood
                </p>
                <button
                  onClick={() => setActiveTab("ifood")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ifood" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Integração com iFood</h3>
                  <p className="text-gray-600">Sincronize seus dados com a maior plataforma de delivery do Brasil</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Funcionalidades disponíveis:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Sincronização automática de vendas
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status da conexão:</h4>
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon()}
                    <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
                  </div>

                  {status === "connected" ? (
                    <button
                      onClick={handleIfoodDisconnect}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={handleIfoodConnect}
                      disabled={status === "connecting"}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                      {status === "connecting" ? "Conectando..." : "Conectar com iFood"}
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Erro na conexão</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              )}
            </div>

            {status === "connected" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Buscar Vendas</h3>
                <form onSubmit={handleSearchSales} className="space-y-4">
                  <div>
                    <label htmlFor="merchant-select" className="block text-sm font-medium text-gray-600 mb-1">
                      Selecione a Loja
                    </label>
                    <select
                      id="merchant-select"
                      value={selectedMerchantId}
                      onChange={(e) => setSelectedMerchantId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md">
                      {merchants.map((merchant) => (
                        <option key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="beginDate" className="block text-sm font-medium text-gray-600 mb-1">
                        Data Início
                      </label>
                      <input
                        type="date"
                        id="beginDate"
                        value={dateRange.beginDate}
                        onChange={(e) => setDateRange((prev) => ({ ...prev, beginDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">
                        Data Fim
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                    {loading ? <Loader className="animate-spin" /> : <Link size={18} />}
                    Buscar Vendas
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
