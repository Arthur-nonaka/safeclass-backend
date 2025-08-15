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
  photo VARCHAR(255) NULL,
  tipo ENUM('professor','responsavel') NOT NULL,
  sala_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (sala_id) REFERENCES sala(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE aluno (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nome_completo VARCHAR(150) NOT NULL,
  alergias TEXT NULL,
  sala_id BIGINT UNSIGNED NULL,
  responsavel_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (responsavel_id) REFERENCES usuario(id) ON DELETE SET NULL,
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
  condicao_id BIGINT UNSIGNED NULL,
  FOREIGN KEY (condicao_id) REFERENCES condicao_medica(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO sala (nome) VALUES 
('1º Ano A'), 
('1º Ano B'), 
('2º Ano A'), 
('2º Ano B'),
('3º Ano A');

INSERT INTO condicao_medica (nome, descricao) VALUES 
('Diabetes', 'ATENÇÃO: Em caso de hipoglicemia (tremores, suor, confusão), ofereça açúcar ou suco imediatamente. Se hiperglicemia (sede excessiva, sonolência), chame os responsáveis. Sempre permita ida ao banheiro e lanche nos horários prescritos.'),
('Asma', 'ATENÇÃO: Em crise de asma (dificuldade para respirar, chiado), mantenha o aluno calmo, em posição sentada. Auxilie no uso da bombinha se prescrita. Se não melhorar em 10 minutos, chame emergência e responsáveis.'),
('Alergia Alimentar', 'ATENÇÃO: Evite exposição aos alérgenos conhecidos. Em reação alérgica (coceira, inchaço, dificuldade respiratória), administre anti-histamínico se prescrito e chame imediatamente os responsáveis. Em casos graves, chame emergência.'),
('TDAH', 'ORIENTAÇÃO: Aluno pode ter dificuldade de concentração e hiperatividade. Use estratégias como pausas frequentes, tarefas divididas em etapas menores, ambiente menos estimulante. Seja paciente e ofereça reforço positivo.'),
('Epilepsia', 'EMERGÊNCIA: Durante convulsão, proteja a cabeça, afaste objetos perigosos, NÃO coloque nada na boca, posicione de lado após parar. Crises acima de 5 minutos ou repetidas: chame emergência. Sempre notifique responsáveis.');

INSERT INTO aluno (nome_completo, sala_id) VALUES 
('João Silva Santos', 1),
('Maria Oliveira Costa', 1),
('Pedro Souza Lima', 2),
('Ana Carolina Ferreira', 2),
('Lucas Gabriel Alves', 3);

INSERT INTO usuario (nome_completo, email, telefone, tipo, sala_id, senha_hash) VALUES 
('responsavel', 'responsavel@gmail.com', '(11) 98765-4321', 'responsavel', 1, '$2a$10$5Nd0oaeFv07C0zBKBBwwtukoSdIW5zAQ3CCQMhh1OXPZWgYh0kfJK'),
('prof. Prof', 'prof@gmail.com', '(11) 97654-3210', 'professor', 2, '$2a$10$5Nd0oaeFv07C0zBKBBwwtukoSdIW5zAQ3CCQMhh1OXPZWgYh0kfJK'),
('José Silva Santos', 'jose@email.com', '(11) 99999-1111', 'responsavel', NULL, ''),
('Maria Aparecida Costa', 'maria.ap@email.com', '(11) 99999-2222', 'responsavel', NULL, ''),
('Roberto Lima', 'roberto@email.com', '(11) 99999-3333', 'responsavel', NULL, '');

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

INSERT INTO historico (usuario_id, descricao, condicao_id) VALUES 
(1, 'Aluno João teve episódio de hipoglicemia durante a aula de matemática. Foi oferecido suco e o aluno se recuperou em 10 minutos.', 1),
(2, 'Maria utilizou bombinha para asma durante o recreio devido a dificuldade respiratória. Situação normalizada após uso da medicação.', 2),
(3, 'Pedro teve reação alérgica leve após lanche - coceira no rosto. Pais foram notificados e administrado anti-histamínico conforme prescrição.', 3);
