const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { testConnection } = require("./config/database");

const usuarioController = require("./controllers/usuarioController");

const salaRoutes = require("./routes/salaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const condicaoMedicaRoutes = require("./routes/condicaoMedicaRoutes");
const remedioRoutes = require("./routes/remedioRoutes");
const historicoRoutes = require("./routes/historicoRoutes");
const relacionamentosRoutes = require("./routes/relacionamentosRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "SafeClass API está funcionando!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "photos/usuarios");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage });

app.post("/api/usuarios/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Nenhum arquivo enviado",
    });
  }
  res.json({
    success: true,
    message: "Arquivo enviado com sucesso",
    file: req.file,
  });
});

app.use("/api/salas", salaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/condicoes-medicas", condicaoMedicaRoutes);
app.use("/api/remedios", remedioRoutes);
app.use("/api/historico", historicoRoutes);
app.use("/api", relacionamentosRoutes);
app.post("/api/auth/login", usuarioController.authenticateUsuario);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("Erro:", error);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Algo deu errado",
  });
});

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`API disponível em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
