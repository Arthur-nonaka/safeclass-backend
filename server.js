const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rotas
const salaRoutes = require('./routes/salaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const condicaoMedicaRoutes = require('./routes/condicaoMedicaRoutes');
const remedioRoutes = require('./routes/remedioRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const relacionamentosRoutes = require('./routes/relacionamentosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'SafeClass API está funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Configurar rotas da API
app.use('/api/salas', salaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/condicoes-medicas', condicaoMedicaRoutes);
app.use('/api/remedios', remedioRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api', relacionamentosRoutes);

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros globais
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 API disponível em: http://localhost:${PORT}`);
      console.log(`📋 Documentação das rotas disponível no README.md`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
