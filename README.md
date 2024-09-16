<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="https://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

<br />

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- Typescript
- NestJs
- Axios
- TypeOrm
- Redis
- Postgres

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

**1. First, Clone this repository either using https or ssh:**

```bash
  $ git clone https://github.com/ganonym741/dating-apps-playground.git
```

**2. Install all dependencies**

```bash
  $ npm install
```

**3. Prepare husky, install husky in global environment.**

```bash
  $ npm -g install husky
```

**4. Prepare husky, initiate husky**

```bash
  $ npm run prepare
```

**5. Preparation for Migration**

```bash
  $ npm run migration:generate
```

**6. Run Migrate DB**

```bash
  $ npm run migration:run
```

**7. Run code, and enjoy the journey** **(^\_^)**

```bash
  $ npm run start:dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Or using docker compose

> Just running:

```bash
  $ docker compose up --build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Utilities

**1. API List.**
You need to run the service first then access its host:port/docs

**2. Encryption Ready.**
Uncomment Interceptor Request and/or Response in src/app.module.ts

**3. SQL Logging.**
as it was running on development the log will appear, deactivate it at src/@core/config/config.service.ts on getTypeOrmConfig function, disable logging value.

## TODO:

1. Can Upload Image to Goole Drive.
2. Can search by live location distance

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make this project such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please clone the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Clone the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m '{type}({scope}): {details}'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## File Journey

```graphql
├───.husky
│    └───\_
├───src
│   ├───@core
│   │   ├───config
│   │   ├───decorators
│   │   ├───guards
│   │   ├───interceptors
│   │   ├───logger
│   │   ├───middleware
│   │   ├───seeds
│   │   ├───service
│   │   ├───type
│   │   └───utils
│   ├───@model
│   ├───album
│   │   └───dto
│   ├───auth
│   │   └───dto
│   ├───migrations
│   │   └───seeds
│   ├───user
│   │   └───dto
│   └───user-action
├───.env
├───.gitignore
├───.lintstagedrc.js
├───.prettierignore
├───.prettierrc
├───eslintrc.json
├───commitlint.config.js
├───docker-compose.yaml
├───Dockerfile
├───package.json
├───package-lock.yaml
├───README.md
└───tsconfig.js
```
