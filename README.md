<a id="readme-top"></a>

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GPL License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <h3 align="center">🧶 Amigulab</h3>

  <p align="center">
    Vitrine digital e diário de artesanato para projetos de crochê e amigurumis, desenvolvido com Next.js e Go.
    <br />
    <a href="https://github.com/GiuTP/Amigulab/issues/new?labels=bug">Reportar Bug</a>
    &middot;
    <a href="https://github.com/GiuTP/Amigulab/issues/new?labels=enhancement">Sugerir Melhoria</a>
  </p>
</div>

---

<!-- SUMÁRIO -->
<details>
  <summary>Sumário</summary>
  <ol>
    <li><a href="#-sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#-construído-com">Construído com</a></li>
      </ul>
    </li>
    <li><a href="#-funcionalidades">Funcionalidades</a></li>
    <li><a href="#-arquitetura-e-fluxo-de-dados">Arquitetura e Fluxo de Dados</a></li>
    <li><a href="#-estrutura-do-projeto">Estrutura do Projeto</a></li>
    <li>
      <a href="#-instalação">Instalação</a>
      <ul>
        <li><a href="#-pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#-configuração-do-backend-go">Configuração do Backend (Go)</a></li>
        <li><a href="#-configuração-do-frontend-nextjs">Configuração do Frontend (Next.js)</a></li>
      </ul>
    </li>
    <li><a href="#-variáveis-de-ambiente">Variáveis de Ambiente</a></li>
    <li><a href="#-deploy">Deploy</a></li>
    <li><a href="#-licença">Licença</a></li>
    <li><a href="#-contato">Contato</a></li>
    <li><a href="#-agradecimentos">Agradecimentos</a></li>
  </ol>
</details>

---

## 🧶 Sobre o Projeto

![Amigulab Banner](frontend/public/juninos.jpg)

**Amigulab** é uma vitrine digital e diário de artesanato criado para expor peças autorais de crochê/amigurumi.

Diferente de um e-commerce tradicional com carrinho de compras, o propósito central do Amigulab é registrar a jornada criativa de cada peça artesanal: os desafios técnicos superados, a contagem de tempo investido, os materiais utilizados (fios, agulhas, enchimentos), o nível de complexidade e a narrativa por trás de sua concepção.

A aplicação adota uma arquitetura moderna desacoplada (monorepo), combinando um frontend reativo em Next.js (App Router) com um backend em Go, banco de dados relacional PostgreSQL hospedado na nuvem e autenticação restrita via Google OAuth.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

### 🛠 Construído com

* [![Next.js][Next-badge]][Next-url]
* [![React][React-badge]][React-url]
* [![TypeScript][TypeScript-badge]][TypeScript-url]
* [![Tailwind CSS][Tailwind-badge]][Tailwind-url]
* [![Go][Go-badge]][Go-url]
* [![PostgreSQL][PostgreSQL-badge]][PostgreSQL-url]
* [![Cloudinary][Cloudinary-badge]][Cloudinary-url]

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## ✨ Funcionalidades

- **Vitrine e Galeria Interativa** — visualização em grid responsivo com cards dinâmicos que se adaptam a diferentes resoluções (mobile, tablet e desktop).
- **Filtros Multicritério** — busca instantânea por nome da peça, nota de dificuldade (1 a 5), tempo máximo de confecção (horas) e seleção dinâmica por materiais utilizados.
- **Ficha Técnica Detalhada** — página individual para cada amigurumi exibindo história, tempo gasto, materiais em tags interativas e satisfação do autor.
- **Painel Administrativo Protegido** — gerenciamento completo (criação, edição e exclusão de trabalhos) restrito ao autor da plataforma via Google OAuth 2.0.
- **Upload Otimizado de Imagens** — integração direta com Cloudinary para entrega rápida e CDN de mídia em alta resolução.
- **Formulário de Contato Integrado** — envio direto de mensagens para a caixa de e-mail do autor através da API do Resend.
- **Navegação Mobile Fluida** — menu hambúrguer com transições suaves e travamento de scroll nativo em dispositivos móveis.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🏛 Arquitetura e Fluxo de Dados

```
[ Usuário / Navegador ]
         │
         ▼
[ Frontend: Next.js 16 (Vercel) ]
   ├── Server Components & SSR
   ├── NextAuth (Google Provider)
   └── Resend API (Envio de E-mails)
         │  (Chamadas REST com Bearer Token)
         ▼
[ Backend: Go REST API (Render) ]
   ├── Chi Router + CORS Dinâmico
   ├── Google ID Token Validator (AuthMiddleware)
   └── Cloudinary SDK (Mídia)
         │
         ▼
[ Banco de Dados: PostgreSQL (Neon.tech) ]
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📁 Estrutura do Projeto

```
Amigulab/
├── backend/                         # Servidor e API RESTful em Go
│   ├── internal/
│   │   ├── database/                # Conexão com PostgreSQL (pgx)
│   │   ├── handlers/                # Controladores HTTP (CRUD de amigurumis)
│   │   ├── models/                  # Structs e tipos do domínio
│   │   └── repository/              # Queries SQL e acesso ao banco
│   ├── go.mod                       # Módulos e dependências Go
│   ├── go.sum                       # Checksums de dependências
│   ├── main.go                      # Ponto de entrada do servidor HTTP
│   └── README.md                    # Documentação técnica do backend
├── frontend/                        # Aplicação Web em Next.js (App Router)
│   ├── app/                         # Rotas (Home, Galeria, Work, Admin)
│   ├── components/                  # Componentes reutilizáveis (Sidebar, Cards, Contato)
│   ├── lib/                         # Clientes HTTP (API), autenticação e utilitários
│   ├── public/                      # Imagens estáticas e favicons
│   ├── types/                       # Definições de tipos TypeScript
│   ├── package.json                 # Dependências e scripts npm
│   ├── next.config.ts               # Configuração do Next.js
│   └── README.md                    # Documentação técnica do frontend
├── AGENTS.md                        # Fonte da verdade arquitetural
├── LICENSE                          # Licença GNU GPLv3
└── README.md                        # Documentação global do projeto
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🚀 Instalação

### 📦 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Go** (versão 1.22 ou superior)
- **Node.js** (versão 20 ou superior) e gerenciador de pacotes **npm**
- Conta no **Neon.tech** (PostgreSQL na nuvem) ou instância PostgreSQL local
- Conta no **Cloudinary** (armazenamento e otimização de imagens)
- Credenciais configuradas no **Google Cloud Console** (OAuth 2.0 Client ID)

---

### ⚙ Configuração do Backend (Go)

1. Acesse o diretório do backend:
   ```sh
   cd backend
   ```

2. Instale as dependências Go:
   ```sh
   go mod tidy
   ```

3. Crie o arquivo `.env` no diretório `backend/` com base no exemplo:
   ```env
   PORT=8080
   DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require
   GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
   ADMIN_EMAIL=seu-email@gmail.com
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. Inicie o servidor da API:
   ```sh
   go run main.go
   ```

O backend estará ativo em `http://localhost:8080`.

---

### ⚙ Configuração do Frontend (Next.js)

1. Em outro terminal, acesse a pasta do frontend:
   ```sh
   cd frontend
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Crie o arquivo `.env.local` na pasta `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=sua-chave-secreta-aleatoria

   ADMIN_EMAIL=seu-email@gmail.com
   GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu-google-client-secret

   RESEND_API_KEY=re_sua_chave_resend

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
   ```

4. Execute o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```

Abra [http://localhost:3000](http://localhost:3000) no navegador para acessar a aplicação.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🔐 Variáveis de Ambiente

| Variável | Onde Configurar | Descrição |
|----------|-----------------|-----------|
| `DATABASE_URL` | Backend | String de conexão do PostgreSQL (Neon.tech) |
| `PORT` | Backend | Porta HTTP do servidor Go (padrão: `8080`) |
| `ALLOWED_ORIGINS` | Backend | Origens permitidas pelo CORS (separadas por vírgula) |
| `GOOGLE_CLIENT_ID` | Backend & Frontend | Client ID OAuth 2.0 da Google |
| `GOOGLE_CLIENT_SECRET`| Frontend | Client Secret OAuth 2.0 da Google |
| `ADMIN_EMAIL` | Backend & Frontend | E-mail do autor com permissão administrativa |
| `NEXTAUTH_URL` | Frontend | URL canônica da aplicação frontend |
| `NEXTAUTH_SECRET` | Frontend | Chave para criptografia dos cookies de sessão |
| `NEXT_PUBLIC_API_URL` | Frontend | URL base da API do Go (`http://localhost:8080` ou URL de produção) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Frontend | Nome da conta no Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Frontend | Preset de upload unsigned do Cloudinary |
| `RESEND_API_KEY` | Frontend | Chave de API do Resend para envio de e-mails de contato |

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🌐 Deploy

A aplicação foi planejada para hospedagem em camadas gratuitas:

- **Frontend:** [Vercel](https://vercel.com/) (Root Directory: `frontend/`)
- **Backend:** [Render](https://render.com/) ou [Railway](https://railway.app/) (Root Directory: `backend/`)
- **Banco de Dados:** [Neon.tech](https://neon.tech/) (PostgreSQL Serverless)
- **Mídia:** [Cloudinary](https://cloudinary.com/) (Media CDN)

> Lembre-se de configurar as URLs de redirecionamento autorizadas do Google OAuth no Google Cloud Console com o domínio final gerado pelo deploy.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📄 Licença

Este projeto está distribuído sob a licença **GPLv3**. Consulte o arquivo [`LICENSE`](LICENSE) para obter mais informações.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📬 Contato

GiuTP — [github.com/GiuTP](https://github.com/GiuTP)

E-mail — giulianotpt@gmail.com

Link do projeto: [https://github.com/GiuTP/Amigulab](https://github.com/GiuTP/Amigulab)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🙏 Agradecimentos

* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) — template base deste README
* [Lucide Icons](https://lucide.dev/) — conjunto de ícones minimalistas
* [shadcn/ui](https://ui.shadcn.com/) — referências para componentes acessíveis

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

<!-- MARKDOWN LINKS & IMAGES -->
[stars-shield]: https://img.shields.io/github/stars/GiuTP/Amigulab.svg?style=for-the-badge
[stars-url]: https://github.com/GiuTP/Amigulab/stargazers
[issues-shield]: https://img.shields.io/github/issues/GiuTP/Amigulab.svg?style=for-the-badge
[issues-url]: https://github.com/GiuTP/Amigulab/issues
[license-shield]: https://img.shields.io/github/license/GiuTP/Amigulab.svg?style=for-the-badge
[license-url]: https://github.com/GiuTP/Amigulab/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/giuliano-tavares/
[Next-badge]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React-badge]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[TypeScript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Go-badge]: https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white
[Go-url]: https://go.dev/
[PostgreSQL-badge]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Cloudinary-badge]: https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white
[Cloudinary-url]: https://cloudinary.com/