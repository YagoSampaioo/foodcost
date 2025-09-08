# 🍔 FOODCOST - Sistema de Gestão de Custos para Restaurantes

## 📋 **VISÃO GERAL DO PROJETO**

**FoodCost** é um sistema completo de gestão de custos desenvolvido especificamente para restaurantes, com foco no controle de insumos, produtos, despesas e vendas. O sistema oferece uma solução multi-cliente robusta com autenticação segura e análise financeira avançada.

### **🎯 OBJETIVOS PRINCIPAIS:**

- **Gestão de Insumos:** Controle de matéria-prima e compras
- **Controle de Produtos:** Cálculo de custos e preços sugeridos
- **Gestão Financeira:** Despesas fixas, variáveis e análise de rentabilidade
- **Dashboard Financeiro:** Métricas avançadas (CMV, CMO, margens)
- **Sistema Multi-Cliente:** Arquitetura isolada por cliente
- **Interface Intuitiva:** UX otimizada para restaurantes

---

## 🛠️ **TECNOLOGIAS UTILIZADAS**

### **🔧 FRONTEND (CLIENT-SIDE)**

#### **Core Technologies:**

- **React 18.3.1** - Biblioteca JavaScript para interfaces
- **TypeScript 5.5.3** - Superset JavaScript com tipagem estática
- **Vite 5.4.2** - Build tool e dev server ultra-rápido

#### **Styling & UI:**

- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **PostCSS 8.4.35** - Processador CSS
- **Autoprefixer 10.4.18** - Prefixos CSS automáticos
- **Lucide React 0.344.0** - Biblioteca de ícones SVG

#### **Development Tools:**

- **ESLint 9.9.1** - Linter para qualidade de código
- **TypeScript ESLint 8.3.0** - Regras ESLint para TypeScript
- **React Hooks ESLint 5.1.0** - Regras para React Hooks

### **🚀 BACKEND & INFRAESTRUTURA**

#### **Database & Backend:**

- **Supabase** - Backend-as-a-Service (PostgreSQL)
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança por cliente
- **REST API** - Endpoints para operações CRUD

#### **Authentication:**

- **Custom Auth System** - Autenticação direta no banco
- **Password Hashing** - Senhas criptografadas
- **Session Management** - Gerenciamento de sessões

#### **Deployment:**

- **Vercel** - Plataforma de deploy e hosting
- **Environment Variables** - Configuração por ambiente
- **Build Optimization** - Otimizações para produção

### **📱 RESPONSIVIDADE & UX**

#### **Design System:**

- **Mobile-First** - Design responsivo para todos os dispositivos
- **Component-Based** - Arquitetura de componentes reutilizáveis
- **Accessibility** - Padrões de acessibilidade web
- **Performance** - Otimizações de carregamento

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **📁 ESTRUTURA DE DIRETÓRIOS**

```
src/
├── components/          # Componentes React reutilizáveis
├── services/           # Serviços de API e lógica de negócio
├── types/              # Definições TypeScript
├── config/             # Configurações do sistema
├── utils/              # Utilitários e helpers
├── App.tsx            # Componente principal da aplicação
├── main.tsx           # Ponto de entrada da aplicação
└── index.css          # Estilos globais
```

### **🔄 FLUXO DE DADOS**

```
User Interface (React)
    ↓
State Management (useState/useEffect)
    ↓
Service Layer (supabaseService)
    ↓
Supabase API (PostgreSQL)
    ↓
Row Level Security (RLS)
    ↓
Database Tables
```

### **🔐 SISTEMA DE AUTENTICAÇÃO**

#### **Multi-Tenant Architecture:**

- **Cliente ID:** Identificador único para cada restaurante
- **Row Level Security:** Dados isolados por cliente
- **Session Management:** Sessões persistentes via localStorage
- **Direct Database Auth:** Autenticação direta na tabela clients

---

## 📊 **BANCO DE DADOS**

### **🗄️ ESQUEMA COMPLETO**

#### **1. Tabela `clients`**

```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- name (VARCHAR)
- company_name (VARCHAR)
- phone (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- is_active (BOOLEAN)
```

#### **2. Tabela `raw_materials`**

```sql
- id (UUID, Primary Key)
- client_id (UUID, Foreign Key)
- code (VARCHAR, Unique per client)
- name (VARCHAR)
- category (VARCHAR)
- measurement_unit (VARCHAR)
- unit_price (DECIMAL)
- supplier (VARCHAR)
- minimum_stock (DECIMAL)
- current_stock (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **3. Tabela `products`**

```sql
- id (UUID, Primary Key)
- client_id (UUID, Foreign Key)
- name (VARCHAR)
- category (VARCHAR)
- description (TEXT)
- portion_yield (DECIMAL)
- portion_unit (VARCHAR)
- selling_price (DECIMAL)
- ingredients (JSONB)
- margin_percentage (DECIMAL)
- created_at (TIMESTAMP)
- last_modified (TIMESTAMP)
```

#### **4. Tabela `raw_material_purchases`**

```sql
- id (UUID, Primary Key)
- client_id (UUID, Foreign Key)
- raw_material_id (UUID, Foreign Key)
- quantity (DECIMAL)
- unit_price (DECIMAL)
- total_cost (DECIMAL)
- purchase_date (DATE)
- supplier (VARCHAR)
- payment_method (VARCHAR)
- receipt (VARCHAR)
- notes (TEXT)
- created_at (TIMESTAMP)
```

#### **5. Tabela `fixed_expenses`**

```sql
- id (UUID, Primary Key)
- client_id (UUID, Foreign Key)
- name (VARCHAR)
- category (VARCHAR)
- amount (DECIMAL)
- frequency (ENUM: mensal/trimestral/semestral/anual)
- due_date (INTEGER: 1-31)
- description (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **6. Tabela `variable_expenses`**

```sql
- id (UUID, Primary Key)
- client_id (UUID, Foreign Key)
- name (VARCHAR)
- category (VARCHAR)
- amount (DECIMAL)
- expense_date (DATE)
- payment_method (VARCHAR)
- receipt (VARCHAR)
- description (TEXT)
- created_at (TIMESTAMP)
```

#### **7. Tabela `sales`**

```sql
- id (UUID, Primary Key)
- client_id (UUID, Foreign Key)
- sale_date (DATE)
- total_sales (DECIMAL)
- number_of_orders (INTEGER)
- average_ticket (DECIMAL)
- notes (TEXT)
- created_at (TIMESTAMP)
```

### **🔒 SEGURANÇA E ISOLAMENTO**

#### **Row Level Security (RLS):**

- **Políticas por cliente:** `client_id = auth.uid()`
- **Isolamento total:** Dados nunca se misturam entre clientes
- **Operações seguras:** INSERT, UPDATE, DELETE, SELECT protegidos

---

## 🎨 **PÁGINAS E COMPONENTES**

### **🏠 PÁGINA PRINCIPAL (App.tsx)**

#### **Funcionalidades:**

- **Roteamento interno** entre páginas
- **Gerenciamento de estado global** para todos os dados
- **Autenticação e sessão** do usuário
- **Orquestração** de todos os componentes

#### **Integrações:**

- **Auth.tsx** - Sistema de login
- **Layout.tsx** - Navegação e estrutura
- **Todas as páginas** de funcionalidade

#### **Estado Global:**

```typescript
- rawMaterials: RawMaterial[]
- products: Product[]
- fixedExpenses: FixedExpense[]
- variableExpenses: VariableExpense[]
- rawMaterialPurchases: RawMaterialPurchase[]
- sales: Sale[]
- currentUser: Client | null
```

### **🔐 PÁGINA DE AUTENTICAÇÃO (Auth.tsx)**

#### **Funcionalidades:**

- **Login de usuários** com email e senha
- **Validação de credenciais** contra tabela clients
- **Redirecionamento automático** após autenticação
- **Interface de acesso restrito** (sem registro)

#### **Integrações:**

- **authService.ts** - Lógica de autenticação
- **App.tsx** - Gerenciamento de sessão
- **Supabase** - Validação de credenciais

#### **Fluxo de Autenticação:**

```
1. Usuário insere credenciais
2. Validação contra tabela clients
3. Criação de sessão local
4. Redirecionamento para Dashboard
5. Carregamento de dados do cliente
```

### **📊 DASHBOARD FINANCEIRO (Dashboard.tsx)**

#### **Funcionalidades:**

- **Métricas financeiras avançadas:**
  - **CMV (Custo das Mercadorias Vendidas)**
  - **CMO (Custo Mão de Obra)**
  - **Margem Bruta e Operacional**
  - **Ponto de Equilíbrio**
  - **Análise de rentabilidade**

#### **Cálculos Implementados:**

```typescript
// CMV - Custo das Mercadorias Vendidas
const cmv = totalIngredientsCost + totalExpenses;

// Margem Bruta
const grossMargin = ((revenue - cmv) / revenue) * 100;

// Ponto de Equilíbrio
const breakEvenPoint = totalFixedExpenses / (1 - cmv / revenue);
```

#### **Integrações:**

- **Dados de produtos** - Para cálculo de custos
- **Dados de vendas** - Para receita mensal
- **Dados de despesas** - Para custos operacionais
- **Dados de insumos** - Para custos de matéria-prima

#### **Visualizações:**

- **Cards de métricas** com valores e percentuais
- **Gráficos de tendência** (se implementados)
- **Análise comparativa** mês a mês
- **Indicadores de performance** (KPIs)

### **🛒 GESTÃO DE PRODUTOS (ProductForm.tsx)**

#### **Funcionalidades:**

- **Cadastro de produtos** com nome e categoria
- **Gestão de ingredientes** (insumos utilizados)
- **Cálculo automático** de custos e preços
- **Preço sugerido** baseado em custos + margem
- **Análise de rentabilidade** por produto

#### **Cálculos Automáticos:**

```typescript
// Custo dos Insumos
const ingredientsCost = ingredients.reduce((sum, ing) => sum + ing.quantity * ing.unitPrice, 0);

// Preço Sugerido (Break-even + Margem)
const suggestedPrice = (ingredientsCost / (1 - expensePercentage)) * (1 + margin_percentage);

// Lucro/Prejuízo
const profit = selling_price - suggestedPrice;
```

#### **Integrações:**

- **RawMaterialsForm** - Seleção de ingredientes
- **Dashboard** - Dados para métricas financeiras
- **ExpensesForm** - Percentuais de despesas
- **SalesForm** - Faturamento mensal

#### **UX Melhorada:**

- **Campo de preço sugerido** com ícone de cadeado
- **Explicação detalhada** dos cálculos
- **Recomendações de margem** (25% a 35%)
- **Validação em tempo real** dos campos

### **💰 GESTÃO DE DESPESAS (ExpensesForm.tsx)**

#### **Funcionalidades:**

- **Três abas principais:**
  1. **Despesas Fixas** - Gastos recorrentes
  2. **Despesas Variáveis** - Gastos pontuais
  3. **Compras de Insumos** - Aquisição de matéria-prima

#### **Aba: Despesas Fixas**

- **Cadastro de despesas** com frequência (mensal, trimestral, etc.)
- **Dia de vencimento** configurável
- **Status ativo/inativo**
- **Cálculo de custo anual** automático

#### **Aba: Despesas Variáveis**

- **Registro de gastos** pontuais
- **Data específica** da despesa
- **Forma de pagamento** e recibo
- **Categorização** por tipo

#### **Aba: Compras de Insumos**

- **Registro de compras** de matéria-prima
- **Seleção de insumo** existente
- **Quantidade e preço** unitário
- **Fornecedor e forma** de pagamento
- **Modal para novo insumo** (criação rápida)

#### **Integrações:**

- **RawMaterialsForm** - Lista de insumos disponíveis
- **ProductForm** - Percentuais para cálculos
- **Dashboard** - Dados para métricas financeiras
- **App.tsx** - Estado global de despesas

#### **UX Otimizada:**

- **Formulário posicionado** acima da tabela
- **Botões organizados** logicamente
- **Cores diferenciadas** por tipo de ação
- **Layout responsivo** para todos os dispositivos

### **📦 GESTÃO DE INSUMOS (RawMaterialsForm.tsx)**

#### **Funcionalidades:**

- **Visualização exclusiva** de compras de insumos
- **Histórico completo** de todas as compras
- **Ordenação por data** (mais recentes primeiro)
- **Detalhes completos** de cada compra

#### **Dados Exibidos:**

- **Nome do insumo** comprado
- **Quantidade e preço** unitário
- **Custo total** da compra
- **Data da compra** e fornecedor
- **Forma de pagamento** utilizada

#### **Integrações:**

- **ExpensesForm** - Dados de compras registradas
- **ProductForm** - Lista de insumos disponíveis
- **App.tsx** - Estado global de compras

#### **Características:**

- **Modo somente visualização** (sem edição)
- **Tabela responsiva** com scroll horizontal
- **Ordenação automática** por data
- **Interface limpa** e focada

### **📈 GESTÃO DE VENDAS (SalesForm.tsx)**

#### **Funcionalidades:**

- **Registro de vendas diárias** com total e número de pedidos
- **Cálculo automático** de ticket médio
- **Filtro por mês** para análise temporal
- **Resumo financeiro** mensal

#### **Dados Capturados:**

```typescript
- saleDate: Date          // Data da venda
- totalSales: number      // Total vendido no dia
- numberOfOrders: number  // Número de pedidos
- averageTicket: number   // Ticket médio (calculado)
- notes: string          // Observações opcionais
```

#### **Cálculos Automáticos:**

```typescript
// Ticket Médio
const averageTicket = totalSales / numberOfOrders;

// Faturamento Mensal
const monthlyRevenue = sales
  .filter((sale) => isCurrentMonth(sale.saleDate))
  .reduce((sum, sale) => sum + sale.totalSales, 0);
```

#### **Integrações:**

- **ProductForm** - Faturamento para cálculos de preço
- **Dashboard** - Dados para métricas de receita
- **ExpensesForm** - Percentuais baseados em vendas
- **App.tsx** - Estado global de vendas

#### **Filtros e Visualizações:**

- **Filtro por mês atual** por padrão
- **Tabela de vendas** com detalhes completos
- **Resumo financeiro** com totais e médias
- **Exportação de dados** (se implementado)

### **🎨 LAYOUT E NAVEGAÇÃO (Layout.tsx)**

#### **Funcionalidades:**

- **Menu de navegação** entre todas as páginas
- **Header com informações** do usuário logado
- **Logo e branding** da aplicação
- **Responsividade** para mobile

#### **Estrutura de Navegação:**

```
🏠 Dashboard      📊 Produtos      💰 Despesas
📦 Insumos       📈 Vendas        ⚙️ Configurações
```

#### **Integrações:**

- **Todas as páginas** de funcionalidade
- **App.tsx** - Estado do usuário logado
- **Auth.tsx** - Sistema de logout

---

## 🔌 **SERVIÇOS E INTEGRAÇÕES**

### **🌐 SUPABASE SERVICE (supabaseService.ts)**

#### **Funcionalidades:**

- **CRUD completo** para todas as entidades
- **Operações em lote** para melhor performance
- **Tratamento de erros** robusto
- **Validação de dados** antes do envio

#### **Métodos Implementados:**

```typescript
// Clientes
-getClients() -
  createClient() -
  updateClient() -
  deleteClient() -
  // Insumos
  getRawMaterials() -
  createRawMaterial() -
  updateRawMaterial() -
  deleteRawMaterial() -
  // Produtos
  getProducts() -
  createProduct() -
  updateProduct() -
  deleteProduct() -
  // Despesas
  getFixedExpenses() -
  createFixedExpense() -
  updateFixedExpense() -
  deleteFixedExpense() -
  // Compras
  getRawMaterialPurchases() -
  createRawMaterialPurchase() -
  updateRawMaterialPurchase() -
  deleteRawMaterialPurchase() -
  // Vendas
  getSales() -
  createSale() -
  updateSale() -
  deleteSale();
```

#### **Integrações:**

- **Todas as páginas** que precisam de dados
- **App.tsx** - Estado global sincronizado
- **Supabase** - Banco de dados PostgreSQL

### **🔐 AUTH SERVICE (authService.ts)**

#### **Funcionalidades:**

- **Autenticação direta** na tabela clients
- **Gerenciamento de sessão** local
- **Logout e limpeza** de dados
- **Validação de usuário** ativo

#### **Fluxo de Autenticação:**

```typescript
1. Usuário insere credenciais
2. Query direta na tabela clients
3. Validação de password_hash
4. Criação de sessão local
5. Redirecionamento para Dashboard
```

#### **Integrações:**

- **Auth.tsx** - Interface de login
- **App.tsx** - Estado de autenticação
- **Layout.tsx** - Informações do usuário
- **Supabase** - Validação de credenciais

---

## 🚀 **DEPLOY E CONFIGURAÇÃO**

### **📦 BUILD E PRODUÇÃO**

#### **Scripts Disponíveis:**

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run build:prod   # Build otimizado para produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos TypeScript
```

#### **Configuração Vite:**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      manualChunks: {
        vendor: ["react", "react-dom"],
        supabase: ["@supabase/supabase-js"],
      },
    },
  },
});
```

### **🌍 DEPLOY NO VERCEL**

#### **Configuração:**

```json
// vercel.json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### **Variáveis de Ambiente:**

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### **🔧 CONFIGURAÇÃO LOCAL**

#### **Arquivo .env.local:**

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

#### **Configuração TypeScript:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 📱 **RESPONSIVIDADE E UX**

### **🎨 DESIGN SYSTEM**

#### **Cores Principais:**

- **Laranja (#f97316):** Ações principais, destaque
- **Azul (#2563eb):** Ações secundárias, links
- **Verde (#16a34a):** Sucesso, confirmação
- **Vermelho (#dc2626):** Erro, exclusão
- **Cinza (#6b7280):** Texto secundário, bordas

#### **Componentes Base:**

- **Botões:** Estilos consistentes com hover states
- **Inputs:** Bordas, focus rings e validação visual
- **Tabelas:** Responsivas com scroll horizontal
- **Cards:** Sombras e bordas arredondadas
- **Modais:** Overlay com backdrop

### **📱 RESPONSIVIDADE**

#### **Breakpoints:**

```css
/* Mobile First */
sm: 640px   /* Tablets pequenos */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops pequenos */
xl: 1280px  /* Desktops */
2xl: 1536px /* Desktops grandes */
```

#### **Grid System:**

```tsx
// Layout responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{/* Conteúdo se adapta automaticamente */}</div>
```

---

## 🔒 **SEGURANÇA**

### **🛡️ AUTENTICAÇÃO E AUTORIZAÇÃO**

#### **Sistema de Login:**

- **Validação direta** na tabela clients
- **Password hashing** para segurança
- **Sessões persistentes** via localStorage
- **Logout automático** em caso de erro

#### **Row Level Security (RLS):**

```sql
-- Exemplo de política RLS
CREATE POLICY "Users can only access their own data" ON raw_materials
FOR ALL USING (client_id = auth.uid());
```

### **🔐 PROTEÇÃO DE DADOS**

#### **Isolamento por Cliente:**

- **client_id** em todas as tabelas
- **Políticas RLS** para isolamento total
- **Validação no frontend** antes do envio
- **Sanitização** de inputs

---

## 📊 **MÉTRICAS E PERFORMANCE**

### **⚡ OTIMIZAÇÕES**

#### **Code Splitting:**

- **Chunks separados** para vendor e supabase
- **Lazy loading** de componentes pesados
- **Tree shaking** para remover código não utilizado

#### **Build Optimization:**

- **Minificação** de CSS e JavaScript
- **Compressão Gzip** para transferência
- **Source maps** para debugging
- **Cache busting** automático

### **📈 MONITORAMENTO**

#### **Métricas de Performance:**

- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Time to Interactive (TTI)**
- **Cumulative Layout Shift (CLS)**

---

## 🧪 **TESTES E QUALIDADE**

### **🔍 QUALIDADE DE CÓDIGO**

#### **ESLint:**

- **Regras React** para hooks e refresh
- **Regras TypeScript** para tipagem
- **Padrões de código** consistentes
- **Prevenção de bugs** comuns

#### **TypeScript:**

- **Tipagem estática** para todos os dados
- **Interfaces bem definidas** para entidades
- **Validação de tipos** em tempo de compilação
- **IntelliSense** completo no desenvolvimento

---

## 🚀 **ROADMAP E MELHORIAS FUTURAS**

### **🔄 PRÓXIMAS VERSÕES**

#### **v1.1 - Relatórios Avançados:**

- **Exportação PDF** de relatórios
- **Gráficos interativos** com Chart.js
- **Comparativo mensal** de métricas
- **Alertas de estoque** baixo

#### **v1.2 - Integrações:**

- **API para terceiros** (Ifood, iFood, etc.)
- **Webhook** para notificações
- **Sincronização** com sistemas externos
- **Backup automático** de dados

#### **v1.3 - Mobile App:**

- **PWA (Progressive Web App)**
- **Notificações push** para alertas
- **Offline mode** para uso sem internet
- **Sincronização** automática

### **💡 IDEIAS PARA MELHORIAS**

#### **Funcionalidades:**

- **Gestão de funcionários** e folha de pagamento
- **Controle de estoque** com alertas
- **Sistema de fidelidade** para clientes
- **Integração com** sistemas de pagamento

#### **UX/UI:**

- **Tema escuro** opcional
- **Customização** de cores por cliente
- **Dashboard personalizável** com widgets
- **Tutorial interativo** para novos usuários

---

## 📚 **RECURSOS E REFERÊNCIAS**

### **🔗 DOCUMENTAÇÃO OFICIAL**

- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/
- **Vite:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **Supabase:** https://supabase.com/
- **Vercel:** https://vercel.com/

### **📖 ARTIGOS E TUTORIAIS**

- **Multi-tenant Architecture:** https://supabase.com/docs/guides/auth/row-level-security
- **React Performance:** https://react.dev/learn/render-and-commit
- **TypeScript Best Practices:** https://www.typescriptlang.org/docs/
- **Tailwind CSS Components:** https://tailwindui.com/

---

## 🤝 **CONTRIBUIÇÃO E SUPORTE**

### **🐛 REPORTAR BUGS**

Para reportar bugs ou solicitar funcionalidades:

1. **Verifique** se o problema já foi reportado
2. **Descreva** o problema detalhadamente
3. **Inclua** passos para reproduzir
4. **Anexe** screenshots se relevante

### **💻 DESENVOLVIMENTO**

Para contribuir com o projeto:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** as mudanças
4. **Teste** localmente
5. **Envie** um Pull Request

### **📧 CONTATO**

- **Email:** suporte@foodcost.com
- **Documentação:** https://docs.foodcost.com
- **Comunidade:** https://community.foodcost.com

---

## 📄 **LICENÇA**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🎉 **AGRADECIMENTOS**

- **Equipe de desenvolvimento** FoodCost
- **Comunidade React** e TypeScript
- **Supabase** pela infraestrutura robusta
- **Vercel** pela plataforma de deploy
- **Todos os usuários** que testaram e reportaram bugs

---

**🚀 FoodCost - Transformando a gestão de restaurantes através da tecnologia!** ✨

_Última atualização: Janeiro 2025_
_Versão: 1.0.0_
_Status: Produção_
