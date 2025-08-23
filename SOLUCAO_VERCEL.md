# 🚨 SOLUÇÃO PARA ERRO DE VARIÁVEIS DE AMBIENTE NA VERCEL

## ❌ **ERRO ATUAL:**
```
Uncaught Error: supabaseUrl is required.
```

## 🔧 **SOLUÇÃO:**

### **1. Configurar Variáveis de Ambiente na Vercel**

#### **1.1 Acessar o Dashboard**
1. Vá para [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Selecione o projeto `foodcost-ten`

#### **1.2 Adicionar Variáveis de Ambiente**
1. Clique em **"Settings"**
2. Selecione **"Environment Variables"**
3. Clique em **"Add New"**

#### **1.3 Configurar as Variáveis**

**Primeira Variável:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://toyegzbckmtrvnfxbign.supabase.co`
- **Environment**: `Production` ✅
- **Environment**: `Preview` ✅
- **Environment**: `Development` ✅

**Segunda Variável:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `sua_chave_real_aqui` (substitua pela chave real)
- **Environment**: `Production` ✅
- **Environment**: `Preview` ✅
- **Environment**: `Development` ✅

### **2. Obter a Chave Real do Supabase**

#### **2.1 Acessar o Supabase**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto `toyegzbckmtrvnfxbign`

#### **2.2 Copiar a Chave Anônima**
1. Clique em **"Settings"** (ícone de engrenagem)
2. Selecione **"API"**
3. Copie a **"anon public"** key
4. Cole no valor da variável `VITE_SUPABASE_ANON_KEY`

### **3. Re-deploy Após Configuração**

#### **3.1 Deploy Automático**
1. Faça um pequeno commit e push
2. A Vercel fará deploy automático
3. As variáveis estarão disponíveis

#### **3.2 Deploy Manual**
```bash
# Se estiver usando Vercel CLI
vercel --prod
```

### **4. Verificar se Funcionou**

#### **4.1 Console do Navegador**
Abra o console (F12) e verifique se aparecem:
```
✅ Configuração de ambiente válida
🌐 Supabase URL: https://toyegzbckmtrvnfxbign.supabase.co
🔑 Supabase Key: Configurada
🏗️ Ambiente: production
```

#### **4.2 Testar Login**
1. Tente fazer login com as credenciais do JM Hot Dog
2. Verifique se não há mais erros no console
3. Confirme se o dashboard carrega

## 🚨 **PROBLEMAS COMUNS:**

### **Problema 1: Variáveis não aparecem**
- **Solução**: Aguarde alguns minutos após salvar
- **Verificação**: Reinicie o deploy

### **Problema 2: Chave incorreta**
- **Solução**: Verifique se copiou a chave completa
- **Verificação**: Compare com o Supabase

### **Problema 3: Cache do navegador**
- **Solução**: Ctrl+F5 ou limpe o cache
- **Verificação**: Teste em aba anônima

### **Problema 4: Deploy não atualiza**
- **Solução**: Force um novo deploy
- **Verificação**: Verifique os logs da Vercel

## 📋 **CHECKLIST DE VERIFICAÇÃO:**

- [ ] Variáveis configuradas na Vercel
- [ ] Valores corretos (URL e chave)
- [ ] Todas as environments marcadas
- [ ] Deploy realizado após configuração
- [ ] Console mostra mensagens de sucesso
- [ ] Login funciona sem erros
- [ ] Dashboard carrega corretamente

## 🔍 **LOGS ÚTEIS:**

### **Console do Navegador (Sucesso):**
```
✅ Configuração de ambiente válida
🌐 Supabase URL: https://toyegzbckmtrvnfxbign.supabase.co
🔑 Supabase Key: Configurada
🏗️ Ambiente: production
```

### **Console do Navegador (Erro):**
```
❌ Erros de configuração: ['VITE_SUPABASE_URL não está configurada']
```

## 📞 **SUPORTE:**

Se o problema persistir:
1. Verifique os logs da Vercel
2. Confirme as variáveis de ambiente
3. Teste com um novo deploy
4. Verifique se o Supabase está acessível

---

**🎯 Lembre-se: As variáveis de ambiente devem ser configuradas no dashboard da Vercel, não no código!**
