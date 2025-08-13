CREATE DATABASE IF NOT EXISTS safeclass CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safeclass;

CREATE TABLE sala (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nome_completo VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  senha_hash VARCHAR(255),
  telefone VARCHAR(255),
  tipo ENUM('professor','aluno','responsavel') NOT NULL,
  sala_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (sala_id) REFERENCES sala(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE aluno (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nome_completo VARCHAR(150) NOT NULL,
  sala_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (sala_id) REFERENCES sala(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE responsavel_filho (
  responsavel_id BIGINT UNSIGNED NOT NULL,
  filho_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (responsavel_id, filho_id),
  FOREIGN KEY (responsavel_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (filho_id) REFERENCES aluno(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE condicao_medica (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE usuario_condicao_medica (
  aluno_id BIGINT UNSIGNED NOT NULL,
  condicao_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (aluno_id, condicao_id),
  FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE,
  FOREIGN KEY (condicao_id) REFERENCES condicao_medica(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE remedio (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  aluno_id BIGINT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NULL,
  dosagem VARCHAR(100) NOT NULL,
  horario VARCHAR(100) NULL,
  FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE historico (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  descricao TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO sala (nome) VALUES 
('1º Ano A'), 
('1º Ano B'), 
('2º Ano A'), 
('2º Ano B'),
('3º Ano A');

INSERT INTO condicao_medica (nome, descricao) VALUES 
('Diabetes', 'Diabetes mellitus tipo 1 ou 2'),
('Asma', 'Condição respiratória crônica'),
('Alergia Alimentar', 'Reações alérgicas a alimentos específicos'),
('TDAH', 'Transtorno do Déficit de Atenção com Hiperatividade'),
('Epilepsia', 'Distúrbio neurológico com convulsões');

INSERT INTO aluno (nome_completo, sala_id) VALUES 
('João Silva Santos', 1),
('Maria Oliveira Costa', 1),
('Pedro Souza Lima', 2),
('Ana Carolina Ferreira', 2),
('Lucas Gabriel Alves', 3);

INSERT INTO usuario (nome_completo, email, telefone, tipo, sala_id) VALUES 
('Prof. Carlos Eduardo', 'carlos@escola.com', '(11) 98765-4321', 'professor', 1),
('Prof. Marina Santos', 'marina@escola.com', '(11) 97654-3210', 'professor', 2),
('José Silva Santos', 'jose@email.com', '(11) 99999-1111', 'responsavel', NULL),
('Maria Aparecida Costa', 'maria.ap@email.com', '(11) 99999-2222', 'responsavel', NULL),
('Roberto Lima', 'roberto@email.com', '(11) 99999-3333', 'responsavel', NULL);

INSERT INTO responsavel_filho (responsavel_id, filho_id) VALUES 
(3, 1), 
(4, 2),
(5, 3); 

INSERT INTO usuario_condicao_medica (aluno_id, condicao_id) VALUES 
(1, 1),
(2, 2),
(3, 3); 

INSERT INTO remedio (aluno_id, nome, descricao, dosagem, horario) VALUES 
(1, 'Insulina', 'Para controle da glicemia', '10 unidades', '08:00 e 18:00'),
(2, 'Bombinha para Asma', 'Broncodilatador', '2 borrifadas', 'Quando necessário'),
(3, 'Anti-histamínico', 'Para reações alérgicas', '1 comprimido', 'Em caso de alergia');

INSERT INTO historico (usuario_id, descricao) VALUES 
(1, 'Aluno João teve episódio de hipoglicemia durante a aula'),
(2, 'Maria utilizou bombinha durante o recreio'),
(3, 'Pedro teve reação alérgica no lanche - pais notificados');
