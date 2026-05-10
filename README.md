# Shema — Plataforma de Gestão da Igreja Batista Shema

Sistema web completo para gestão de membros, células, eventos e comunicação interna da Igreja Batista Shema (Fortaleza – CE).

---

## Funcionalidades

- **Dashboard** — KPIs em tempo real, gráfico de crescimento de membros, aniversariantes do mês e próximos eventos
- **Membros** — Cadastro completo com foto, status, ministério, histórico de atividades e exportação CSV
- **Células** — Gerenciamento de grupos, controle de frequência e associação de membros
- **Eventos** — Agenda de cultos e eventos com sistema de check-in de presença
- **Feed** — Mural de comunicados com fotos, vídeos, curtidas e comentários
- **Autenticação** — Login seguro com JWT + refresh token em HTTPOnly cookie, com 3 níveis de acesso (Admin, Líder, Membro)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, CSS Modules, Recharts |
| Backend | Node.js (ES Modules), Express 4 |
| Banco de dados | MongoDB + Mongoose 8 |
| Autenticação | JWT (access token) + HTTPOnly Cookie (refresh token) |
| Validação | Zod |
| Upload | Multer + validação de magic bytes |
| Documentação | Swagger UI (`/api/docs`) |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [MongoDB](https://www.mongodb.com/try/download/community) rodando localmente (ou URI remota)
- npm v9 ou superior

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Thiago-galdino/shema.git
cd shema
```

### 2. Instale as dependências

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure as variáveis de ambiente

**Backend** — crie `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shema-church
JWT_SECRET=sua_chave_secreta_aqui
JWT_REFRESH_SECRET=sua_chave_refresh_aqui
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
UPLOADS_PATH=uploads
```

**Frontend** — crie `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Popule o banco com dados iniciais (opcional)

```bash
cd server
npm run seed
```

Isso cria um usuário administrador e dados de exemplo para desenvolvimento.

**Credenciais do admin:**
- Email: `admin@igrejashema.com`
- Senha: `Shema@2024`

---

## Rodando o projeto

Abra dois terminais:

```bash
# Terminal 1 — Backend (porta 5000)
cd server
npm run dev

# Terminal 2 — Frontend (porta 3000)
cd client
npm run dev
```

Acesse **http://localhost:3000**

---

## Documentação da API

Com o servidor rodando, a documentação interativa Swagger está disponível em:

```
http://localhost:5000/api/docs
```

### Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `POST` | `/api/auth/refresh` | Renovar access token |
| `GET` | `/api/members` | Listar membros |
| `POST` | `/api/members` | Criar membro |
| `GET` | `/api/members/:id` | Detalhe do membro |
| `PUT` | `/api/members/:id` | Atualizar membro |
| `DELETE` | `/api/members/:id` | Remover membro (soft delete) |
| `GET` | `/api/members/export` | Exportar CSV |
| `GET` | `/api/cells` | Listar células |
| `POST` | `/api/cells` | Criar célula |
| `POST` | `/api/cells/:id/frequency` | Registrar frequência |
| `GET` | `/api/events` | Listar eventos |
| `POST` | `/api/events` | Criar evento |
| `POST` | `/api/events/:id/checkin` | Check-in em evento |
| `GET` | `/api/posts` | Feed de posts |
| `POST` | `/api/posts` | Criar post |
| `POST` | `/api/posts/:id/like` | Curtir / descurtir |
| `POST` | `/api/posts/:id/comments` | Comentar |
| `GET` | `/api/dashboard` | KPIs e gráficos |
| `GET` | `/api/dashboard/upcoming-events` | Próximos eventos |
| `GET` | `/api/health` | Health check |

---

## Estrutura do projeto

```
shema/
├── client/                        # Frontend Next.js
│   └── src/
│       ├── app/
│       │   ├── (dashboard)/       # Páginas protegidas
│       │   │   ├── dashboard/     # Dashboard com KPIs
│       │   │   ├── membros/       # Gestão de membros
│       │   │   ├── celulas/       # Gestão de células
│       │   │   ├── eventos/       # Gestão de eventos
│       │   │   └── feed/          # Feed da comunidade
│       │   └── login/             # Página de login
│       ├── components/layout/     # Sidebar e Header
│       ├── context/               # AuthContext (estado global)
│       └── lib/                   # Cliente HTTP e utilitários
│
└── server/                        # Backend Express
    └── src/
        ├── config/                # Conexão DB e Swagger
        ├── controllers/           # Handlers HTTP
        ├── middlewares/           # Auth, validação, upload, erros
        ├── models/                # Schemas Mongoose
        ├── repositories/          # Acesso a dados
        ├── routes/                # Definição de rotas
        ├── services/              # Lógica de negócio
        ├── validators/            # Schemas Zod
        └── seeds/                 # Dados iniciais para dev
```

---

## Segurança implementada

- Refresh token em **HTTPOnly cookie** (protegido contra XSS)
- Validação de entrada com **Zod** em todas as rotas de escrita
- Upload com verificação de **magic bytes** (bloqueia arquivos maliciosos renomeados)
- **Soft delete** — registros removidos nunca aparecem nas queries
- CORS configurável via variável de ambiente (múltiplas origens separadas por vírgula)
- Autorização por papel (Admin / Líder / Membro) em todas as rotas protegidas

---

## Scripts disponíveis

| Diretório | Comando | Descrição |
|---|---|---|
| `server/` | `npm run dev` | Inicia com nodemon (hot reload) |
| `server/` | `npm start` | Inicia em produção |
| `server/` | `npm run seed` | Popula o banco com dados iniciais |
| `client/` | `npm run dev` | Inicia o Next.js em desenvolvimento |
| `client/` | `npm run build` | Gera o build de produção |
| `client/` | `npm start` | Inicia o build de produção |

---

## Variáveis de ambiente — referência completa

### Backend (`server/.env`)

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta do servidor | `5000` |
| `MONGODB_URI` | URI de conexão MongoDB | `mongodb://localhost:27017/shema-church` |
| `JWT_SECRET` | Chave secreta do access token | string aleatória longa |
| `JWT_REFRESH_SECRET` | Chave secreta do refresh token | string aleatória longa |
| `JWT_EXPIRES_IN` | Validade do access token | `1d` |
| `JWT_REFRESH_EXPIRES_IN` | Validade do refresh token | `7d` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |
| `CLIENT_URL` | Origem(ns) permitida(s) pelo CORS | `http://localhost:3000` |
| `UPLOADS_PATH` | Pasta para arquivos enviados | `uploads` |

### Frontend (`client/.env.local`)

| Variável | Descrição | Exemplo |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API | `http://localhost:5000/api` |

---

## Licença

Projeto desenvolvido para uso interno da Igreja Batista Shema — Fortaleza, CE.

