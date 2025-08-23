# 🔑 COMO OBTER A CHAVE REAL DO SUPABASE

## 🚨 **PROBLEMA ATUAL:**
```
Error: Invalid API key
```

## 🔧 **SOLUÇÃO: OBTER A CHAVE REAL**

### **1. Acessar o Supabase**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **`toyegzbckmtrvnfxbign`**

### **2. Navegar para as Configurações**
1. No dashboard do projeto, clique no ícone **⚙️ Settings** (canto inferior esquerdo)
2. No menu lateral, clique em **"API"**

### **3. Copiar a Chave Anônima**
1. Na seção **"Project API keys"**
2. Encontre a chave **"anon public"**
3. Clique no ícone **👁️** para revelar a chave
4. Clique no ícone **📋** para copiar

### **4. Substituir no Código**

**Arquivo:** `src/config/env.ts`

**Linha 7:** Substitua `SUBSTITUA_PELA_SUA_CHAVE_REAL` pela chave copiada:

```typescript
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVnemJja210cnZuZnhiaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.SUA_CHAVE_REAL_AQUI',
```

### **5. Exemplo Visual**

**❌ ANTES (Inválida):**
```typescript
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVnemJja210cnZuZnhiaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.SUBSTITUA_PELA_SUA_CHAVE_REAL',
```

**✅ DEPOIS (Válida):**
```typescript
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVnemJja210cnZuZnhiaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
```

### **6. Testar Localmente**

```bash
npm run dev
```

1. Abra `http://localhost:5173/`
2. Tente fazer login com:
   - **Email:** `jmhotdog@assessorialpha.com`
   - **Senha:** `sanguenoolhojm`

### **7. Deploy na Vercel**

```bash
git add .
git commit -m "Atualizada chave real do Supabase"
git push origin main
```

## 🔍 **COMO IDENTIFICAR A CHAVE CORRETA**

### **Características da Chave Válida:**
- Começa com: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- Contém o projeto: `toyegzbckmtrvnfxbign`
- Termina com uma assinatura única
- Tem aproximadamente 200+ caracteres

### **Exemplo de Estrutura:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVnemJja210cnZuZnhiaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.[ASSINATURA_ÚNICA]
```

## 🚨 **PROBLEMAS COMUNS**

### **1. Chave não aparece**
- Verifique se está no projeto correto
- Confirme se tem permissões de administrador

### **2. Chave copiada incorretamente**
- Certifique-se de copiar a chave completa
- Não inclua espaços extras no início/fim

### **3. Projeto não encontrado**
- Confirme o nome do projeto: `toyegzbckmtrvnfxbign`
- Verifique se está logado na conta correta

## ✅ **VERIFICAÇÃO DE SUCESSO**

### **Console deve mostrar:**
```
✅ Configuração carregada com valores diretos
🌐 Supabase URL: https://toyegzbckmtrvnfxbign.supabase.co
🔑 Supabase Key: Configurada
🏗️ Ambiente: development
```

### **Login deve funcionar:**
- Sem erros 401 (Unauthorized)
- Dashboard carrega corretamente
- Dados aparecem nas tabelas

---

**🎯 IMPORTANTE: A chave anônima é segura para uso público, mas sempre mantenha a service_role key em segredo!**
