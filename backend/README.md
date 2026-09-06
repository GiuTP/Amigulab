<a id="readme-top"></a>

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GPL License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <h3 align="center">⚡ Amigulab — Backend API</h3>

  <p align="center">
    API RESTful desenvolvida em Go (Golang) com roteador Chi, persistência em PostgreSQL (Neon.tech) e autenticação criptográfica via Google OAuth.
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
    <li><a href="#-sobre-o-backend">Sobre o Backend</a>
      <ul>
        <li><a href="#-construído-com">Construído com</a></li>
      </ul>
    </li>
    <li><a href="#-funcionalidades-e-segurança">Funcionalidades e Segurança</a></li>
    <li><a href="#-endpoints-da-api">Endpoints da API</a></li>
    <li><a href="#-modelo-de-dados-postgresql">Modelo de Dados (PostgreSQL)</a></li>
    <li><a href="#-estrutura-do-projeto">Estrutura do Projeto</a></li>
    <li>
      <a href="#-instalação-e-execução">Instalação e Execução</a>
      <ul>
        <li><a href="#-pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#-variáveis-de-ambiente">Variáveis de Ambiente</a></li>
        <li><a href="#-execução-local">Execução Local</a></li>
      </ul>
    </li>
    <li><a href="#-licença">Licença</a></li>
    <li><a href="#-contato">Contato</a></li>
    <li><a href="#-agradecimentos">Agradecimentos</a></li>
  </ol>
</details>

---

## ⚡ Sobre o Backend

O backend do **Amigulab** é um microsserviço monolítico enxuto e performático escrito em **Go**, projetado para atuar como o guarda dos dados dos trabalhos de crochê e das operações administrativas da plataforma.

A escolha de Go se deu pela velocidade de inicialização, consumo mínimo de memória RAM (ideal para instâncias serverless e tiers gratuitos como Render) e forte segurança de tipos em tempo de compilação.

A camada de dados integra-se com **PostgreSQL** hospedado na nuvem via **Neon.tech**, tirando proveito de tipos nativos como arrays de texto (`TEXT[]`) para armazenar listas de materiais sem a sobrecarga de tabelas intermediárias de junção.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

### 🛠 Construído com

* [![Go][Go-badge]][Go-url]
* [![PostgreSQL][PostgreSQL-badge]][PostgreSQL-url]
* [![Neon][Neon-badge]][Neon-url]
* [![Google Cloud][GoogleCloud-badge]][GoogleCloud-url]

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🔒 Funcionalidades e Segurança

- **Operações CRUD Completas** — criação, listagem paginada, consulta por identificador único, atualização e exclusão de trabalhos.
- **Validação Criptográfica de Tokens ID** — uso do SDK oficial `google.golang.org/api/idtoken` para checagem da assinatura pública emitida pelo Google, expiração e integridade do token sem necessitar de senhas em banco.
- **Autorização por Allowlist Estrita** — somente requisições portando tokens emitidos para a conta definida em `ADMIN_EMAIL` possuem privilégios de escrita ou exclusão (status `403 Forbidden` para e-mails não autorizados).
- **CORS Flexível e Dinâmico** — middleware configurado para receber origens autorizadas via variável `ALLOWED_ORIGINS` ou `FRONTEND_URL`, com suporte nativo a `http://localhost:3000` em ambiente local.
- **Proteção contra Vazamento de Erros** — mensagens genéricas nos retornos HTTP (`500`, `404`, `400`), restringindo stack traces e mensagens cruas de banco aos logs internos do servidor via `log.Printf`.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📡 Endpoints da API

### Públicos (Acesso Livre)

| Método | Rota | Descrição | Resposta de Sucesso |
|--------|------|-----------|---------------------|
| `GET` | `/api/amigurumis?limit=10&page=1` | Lista amigurumis com suporte a paginação | `200 OK` (Array JSON) |
| `GET` | `/api/amigurumis/{id}` | Retorna detalhes completos de uma peça | `200 OK` (Objeto JSON) |

### Administrativos (Requerem Header `Authorization: Bearer <google_id_token>`)

| Método | Rota | Descrição | Resposta de Sucesso |
|--------|------|-----------|---------------------|
| `POST` | `/api/amigurumis` | Cria um novo trabalho no catálogo | `201 Created` |
| `PUT` | `/api/amigurumis/{id}` | Atualiza dados e metadados de um trabalho existente | `200 OK` |
| `DELETE`| `/api/amigurumis/{id}` | Remove um trabalho do banco de dados | `200 OK` |

#### Exemplo de Payload (`POST /api/amigurumis`)

```json
{
  "name": "Snoopy Piloto",
  "image_url": "https://res.cloudinary.com/demo/image/upload/snoopy.jpg",
  "difficulty": 3,
  "satisfaction": 5,
  "time_spent_hours": 12.5,
  "materials": [
    "Fio Amigurumi Branco e Preto",
    "Agulha 2.5mm",
    "Fibra Siliconada",
    "Olhos com trava de segurança"
  ],
  "story": "Projeto confeccionado sob encomenda especial, com detalhes na touca de aviador."
}
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🗄 Modelo de Dados (PostgreSQL)

O schema do banco de dados foi desenhado para ser enxuto e estritamente tipado:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS amigurumis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    satisfaction INT NOT NULL CHECK (satisfaction BETWEEN 1 AND 5),
    time_spent_hours NUMERIC(5, 2) NOT NULL,
    materials TEXT[] NOT NULL DEFAULT '{}',
    story TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 📁 Estrutura do Projeto

```
backend/
├── internal/
│   ├── database/            # Pool de conexões PostgreSQL (pgx/database/sql)
│   ├── handlers/            # Controladores das rotas HTTP (CRUD)
│   ├── models/              # Structs Go para deserialização de JSON e banco
│   └── repository/          # Consultas SQL nativas e operações de persistência
├── go.mod                   # Declaração do módulo Go e dependências diretas
├── go.sum                   # Verificação criptográfica de hashes das dependências
├── main.go                  # Setup do router Chi, middlewares e porta HTTP
└── README.md                # Documentação técnica do backend
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

---

## 🚀 Instalação e Execução

### 📦 Pré-requisitos

- **Go** 1.22 ou superior instalado
- Instância ativa de banco de dados **PostgreSQL** (local ou [Neon.tech](https://neon.tech))
- **Google OAuth Client ID** configurado

### ⚙ Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
# Porta do servidor HTTP
PORT=8080

# String de conexão do PostgreSQL
DATABASE_URL=postgresql://neondb_owner:senha@ep-exemplo.neon.tech/neondb?sslmode=require

# Google OAuth (ID de cliente da sua aplicação)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com

# E-mail com privilégios de administrador
ADMIN_EMAIL=seu-email@gmail.com

# Origens permitidas pelo CORS (separadas por vírgula)
ALLOWED_ORIGINS=http://localhost:3000,https://seu-frontend.vercel.app
```

### 💻 Execução Local

Na pasta `backend/`:

```sh
# Baixa e organiza as dependências
go mod tidy

# Executa o servidor em desenvolvimento
go run main.go

# Compila o binário de produção
go build -o server .

# Executa o binário compilado
./server
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

* [Chi Router](https://github.com/go-chi/chi) — roteador HTTP leve e idiomático para Go
* [pgx](https://github.com/jackc/pgx) — driver PostgreSQL de alta performance para Go
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) — template base deste README

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
[Go-badge]: https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white
[Go-url]: https://go.dev/
[PostgreSQL-badge]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Neon-badge]: https://img.shields.io/badge/Neon.tech-00E599?style=for-the-badge&logo=postgresql&logoColor=black
[Neon-url]: https://neon.tech/
[GoogleCloud-badge]: https://img.shields.io/badge/Google_Cloud_OAuth-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white
[GoogleCloud-url]: https://cloud.google.com/
