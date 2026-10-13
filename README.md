# Namu Habits

Aplicacao mobile para criar habitos, registrar check-ins e acompanhar o progresso.

## Funcionalidades

- Cadastro e login de usuarios com senha protegida por bcrypt
- Criacao, listagem, edicao e exclusao de habitos
- Check-in e desmarcacao de habitos por data
- Dashboard com progresso diario, percentual semanal e streak atual
- Detalhe do habito com historico mensal de check-ins
- Alteracao de senha com confirmacao da senha atual

## Tecnologias

- Backend: Node.js, TypeScript, NestJS e TypeORM
- Banco de dados: MySQL executado com Docker Compose
- Mobile: React Native no bare workflow e React Navigation
- Qualidade: ESLint, Prettier e Jest

## Requisitos tecnicos atendidos

- API REST criada com Node.js, TypeScript, NestJS e MySQL.
- TypeORM utilizado para mapear as entidades e acessar o banco de dados.
- Aplicativo mobile criado em React Native bare workflow, sem Expo managed.
- Navegacao entre autenticacao, dashboard, lista, criacao e detalhe feita com
  React Navigation.
- Comunicacao entre app e backend feita por requisicoes HTTP para a API REST.
- Validacoes no mobile para campos obrigatorios e no backend por DTOs com
  class-validator.
- ESLint e Prettier configurados no projeto mobile.
- Testes unitarios com Jest configurados no backend e no mobile.
- Interface mobile organizada para criar, editar, excluir e acompanhar habitos.
- Projeto organizado como monorepo, com `apps/api` e `apps/mobile`.

## Decisoes tecnicas

- O backend usa validacao global do NestJS e DTOs para validar os dados
  recebidos pela API.
- Cada habito pertence a um usuario, e todas as consultas filtram pelo usuario
  autenticado no app.
- O banco impede check-ins duplicados com uma chave unica por habito e data.
- O streak considera somente os dias configurados para cada habito.
- A API usa o header x-user-id para manter o escopo simples do desafio. Em
  uma aplicacao publicada, o proximo passo seria substituir isso por JWT.

## Requisitos

- Node.js 22 ou superior
- Docker Desktop
- Android Studio com um emulador Android configurado

## Banco de dados

1. Crie o arquivo de ambiente a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

2. Inicie o MySQL:

```powershell
docker compose up -d
```

O schema esta centralizado em `seed.sql`. O Docker executa esse arquivo somente
quando cria o volume `mysql_data` pela primeira vez.

Para recriar o banco local depois de alterar o schema, execute:

```powershell
docker compose down -v
docker compose up -d
```

Esse comando remove todos os dados locais do banco.

## API

```powershell
cd apps/api
npm install
npm run start:dev
```

A API inicia na porta definida em `.env` (por padrao, `3001`).

## Mobile

Em outro terminal:

```powershell
cd apps/mobile
npm install
npm start
```

Com o Metro aberto, use outro terminal para instalar o app no emulador:

```powershell
cd apps/mobile
npm run android
```

Para o emulador Android, a API esta configurada em
`apps/mobile/src/config/api.ts` com o host `10.0.2.2`.

Para testar em um celular fisico conectado na mesma rede Wi-Fi, substitua
`API_HOST` pelo IPv4 do computador. Use `ipconfig` no PowerShell para encontrar
esse endereco.

## Testes e qualidade

```powershell
cd apps/api
npm test
npm run build

cd ../mobile
npm run lint
npm test
```

## Demonstracao

O fluxo principal do aplicativo pode ser visto neste
[video de demonstracao](https://drive.google.com/file/d/1jhGKct0Zh1nzIqvTXxxMtRqhCbfQLobB/view?usp=sharing).

Para avaliar o projeto localmente, siga as instrucoes de banco, API e mobile
descritas acima.

## Com mais tempo

- Autenticacao com JWT, para que o usuario seja identificado pelo token.
- Persistencia da sessao no celular, mantendo o usuario conectado depois de
  fechar e abrir o aplicativo.
- Endpoint para carregar os check-ins de todos os habitos de uma vez,
  reduzindo as requisicoes feitas na abertura do dashboard.
- Tela de carregamento enquanto os habitos e check-ins sao buscados pela API.
- Possibilidade de filtrar o historico por mes e navegar entre meses no
  detalhe do habito.
- Lembretes locais para os horarios definidos pelo usuario.
