# SEMIN UFBA — 50 Anos de Engenharia de Minas

Site oficial da Semana de Engenharia de Minas da UFBA (SEMIN), edição comemorativa dos 50 anos do curso.

## 🏗️ Stack / Infraestrutura

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React + Vite + TypeScript + Tailwind CSS |
| **Hospedagem** | **Hostinger** (hospedagem compartilada) |
| **Banco de dados** | **Supabase** (PostgreSQL + Auth + RPC) |
| **Pagamentos** | **Asaas** (PIX, Cartão, Boleto) |
| **Webhooks Asaas** | Proxy PHP na Hostinger → Google Apps Script |
| **Quiz** | Supabase RPC (server-side scoring) |

> **Nota:** O diretório `minerax-backend/` contém uma API Express legada usada apenas para desenvolvimento local. Em produção, toda a lógica server-side roda via **Supabase RPC** e **funções PHP** na Hostinger.

## 🚀 Desenvolvimento local

```sh
# 1. Clonar o repositório
git clone <URL_DO_REPO>
cd semin-50-mineracao

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Copie .env.local.example para .env.local e preencha com suas chaves Supabase

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

## 📦 Build para produção

```sh
npm run build
```

O output vai para a pasta `dist/`. Suba o conteúdo desta pasta para o `public_html/` da Hostinger.

## 📁 Estrutura do projeto

```
├── public/               # Assets estáticos + webhook PHP
│   └── webhook-asaas.php # Proxy de webhook Asaas → Google Sheets
├── src/
│   ├── components/       # Componentes React
│   ├── pages/            # Páginas (Index, Quiz, ThankYou)
│   ├── lib/              # Configuração Supabase
│   └── hooks/            # Custom hooks
├── supabase/
│   └── quiz-schema.sql   # Schema + funções RPC do Quiz
├── minerax-backend/      # API Express (dev/legacy, não usado em prod)
└── vercel.json           # Config de rewrites/cache (compatível com Hostinger .htaccess)
```

## 🎮 Quiz SEMIN

O quiz roda 100% via **Supabase RPC**:
- `get_quiz_questions()` — busca perguntas randomizadas
- `submit_match()` — validação e scoring server-side
- `get_global_ranking()` — ranking por melhor partida única
- `get_my_ranking()` — posição do jogador

**Sistema de pontuação:** Apenas a **maior pontuação em uma única partida** vale para o ranking. Para subir, o jogador precisa superar seu próprio recorde.

## 💳 Pagamentos (Asaas)

- Checkout via Asaas API (criação de cliente + cobrança)
- Webhooks do Asaas passam por `webhook-asaas.php` na Hostinger (proxy PHP que responde 200 e encaminha para Google Apps Script)

## 🔧 Tecnologias

- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (animações)
- **Supabase** (Auth, Database, RPC)
- **Recharts** (gráficos do quiz)
