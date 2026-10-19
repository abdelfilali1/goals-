# Compass

Track daily progress against the objectives you set.

- **Objectives**: each belongs to a category (Family, Health, Work, Personal, Finance by default, and editable) and has a description, an optional target date, and sub-objectives.
- **To-do**: Day, Week and Month views. Each to-do links to an objective and one of its sub-objectives.
  - At the end of the day, tick what you finished and push the rest with **Next →**, or use **Move unfinished to tomorrow**.
  - Pushed to-dos show up under **Carried over** with their delay, for example **+5 d**.
  - To-dos left on a past day without being pushed show up under **Overdue**.
- **Progress**: completion overall, per category, per objective and per sub-objective, plus a cumulative chart and a daily completion chart. Only to-dos due today or earlier count.

Stack: Next.js 15, PostgreSQL with Prisma, and Tailwind CSS. One password protects the app.

## Run locally

```bash
# 1. Start a Postgres database (Docker example)
docker run -d --name progress-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=progress \
  -p 5432:5432 -v progress-pg-data:/var/lib/postgresql/data postgres:17

# 2. Configure
cp .env.example .env        # then set APP_PASSWORD and SESSION_SECRET

# 3. Install, migrate, run
npm install
npx prisma migrate dev
npm run dev                 # http://localhost:3000
```

Default categories are created automatically the first time you open the app.

## Deploy on Railway

1. Push this repository to GitHub.
2. In Railway, choose **New Project → Deploy from GitHub repo** and pick the repository.
3. In the same project, add a database with **New → Database → PostgreSQL**.
4. Open the app service, go to **Variables**, and set:
   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (a reference to the database) |
   | `APP_PASSWORD` | the password you will use to log in |
   | `SESSION_SECRET` | a random string of 32 or more characters, e.g. from `openssl rand -hex 32` |
5. Under **Settings → Networking**, click **Generate Domain**.

Railway runs `npm run build` and then `npm start`. The start command applies pending database migrations (`prisma migrate deploy`) before starting Next.js on Railway's `PORT`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Generate the Prisma client and build |
| `npm start` | Apply migrations, then serve the production build |
| `npm run db:migrate` | Create and apply a migration after editing `prisma/schema.prisma` |

## Design

The look is the "Departure Board" direction, chosen with [Impeccable](https://impeccable.style).

- **Base:** white background with black ink.
- **Delays:** a pushed to-do shows its delay in red in a fixed right-hand column, like train delays on a station board.
- **Category codes:** each category has a short code (FAM, HLT…) shown as a coloured badge.

Product context is in `PRODUCT.md`, and the design system is in `DESIGN.md`.
