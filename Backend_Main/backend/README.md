# AI Resume Analyzer Backend

Node.js, Express.js and MySQL backend for an AI Resume Analyzer / ATS Resume Analyzer. It supports candidate resume analysis, recruiter resume ranking, skill extraction, deterministic ATS scoring, recommendations, admin management, JWT authentication and role-based authorization.

## Features

- Candidate signup/login, resume upload, JD text input and ATS analysis.
- Recruiter signup/login, JD creation, multi-resume upload and ranked candidate results.
- Admin-only dashboard and management APIs.
- Lowercase roles everywhere: `candidate`, `recruiter`, `admin`.
- Public signup blocks `admin`.
- Resume parsing with `multer`, `pdf-parse` and DOCX parsing through `mammoth`.
- Skills are deduplicated and mapped through junction tables.
- AI for suggestions. Rule-based recommendations work without an API key.

## Prerequisites

- Node.js
- MySQL

## Installation

```bash
npm install
```

Create a `.env` file then create the database:

```bash
mysql -u root -p < config/db.sql
```

Seed the default admin:

```bash
node seed/adminSeeder.js
```

Default admin:

- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `admin`

## Run

```bash
npm start
npm run dev
```

Base URL: `http://localhost:5000`

## API List

- `POST /api/users/signup`
- `POST /api/users/signin`
- `GET /api/users/profile`
- `PATCH /api/users/profile`
- `GET /api/users`
- `DELETE /api/users/:id`
- `POST /api/resumes/upload`
- `GET /api/resumes`
- `GET /api/resumes/:id`
- `DELETE /api/resumes/:id`
- `POST /api/jds`
- `GET /api/jds`
- `GET /api/jds/:id`
- `DELETE /api/jds/:id`
- `POST /api/analysis/candidate`
- `POST /recruiter/analyze` (recruiter/admin JWT; multipart `jd_text`, optional `jd_title` and `experience_required`, plus 1-5 PDF files named `resumes`)
- `POST /api/rankings/:jd_id`
- `GET /api/rankings/:jd_id`
- `POST /api/skills`
- `GET /api/skills`
- `GET /api/skills/resume/:resume_id`
- `GET /api/skills/jd/:jd_id`
- `GET /api/results`
- `GET /api/results/:id`
- `GET /api/results/resume/:resume_id`
- `GET /api/results/jd/:jd_id`
- `GET /api/recommendations/result/:result_id`
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/resumes`
- `GET /api/admin/jds`
- `GET /api/admin/results`
- `GET /api/admin/logs`
- `DELETE /api/admin/users/:id`

## Postman

Import `AI_Resume_Analyzer.postman_collection.json`. Set `{{base_url}}` to `http://localhost:5000`. After signin, copy the returned token into the collection variable `token`.

## ATS Formula

The backend extracts resume skills and JD-required skills, then calculates:

```txt
ATS Score = (matched_required_skills / total_jd_required_skills) * 100
```

Quality labels:

- `80-100`: Excellent match
- `60-79`: Good match
- `40-59`: Average match
- Below `40`: Poor match
