# FoodCost - Sistema de Gestão de Custos Alimentícios

Sistema completo para gestão de custos em estabelecimentos de alimentação, com autenticação multi-cliente e integração com Supabase.

## 🚀 Funcionalidades

### **🔐 Autenticação Multi-Cliente**
- Sistema de login/registro seguro
- Isolamento de dados por cliente
- Gestão de sessões

### **📊 Dashboard Inteligente**
- Visão geral de produtos, vendas e despesas
- Métricas em tempo real do mês atual
- Produtos e vendas recentes

### **🥬 Gestão de Insumos**
- Cadastro completo de ingredientes
- Controle de estoque e preços
- Categorização e fornecedores

### **🍕 Gestão de Produtos**
- Criação de fichas técnicas
- Sistema de ingredientes integrado
- Cálculo automático de custos
- Preços sugeridos baseados em margem

### **💰 Controle de Vendas**
- Registro de vendas diárias
- Filtro automático por mês atual
- Cálculo de ticket médio e total

### **📋 Gestão de Despesas**
- Despesas fixas e variáveis unificadas
- Cálculo automático de percentuais
- Integração com análise de produtos

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Supabase** para banco de dados e autenticação
- **Lucide React** para ícones

## 📦 Instalação

```bash
npm install
npm run dev
```

## 🗄️ Banco de Dados

Execute o script `database_setup.sql` no seu projeto Supabase para criar:
- Tabelas com RLS (Row Level Security)
- Índices otimizados
- Dados de exemplo

## 🎯 Como Usar

1. **Login**: Acesse com suas credenciais
2. **Insumos**: Cadastre ingredientes básicos
3. **Produtos**: Crie produtos com ingredientes
4. **Vendas**: Registre vendas diárias
5. **Despesas**: Controle gastos fixos e variáveis
6. **Dashboard**: Monitore performance

## 🔒 Segurança

- Autenticação via Supabase Auth
- RLS para isolamento de dados
- Validação de entrada
- Sessões seguras

---

**Sistema profissional para gestão eficiente de custos alimentícios.**

