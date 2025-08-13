const { pool } = require('../config/database');

// Listar todas as salas
const getAllSalas = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM sala ORDER BY nome');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar salas',
      error: error.message
    });
  }
};

// Buscar sala por ID
const getSalaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM sala WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar sala',
      error: error.message
    });
  }
};

// Criar nova sala
const createSala = async (req, res) => {
  try {
    const { nome } = req.body;
    
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome da sala é obrigatório'
      });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO sala (nome) VALUES (?)',
      [nome]
    );
    
    res.status(201).json({
      success: true,
      message: 'Sala criada com sucesso',
      data: {
        id: result.insertId,
        nome
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar sala',
      error: error.message
    });
  }
};

// Atualizar sala
const updateSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome da sala é obrigatório'
      });
    }
    
    const [result] = await pool.execute(
      'UPDATE sala SET nome = ? WHERE id = ?',
      [nome, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Sala atualizada com sucesso',
      data: { id, nome }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar sala',
      error: error.message
    });
  }
};

// Deletar sala
const deleteSala = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM sala WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Sala deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar sala',
      error: error.message
    });
  }
};

module.exports = {
  getAllSalas,
  getSalaById,
  createSala,
  updateSala,
  deleteSala
};
