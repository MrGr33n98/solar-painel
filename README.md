# Solar Panel Project

## Instalação

```bash
npm install
```

## Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto contendo as seguintes chaves:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto no Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública (`anon`) do Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: (opcional) chave de serviço para operações privilegiadas.
- `DATABASE_URL`: string de conexão do banco Postgres utilizada pelo Prisma.

## Executando em Modo de Desenvolvimento

Inicie o servidor com o comando:

```bash
npm run dev
```

## Dependências

Este projeto utiliza o **Supabase** como backend para autenticação, banco de dados e armazenamento. O acesso ao banco é feito por meio do **Prisma**, que gera o client usado nas rotas de API.
