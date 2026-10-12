# Namu Habits

Aplicacao mobile para criar habitos, registrar check-ins e acompanhar o progresso.

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
