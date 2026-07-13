What this is
A bilingual (multi‑locale) full‑stack travel guide: a Next.js client (client/) paired with an Express + TypeScript API backend (server/) that seeds and serves travel destinations from a MongoDB database. It’s organized as a production-ready demo app with docs and implementation blueprints for deployment, localization, and iterative improvements.

Stack
Language(s): TypeScript (frontend + backend), JavaScript for some server build artifacts
Framework / runtime: Next.js (App Router) for the client; Node.js + Express for the backend
Notable libraries / patterns (observed):
Next.js (client app)
Express, helmet, cors, morgan, dotenv (server)
MongoDB integration (connectDB / seedDatabase pattern in server/src)
TypeScript toolchain (tsconfig files present for client and server)
How it's organized
Top-level (annotated):

Text
.gitignore
IMPROVEMENTS.md                 Project improvement notes / roadmap
PROJECT_STRUCTURE.md            High-level layout / module responsibilities
SETUP_COMPLETE.md               Setup / deployment checklist
WORKFLOW_GUIDE.md               Contributor workflow & CI notes
ultimate_implementation_blueprint.md  Detailed implementation plan / blueprints

assets/                         static images / global assets
client/                         Next.js frontend (app router)
  README.md
  package.json, package-lock.json
  tsconfig.json
  src/
    app/
      page.tsx                   app entry page
      layout.tsx                 root layout
      globals.css
      auth/, explore/, hotels/, map/, planner/, premium/, profile/  feature routes
    components/                  React UI components
    context/                     React context providers
    public/                      static public assets

server/                         Express API backend (TypeScript)
  package.json, package-lock.json, tsconfig.json
  src/
    index.ts                     app bootstrap (connectDB, seedDatabase, /api router)
    config/                      DB connection and seed (connectDB, seedDatabase)
    controllers/                 request handlers
    middleware/                  Express middleware
    models/                      data models (Mongo collections)
    routes/                      /api router and endpoints
    services/                    business logic, external integrations
  dist/                          compiled server output (build artifact)

index.html                      site landing or static site variant
world-tourist-guide.html        static / alternate UI
de/, en/, es/, fr/, ja/, zh/    localization directories (language-specific content)
How it fits together:

The Next.js app in client/ is the user‑facing UI (App Router pages under client/src/app). It fetches data and interacts with the API under /api.
The Express server in server/ mounts its main router at /api (see server/src/index.ts), connects to MongoDB via a config/db module, and seeds default travel destinations using seedDatabase when the DB is connected.
Top-level docs (PROJECT_STRUCTURE.md, SETUP_COMPLETE.md, WORKFLOW_GUIDE.md, ultimate_implementation_blueprint.md) provide deployment, operational, and roadmap guidance; localization directories indicate multi‑language content support.
How to run it
Frontend (from client/; taken from client/README.md):

bash
cd client
npm install
npm run dev        # or yarn dev / pnpm dev / bun dev
# Visit http://localhost:3000
Backend (server/):

Environment: server uses dotenv; supply a .env with your MongoDB connection string and any other required env vars (PORT defaults to 5000 if unset). The server exposes a health endpoint at /health and the API under /api.
Typical commands (check server/package.json scripts to confirm):
bash
cd server
npm install
# development (if a dev script exists)
npm run dev

# or build + start (if build/start scripts exist)
npm run build
npm start
Quick health check / endpoints:

Root splash: GET / (returns a small HTML "Let's Travel World API Node" splash)
Health: GET /health → { status: 'healthy', timestamp, service }
API router: mounted at /api (inspect server/src/routes for endpoints)
Notes on env vars / prerequisites:

A MongoDB instance and a connection string are required (server/src/config/connectDB is called at startup).
Check server/src/config and SETUP_COMPLETE.md for the exact environment variables and optional seed behavior.
