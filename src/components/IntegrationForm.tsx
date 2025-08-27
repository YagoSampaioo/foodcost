import React, { useState, useEffect } from 'react';
import { Link, Settings, Smartphone, Store, Zap, CheckCircle, AlertCircle, ExternalLink, Users, Lock } from 'lucide-react';
import { ifoodService } from '../services/ifoodService';
import { IFOOD_CONFIG } from '../config/ifood';

interface IntegrationFormProps {
  currentUser: any;
}

export default function IntegrationForm({ currentUser }: IntegrationFormProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ifood' | 'crm' | 'other'>('overview');
  const [ifoodStatus, setIfoodStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [ifoodCredentials, setIfoodCredentials] = useState({
    merchantId: ''
  });

  // Verificar status da conexão ao carregar o componente
  useEffect(() => {
    const checkConnection = async () => {
      // Verificar se já existe um merchant ID salvo
      const savedMerchantId = localStorage.getItem('ifood_merchant_id');
      if (savedMerchantId) {
        setIfoodCredentials({ merchantId: savedMerchantId });
      }
      
      // Verificar se já está autenticado
      if (ifoodService.isConnected()) {
        setIfoodStatus('connected');
      }
    };
    
    checkConnection();
  }, []);

  const handleIfoodConnect = async () => {
    if (!ifoodCredentials.merchantId.trim()) {
      alert('Por favor, informe o ID da sua loja no iFood');
      return;
    }

    setIfoodStatus('connecting');
    
    try {
      // Primeiro autentica com as credenciais fixas da API
      const authSuccess = await ifoodService.authenticate(
        IFOOD_CONFIG.CLIENT_ID, 
        IFOOD_CONFIG.CLIENT_SECRET
      );
      
      if (authSuccess) {
        // Testa a conexão buscando vendas do mês atual
        const sales = await ifoodService.getCurrentMonthSales(ifoodCredentials.merchantId);
        console.log('Vendas encontradas:', sales);
        
        // Salva o merchant ID no localStorage
        localStorage.setItem('ifood_merchant_id', ifoodCredentials.merchantId);
        
        setIfoodStatus('connected');
      } else {
        setIfoodStatus('error');
      }
    } catch (error) {
      setIfoodStatus('error');
      console.error('Erro ao conectar com iFood:', error);
    }
  };

  const handleIfoodDisconnect = () => {
    ifoodService.disconnect();
    setIfoodStatus('disconnected');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'connecting':
        return <div className="h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'error':
        return 'Erro na conexão';
      default:
        return 'Desconectado';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('ifood')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ifood'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              iFood
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'crm'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              CRM
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'other'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Outras Integrações
            </button>
          </nav>
        </div>

        {/* Conteúdo das tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card iFood */}
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
                    {getStatusIcon(ifoodStatus)}
                    <span className={`text-sm font-medium ${getStatusColor(ifoodStatus)}`}>
                      {getStatusText(ifoodStatus)}
                    </span>
                  </div>
                </div>
                                 <p className="text-sm text-gray-600 mb-4">
                   Sincronize vendas financeiras e relatórios com a plataforma iFood
                 </p>
                <button
                  onClick={() => setActiveTab('ifood')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Configurar
                </button>
              </div>

              {/* Card Uber Eats */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Uber Eats</h3>
                      <p className="text-sm text-gray-600">Delivery de comida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Em breve</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Integração com Uber Eats em desenvolvimento
                </p>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Em breve
                </button>
              </div>

              {/* Card CRM */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">CRM</h3>
                      <p className="text-sm text-gray-600">Gestão de clientes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">Bloqueado</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Sistema completo de gestão de relacionamento com clientes
                </p>
                <button
                  onClick={() => setActiveTab('crm')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Configurar
                </button>
              </div>

              {/* Card WhatsApp Business */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp Business</h3>
                      <p className="text-sm text-gray-600">Comunicação</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Em breve</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Envio automático de pedidos via WhatsApp
                </p>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Em breve
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Como funcionam as integrações?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    As integrações permitem que seu sistema FoodCost se comunique automaticamente com 
                    plataformas externas, sincronizando dados como pedidos, produtos e vendas. 
                    Isso elimina a necessidade de inserção manual de informações e garante 
                    maior precisão nos seus relatórios financeiros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ifood' && (
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
                     <li className="flex items-center gap-2">
                       <CheckCircle className="h-4 w-4 text-green-500" />
                       Relatórios financeiros integrados
                     </li>
                     <li className="flex items-center gap-2">
                       <CheckCircle className="h-4 w-4 text-green-500" />
                       Dados de comissões e valores líquidos
                     </li>
                     <li className="flex items-center gap-2">
                       <CheckCircle className="h-4 w-4 text-green-500" />
                       Histórico completo de vendas
                     </li>
                   </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status da conexão:</h4>
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon(ifoodStatus)}
                    <span className={`font-medium ${getStatusColor(ifoodStatus)}`}>
                      {getStatusText(ifoodStatus)}
                    </span>
                  </div>

                  {ifoodStatus === 'connected' ? (
                    <button
                      onClick={handleIfoodDisconnect}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={handleIfoodConnect}
                      disabled={ifoodStatus === 'connecting'}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {ifoodStatus === 'connecting' ? 'Conectando...' : 'Conectar com iFood'}
                    </button>
                  )}
                </div>
              </div>

              {ifoodStatus === 'connected' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Conexão ativa!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Sua integração com iFood está funcionando perfeitamente. 
                    Os dados estão sendo sincronizados automaticamente.
                  </p>
                </div>
              )}

              {ifoodStatus === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Erro na conexão</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Houve um problema ao conectar com iFood. Verifique suas credenciais e tente novamente.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Configurações da sua loja</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID da Loja no iFood *
                  </label>
                  <input
                    type="text"
                    value={ifoodCredentials.merchantId}
                    onChange={(e) => setIfoodCredentials({...ifoodCredentials, merchantId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: 12345-67890-abcde"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este é o identificador único da sua loja no iFood. Você pode encontrá-lo no painel do restaurante.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Como encontrar o ID da sua loja:</h5>
                  <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Acesse o painel do restaurante no iFood</li>
                    <li>Vá em "Configurações" ou "Perfil da Loja"</li>
                    <li>Procure por "ID da Loja", "Merchant ID" ou similar</li>
                    <li>Copie o código alfanumérico (ex: 12345-67890-abcde)</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Documentação iFood</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Para obter suas credenciais de API, acesse o 
                    <a 
                      href="https://developers.ifood.com.br/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline ml-1"
                    >
                      portal de desenvolvedores do iFood
                    </a>
                    . Você precisará criar uma aplicação e configurar as permissões necessárias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Sistema CRM</h3>
                  <p className="text-gray-600">Gestão completa de relacionamento com clientes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Funcionalidades disponíveis:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Cadastro e gestão de clientes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Histórico de pedidos por cliente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Sistema de fidelidade e pontos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Campanhas e promoções personalizadas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Relatórios de comportamento do cliente
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status do sistema:</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-orange-600">Bloqueado</span>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Funcionalidade bloqueada</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      O sistema CRM está temporariamente indisponível. 
                      Entre em contato com o suporte para mais informações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Sobre o Sistema CRM</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      O sistema CRM do FoodCost permite que você gerencie todos os aspectos do relacionamento 
                      com seus clientes, desde o primeiro contato até a fidelização. 
                      Acompanhe preferências, histórico de compras e crie campanhas personalizadas 
                      para aumentar suas vendas e satisfação do cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Recursos em desenvolvimento</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Integração com WhatsApp</h5>
                    <p className="text-xs text-gray-600">Comunicação automática com clientes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">App Mobile</h5>
                    <p className="text-xs text-gray-600">Acesso via smartphone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Analytics Avançado</h5>
                    <p className="text-xs text-gray-600">Relatórios detalhados de comportamento</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-medium">4</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Automação</h5>
                    <p className="text-xs text-gray-600">Fluxos automáticos de marketing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'other' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Mais integrações em desenvolvimento</h3>
              <p className="mt-1 text-sm text-gray-500">
                Estamos trabalhando para trazer mais opções de integração para você.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Uber Eats</h3>
                    <p className="text-sm text-gray-600">Em desenvolvimento</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Integração completa com Uber Eats para sincronização de pedidos e produtos.
                </p>
                <div className="text-xs text-gray-500">
                  Previsão: Q1 2025
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">WhatsApp Business</h3>
                    <p className="text-sm text-gray-600">Em desenvolvimento</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Automação de pedidos e comunicação via WhatsApp Business API.
                </p>
                <div className="text-xs text-gray-500">
                  Previsão: Q2 2025
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
