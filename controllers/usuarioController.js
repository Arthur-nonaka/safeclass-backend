const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.*, s.nome as sala_nome 
      FROM usuario u 
      LEFT JOIN sala s ON u.sala_id = s.id 
      ORDER BY u.nome_completo
    `);
    
    const usuariosSemSenha = rows.map(usuario => {
      const { senha_hash, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    });
    
    res.json({
      success: true,
      data: usuariosSemSenha
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários',
      error: error.message
    });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT u.*, s.nome as sala_nome 
      FROM usuario u 
      LEFT JOIN sala s ON u.sala_id = s.id 
      WHERE u.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    const { senha_hash, ...usuarioSemSenha } = rows[0];
    
    res.json({
      success: true,
      data: usuarioSemSenha
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
    });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { nome_completo, email, senha, telefone, tipo, sala_id } = req.body;
    
    if (!nome_completo || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nome completo e tipo são obrigatórios'
      });
    }
    
    if (!['professor', 'aluno', 'responsavel'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo deve ser: professor, aluno ou responsavel'
      });
    }

    let senhaHash = null;
    if (senha) {
      senhaHash = await bcrypt.hash(senha, 10);
    }
    
    const [result] = await pool.execute(
      'INSERT INTO usuario (nome_completo, email, senha_hash, telefone, tipo, sala_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nome_completo, email, senhaHash, telefone, tipo, sala_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        id: result.insertId,
        nome_completo,
        email,
        telefone,
        tipo,
        sala_id
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: error.message
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_completo, email, senha, telefone, tipo, sala_id } = req.body;
    
    if (!nome_completo || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nome completo e tipo são obrigatórios'
      });
    }
    
    if (!['professor', 'aluno', 'responsavel'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo deve ser: professor, aluno ou responsavel'
      });
    }
    
    let senhaHash = null;
    if (senha) {
      senhaHash = await bcrypt.hash(senha, 10);
    }
    
    let query, params;
    
    if (senhaHash) {
      query = 'UPDATE usuario SET nome_completo = ?, email = ?, senha_hash = ?, telefone = ?, tipo = ?, sala_id = ? WHERE id = ?';
      params = [nome_completo, email, senhaHash, telefone, tipo, sala_id, id];
    } else {
      query = 'UPDATE usuario SET nome_completo = ?, email = ?, telefone = ?, tipo = ?, sala_id = ? WHERE id = ?';
      params = [nome_completo, email, telefone, tipo, sala_id, id];
    }
    
    const [result] = await pool.execute(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        id,
        nome_completo,
        email,
        telefone,
        tipo,
        sala_id
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: error.message
    });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
