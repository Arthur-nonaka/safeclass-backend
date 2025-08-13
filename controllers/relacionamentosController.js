const { pool } = require('../config/database');

const getAllResponsavelFilho = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT rf.*, 
             u.nome_completo as responsavel_nome,
             a.nome_completo as filho_nome
      FROM responsavel_filho rf
      INNER JOIN usuario u ON rf.responsavel_id = u.id
      INNER JOIN aluno a ON rf.filho_id = a.id
      ORDER BY u.nome_completo, a.nome_completo
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar relacionamentos responsável-filho',
      error: error.message
    });
  }
};


const getFilhosByResponsavel = async (req, res) => {
  try {
    const { responsavel_id } = req.params;
    const [rows] = await pool.execute(`
      SELECT rf.*, 
             u.nome_completo as responsavel_nome,
             a.nome_completo as filho_nome
      FROM responsavel_filho rf
      INNER JOIN usuario u ON rf.responsavel_id = u.id
      INNER JOIN aluno a ON rf.filho_id = a.id
      WHERE rf.responsavel_id = ?
      ORDER BY a.nome_completo
    `, [responsavel_id]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar filhos do responsável',
      error: error.message
    });
  }
};

const getResponsaveisByFilho = async (req, res) => {
  try {
    const { filho_id } = req.params;
    const [rows] = await pool.execute(`
      SELECT rf.*, 
             u.nome_completo as responsavel_nome,
             a.nome_completo as filho_nome
      FROM responsavel_filho rf
      INNER JOIN usuario u ON rf.responsavel_id = u.id
      INNER JOIN aluno a ON rf.filho_id = a.id
      WHERE rf.filho_id = ?
      ORDER BY u.nome_completo
    `, [filho_id]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar responsáveis do aluno',
      error: error.message
    });
  }
};

const createResponsavelFilho = async (req, res) => {
  try {
    const { responsavel_id, filho_id } = req.body;
    
    if (!responsavel_id || !filho_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do responsável e ID do filho são obrigatórios'
      });
    }
    
    const [existing] = await pool.execute(
      'SELECT * FROM responsavel_filho WHERE responsavel_id = ? AND filho_id = ?',
      [responsavel_id, filho_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Relacionamento já existe'
      });
    }
    
    await pool.execute(
      'INSERT INTO responsavel_filho (responsavel_id, filho_id) VALUES (?, ?)',
      [responsavel_id, filho_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Relacionamento responsável-filho criado com sucesso',
      data: { responsavel_id, filho_id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar relacionamento responsável-filho',
      error: error.message
    });
  }
};

const deleteResponsavelFilho = async (req, res) => {
  try {
    const { responsavel_id, filho_id } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM responsavel_filho WHERE responsavel_id = ? AND filho_id = ?',
      [responsavel_id, filho_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Relacionamento não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Relacionamento responsável-filho deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar relacionamento responsável-filho',
      error: error.message
    });
  }
};

const getAllUsuarioCondicao = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT uc.*, 
             a.nome_completo as aluno_nome,
             cm.nome as condicao_nome
      FROM usuario_condicao_medica uc
      INNER JOIN aluno a ON uc.aluno_id = a.id
      INNER JOIN condicao_medica cm ON uc.condicao_id = cm.id
      ORDER BY a.nome_completo, cm.nome
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar relacionamentos usuário-condição',
      error: error.message
    });
  }
};

const getCondicoesByAluno = async (req, res) => {
  try {
    const { aluno_id } = req.params;
    const [rows] = await pool.execute(`
      SELECT uc.*, 
             a.nome_completo as aluno_nome,
             cm.nome as condicao_nome,
             cm.descricao as condicao_descricao
      FROM usuario_condicao_medica uc
      INNER JOIN aluno a ON uc.aluno_id = a.id
      INNER JOIN condicao_medica cm ON uc.condicao_id = cm.id
      WHERE uc.aluno_id = ?
      ORDER BY cm.nome
    `, [aluno_id]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar condições do aluno',
      error: error.message
    });
  }
};

const createUsuarioCondicao = async (req, res) => {
  try {
    const { aluno_id, condicao_id } = req.body;
    
    if (!aluno_id || !condicao_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do aluno e ID da condição são obrigatórios'
      });
    }
    
    const [existing] = await pool.execute(
      'SELECT * FROM usuario_condicao_medica WHERE aluno_id = ? AND condicao_id = ?',
      [aluno_id, condicao_id]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Relacionamento já existe'
      });
    }
    
    await pool.execute(
      'INSERT INTO usuario_condicao_medica (aluno_id, condicao_id) VALUES (?, ?)',
      [aluno_id, condicao_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Relacionamento usuário-condição criado com sucesso',
      data: { aluno_id, condicao_id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar relacionamento usuário-condição',
      error: error.message
    });
  }
};

const deleteUsuarioCondicao = async (req, res) => {
  try {
    const { aluno_id, condicao_id } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM usuario_condicao_medica WHERE aluno_id = ? AND condicao_id = ?',
      [aluno_id, condicao_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Relacionamento não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Relacionamento usuário-condição deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar relacionamento usuário-condição',
      error: error.message
    });
  }
};

module.exports = {
  getAllResponsavelFilho,
  getFilhosByResponsavel,
  getResponsaveisByFilho,
  createResponsavelFilho,
  deleteResponsavelFilho,
  getAllUsuarioCondicao,
  getCondicoesByAluno,
  createUsuarioCondicao,
  deleteUsuarioCondicao
};
