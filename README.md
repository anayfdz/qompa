# NestJS + Encore Example

This is an [Encore.ts](https://encore.dev/) + [NestJS](https://docs.nestjs.com/) example. It's a great way to learn how to combine Encore's backend 
capabilities with a modern web framework — perfect for building a web app.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/ts/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=ts/nestjs
```

## Running locally
```bash
encore run
```

You can also access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash) on <http://localhost:9400/> to view traces, API documentation, and more.

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!

```
qompa
├─ .encore
│  ├─ build
│  │  └─ combined
│  │     └─ combined
│  │        ├─ main.mjs
│  │        └─ main.mjs.map
│  └─ manifest.json
├─ .eslintrc.js
├─ .prettierrc
├─ README.md
├─ encore.app
├─ encore.gen
│  ├─ auth
│  │  └─ index.ts
│  ├─ clients
│  │  ├─ index.d.ts
│  │  └─ index.js
│  └─ internal
│     ├─ auth
│     │  └─ auth.ts
│     ├─ clients
│     │  └─ nest
│     │     ├─ endpoints.d.ts
│     │     ├─ endpoints.js
│     │     └─ endpoints_testing.js
│     └─ entrypoints
│        ├─ combined
│        │  └─ main.ts
│        ├─ gateways
│        │  └─ api-gateway
│        │     └─ main.ts
│        └─ services
│           └─ nest
│              └─ main.ts
├─ package-lock.json
├─ package.json
├─ src
│  ├─ app.module.ts
│  ├─ applicationContext.ts
│  ├─ auth
│  │  └─ authHandler.ts
│  ├─ cats
│  │  ├─ cats.controller.ts
│  │  ├─ cats.module.ts
│  │  ├─ cats.providers.ts
│  │  ├─ cats.service.ts
│  │  ├─ dto
│  │  │  └─ create-cat.dto.ts
│  │  └─ interfaces
│  │     └─ cat.interface.ts
│  ├─ core
│  │  ├─ database.module.ts
│  │  ├─ database.providers.ts
│  │  └─ migrations
│  │     └─ 1_create_tables.up.sql
│  └─ encore.service.ts
└─ tsconfig.json

```