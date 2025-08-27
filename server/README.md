# 🚀 Proxy iFood - FoodCost

Este servidor proxy resolve problemas de CORS ao integrar com a API do iFood.

## 🎯 **Por que usar um proxy?**

- **CORS Policy**: Navegadores bloqueiam requisições diretas para APIs externas
- **Segurança**: Evita expor credenciais no frontend
- **Controle**: Permite logging e tratamento de erros centralizado
- **Flexibilidade**: Fácil de modificar endpoints e parâmetros

## 🛠️ **Instalação**

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Instalar dependência de desenvolvimento (opcional)
npm install -g nodemon
```

## 🚀 **Execução**

### **Modo Desenvolvimento (com auto-reload)**
```bash
npm run dev
```

### **Modo Produção**
```bash
npm start
```

### **Verificar se está funcionando**
```bash
curl http://localhost:3001/api/test
```

## 📡 **Endpoints Disponíveis**

### **1. Autenticação OAuth2**
```
POST /api/ifood/auth
```
**Body:**
```json
{
  "clientId": "seu_client_id",
  "clientSecret": "seu_client_secret"
}
```

### **2. Buscar Vendas**
```
GET /api/ifood/sales/:merchantId?beginDate=2025-01-01&endDate=2025-01-31&page=1
```
**Headers:**
```
Authorization: Bearer seu_token_aqui
```

### **3. Verificar Conexão**
```
GET /api/ifood/check
```
**Headers:**
```
Authorization: Bearer seu_token_aqui
```

### **4. Teste**
```
GET /api/test
```

## 🔧 **Configuração**

### **Porta**
Por padrão, o servidor roda na porta **3001**. Para alterar:

```javascript
// proxy.js
const PORT = process.env.PORT || 3001;
```

### **Variáveis de Ambiente**
```bash
# .env
PORT=3001
NODE_ENV=development
```

## 🐛 **Troubleshooting**

### **Erro: "Cannot find module 'express'"**
```bash
npm install
```

### **Erro: "Port already in use"**
```bash
# Verificar processos na porta 3001
lsof -i :3001

# Matar processo
kill -9 PID
```

### **Erro de CORS persistente**
Verificar se o middleware CORS está configurado:
```javascript
app.use(cors());
```

## 📊 **Logs**

O servidor exibe logs detalhados:
- ✅ Requisições bem-sucedidas
- ❌ Erros de autenticação
- 🔍 Detalhes de erros da API iFood
- 📡 Status das conexões

## 🔒 **Segurança**

- **CORS configurado** para permitir apenas localhost
- **Validação de headers** obrigatórios
- **Tratamento de erros** sem exposição de dados sensíveis
- **Rate limiting** (pode ser implementado)

## 🚀 **Deploy em Produção**

### **Vercel (Serverless)**
```bash
# Criar vercel.json
{
  "functions": {
    "server/proxy.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### **Heroku**
```bash
heroku create
git push heroku main
```

## 📝 **Exemplo de Uso**

### **Frontend (React)**
```typescript
// Autenticação
const authResponse = await fetch('http://localhost:3001/api/ifood/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientId, clientSecret })
});

// Buscar vendas
const salesResponse = await fetch(
  `http://localhost:3001/api/ifood/sales/${merchantId}?beginDate=${beginDate}&endDate=${endDate}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

## 🔄 **Atualizações**

Para atualizar o proxy:
```bash
git pull origin main
npm install
npm restart
```

## 📞 **Suporte**

- **Issues**: GitHub Issues
- **Documentação**: Este README
- **Logs**: Console do servidor

---

**Desenvolvido para FoodCost** 🍔✨

