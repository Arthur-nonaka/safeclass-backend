# SafeClass Backend API

Sistema de gerenciamento escolar com foco na segurança e saúde dos alunos.

## Funcionalidades

- CRUD completo para todas as entidades do sistema
- Gestão de usuários (professores, alunos, responsáveis)
- Controle de salas de aula
- Gerenciamento de condições médicas e remédios
- Histórico de atividades

## Tecnologias

- Node.js
- Express.js
- MySQL
- bcryptjs (para criptografia de senhas)

## Estrutura do Projeto

```
/
├── controllers/     # Controllers para cada entidade
├── routes/         # Rotas da API
├── config/         # Configuração do banco de dados
├── middleware/     # Middlewares customizados
├── models/         # (Opcional) Modelos de dados
└── server.js       # Arquivo principal
```

## Instalação

1. Clone o repositório
2. Execute `npm install`
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute `npm run dev` para desenvolvimento

## Variáveis de Ambiente

Crie um arquivo `.env` com:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=safeclass
PORT=3000
```

## Endpoints da API

### Salas
- GET /api/salas - Listar todas as salas
- GET /api/salas/:id - Buscar sala por ID
- POST /api/salas - Criar nova sala
- PUT /api/salas/:id - Atualizar sala
- DELETE /api/salas/:id - Deletar sala

### Usuários
- GET /api/usuarios - Listar todos os usuários
- GET /api/usuarios/:id - Buscar usuário por ID
- POST /api/usuarios - Criar novo usuário
- PUT /api/usuarios/:id - Atualizar usuário
- DELETE /api/usuarios/:id - Deletar usuário

### Alunos
- GET /api/alunos - Listar todos os alunos
- GET /api/alunos/:id - Buscar aluno por ID
- POST /api/alunos - Criar novo aluno
- PUT /api/alunos/:id - Atualizar aluno
- DELETE /api/alunos/:id - Deletar aluno

### Condições Médicas
- GET /api/condicoes-medicas - Listar todas as condições
- GET /api/condicoes-medicas/:id - Buscar condição por ID
- POST /api/condicoes-medicas - Criar nova condição
- PUT /api/condicoes-medicas/:id - Atualizar condição
- DELETE /api/condicoes-medicas/:id - Deletar condição

### Remédios
- GET /api/remedios - Listar todos os remédios
- GET /api/remedios/:id - Buscar remédio por ID
- POST /api/remedios - Criar novo remédio
- PUT /api/remedios/:id - Atualizar remédio
- DELETE /api/remedios/:id - Deletar remédio

### Histórico
- GET /api/historico - Listar histórico
- GET /api/historico/:id - Buscar histórico por ID
- POST /api/historico - Criar nova entrada no histórico
- PUT /api/historico/:id - Atualizar histórico
- DELETE /api/historico/:id - Deletar histórico

### Relacionamentos
- GET /api/responsavel-filho - Listar relacionamentos responsável-filho
- POST /api/responsavel-filho - Criar relacionamento
- DELETE /api/responsavel-filho/:responsavel_id/:filho_id - Deletar relacionamento

- GET /api/usuario-condicao - Listar relacionamentos usuário-condição
- POST /api/usuario-condicao - Criar relacionamento
- DELETE /api/usuario-condicao/:aluno_id/:condicao_id - Deletar relacionamento
