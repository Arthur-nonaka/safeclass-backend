const { pool } = require('../config/database');

// Listar todos os alunos
const getAllAlunos = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT a.*, s.nome as sala_nome 
      FROM aluno a 
      LEFT JOIN sala s ON a.sala_id = s.id 
      ORDER BY a.nome_completo
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alunos',
      error: error.message
    });
  }
};

// Buscar aluno por ID
const getAlunoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT a.*, s.nome as sala_nome 
      FROM aluno a 
      LEFT JOIN sala s ON a.sala_id = s.id 
      WHERE a.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar aluno',
      error: error.message
    });
  }
};

// Criar novo aluno
const createAluno = async (req, res) => {
  try {
    const { nome_completo, sala_id } = req.body;
    
    if (!nome_completo) {
      return res.status(400).json({
        success: false,
        message: 'Nome completo é obrigatório'
      });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO aluno (nome_completo, sala_id) VALUES (?, ?)',
      [nome_completo, sala_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Aluno criado com sucesso',
      data: {
        id: result.insertId,
        nome_completo,
        sala_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar aluno',
      error: error.message
    });
  }
};

// Atualizar aluno
const updateAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_completo, sala_id } = req.body;
    
    if (!nome_completo) {
      return res.status(400).json({
        success: false,
        message: 'Nome completo é obrigatório'
      });
    }
    
    const [result] = await pool.execute(
      'UPDATE aluno SET nome_completo = ?, sala_id = ? WHERE id = ?',
      [nome_completo, sala_id, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno atualizado com sucesso',
      data: { id, nome_completo, sala_id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar aluno',
      error: error.message
    });
  }
};

// Deletar aluno
const deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM aluno WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar aluno',
      error: error.message
    });
  }
};

module.exports = {
  getAllAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno
};
