# APIContratos

README simples para rodar o back-end ASP.NET e o front-end React.

## Estrutura

- `back-end/APIContratos`: API ASP.NET
- `frontend`: interface React com Vite

## Requisitos

- .NET SDK instalado
- Node.js e npm instalados
- SQL Server acessivel

## Configuracao do back-end

O projeto possui um arquivo de exemplo em:

- `back-end/APIContratos/appsettings.example.json`

Use esse arquivo como base para criar o seu:

- `back-end/APIContratos/appsettings.json`

O servidor originalmente esta configurado para usar esta connection string:

```json
"Server=localhost\\SQLEXPRESS;Database=APIContratosDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

Exemplo de fluxo:

1. Abra `back-end/APIContratos/appsettings.example.json`
2. Copie o conteudo para `back-end/APIContratos/appsettings.json`
3. Ajuste a string de conexao e a chave JWT conforme o seu ambiente

## Rodando o back-end

No terminal, a partir da raiz do repositório:

```powershell
cd back-end/APIContratos
dotnet restore
dotnet run
```

Por padrao, o projeto usa:

- `http://localhost:5063`
- `https://localhost:7028`

## Rodando o front-end

Em outro terminal, a partir da raiz do repositório:

```powershell
cd frontend
npm install
npm run dev
```

O front roda por padrao em:

- `http://localhost:5173`

## Observacao sobre a integracao

Durante o desenvolvimento, o Vite usa proxy para encaminhar chamadas de `/api` para o back-end em:

- `http://localhost:5063`

Por isso, para o sistema funcionar corretamente em ambiente local:

- o back-end precisa estar rodando
- o front-end precisa ser iniciado com `npm run dev`

## Comandos uteis

### Front-end

```powershell
cd frontend
npm run dev
npm run build
npm run lint
```

### Back-end

```powershell
cd back-end/APIContratos
dotnet run
dotnet build
```
