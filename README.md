# 🍔 FoodCost - JM Hot Dog Prensado

Sistema completo de gestão financeira para restaurantes, desenvolvido especificamente para o JM Hot Dog Prensado.

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Projeto no [Supabase](https://supabase.com)
- Node.js 18+ e npm 8+

### Passos para Deploy

#### 1. Preparar o Projeto
```bash
# Clonar o repositório
git clone <seu-repositorio>
cd foodcost-jm-hotdog

# Instalar dependências
npm install

# Testar build local
npm run build
```

#### 2. Configurar Variáveis de Ambiente na Vercel

No dashboard da Vercel, adicione as seguintes variáveis de ambiente:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

#### 3. Deploy Automático

1. Conecte seu repositório GitHub/GitLab na Vercel
2. A Vercel detectará automaticamente que é um projeto Vite
3. Configure o build command: `npm run vercel-build`
4. Configure o output directory: `dist`
5. Deploy!

#### 4. Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

### 📁 Estrutura do Projeto

```
foodcost-jm-hotdog/
├── src/
│   ├── components/          # Componentes React
│   ├── services/            # Serviços (Supabase)
│   ├── types/               # Tipos TypeScript
│   └── App.tsx             # App principal
├── vercel.json             # Configuração Vercel
├── vite.config.ts          # Configuração Vite
└── package.json            # Dependências
```

### 🔧 Configurações Importantes

#### Vercel (vercel.json)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: `vite`
- **SPA Routing**: Configurado para React Router

#### Vite (vite.config.ts)
- **Build Optimization**: Chunks separados para vendor e Supabase
- **Source Maps**: Desabilitados em produção
- **Output**: Otimizado para CDN

### 🌐 URLs de Produção

Após o deploy, sua aplicação estará disponível em:
- **URL Principal**: `https://seu-projeto.vercel.app`
- **Domínio Customizado**: Se configurado

### 📊 Funcionalidades

- ✅ **Dashboard Financeiro** - Métricas completas (CMV, CMO, margens)
- ✅ **Gestão de Produtos** - Cadastro e análise de rentabilidade
- ✅ **Controle de Insumos** - Estoque e compras
- ✅ **Gestão de Despesas** - Fixas e variáveis
- ✅ **Controle de Vendas** - Histórico e análises
- ✅ **Multi-cliente** - Arquitetura preparada para expansão

### 🔒 Segurança

- **Row Level Security (RLS)** no Supabase
- **Autenticação** por cliente
- **Isolamento** de dados por empresa
- **HTTPS** obrigatório em produção

### 📱 Responsividade

- **Mobile First** design
- **Tailwind CSS** para estilização
- **Componentes** adaptáveis
- **PWA Ready** (configurável)

### 🚀 Performance

- **Code Splitting** automático
- **Lazy Loading** de componentes
- **Bundle Optimization** para produção
- **CDN** global da Vercel

### 📈 Monitoramento

- **Vercel Analytics** (opcional)
- **Error Tracking** automático
- **Performance Metrics** em tempo real
- **Deploy Previews** para cada PR

### 🔄 CI/CD

A Vercel oferece:
- **Deploy automático** a cada push
- **Preview deployments** para branches
- **Rollback** instantâneo
- **A/B Testing** (Enterprise)

### 💡 Dicas de Deploy

1. **Teste localmente** antes do deploy
2. **Configure variáveis** de ambiente corretamente
3. **Monitore** os logs de build
4. **Use preview deployments** para testes
5. **Configure domínio** customizado se necessário

### 🆘 Suporte

- **Issues**: GitHub Issues
- **Documentação**: Este README
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para o JM Hot Dog Prensado**

