const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rota para autenticação OAuth2
app.post('/api/ifood/auth', async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body;
    
    const response = await axios.post('https://merchant-api.ifood.com.br/oauth/token', 
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'merchant.read financial.read'
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Erro na autenticação iFood:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erro na autenticação',
      details: error.response?.data || error.message
    });
  }
});

// Rota para buscar vendas
app.get('/api/ifood/sales/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { beginDate, endDate, page = 1 } = req.query;
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({ error: 'Token de autorização necessário' });
    }
    
    const response = await axios.get(
      `https://merchant-api.ifood.com.br/financial/v3.0/merchants/${merchantId}/sales?beginSalesDate=${beginDate}&endSalesDate=${endDate}&page=${page}`,
      {
        headers: {
          'Authorization': authorization,
          'Accept': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar vendas iFood:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erro ao buscar vendas',
      details: error.response?.data || error.message
    });
  }
});

// Rota para verificar conexão
app.get('/api/ifood/check', async (req, res) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({ error: 'Token de autorização necessário' });
    }
    
    const response = await axios.get('https://merchant-api.ifood.com.br/merchant', {
      headers: {
        'Authorization': authorization,
        'Accept': 'application/json'
      }
    });
    
    res.json({ connected: true, data: response.data });
  } catch (error) {
    console.error('Erro ao verificar conexão iFood:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erro ao verificar conexão',
      details: error.response?.data || error.message
    });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Proxy iFood funcionando!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy iFood rodando na porta ${PORT}`);
  console.log(`📡 Teste: http://localhost:${PORT}/api/test`);
});

