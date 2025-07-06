# Solar Panel Project

## Development

Siga os passos abaixo para iniciar o projeto localmente:

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**

   Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme o seu ambiente.

3. **Execute as migrações do banco de dados**

   ```bash
   npm run prisma:migrate
   ```

4. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

## Scripts

Utilize os comandos abaixo para interagir com o projeto:

- `npm run dev` – inicia o servidor de desenvolvimento do Next.js.
- `npm run build` – gera a versão de produção.
- `npm run start` – inicia a aplicação já compilada.
- `npm run prisma:generate` – executa `prisma generate` para criar o client.
- `npm run prisma:migrate` – aplica as migrações do banco de dados com `prisma migrate deploy`.

## Testes

Execute todos os testes com o comando:

```bash
npm run test
```
