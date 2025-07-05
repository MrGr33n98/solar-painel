# Plano de Melhorias (MVP v1) - Branch: feature/mvp-v1-improvements

Este documento detalha as propostas de melhoria e novas funcionalidades para a próxima iteração do projeto, focando em aprimorar a experiência do usuário, a robustez do sistema e a eficiência do desenvolvimento.

---

### **1. Autenticação e Autorização (RBAC)**

*Objetivo: Fortalecer a segurança e o controle de acesso, garantindo que cada tipo de usuário (Admin, Vendedor, Comprador) tenha acesso apenas às funcionalidades e dados pertinentes à sua função.*

- [x] **Tarefa 1.1: Implementação de Controle de Acesso Baseado em Papéis (RBAC) no Backend**
    - **Descrição:**
        - **Desenvolvedor:** Adicionar lógica de verificação de `role` nas API Routes (`/api/products` POST, futuras rotas de admin/vendedor) para garantir que apenas usuários com a `role` apropriada possam executar certas ações. Utilizar a `SUPABASE_SERVICE_ROLE_KEY` para operações que exigem privilégios elevados no servidor, se necessário.
        - **DevOps:** Garantir que as verificações de role sejam eficientes e não introduzam latência excessiva nas requisições.
    - **Status:** ✅ Concluída

- [x] **Tarefa 1.2: Proteção de Rotas no Frontend com Base em Papéis**
    - **Descrição:**
        - **Desenvolvedor:** Aprimorar o `middleware.ts` para não apenas verificar a autenticação, mas também a `role` do usuário, redirecionando para páginas específicas ou de erro/acesso negado se a `role` não for permitida para a rota acessada (ex: `/admin` apenas para `ADMIN`, `/vendor` apenas para `VENDOR`).
        - **Marketing:** Melhorar a experiência do usuário com mensagens claras de acesso negado.
    - **Status:** ✅ Concluída

- [x] **Tarefa 1.3: Fluxo de Registro de Usuários**
    - **Descrição:**
        - **Desenvolvedor:** Criar uma página de registro (`/app/register/page.tsx`) e implementar a funcionalidade de `supabase.auth.signUp` para permitir que novos usuários se cadastrem.
        - **Marketing:** Garantir um fluxo de registro intuitivo e com feedback claro.
    - **Status:** ✅ Concluída

- [x] **Tarefa 1.4: Recuperação de Senha**
    - **Descrição:**
        - **Desenvolvedor:** Implementar o fluxo de "Esqueceu a Senha" utilizando as funcionalidades do Supabase para envio de e-mail de redefinição e página de redefinição de senha.
        - **Marketing:** Essencial para a usabilidade e retenção de usuários.
    - **Status:** ✅ Concluída

---

### **2. Gerenciamento de Produtos (Avançado)**

*Objetivo: Aprimorar a funcionalidade de produtos para uma experiência mais rica e completa para vendedores e compradores.*

- [x] **Tarefa 2.1: Upload de Imagens de Produtos para o Supabase Storage**
    - **Descrição:**
        - **Desenvolvedor:** Modificar o formulário de adição de produtos (`/vendor/products/add/page.tsx`) para permitir o upload de arquivos de imagem diretamente para o Supabase Storage. Atualizar o `Product` model no `schema.prisma` para armazenar as URLs das imagens.
        - **DevOps:** Configurar políticas de segurança (RLS) no Supabase Storage para uploads.
        - **Marketing:** Imagens de alta qualidade são cruciais para a atratividade do produto.
    - **Status:** ✅ Concluída

- [x] **Tarefa 2.2: Página de Detalhes do Produto (Comprador)**
    - **Descrição:**
        - **Desenvolvedor:** Criar um novo endpoint de API (`GET /api/products/[id]`) para buscar detalhes de um único produto. A página `/buyer/products/[id]/page.tsx` deve consumir este endpoint e exibir todas as informações do produto (nome, descrição, preço, imagens, especificações, garantia, certificações).
        - **Marketing:** Apresentar todas as informações relevantes para o comprador tomar uma decisão.
    - **Status:** ✅ Concluída

- [x] **Tarefa 2.3: Filtragem e Busca Avançada de Produtos**
    - **Descrição:**
        - **Desenvolvedor:** Implementar lógica de filtragem no backend para a API de listagem de produtos (`GET /api/products`) por categoria, faixa de preço, vendedor, etc.
        - **Marketing:** Permitir que os usuários encontrem produtos específicos de forma mais eficiente.
    - **Status:** ✅ Concluída

---

### **3. Melhorias de UI/UX e Experiência do Desenvolvedor**

*Objetivo: Refinar a interface do usuário para uma experiência mais fluida e otimizar o processo de desenvolvimento.*

- [x] **Tarefa 3.1: Validação de Formulários Robusta (Frontend e Backend)**
    - **Descrição:**
        - **Desenvolvedor:** Integrar uma biblioteca de validação (ex: Zod) para validar dados de formulários no frontend (adição/edição de produtos, login, registro) e replicar essa validação no backend (API Routes) para garantir a integridade dos dados.
        - **Marketing:** Reduzir erros de entrada do usuário e melhorar a qualidade dos dados.
    - **Status:** ✅ Concluída

- [x] **Tarefa 3.2: Indicadores de Carregamento e Estados Vazios**
    - **Descrição:**
        - **Desenvolvedor:** Implementar indicadores visuais de carregamento (skeletons, spinners) para melhorar a percepção de performance. Adicionar estados vazios (empty states) para listas de produtos, carrinho, etc., quando não houver dados.
        - **Marketing:** Melhorar a experiência do usuário durante o carregamento de dados e em cenários sem conteúdo.
    - **Status:** ✅ Concluída

- [x] **Tarefa 3.3: Tratamento de Erros e Notificações Consistentes**
    - **Descrição:**
        - **Desenvolvedor:** Utilizar o `useToast` de forma consistente para todas as mensagens de sucesso, erro e informação em todo o aplicativo. Implementar um sistema de logging de erros mais robusto (ex: Sentry) para monitoramento em produção.
        - **DevOps:** Monitorar e reagir proativamente a erros.
        - **Marketing:** Feedback claro e consistente para o usuário.
    - **Status:** ✅ Concluída

- [x] **Tarefa 3.4: Otimização de Performance (Prisma e Banco de Dados)**
    - **Descrição:**
        - **Desenvolvedor:** Analisar e otimizar queries do Prisma. Garantir que o Prisma Client seja instanciado e reutilizado corretamente.
        - **DevOps:** Adicionar índices no `schema.prisma` para colunas frequentemente consultadas (ex: `email` em `User`, `vendorId` em `Product`, `category` em `Product`).
    - **Status:** ✅ Concluída

- [x] **Tarefa 3.5: Configuração de CI/CD Básico**
    - **Descrição:**
        - **DevOps:** Configurar um pipeline de CI/CD (ex: GitHub Actions, Vercel/Netlify Integrations) para automatizar testes, linting e deploy.
        - **Desenvolvedor:** Garantir que o código passe por linting e type-checking automaticamente em cada push.
    - **Status:** ✅ Concluída

---

### **4. Próximos Passos**

Após a conclusão das tarefas do MVP v1, podemos considerar funcionalidades mais avançadas como:
- Carrinho de Compras e Checkout
- Gerenciamento de Pedidos
- Avaliações e Comentários de Produtos
- Notificações em Tempo Real
- Dashboard de Vendedor e Admin mais completos

Este plano é um guia e pode ser ajustado conforme as prioridades e o feedback.
