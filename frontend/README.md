<a id="readme-top"></a>

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GPL License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <h3 align="center">🎨 Amigulab — Frontend</h3>

  <p align="center">
    Interface web reativa e minimalista desenvolvida com Next.js 16 (App Router), React 19 e Tailwind CSS v4 para a vitrine artesanal Amigulab.
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
    <li><a href="#-sobre-o-frontend">Sobre o Frontend</a>
      <ul>
        <li><a href="#-construído-com">Construído com</a></li>
      </ul>
    </li>
    <li><a href="#-funcionalidades-de-interface">Funcionalidades de Interface</a></li>
    <li><a href="#-rotas-da-aplicação">Rotas da Aplicação</a></li>
    <li><a href="#-estrutura-de-pastas">Estrutura de Pastas</a></li>
    <li>
      <a href="#-instalação-e-execução">Instalação e Execução</a>
      <ul>
        <li><a href="#-pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#-variáveis-de-ambiente">Variáveis de Ambiente</a></li>
        <li><a href="#-scripts-disponíveis">Scripts Disponíveis</a></li>
      </ul>
    </li>
    <li><a href="#-licença">Licença</a></li>
    <li><a href="#-contato">Contato</a></li>
    <li><a href="#-agradecimentos">Agradecimentos</a></li>
  </ol>
</details>

---

## 🎨 Sobre o Frontend

O frontend do **Amigulab** foi concebido sob uma estética visual limpa, acolhedora e minimalista, inspirada no próprio trabalho manual com agulhas e fios de crochê.

A aplicação utiliza os recursos mais recentes do **Next.js 16 com App Router** e **React 19**, usufruindo de Server-Side Rendering (SSR) e Streaming para máxima velocidade de carregamento, pontuações elevadas de Core Web Vitals (LCP/CLS) e indexação otimizada para motores de busca.

A autenticação é orquestrada através do **NextAuth.js** conectado ao provedor do Google, mantendo sessões protegidas sem necessidade de armazenamento de senhas locais.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

### 🛠 Construído com

* [![Next.js][Next-badge]][Next-url]
* [![React][React-badge]][React-url]
* [![TypeScript][TypeScript-badge]][TypeScript-url]
* [![Tailwind CSS][Tailwind-badge]][Tailwind-url]
* [![NextAuth.js][NextAuth-badge]][NextAuth-url]
* [![Resend][Resend-badge]][Resend-url]

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## ✨ Funcionalidades de Interface

- **Hero & Storytelling** — apresentação com tipografia leve, imagens prioritárias com `next/image` e navegação suave ancorada.
- **Filtros Dinâmicos na Galeria** — busca em tempo real combinando:
  - Nome do personagem ou peça;
  - Seletor de grau de dificuldade (1 a 5);
  - Sliders/input de tempo máximo gasto (horas);
  - Checkboxes dinâmicos gerados a partir dos materiais existentes no catálogo.
- **Ficha de Projeto com Indicadores** — exibição de notas de satisfação, tempo de execução, tags visuais de materiais e história de confecção.
- **Upload Unsigned para Cloudinary** — formulário de cadastro envia imagens em alta definição diretamente para a CDN, poupando tráfego do servidor de aplicação.
- **Formulário de Contato com Envio Real** — disparo assíncrono de mensagens para o e-mail do autor com feedback visual de envio via Resend.
- **Experiência Responsiva e Acessível** — drawer lateral adaptativo para dispositivos móveis com travamento de scroll e cursor estilizado para desktop.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🗺 Rotas da Aplicação

| Rota | Tipo | Acesso | Descrição |
|------|------|--------|-----------|
| `/` | SSR / Dinâmica | Público | Página inicial com apresentação, destaques da galeria e formulário de contato |
| `/galeria` | SSR + Client Filter | Público | Catálogo completo com painel lateral de filtros multicritério |
| `/work/[id]` | Dinâmica | Público | Ficha completa com foto, metadados, materiais e história da peça |
| `/new` | Client Form | Privado (Admin) | Formulário de upload de mídia e cadastro de novos amigurumis |
| `/work/[id]/edit` | Client Form | Privado (Admin) | Edição de informações e atualização de imagem do projeto |
| `/api/contact` | Route Handler | Público | Endpoint backend interno para envio de mensagens via Resend |
| `/api/auth/[...nextauth]` | Route Handler | Público | Gerenciamento de rotas de login/callback OAuth do Google |

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📁 Estrutura de Pastas

```
frontend/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Configuração de rotas do NextAuth
│   │   └── contact/route.ts             # Handler de disparo de e-mail via Resend
│   ├── galeria/
│   │   ├── GalleryClient.tsx            # Grid dinâmico e filtros de pesquisa
│   │   ├── GalleryHeader.tsx            # Cabeçalho da galeria com busca
│   │   └── page.tsx                     # Página SSR da galeria
│   ├── new/
│   │   └── page.tsx                     # Formulário de criação de trabalhos
│   ├── work/
│   │   └── [id]/
│   │       ├── edit/
│   │       │   ├── EditForm.tsx         # Formulário de edição de trabalho
│   │       │   └── page.tsx             # Página protegida de edição
│   │       ├── DeleteButton.tsx         # Ação de exclusão restrita a admin
│   │       └── page.tsx                 # Detalhe individual do amigurumi
│   ├── favicon.ico
│   ├── globals.css                      # Diretivas Tailwind CSS v4 e temas
│   ├── layout.tsx                       # Layout raiz com Sidebar e Providers
│   └── page.tsx                         # Página inicial (Hero, Sobre, Destaques)
├── components/
│   ├── layout/
│   │   ├── Providers.tsx                # Context provider da sessão NextAuth
│   │   └── Sidebar.tsx                  # Navegação desktop e menu hambúrguer móvel
│   ├── ui/
│   │   └── CustomCursor.tsx             # Efeito estético de cursor personalizado
│   └── ContactForm.tsx                  # Componente do formulário de contato
├── lib/
│   ├── api.ts                           # Métodos de consumo da API em Go
│   ├── auth.ts                          # Estratégia de autenticação Google OAuth
│   └── utils.ts                         # Funções auxiliares (cn, formatação)
├── public/                              # Imagens autorais e vetores estáticos
├── types/
│   └── index.ts                         # Interfaces TypeScript
├── package.json
├── tsconfig.json
└── next.config.ts
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🚀 Instalação e Execução

### 📦 Pré-requisitos

- **Node.js** 20.x ou superior
- **npm** (versão 10+) ou gerenciador equivalente

### ⚙ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz de `frontend/`:

```env
# URL da API Go (em produção, aponte para a URL do Render)
NEXT_PUBLIC_API_URL=http://localhost:8080

# NextAuth Config
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere_uma_chave_aleatoria_com_openssl_rand_base64_32

# Google OAuth (Admin)
ADMIN_EMAIL=seu-email@gmail.com
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret

# E-mail (Resend)
RESEND_API_KEY=re_sua_chave_resend

# Cloudinary (Upload de fotos)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nome_do_seu_cloud
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nome_do_upload_preset
```

### 💻 Scripts Disponíveis

Na pasta `frontend/`:

```sh
# Instala as dependências do projeto
npm install

# Inicia o servidor em modo de desenvolvimento (Turbopack)
npm run dev

# Executa o build de produção com verificação estrita de TypeScript
npm run build

# Inicia o servidor com o build de produção gerado
npm run start

# Executa o linter de código (ESLint)
npm run lint
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📄 Licença

Distribuído sob a licença **GPLv3**. Consulte [`LICENSE`](../LICENSE) para obter detalhes.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📬 Contato

GiuTP — [github.com/GiuTP](https://github.com/GiuTP)

E-mail — giulianotpt@gmail.com

Repositório: [https://github.com/GiuTP/Amigulab](https://github.com/GiuTP/Amigulab)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🙏 Agradecimentos

* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) — template base deste README
* [Tailwind CSS v4](https://tailwindcss.com/) — estilização moderna com utility-first CSS de alta performance
* [shadcn/ui](https://ui.shadcn.com/) — referências para componentes acessíveis e design minimalista
* [Lucide Icons](https://lucide.dev/) — conjunto de ícones leves e consistentes
* [NextAuth.js](https://next-auth.js.org/) — solução para autenticação segura com Google OAuth
* [Cloudinary](https://cloudinary.com/) — CDN e armazenamento otimizado de mídia na nuvem
* [Resend](https://resend.com/) — API moderna para entrega de e-mails do formulário de contato

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
[Next-badge]: https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React-badge]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[TypeScript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[NextAuth-badge]: https://img.shields.io/badge/NextAuth.js-purple?style=for-the-badge&logo=auth0&logoColor=white
[NextAuth-url]: https://next-auth.js.org/
[Resend-badge]: https://img.shields.io/badge/Resend-black?style=for-the-badge&logo=resend&logoColor=white
[Resend-url]: https://resend.com/
