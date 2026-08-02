# DeployDrive API

Express and MongoDB backend for the DeployDrive travel-story platform. This repository is a maintained version of a backend originally built as part of an educational team project.

## Links

| Resource | URL | Status (last checked 2026-08-02) |
| --- | --- | --- |
| Live frontend | https://project-team-deploydrive.vercel.app | 200 OK |
| API origin | https://travellers-node.onrender.com | Unreachable at last check — four attempts (20s/45s/45s/90s) returned no HTTP response |
| Swagger UI | https://travellers-node.onrender.com/api-docs | Unreachable at last check; API origin returned no HTTP response |
| Health endpoint | https://travellers-node.onrender.com/health | Unreachable at last check; API origin returned no HTTP response |
| Readiness endpoint | https://travellers-node.onrender.com/ready | Unreachable at last check; API origin returned no HTTP response |
| Maintained frontend repository | https://github.com/Gorodeikin/project-team-deploydrive | 200 OK |
| Maintained backend repository | https://github.com/Gorodeikin/nodejs-deploydrive | 200 OK |
| Original team backend repository | https://github.com/elentr/nodejs-deploydrive | 200 OK |
| Upstream backend pull-request history | https://github.com/elentr/nodejs-deploydrive/pulls?q=is%3Apr | 200 OK |

## Project Origin and Attribution

DeployDrive started as a team educational project completed during the GoIT Full Stack Developer course. The current repository is Sergii Gorodeikin's maintained version of the original team backend.

The full original project team and cross-repository contribution map are documented in the [maintained frontend README](https://github.com/Gorodeikin/project-team-deploydrive#original-team-and-verified-contributions).

## Original Backend Contributors and Verified Work

| Contributor | Verified backend work | Evidence |
| --- | --- | --- |
| [Anastasia1102](https://github.com/Anastasia1102) | Initial server/API implementation; authentication, users and stories endpoints; Swagger/OpenAPI documentation | [PR #19](https://github.com/elentr/nodejs-deploydrive/pull/19) |
| [elentr](https://github.com/elentr) | Backend package/dependency setup; repository cleanup and duplicate-file/library fixes | [PR #20](https://github.com/elentr/nodejs-deploydrive/pull/20), [PR #23](https://github.com/elentr/nodejs-deploydrive/pull/23) |
| [Roksolana-Bilous](https://github.com/Roksolana-Bilous) | User routing work; submitted story-route work | [PR #21](https://github.com/elentr/nodejs-deploydrive/pull/21), [PR #29](https://github.com/elentr/nodejs-deploydrive/pull/29) (open/unmerged) |
| [Sergii Gorodeikin](https://github.com/Gorodeikin) | OpenAPI/Swagger corrections; categories route and related API documentation | [PR #24](https://github.com/elentr/nodejs-deploydrive/pull/24), [PR #31](https://github.com/elentr/nodejs-deploydrive/pull/31) |

These descriptions summarize work evidenced by the upstream pull-request history. They do not assign official project roles or exclusive ownership of the final components.

## My Contribution During the Original Team Project

During the original team phase, I (Sergii Gorodeikin) worked on backend tasks alongside the other contributors listed above, specifically:

- OpenAPI/Swagger corrections;
- the categories route and related API documentation.

## Independent Backend Maintenance After the Course

After the original team project was completed, I independently maintained, debugged, and extended my version of the backend.

**Deployment and configuration**
- Prepared the backend for independent deployment.
- Added `MONGODB_URI` support with a validated legacy MongoDB fallback (`MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_URL`, `MONGODB_DB`).
- Added explicit production CORS allowlisting via `ALLOWED_ORIGINS`.
- Added controlled startup failure handling (the process exits with a clear error if MongoDB connection or required configuration fails).
- Added `/health` and database-aware `/ready` endpoints.
- Improved `.env.example` safety and clarity.

**Privacy**
- Removed email addresses from public user-list and public user-profile responses.

**Stories API**
- Added a public `GET /api/stories/:storyId` endpoint.
- Added invalid-ID/not-found handling.
- Returned `categoryName` for story details.
- Aligned the story path parameter name in API documentation.

**Saved stories API**
- Added authenticated `GET /api/users/me/saved`.
- Added pagination metadata.
- Preserved latest-saved-first ordering.
- Ignored stale saved-story references.
- Corrected saved-story path parameter documentation.

## API Capabilities

**Authentication and sessions**
- Registration, login, refresh, logout.
- Opaque access and refresh tokens stored in MongoDB sessions (not JWT).
- Bearer access token required for protected endpoints.
- Refresh/session cookies used for the refresh and logout flows.

**Users and profiles**
- Public paginated user list.
- Public user profile and their stories.
- Current-user profile retrieval and update.
- Avatar upload.
- Saved-story add/remove/list with pagination.

**Stories**
- Paginated story list with category filtering.
- Popular stories.
- Public story detail.
- Authenticated story creation.
- Authenticated, owner-only story update (enforced by matching the story owner against the authenticated user).

**Categories**
- Public category list.

**Operations and documentation**
- `/health`
- `/ready`
- Swagger UI / OpenAPI documentation.

## Main Endpoints

**Auth** (`/api/auth`)
| Method | Path | Access |
| --- | --- | --- |
| POST | `/register` | Public |
| POST | `/login` | Public |
| POST | `/refresh` | Public (uses refresh cookie) |
| POST | `/logout` | Public (uses session cookie) |

**Users** (`/api/users`)
| Method | Path | Access |
| --- | --- | --- |
| GET | `/` | Public |
| GET | `/me`, `/me/profile` | Protected |
| PATCH | `/me` | Protected |
| PATCH | `/me/avatar` | Protected |
| GET | `/me/saved` | Protected |
| POST | `/me/saved/:storyId` | Protected |
| DELETE | `/me/saved/:storyId` | Protected |
| GET | `/:userId` | Public |
| GET | `/:userId/stories` | Public |

**Stories** (`/api/stories`)
| Method | Path | Access |
| --- | --- | --- |
| GET | `/` | Public |
| GET | `/popular` | Public |
| GET | `/:storyId` | Public |
| POST | `/` | Protected |
| PATCH | `/:storyId` | Protected, owner-only |

**Categories** (`/api/categories`)
| Method | Path | Access |
| --- | --- | --- |
| GET | `/` | Public |

**Operations**
| Method | Path | Access |
| --- | --- | --- |
| GET | `/health` | Public |
| GET | `/ready` | Public |
| GET | `/api-docs` | Public (Swagger UI) |

## Authentication Model

- Credentials are checked against bcrypt password hashes.
- Access and refresh tokens are generated with `crypto.randomBytes`, not JWT.
- Each session (access token, refresh token, and their expiry timestamps) is stored as a MongoDB `Session` document.
- Protected endpoints require the access token as a `Bearer` token in the `Authorization` header.
- Refresh and logout flows use `refreshToken`/`sessionId` cookies set via `cookie-parser`.

## Tech Stack

- Node.js (ES modules)
- Express 5
- MongoDB with Mongoose
- bcrypt
- cookie-parser
- CORS
- Joi
- Multer
- Cloudinary
- Swagger UI / OpenAPI (Redocly for bundling)
- Morgan
- dotenv

## Architecture

The source is organized by responsibility under `src/`:

- `routers/` — route definitions per resource (auth, users, stories, categories).
- `controllers/` — request/response handling.
- `services/` — business logic and database queries.
- `models/` — Mongoose schemas (User, Session, Story, Category).
- `middlewares/` — authentication, validation, upload, and error handling.
- `validation/` — Joi schemas.
- `docs/` — OpenAPI source (`openapi.yaml`) and generated Swagger JSON.
- `db/` — MongoDB connection bootstrap.
- `server.js` / `index.js` — app assembly and startup.

## Local Setup

```bash
git clone https://github.com/Gorodeikin/nodejs-deploydrive.git
cd nodejs-deploydrive
npm install
cp .env.example .env
npm run dev
```

The server defaults to port `3000` (`PORT` in `.env`).

Environment configuration (see `.env.example` for the full list):

- `PORT`, `NODE_ENV`
- `MONGODB_URI` — preferred way to configure MongoDB; takes priority when set.
- Legacy fallback (used only when `MONGODB_URI` is empty, all four required together): `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_URL`, `MONGODB_DB`.
- `ALLOWED_ORIGINS` — comma-separated CORS allowlist.
- `APP_DOMAIN`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ENABLE_CLOUDINARY`.

The server and its read-only endpoints can start without Cloudinary credentials, but story-image and avatar-upload operations require valid `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. `ENABLE_CLOUDINARY` is present in `.env.example`, but the current implementation does not read it to enable or disable the upload flow.

No real credentials are included here or in `.env.example`.

## Available Scripts

- `npm run dev` — start the server with nodemon for local development.
- `npm start` — start the server.
- `npm run build` — run `build-docs`.
- `npm run build-docs` — bundle `src/docs/openapi.yaml` into `src/docs/swagger.json`.
- `npm run preview-docs` — preview the OpenAPI documentation locally.

An automated test suite is not currently configured; the `test` script in `package.json` is a placeholder.

## API Documentation

- Local Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI source: `src/docs/openapi.yaml`
- Generated JSON bundle: `src/docs/swagger.json` (regenerated with `npm run build-docs`)

The production `/api-docs` endpoint was unreachable at the last check; see the Links table.

## Project Status

This is a maintained portfolio project, originally built as an educational team project. The current backend supports the deployed DeployDrive frontend.
