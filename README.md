# Task Management API

A small NestJS REST API used to evaluate Codzee's automated pull-request reviews.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run start:dev
```

The API listens on `http://localhost:3000`.

## Current endpoints

- `GET /tasks` — list tasks
- `GET /tasks/:id` — get a task
- `POST /tasks` — create a task
- `PATCH /tasks/:id` — update a task
- `DELETE /tasks/:id` — delete a task

Data is stored in memory, so it resets when the server restarts. This is intentional for a focused code-review exercise; a database is not required.

## Assessment workflow

Start from the baseline code and apply the three patch files in `assessment-patches` one at a time, creating a separate branch and pull request for each. Merge each PR before applying the next patch so the changes build on one another.

See `ASSESSMENT_GUIDE.md` in the ZIP's top-level folder for exact Git commands.
