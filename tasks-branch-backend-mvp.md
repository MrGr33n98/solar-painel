# Plano de Implementação do Backend (MVP) - Branch: feature/backend-mvp

Este documento detalha as features e tarefas para a implementação do backend MVP.

---

### **Feature 1: Configuração da Base do Backend e Banco de Dados**

*Objetivo: Preparar toda a infraestrutura necessária para o desenvolvimento do backend.*

- [ ] **Tarefa 1.1: Configurar o Projeto no Supabase**
    - **Descrição:** Criar um novo projeto na plataforma Supabase. Obter e armazenar de forma segura (em variáveis de ambiente, `.env.local`) a URL do projeto, a chave de API pública (`anon_key`) e a chave de serviço (`service_role_key`).
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 1.2: Instalar e Configurar o Prisma**
    - **Descrição:** Adicionar o Prisma como uma dependência de desenvolvimento. Inicializar o Prisma no projeto (`npx prisma init`), o que criará o diretório `prisma` e o arquivo `schema.prisma`.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 1.3: Conectar Prisma ao Supabase**
    - **Descrição:** Configurar o arquivo `schema.prisma` para usar o driver `postgresql` e adicionar a URL de conexão do banco de dados do Supabase (que inclui a senha) no arquivo `.env`.
    - **Status:** ⬜️ Pendente

---

### **Feature 2: Gerenciamento de Produtos**

*Objetivo: Criar a funcionalidade completa para que Vendedores possam criar produtos e Compradores possam visualizá-los.*

- [ ] **Tarefa 2.1: Modelar o Schema de `Product` e `User/Vendor`**
    - **Descrição:** No `schema.prisma`, definir os modelos para `User` (com um campo de `role` para diferenciar `Buyer`, `Vendor`, `Admin`) e `Product`. Estabelecer a relação onde um `Product` pertence a um `User` (o Vendedor).
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 2.2: Sincronizar o Schema com o Banco de Dados**
    - **Descrição:** Executar o comando `npx prisma db push` para criar as tabelas `User` e `Product` no banco de dados do Supabase com base no schema definido.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 2.3: Criar API Endpoint para Listar Produtos (`GET /api/products`)**
    - **Descrição:** Implementar uma API Route no Next.js que busca todos os produtos do banco de dados usando o Prisma Client e os retorna. Acesso público.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 2.4: Criar API Endpoint para Criar Produtos (`POST /api/products`)**
    - **Descrição:** Implementar uma API Route que recebe os dados de um novo produto. A rota deve ser protegida, permitindo o acesso apenas a usuários com a role `Vendor`.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 2.5: Integrar Frontend para Listar Produtos**
    - **Descrição:** Na página do Marketplace (`/buyer/marketplace`), fazer uma chamada `fetch` ao endpoint `GET /api/products` e exibir os produtos retornados em vez de dados estáticos.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 2.6: Integrar Frontend para Criar Produtos**
    - **Descrição:** No formulário de adicionar produto (`/vendor/products/add`), fazer uma chamada `fetch` ao endpoint `POST /api/products` ao submeter o formulário.
    - **Status:** ⬜️ Pendente

---

### **Feature 3: Autenticação de Usuários**

*Objetivo: Permitir que usuários se cadastrem e façam login na plataforma.*

- [ ] **Tarefa 3.1: Configurar a Autenticação do Supabase**
    - **Descrição:** Instalar os pacotes `@supabase/auth-helpers-nextjs` e `@supabase/supabase-js`. Configurar o "Auth Helper" do Supabase para Next.js (App Router) para gerenciar a sessão do usuário de forma integrada.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 3.2: Implementar o Formulário de Login**
    - **Descrição:** Modificar o componente `login-form.tsx` para usar o cliente do Supabase para realizar o login com email e senha.
    - **Status:** ⬜️ Pendente

- [ ] **Tarefa 3.3: Implementar a Proteção de Rotas**
    - **Descrição:** Utilizar o Auth Helper do Supabase para proteger as rotas de `Admin`, `Buyer` e `Vendor`, redirecionando usuários não autenticados para a página de login.
    - **Status:** ⬜️ Pendente
