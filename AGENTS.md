# Especificação de Arquitetura & Contexto do Projeto: Amigulab

Este documento serve como a **única fonte da verdade (Single Source of Truth)** técnica e funcional para o desenvolvimento do projeto. Ele foi desenhado para contextualizar desenvolvedores e agentes autônomos de IA para a geração de código com fidelidade e sem retrabalho.

---

## 1. Visão Geral do Produto

*   **Propósito:** Vitrine digital, acervo técnico e blog autoral para expor peças artesanais de crochet/amigurumi.
*   **Público-Alvo Principal:** Avaliadores de processos seletivos e editais técnicos (ex: Apple Developer Academy) e entusiastas/comunidade de artesanato.
*   **Premissa Chave:** Não é um e-commerce com carrinho ou gateway de pagamento no momento. É um diário de engenharia e artesanato com alta qualidade visual e técnica.
*   **Público vs. Privado:**
    *   **Público:** Visualização da Home, Galeria com paginação e Páginas de Detalhes de cada peça (com história, metadados de execução, materiais e fotos).
    *   **Privado (Admin):** Gerenciamento completo (criação, edição, exclusão) acessível exclusivamente pelo autor da aplicação.

---

## 2. Stack Tecnológica & Decisões Arquiteturais

| Camada | Tecnologia | Decisão & Racional |
| :--- | :--- | :--- |
| **Frontend** | React 19 / Next.js (App Router) + TypeScript + Tailwind CSS | Performance SSR/SSG nativa para imagens e SEO, arquitetura moderna em componentes, estética minimalista e veloz. |
| **Componentes UI** | shadcn/ui + Lucide Icons | Componentes headless, acessíveis e customizáveis, evitando excesso de CSS manual e garantindo design limpo. |
| **Backend** | Go (Golang) | Performance elevada, tipagem estática forte, modelo de concorrência sólido e padrão REST desacoplado. |
| **Banco de Dados** | PostgreSQL (Hospedado na nuvem via Neon.tech) | Banco relacional clássico, confiável, tipado e com suporte nativo a arrays (`TEXT[]`). Custo zero. |
| **Armazenamento de Mídia** | Cloudinary | O banco armazena apenas strings de URL. O upload passa de forma segura via backend em Go para preservar credenciais. |
| **Autenticação** | Google OAuth 2.0 + JWT Customizado | Sem senhas em banco. O Go valida o token Google e confere se o e-mail bate com a variável de ambiente `ADMIN_EMAIL`. Se sim, gera JWT de sessão. |
| **Estratégia de Repositório**| Monorepo | Uma raiz Git única para manter o perfil do GitHub limpo, com pastas `frontend/` e `backend/` totalmente desacopladas. |
| **Hospedagem / Deploy** | Vercel (Front) + Render (Back) + Neon (BD) | Tier 100% gratuito com 99.9% de disponibilidade para avaliação profissional. |

---

## 3. Modelo de Dados (PostgreSQL)

O banco é deliberadamente enxuto e performático. Nenhuma imagem é armazenada em formato binário (bytes/BLOB) no banco.

### Tabela: `amigurumis`

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE amigurumis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    imagem_url VARCHAR(1024) NOT NULL,
    dificuldade INT NOT NULL CHECK (dificuldade BETWEEN 1 AND 5),
    satisfacao INT NOT NULL CHECK (satisfacao BETWEEN 1 AND 5),
    tempo_gasto_horas NUMERIC(5, 2) NOT NULL,
    materiais TEXT[] NOT NULL DEFAULT '{}',
    historia TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

> **Nota de Segurança:** Não existe tabela de usuários. A autorização é controlada no backend através de verificação de lista estrita (Allowlist) da variável `ADMIN_EMAIL`.

---

## 4. Contrato de API (RESTful Endpoints)

O backend em Go expõe os seguintes serviços:

### Públicos
*   `GET /api/amigurumis?page=1&limit=10`
    *   **Resposta (200 OK):**
        ```json
        {
          "data": [
            {
              "id": "e9b2c3a4-...",
              "nome": "Snoopy Amigurumi",
              "imagem_url": "https://res.cloudinary.com/.../snoopy.jpg",
              "dificuldade": 3,
              "satisfacao": 5,
              "tempo_gasto_horas": 8.5,
              "materiais": ["Fio Amigurumi Branco e Preto", "Agulha 2.5mm", "Fibra Siliconada"],
              "historia": "Projeto detalhado feito como encomenda...",
              "criado_em": "2026-03-15T14:30:00Z"
            }
          ],
          "pagination": {
            "current_page": 1,
            "total_pages": 4,
            "total_items": 38
          }
        }
        ```
*   `GET /api/amigurumis/:id`
    *   Retorna a entidade individual completa para a página de detalhes.

### Autenticação & Autorização
*   `POST /api/auth/google`
    *   **Payload de Entrada:** `{ "id_token": "token_jwt_recebido_do_google_no_front" }`
    *   **Validação no Go:** Verifica autenticidade do token junto aos servidores do Google e extrai o campo `email`. Se `email == os.Getenv("ADMIN_EMAIL")`, gera e assina um JWT próprio com expiração de 24 horas.
    *   **Resposta (200 OK):** `{ "token": "jwt_de_sessao_gerado_pelo_go" }`
    *   **Resposta (403 Forbidden):** `{ "error": "Acesso não autorizado para esta conta." }`

### Administrativos (Exigem Header `Authorization: Bearer <jwt_token>`)
*   `POST /api/amigurumis`
    *   Content-Type: `multipart/form-data` (recebe o arquivo de imagem e os campos de texto). O Go faz stream para o Cloudinary, recebe a URL segura e executa o `INSERT` no Neon.tech.
*   `PUT /api/amigurumis/:id`
    *   Edição de informações existentes (textos, tempo, satisfação, materiais).
*   `DELETE /api/amigurumis/:id`
    *   Remove o registro do banco de dados e executa chamada para exclusão do asset de mídia correspondente no Cloudinary.

---

## 5. Estrutura de Arquivos e Diretórios (Monorepo)

```text
amiguteca/
├── .git/
├── README.md
├── .gitignore
├── backend/
│   ├── go.mod
│   ├── go.sum
│   ├── .env.example
│   ├── main.go
│   ├── internal/
│   │   ├── config/          # Carregamento de variáveis de ambiente
│   │   ├── database/        # Conexão PostgreSQL (pgx / database/sql)
│   │   ├── handlers/        # Lógica das rotas HTTP
│   │   ├── middleware/      # Validador de JWT e CORS
│   │   ├── models/          # Structs de dados e tipos de entrada/saída
│   │   └── services/        # Integração com Cloudinary e Google OAuth
│   └── migrations/          # Scripts SQL de inicialização do schema
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── .env.example
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx                 # Home com Hero e Destaques
        │   ├── galeria/
        │   │   ├── page.tsx             # Grid com paginação
        │   │   └── [id]/page.tsx        # Ficha detalhada do projeto
        │   └── admin/
        │       ├── login/page.tsx       # Botão de autenticação Google
        │       ├── dashboard/page.tsx   # Tabela com listagem, editar e excluir
        │       └── novo/page.tsx        # Formulário de upload e cadastro
        ├── components/
        │   ├── ui/                      # Botões, inputs, cards (shadcn)
        │   ├── navbar.tsx
        │   ├── footer.tsx
        │   ├── amigurumi-card.tsx
        │   └── badge-material.tsx
        └── lib/
            ├── api.ts                   # Fetchers configurados
            └── utils.ts
```

---

## 6. Fluxo de Execução Recomendado para Agentes Autônomos

Ao instruir agentes de código, execute estritamente nesta ordem:

1. **Passo 1 (Schema BD):** Criar script SQL e validar conexão com PostgreSQL no Neon.tech.
2. **Passo 2 (Backend Base):** Criar `backend/main.go`, setup de router (ex: `chi` ou `gin`), conexão com banco e rota de saúde `GET /health`.
3. **Passo 3 (CRUD & Auth Go):** Implementar handlers públicos de listagem e detalhe; implementar middleware de JWT e rotas de administração.
4. **Passo 4 (Upload Cloudinary):** Integrar SDK ou chamada direta de upload de mídia no backend.
5. **Passo 5 (Frontend Vitrine):** Desenvolver Home, Galeria e Página de Detalhes no Next.js consumindo a API local do Go.
6. **Passo 6 (Frontend Admin):** Desenvolver telas protegidas, fluxo Google Login e envio de formulário com FormData.
7. **Passo 7 (Deploy):** Configurar Vercel (Root Directory: `frontend/`) e Render (Root Directory: `backend/`).