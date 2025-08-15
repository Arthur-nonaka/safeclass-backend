const { pool } = require("../config/database");

const getAllHistorico = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT h.*, u.nome_completo as usuario_nome 
      FROM historico h 
      INNER JOIN usuario u ON h.usuario_id = u.id 
      ORDER BY h.criado_em DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar histórico",
      error: error.message,
    });
  }
};

const getHistoricoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `
      SELECT h.*, u.nome_completo as usuario_nome 
      FROM historico h 
      INNER JOIN usuario u ON h.usuario_id = u.id 
      WHERE h.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Histórico não encontrado",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar histórico",
      error: error.message,
    });
  }
};

const getHistoricoByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const [rows] = await pool.execute(
      `
      SELECT h.*, u.nome_completo as usuario_nome 
      FROM historico h 
      INNER JOIN usuario u ON h.usuario_id = u.id 
      WHERE h.usuario_id = ?
      ORDER BY h.criado_em DESC
    `,
      [usuario_id]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar histórico do usuário",
      error: error.message,
    });
  }
};

const createHistorico = async (req, res) => {
  try {
    const { usuario_id, descricao, condicao_id } = req.body;

    if (!usuario_id || !descricao) {
      return res.status(400).json({
        success: false,
        message: "Usuário e descrição são obrigatórios",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO historico (usuario_id, descricao, condicao_id) VALUES (?, ?, ?)",
      [usuario_id, descricao, condicao_id]
    );

    res.status(201).json({
      success: true,
      message: "Entrada do histórico criada com sucesso",
      data: {
        id: result.insertId,
        usuario_id,
        descricao,
        condicao_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar entrada do histórico",
      error: error.message,
    });
  }
};

const updateHistorico = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, descricao, condicao_id } = req.body;

    if (!usuario_id || !descricao) {
      return res.status(400).json({
        success: false,
        message: "Usuário e descrição são obrigatórios",
      });
    }

    const [result] = await pool.execute(
      "UPDATE historico SET usuario_id = ?, descricao = ?, condicao_id = ? WHERE id = ?",
      [usuario_id, descricao, condicao_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Histórico não encontrado",
      });
    }

    res.json({
      success: true,
      message: "Histórico atualizado com sucesso",
      data: { id, usuario_id, descricao },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar histórico",
      error: error.message,
    });
  }
};

const deleteHistorico = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM historico WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Histórico não encontrado",
      });
    }

    res.json({
      success: true,
      message: "Histórico deletado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao deletar histórico",
      error: error.message,
    });
  }
};

module.exports = {
  getAllHistorico,
  getHistoricoById,
  getHistoricoByUsuario,
  createHistorico,
  updateHistorico,
  deleteHistorico,
};
