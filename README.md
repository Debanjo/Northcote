
## README.md (Full Content)

```markdown
#  Yetosol Associates – Construction Management Platform

Full‑stack monorepo for managing construction projects, clients, teams, invoices, site inspections, and real‑time communication. Built with **React + Vite** (frontend), **Express + MongoDB** (backend), **Better Auth** (authentication), and **Socket.io** (real‑time).

---

##  Product Overview

Yetosol Associates provides a unified portal for all stakeholders in construction projects:

- **Clients** – track project progress, view milestones, download documents, message their team, and manage invoices.

- **Project Managers** – create and manage projects, assign supervisors, upload milestones and documents, oversee budgets.

- **Supervisors / Engineers** – upload site inspections, update milestones, monitor daily activities.

- **Admins / Superadmins** – manage users, system settings, view global analytics, approve admin actions.

Each role sees **only the data relevant to their responsibilities**, ensuring clean separation of concerns.

---

##  Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/yetosol/yetosolassociates.git

cd yetosolassociates

# Install all dependencies (monorepo workspaces)
npm install

# Start backend (http://localhost:5000)
npm run dev:server

# Start frontend (http://localhost:5173)
npm run dev:ui
```

### Environment Variables

#### Backend (`yetosoll-server/.env`)
```
NODE_ENV=development

MONGO_URI=mongodb+srv://...

BETTER_AUTH_SECRET=<random‑64‑char‑string>

BETTER_AUTH_URL=http://localhost:5000

FRONTEND_URL=http://localhost:5173

UPLOADTHING_TOKEN=...
```

#### Frontend (`yetosoll-ui/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

##  Deployment

### Frontend (Vercel)
1. Connect your GitHub repo (`yetosol/yetosolassociates`).

2. Set **Root Directory** → `yetosoll-ui`.

3. Add Environment Variable: `VITE_API_URL` = `https://yetosolassociates.onrender.com`.

4. Build command: `npm run build`, output directory: `build/client`.

5. Deploy – Vercel will auto‑deploy on every push to `main`.

### Backend (Render)
1. Connect the same repo.
2. Set **Root Directory** → `yetosoll-server`.

3. Build command: `npm install`, start command: `npm run start`.

4. Add all environment variables from the `.env` file (especially `MONGO_URI`, `BETTER_AUTH_SECRET`, `FRONTEND_URL`, `BETTER_AUTH_URL`).

5. Deploy – Render will auto‑deploy on every push (or use Manual Deploy).

### Push to Deploy
```powershell
cd yetosolassociates    # monorepo root
git add .
git commit -m "Your commit message"
git push
```
Both Vercel and Render will automatically redeploy the latest commit.

---

##  Authentication & Role‑Based Access

- **Better Auth** handles sign‑in/sign‑up with email + password.

- Session token stored in an `HttpOnly` cookie (cross‑domain) **and** in the `Authorization` header (via `localStorage`) for iOS/Safari compatibility.

- Every protected route uses `requireAuth` middleware.
- Role‑based guards (`checkRole`) ensure users only access endpoints allowed for their role.

---

##  Role‑Specific Data Fetching

Data separation is enforced at the API level:

| Role | Sees |
|------|------|
| **Client** | Own project(s), own invoices, own milestones, own documents, messages with their team. |

| **Project Manager** | Projects they are assigned to, milestones/documents for those projects, client lists, team members, invoices for their clients. |

| **Supervisor / Engineer** | Projects they supervise, site inspections, milestones, documents, messages. |

| **Admin** | All users, all projects, all invoices, activity logs, system settings. |

| **Superadmin** | Everything + system health, audit logs, impersonation, approval workflow. |

**How we enforce it**  
- Controllers filter data by the authenticated user’s `id` or `role`.  

- For example, `getClientProject` returns only the active project where `clientId` matches the logged‑in user.  

- `fetchAllUsers` is now accessible to `client` roles (so dashboard cards can show counts), but sensitive fields (password, etc.) are excluded via projection.  

- The frontend never hides data – the API simply doesn’t return it.

---

##  FULL API DOCUMENTATION:

**Base URL:** `https://yetosolassociates.onrender.com/api`

### Authentication Endpoints (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-in/email` | Log in with email & password |

| POST | `/api/auth/sign-up/email` | Register a new account |

| POST | `/api/auth/reset-password` | Request password reset |

| GET | `/api/me` | Get current session |

### Users
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/users?page=&limit=&role=&status=&search=` | All authenticated | List users (filterable) |

| GET | `/api/users/profile/:id` | All (clients self only) | Get user by ID |

| PUT | `/api/users/update/:id` | admin, superadmin, PM, supervisor | Update user |

| POST | `/api/users/project` | admin, superadmin, PM | Create a project for a client |

| POST | `/api/users/toggle-ban/:userId` | admin, superadmin | Ban/unban user |

| DELETE | `/api/users/:userId` | admin, superadmin | Soft‑delete user |

### Projects
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/projects/all` | All | List all projects |

| GET | `/api/projects/client/:clientId` | client, admin, superadmin, PM, supervisor | Get client's active project |

| POST | `/api/projects` | admin, superadmin, PM | Create project |

| PUT | `/api/projects/:id/progress` | admin, superadmin, PM, supervisor | Update progress |

### Milestones
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/projects/:projectId/milestones` | All | List milestones |

| POST | `/api/projects/:projectId/milestones` | admin, superadmin, PM | Create milestone |

| PUT | `/api/milestones/:id` | admin, superadmin, PM | Update milestone |

| DELETE | `/api/milestones/:id` | admin, superadmin, PM | Delete milestone |

### Documents
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/projects/:projectId/documents` | All | List documents |

| POST | `/api/projects/:projectId/documents` | admin, superadmin, PM | Upload document |

| DELETE | `/api/documents/:id` | admin, superadmin, PM | Delete document |

### Invoices
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/invoices/my-active-invoice` | client, admin, superadmin | Get client's draft/pending invoice |

| GET | `/api/invoices/history` | client | Billing history |

| GET | `/api/invoices?page=&limit=` | admin, superadmin, PM | All invoices |

| POST | `/api/invoices/:id/pay` | admin, superadmin | Mark as paid |

| POST | `/api/invoices/charge` | admin, superadmin, PM | Add charge |

### Site Inspections
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| POST | `/api/inspections` | admin, superadmin, PM, supervisor | Create inspection |

| GET | `/api/inspections/project/:projectId` | admin, superadmin, PM, supervisor, engineer | List inspections |

| PUT | `/api/inspections/:id` | admin, superadmin, PM, supervisor | Update inspection |

### Activity Logs
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/activity-logs?page=&limit=` | All | System activity |

| POST | `/api/activity-logs/create` | internal | Log an event |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|

| GET | `/api/notifications` | User's notifications |
| POST | `/api/notifications/:id/read` | Mark as read |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|

| GET | `/api/chat/messages/:userId1/:userId2` | Messages between two users |

| GET | `/api/chat/conversations/:userId` | User's conversations |

| POST | `/api/chat/read` | Mark messages as read |

| GET | `/api/chat/unread/:userId` | Unread message count |

### Settings
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/settings/:key` | Public | Get setting |

| GET | `/api/settings` | admin, superadmin | All settings |

| PUT | `/api/settings/:key` | admin, superadmin | Update setting |

### Super Admin
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| GET | `/api/super-admin/analytics` | superadmin | System analytics |

| GET | `/api/super-admin/users` | superadmin | All users (extended) |

| POST | `/api/super-admin/impersonate/:userId` | superadmin | Impersonate user |

| GET | `/api/super-admin/health` | superadmin | System health |

### Approvals
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|

| POST | `/api/approval` | admin, superadmin | Request approval |

| GET | `/api/approval/pending` | superadmin | Pending requests |

| PUT | `/api/approval/:id` | superadmin | Approve/reject |

### File Uploads
| Method | Endpoint | Description |
|--------|----------|-------------|

| POST | `/api/uploadthing` | Upload file |

| DELETE | `/api/uploadthing/delete` | Delete file |

### Google Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|

| GET | `/api/reviews/google` | Google Places rating & count |

---

##  Socket.io Events

Real‑time communication for chat, project updates, notifications.

**Client → Server**
- `join_role_room` – join room by role

- `user_online` – notify presence

- `send_message` – send a chat message

- `mark_read` – mark messages as read

- `typing` – typing indicator

**Server → Client**
- `new_message`, `message_sent`, `messages_read`

- `new_notification`, `project_created/updated`

- `milestone_created/updated/deleted`

- `document_created/deleted`

- `inspection_added/updated`

- `new_approval_request` (superadmin only)

---

##  Error Handling

All errors return JSON with `message` and (in development)

 `stack`. Standard HTTP codes:

- `200` – Success

- `201` – Created

- `400` – Bad request

- `401` – Unauthorized

- `403` – Forbidden

- `404` – Not found

- `500` – Internal server error

Empty datasets return `200` with an empty array – **never an error**.

---

##  Project Structure

```
yetosoll-monorepo/
├── yetosoll-ui/          # React frontend (Vite + React Router v7)
│   ├── dockerfile
│   ├── dockerfile.dev
│   ├── app/
│   │   ├── components/   # Reusable UI components
│   │   ├── routes/       # Page components
│   │   ├── lib/          # API client, auth, socket, utils
│   │   └── ...
│   └── ...
├── yetosoll-server/      # Express backend
│   ├── dockerfile
│   ├── dockerfile.dev
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   ├── middleware/    # Auth, role, maintenance
│   │   ├── services/     # Business logic
│   │   ├── lib/          # Auth config, socket, upload
│   │   └── ...
│   └── ...
├── package.json          # Monorepo workspace root
├── docker-compose.dev.yaml
├── docker-compose.prod.yaml # Builds optimized backend (npm run start) and optimized frontend (React → Nginx).
└── README.md
```

---

##  Tech Stack

- **Frontend:** React 19, React Router v7, Tailwind CSS, Shadcn UI, Framer Motion, TanStack Query, Embla Carousel, Recharts

- **Backend:** Express 5, MongoDB/Mongoose, Better Auth, Socket.io, Inngest, Uploadthing

- **DevOps:** Vercel (frontend), Render (backend), GitHub
```

## Docker

'''Local Development:

bash
docker-compose -f docker-compose.dev.yml up --build

Runs backend in dev mode (npm run dev).

Runs frontend in dev mode (npm run dev with hot reload).

Runs MongoDB locally.

Production Build:

bash
docker-compose -f docker-compose.prod.yml up --build -d
Builds optimized backend (npm run start).

Builds optimized frontend (React → Nginx).

Connects to MongoDB Atlas (no local Mongo).'''
