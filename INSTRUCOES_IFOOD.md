# 🔧 Solução para Integração iFood - Problema de CORS

## 🚨 **Problema Identificado**

Você está enfrentando um erro de **CORS (Cross-Origin Resource Sharing)** ao tentar integrar com a API do iFood:

```
Access to fetch at 'https://merchant-api.ifood.com.br/oauth/token' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## 🎯 **Por que isso acontece?**

- **CORS Policy**: Navegadores bloqueiam requisições diretas para APIs externas por segurança
- **Origem localhost**: Desenvolvimento local não tem permissões para APIs externas
- **API iFood**: Não permite requisições diretas de navegadores

## 🛠️ **Solução Implementada: Servidor Proxy**

Criei um servidor proxy Node.js que resolve o problema de CORS:

### **📁 Estrutura Criada:**

```
server/
├── proxy.js          # Servidor proxy principal
├── package.json      # Dependências do servidor
├── start.bat         # Script de inicialização (Windows)
├── start.sh          # Script de inicialização (Linux/Mac)
└── README.md         # Documentação completa
```

## 🚀 **Como Usar (Passo a Passo)**

### **1. Instalar Dependências**

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install
```

### **2. Iniciar o Servidor Proxy**

#### **Windows:**

```bash
# Duplo clique no arquivo start.bat
# OU execute no terminal:
start.bat
```

#### **Linux/Mac:**

```bash
# Dar permissão de execução
chmod +x start.sh

# Executar
./start.sh
```

#### **Manual:**

```bash
npm start
# ou
npm run dev  # para desenvolvimento com auto-reload
```

### **3. Verificar se está Funcionando**

```bash
# Teste básico
curl http://localhost:3001/api/test

# Deve retornar:
# {"message":"Proxy iFood funcionando!","timestamp":"..."}
```

### **4. Testar a Integração**

Agora você pode testar a integração com iFood na aplicação React. O proxy irá:

- ✅ Resolver problemas de CORS
- ✅ Fazer requisições para a API iFood
- ✅ Retornar respostas para o frontend
- ✅ Logar todas as operações

## 🔧 **Como Funciona**

### **Antes (Com CORS):**

```
Frontend (localhost:5173) ❌→ API iFood
```

### **Depois (Com Proxy):**

```
Frontend (localhost:5173) ✅→ Proxy (localhost:3001) ✅→ API iFood
```

### **Fluxo de Autenticação:**

1. Frontend envia credenciais para `/api/ifood/auth`
2. Proxy faz requisição OAuth2 para iFood
3. Proxy retorna token para frontend
4. Frontend usa token para outras requisições

### **Fluxo de Vendas:**

1. Frontend envia token para `/api/ifood/sales/:merchantId`
2. Proxy faz requisição autenticada para iFood
3. Proxy retorna dados de vendas para frontend

## 📡 **Endpoints do Proxy**

| Endpoint                       | Método | Descrição              |
| ------------------------------ | ------ | ---------------------- |
| `/api/test`                    | GET    | Teste de funcionamento |
| `/api/ifood/auth`              | POST   | Autenticação OAuth2    |
| `/api/ifood/sales/:merchantId` | GET    | Buscar vendas          |
| `/api/ifood/check`             | GET    | Verificar conexão      |

## 🐛 **Troubleshooting**

### **Erro: "Cannot find module 'express'"**

```bash
cd server
npm install
```

### **Erro: "Port already in use"**

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### **Erro: "ECONNREFUSED"**

- Verificar se o servidor proxy está rodando
- Verificar se a porta 3001 está livre
- Verificar logs do servidor

### **Erro de CORS persistente**

- Verificar se o proxy está rodando na porta 3001
- Verificar se o frontend está usando URLs do proxy
- Verificar logs do navegador

## 📊 **Logs e Monitoramento**

O servidor proxy exibe logs detalhados:

```
🚀 Proxy iFood rodando na porta 3001
📡 Teste: http://localhost:3001/api/test

✅ Requisição de autenticação bem-sucedida
❌ Erro na autenticação: 401 - Invalid credentials
🔍 Detalhes do erro: { error: "invalid_client" }
```

## 🔒 **Segurança**

- **CORS configurado** apenas para localhost
- **Validação de headers** obrigatórios
- **Tratamento de erros** sem exposição de dados sensíveis
- **Logs de auditoria** para todas as requisições

## 🚀 **Próximos Passos**

### **1. Teste Local**

```bash
# Terminal 1: Iniciar proxy
cd server
npm start

# Terminal 2: Testar integração
# Acessar aplicação React e tentar conectar com iFood
```

### **2. Verificar Logs**

- Console do servidor proxy
- Console do navegador
- Network tab do DevTools

### **3. Testar Endpoints**

```bash
# Teste básico
curl http://localhost:3001/api/test

# Teste de autenticação (substitua pelas suas credenciais)
curl -X POST http://localhost:3001/api/ifood/auth \
  -H "Content-Type: application/json" \
  -d '{"client_id":"acac8cf5-4e63-4433-950d-e1c79d76fa34","clientSecret":"gvlkvyr7204edc20ozpe5fyhhwhbvbfss4tb6fxbjvsxgd8cofix1a12j9urs94ohwpkf9wtjqjr7pj46oosd9cs6mcz97y9xqk"}'
```

## 💡 **Dicas Importantes**

1. **Sempre inicie o proxy primeiro** antes de testar a integração
2. **Mantenha o terminal do proxy aberto** para ver logs em tempo real
3. **Use o DevTools** para verificar requisições e respostas
4. **Verifique a porta 3001** se houver problemas de conexão
5. **Teste endpoints individualmente** antes de testar a integração completa

## 🔄 **Atualizações Futuras**

- **Deploy em produção** com Vercel Functions
- **Rate limiting** para proteção da API
- **Cache de tokens** para melhor performance
- **Métricas e monitoramento** avançados

---

## ✅ **Resumo da Solução**

1. **Problema**: CORS bloqueando integração com iFood
2. **Solução**: Servidor proxy Node.js na porta 3001
3. **Benefícios**: Resolve CORS, melhora segurança, facilita debugging
4. **Uso**: Iniciar proxy → testar integração → verificar logs

**Agora você pode integrar com iFood sem problemas de CORS!** 🎯✨

---

**Precisa de ajuda?** Verifique os logs do servidor proxy e console do navegador para identificar problemas específicos.
