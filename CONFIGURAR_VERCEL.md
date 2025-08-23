# 🔧 CONFIGURAR VARIÁVEIS DE AMBIENTE NA VERCEL

## 🎯 **OBJETIVO:**
Configurar as variáveis de ambiente necessárias para o Supabase funcionar na Vercel.

## 📋 **VARIÁVEIS NECESSÁRIAS:**

### **1. VITE_SUPABASE_URL**
```
Valor: https://toyegzbckmtrvnfxbign.supabase.co
```

### **2. VITE_SUPABASE_ANON_KEY**
```
Valor: [SUA_CHAVE_ANON_REAL_DO_SUPABASE]
```

## 🚀 **COMO CONFIGURAR NA VERCEL:**

### **Passo 1: Acessar o Dashboard da Vercel**
1. Vá para [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Selecione o projeto **`foodcost-jm-hotdog`**

### **Passo 2: Navegar para Settings**
1. No dashboard do projeto, clique em **"Settings"**
2. No menu lateral, clique em **"Environment Variables"**

### **Passo 3: Adicionar as Variáveis**

#### **Variável 1: VITE_SUPABASE_URL**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://toyegzbckmtrvnfxbign.supabase.co`
- **Environment:** `Production`, `Preview`, `Development`
- Clique em **"Add"**

#### **Variável 2: VITE_SUPABASE_ANON_KEY**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `[SUA_CHAVE_REAL_AQUI]`
- **Environment:** `Production`, `Preview`, `Development`
- Clique em **"Add"**

### **Passo 4: Obter a Chave Real do Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **`toyegzbckmtrvnfxbign`**
4. Vá em **Settings** → **API**
5. Copie a chave **"anon public"**
6. Cole no campo **Value** da variável `VITE_SUPABASE_ANON_KEY`

### **Passo 5: Fazer Deploy**
1. Volte para o dashboard da Vercel
2. Clique em **"Deployments"**
3. Clique em **"Redeploy"** no último deployment
4. Aguarde o deploy concluir

## 🔍 **VERIFICAÇÃO:**

### **Console deve mostrar:**
```
✅ Configuração carregada com sucesso
🌐 Supabase URL: https://toyegzbckmtrvnfxbign.supabase.co
🔑 Supabase Key: Configurada
🏗️ Ambiente: production
```

### **Login deve funcionar:**
- Email: `jmhotdog@assessorialpha.com`
- Senha: `sanguenoolhojm`
- Sem erros 401 (Unauthorized)

## 📁 **ARQUIVOS CONFIGURADOS:**

### **1. `src/config/env.ts`**
- ✅ Usa variáveis de ambiente
- ✅ Validação em produção
- ✅ Logs de debug

### **2. `vercel.json`**
- ✅ Referências às variáveis
- ✅ Build otimizado
- ✅ Headers de cache

### **3. `.env.local` (Desenvolvimento)**
- ✅ Variáveis locais
- ✅ Não commitado no git

## 🚨 **PROBLEMAS COMUNS:**

### **1. Variável não encontrada**
- Verifique se o nome está exato: `VITE_SUPABASE_URL`
- Confirme se está marcada para `Production`

### **2. Chave inválida**
- Copie a chave completa do Supabase
- Não inclua espaços extras

### **3. Deploy não atualiza**
- Force um redeploy na Vercel
- Verifique se as variáveis foram salvas

## ✅ **CHECKLIST FINAL:**

- [ ] ✅ `VITE_SUPABASE_URL` configurada
- [ ] ✅ `VITE_SUPABASE_ANON_KEY` configurada
- [ ] ✅ Todas marcadas para Production
- [ ] ✅ Redeploy realizado
- [ ] ✅ Console mostra sucesso
- [ ] ✅ Login funciona

## 🎉 **RESULTADO ESPERADO:**

Após configurar as variáveis de ambiente na Vercel:
- A aplicação funcionará em produção
- O Supabase será acessível
- O login funcionará corretamente
- Todos os dados serão carregados

---

**🚀 Configure as variáveis na Vercel e faça o deploy para funcionar!**
