# GoPar

Plataforma para conectar pessoas a **parceiros de rotina e estilo de vida**: correr junto, ir ao shopping, visitar museus, fazer tours de cafeteria e resolver o cotidiano com companhia.

Este repositório é um monorepo simples, pronto para hospedar na [Render](https://render.com) (serviço web Node.js + site estático).

```
go-par/
├── frontend/   # React + Vite + Tailwind CSS
└── backend/    # API Express, pronta para PostgreSQL
```

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Como rodar localmente

Abra dois terminais na raiz do projeto (`go-par/`).

### 1. Backend (API)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

A API sobe em [http://localhost:3001](http://localhost:3001).

Rotas úteis:

- `GET /api/health` — status do serviço e do banco (quando `DATABASE_URL` existir)
- `GET /api/activities` — listagem de atividades (dados de exemplo por enquanto)
- `GET /api/activities?category=corrida` — filtro por categoria

O PostgreSQL é opcional neste MVP. Quando quiser conectar, defina `DATABASE_URL` no `.env` do backend. O módulo `backend/src/config/db.js` já cria o pool e o health check consulta o banco.

### 2. Frontend (site)

```bash
cd frontend
npm install
npm run dev
```

O app sobe em [http://localhost:5173](http://localhost:5173).

No desenvolvimento, o Vite encaminha `/api` para `http://localhost:3001`. Deixe `VITE_API_URL` vazio (veja `frontend/.env.example`).

Páginas:

- `/` — conceito do GoPar
- `/atividades` — listagem de planos e parceiros
- `/entrar` — login (e-mail + senha)
- `/cadastro` — cadastro com nome, CPF, data de nascimento e gênero (18+)

### Auth (Supabase)

No `frontend/.env`, use `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do projeto **go-par**.

No Dashboard do Supabase → **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:5173`
- **Redirect URLs:** `http://localhost:5173/**`

Para desenvolvimento sem fricção, em **Providers → Email** você pode desativar **Confirm email**. Em produção, reative.

O tipo de conta (`cliente` / `trabalhador`) fica em `profiles.account_type` com default `cliente` e **não pode ser alterado pelo cliente** (RLS + trigger).

Atalhos a partir da raiz:

```bash
npm run dev:backend
npm run dev:frontend
```

## Deploy na Render

Crie dois serviços no mesmo repositório.

**Web Service (API)**

- Root directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Variáveis: `NODE_ENV=production`, `CORS_ORIGIN` com a URL do site estático, e `DATABASE_URL` quando o Postgres estiver ligado

**Static Site (frontend)**

- Root directory: `frontend`
- Build: `npm install && npm run build`
- Publish directory: `dist`
- Variáveis de build: `VITE_API_URL` com a URL pública da API, `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Ative o rewrite de SPA para `index.html` (todas as rotas do React)

Há um `render.yaml` na raiz como ponto de partida.