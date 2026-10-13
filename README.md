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

~~~powershell
cd apps/api
npm test
npm run build

cd ../mobile
npm run lint
npm test
~~~

## APK de debug

Antes de gerar um APK para instalar em um celular, a API precisa estar
publicada ou acessivel pela rede local. O endereco 10.0.2.2 funciona apenas
no emulador Android. Ajuste apps/mobile/src/config/api.ts para o endereco que
o celular consegue acessar.

Para gerar o APK no Windows:

~~~powershell
cd apps/mobile/android
.\gradlew.bat assembleDebug
~~~

O arquivo gerado fica em:

~~~text
apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
~~~

Publique esse arquivo em um GitHub Release ou Google Drive e adicione o link
nesta secao antes de enviar o repositorio para avaliacao.

## Com mais tempo

- Autenticacao com JWT em vez do header de usuario
- Endpoint para carregar os check-ins de todos os habitos de uma vez
- Testes de integracao da API e testes de interacao no mobile
