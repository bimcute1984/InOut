# InOut

Smart Employee Time Tracking System for small businesses, shops, cafes, restaurants, and SMEs.

## Tech Stack

- Frontend: Angular
- Backend: NestJS
- Database: PostgreSQL
- ORM: Prisma
- Runtime: Node.js
- DevOps: Docker Compose

## Project Structure

```txt
InOut/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Angular frontend
├── docs/             # Project documents
├── docker-compose.yml
├── .env.example
└── README.md
```

## MVP Scope v1.0

### Owner / Admin

- Login
- Company profile
- Branch settings
- Employee management
- Attendance dashboard
- Attendance records
- Monthly report
- Export report

### Employee

- Login
- Check in
- Check out
- GPS location capture
- Selfie capture placeholder
- My attendance history

### Core Tables

- companies
- branches
- users
- employees
- attendance_logs
- plans
- subscriptions
- audit_logs

## Setup

```bash
cp .env.example .env
npm install
npm run db:up
npm run prisma:migrate
npm run dev:api
npm run dev:web
```

## GitHub Remote

```bash
git remote -v
# origin https://github.com/bimcute1984/InOut.git
```

## First Push

```bash
git branch -M main
git push -u origin main
```

## Product Direction

InOut starts as a simple SaaS attendance platform:

> Employees can check in/out from mobile, owners can monitor attendance in real time, and businesses can export monthly reports for payroll.

Future modules:

- Leave Management
- Shift Scheduling
- Payroll Export
- AI Attendance Insights
- Multi-branch Operations
