const { pool } = require('../config/database');

// Listar todas as condições médicas
const getAllCondicoesMedicas = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM condicao_medica ORDER BY nome');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar condições médicas',
      error: error.message
    });
  }
};

// Buscar condição médica por ID
const getCondicaoMedicaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM condicao_medica WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Condição médica não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar condição médica',
      error: error.message
    });
  }
};

// Criar nova condição médica
const createCondicaoMedica = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome da condição médica é obrigatório'
      });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO condicao_medica (nome, descricao) VALUES (?, ?)',
      [nome, descricao]
    );
    
    res.status(201).json({
      success: true,
      message: 'Condição médica criada com sucesso',
      data: {
        id: result.insertId,
        nome,
        descricao
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar condição médica',
      error: error.message
    });
  }
};

// Atualizar condição médica
const updateCondicaoMedica = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome da condição médica é obrigatório'
      });
    }
    
    const [result] = await pool.execute(
      'UPDATE condicao_medica SET nome = ?, descricao = ? WHERE id = ?',
      [nome, descricao, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Condição médica não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Condição médica atualizada com sucesso',
      data: { id, nome, descricao }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar condição médica',
      error: error.message
    });
  }
};

// Deletar condição médica
const deleteCondicaoMedica = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM condicao_medica WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Condição médica não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Condição médica deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar condição médica',
      error: error.message
    });
  }
};

module.exports = {
  getAllCondicoesMedicas,
  getCondicaoMedicaById,
  createCondicaoMedica,
  updateCondicaoMedica,
  deleteCondicaoMedica
};
