# 🚀 Guia de Deploy na Vercel

## 📋 Checklist de Deploy

### ✅ **1. Preparação do Projeto**
- [ ] Projeto compila sem erros (`npm run build`)
- [ ] Todas as dependências estão instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Arquivo `vercel.json` criado
- [ ] README.md atualizado

### ✅ **2. Configuração da Vercel**

#### **2.1 Criar Conta**
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub/GitLab/Bitbucket
3. Aceite os termos de uso

#### **2.2 Conectar Repositório**
1. Clique em "New Project"
2. Selecione seu repositório
3. Configure as permissões necessárias

#### **2.3 Configurar Build**
- **Framework Preset**: Vite
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### ✅ **3. Variáveis de Ambiente**

No dashboard da Vercel, adicione:

```env
VITE_SUPABASE_URL=https://toyegzbckmtrvnfxbign.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_real_aqui
```

**⚠️ IMPORTANTE**: Substitua `sua_chave_real_aqui` pela chave real do seu Supabase!

### ✅ **4. Deploy**

#### **4.1 Deploy Automático (Recomendado)**
1. Faça push para a branch `main`
2. A Vercel fará deploy automático
3. Monitore os logs de build

#### **4.2 Deploy Manual**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### ✅ **5. Verificação Pós-Deploy**

- [ ] Aplicação carrega sem erros
- [ ] Login funciona corretamente
- [ ] Dashboard carrega os dados
- [ ] Todas as funcionalidades operam
- [ ] Responsividade em dispositivos móveis

## 🔧 **Configurações Avançadas**

### **Domínio Customizado**
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções

### **Analytics (Opcional)**
1. Vá em "Settings" > "Analytics"
2. Ative o Vercel Analytics
3. Configure eventos personalizados

### **Performance Monitoring**
1. Vá em "Settings" > "Monitoring"
2. Ative Core Web Vitals
3. Configure alertas

## 🚨 **Solução de Problemas**

### **Build Falha**
```bash
# Verificar logs
vercel logs

# Testar build local
npm run build

# Verificar dependências
npm ci
```

### **Erro de Variáveis de Ambiente**
- Verifique se as variáveis estão configuradas
- Confirme se os nomes estão corretos
- Reinicie o deploy após alterações

### **Erro de CORS**
- Verifique configurações do Supabase
- Confirme se o domínio está na whitelist
- Teste com diferentes navegadores

### **Performance Lenta**
- Verifique tamanho do bundle
- Otimize imagens e assets
- Use lazy loading para componentes

## 📱 **Testes de Qualidade**

### **Funcionalidades**
- [ ] Login/Logout
- [ ] Dashboard carrega
- [ ] CRUD de produtos
- [ ] CRUD de insumos
- [ ] CRUD de despesas
- [ ] CRUD de vendas
- [ ] Cálculos financeiros

### **Responsividade**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile Landscape (667x375)

### **Navegadores**
- [ ] Chrome (última versão)
- [ ] Firefox (última versão)
- [ ] Safari (última versão)
- [ ] Edge (última versão)

## 🔄 **Deploy Contínuo**

### **Branches**
- `main` → Deploy automático em produção
- `develop` → Deploy preview para testes
- `feature/*` → Deploy preview para features

### **Pull Requests**
- Cada PR gera um deploy preview
- Teste antes de fazer merge
- Use para validação de mudanças

## 📊 **Monitoramento**

### **Métricas Importantes**
- **Build Time**: < 2 minutos
- **Bundle Size**: < 500KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s

### **Alertas Recomendados**
- Build failures
- Performance degradation
- Error rate > 1%
- Response time > 2s

## 🎯 **Próximos Passos**

### **Otimizações**
- [ ] Implementar PWA
- [ ] Adicionar service worker
- [ ] Otimizar imagens
- [ ] Implementar cache

### **Funcionalidades**
- [ ] Backup automático
- [ ] Relatórios avançados
- [ ] Integração com APIs
- [ ] Multi-idioma

---

**🎉 Parabéns! Seu projeto está no ar na Vercel!**
