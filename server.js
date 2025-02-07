const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config(); // Adicione esta linha para carregar variáveis de ambiente do arquivo .env

// Configuração do CORS para permitir requisições do seu frontend
app.use(cors({
  origin: 'http://localhost:8081'
}));

const API_KEY = process.env.API_KEY; // Use process.env para acessar a variável de ambiente
const BASE_URL = 'http://dataservice.accuweather.com';

// Rota para autocomplete
app.get('/api/locations/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`${BASE_URL}/locations/v1/cities/autocomplete`, {
      params: {
        apikey: API_KEY,
        q
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para dados de localização
app.get('/api/locations/:locationKey', async (req, res) => {
  try {
    const { locationKey } = req.params;
    const response = await axios.get(`${BASE_URL}/locations/v1/${locationKey}`, {
      params: {
        apikey: API_KEY,
        details: true,
        language: 'pt-br'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para condições atuais
app.get('/api/currentconditions/:locationKey', async (req, res) => {
  try {
    const { locationKey } = req.params;
    const response = await axios.get(`${BASE_URL}/currentconditions/v1/${locationKey}`, {
      params: {
        apikey: API_KEY,
        language: 'pt-br',
        details: true
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para previsão
app.get('/api/forecasts/:locationKey', async (req, res) => {
  try {
    const { locationKey } = req.params;
    const response = await axios.get(`${BASE_URL}/forecasts/v1/daily/1day/${locationKey}`, {
      params: {
        apikey: API_KEY,
        details: true,
        language: 'pt-br'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});