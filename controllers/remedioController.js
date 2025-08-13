const { pool } = require('../config/database');

// Listar todos os remédios
const getAllRemedios = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT r.*, a.nome_completo as aluno_nome 
      FROM remedio r 
      INNER JOIN aluno a ON r.aluno_id = a.id 
      ORDER BY a.nome_completo, r.nome
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar remédios',
      error: error.message
    });
  }
};

// Buscar remédio por ID
const getRemedioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT r.*, a.nome_completo as aluno_nome 
      FROM remedio r 
      INNER JOIN aluno a ON r.aluno_id = a.id 
      WHERE r.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Remédio não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar remédio',
      error: error.message
    });
  }
};

// Buscar remédios por aluno
const getRemediosByAluno = async (req, res) => {
  try {
    const { aluno_id } = req.params;
    const [rows] = await pool.execute(`
      SELECT r.*, a.nome_completo as aluno_nome 
      FROM remedio r 
      INNER JOIN aluno a ON r.aluno_id = a.id 
      WHERE r.aluno_id = ?
      ORDER BY r.nome
    `, [aluno_id]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar remédios do aluno',
      error: error.message
    });
  }
};

// Criar novo remédio
const createRemedio = async (req, res) => {
  try {
    const { aluno_id, nome, descricao, dosagem, horario } = req.body;
    
    if (!aluno_id || !nome || !dosagem) {
      return res.status(400).json({
        success: false,
        message: 'Aluno, nome e dosagem são obrigatórios'
      });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO remedio (aluno_id, nome, descricao, dosagem, horario) VALUES (?, ?, ?, ?, ?)',
      [aluno_id, nome, descricao, dosagem, horario]
    );
    
    res.status(201).json({
      success: true,
      message: 'Remédio criado com sucesso',
      data: {
        id: result.insertId,
        aluno_id,
        nome,
        descricao,
        dosagem,
        horario
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar remédio',
      error: error.message
    });
  }
};

// Atualizar remédio
const updateRemedio = async (req, res) => {
  try {
    const { id } = req.params;
    const { aluno_id, nome, descricao, dosagem, horario } = req.body;
    
    if (!aluno_id || !nome || !dosagem) {
      return res.status(400).json({
        success: false,
        message: 'Aluno, nome e dosagem são obrigatórios'
      });
    }
    
    const [result] = await pool.execute(
      'UPDATE remedio SET aluno_id = ?, nome = ?, descricao = ?, dosagem = ?, horario = ? WHERE id = ?',
      [aluno_id, nome, descricao, dosagem, horario, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Remédio não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Remédio atualizado com sucesso',
      data: { id, aluno_id, nome, descricao, dosagem, horario }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar remédio',
      error: error.message
    });
  }
};

// Deletar remédio
const deleteRemedio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM remedio WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Remédio não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Remédio deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar remédio',
      error: error.message
    });
  }
};

module.exports = {
  getAllRemedios,
  getRemedioById,
  getRemediosByAluno,
  createRemedio,
  updateRemedio,
  deleteRemedio
};
