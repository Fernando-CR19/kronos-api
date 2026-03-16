<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <strong>Kronos API</strong> — Backend of the Kronos personal calendar app, built with NestJS + PostgreSQL.
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

## Description

REST API for the [Kronos](https://github.com/your-user/kronos-app) mobile app — a personal calendar with offline-first sync, color tags, and local notifications. Built with [NestJS](https://github.com/nestjs/nest), Prisma, and PostgreSQL.

## Requirements

- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

## Getting started

### 1. Install dependencies

```bash
$ yarn install
```

### 2. Configure environment variables

```bash
$ cp .env.example .env
```

Open `.env` and fill in the variables:

```env
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=mnemo

DATABASE_URL=postgresql://your_user:your_password@localhost:5434/mnemo?schema=public
```

### 3. Start the database

```bash
# First time — create and start the container
$ docker compose up -d

# After the first time — just start
$ yarn db:start
```

### 4. Run database migrations

```bash
$ yarn prisma migrate deploy
```

### 5. Start the API

```bash
# Development
$ yarn start:dev

# Production
$ yarn start:prod
```

The API will be available at `http://localhost:3000`.

## Database commands

```bash
# Start the database container
$ yarn db:start

# Stop the database container
$ yarn db:stop

# Reset the database (WARNING: deletes all data)
$ yarn db:reset
```

## Prisma commands

```bash
# Generate Prisma client
$ yarn prisma generate

# Create a new migration
$ yarn prisma migrate dev --name your_migration_name

# Apply pending migrations
$ yarn prisma migrate deploy
```

## Compile and run

```bash
# Development (watch mode)
$ yarn start:dev

# Debug mode
$ yarn start:debug

# Production
$ yarn start:prod
```

## Run tests

```bash
# Unit tests
$ yarn test

# E2E tests
$ yarn test:e2e

# Test coverage
$ yarn test:cov
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Kronos App Repository](https://github.com/Fernando-CR19/kronos-app)

## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
