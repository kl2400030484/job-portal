# Job Portal Full-Stack Clone

## 1. Executive Summary & Final Status

**Current Status:** Production-ready local build.

The Job Portal is a fully functional, full-stack application designed to connect employers with candidates while offering administrative and support overhead. The architecture relies on robust stateless authentication to heavily compartmentalize permissions.

The system is powered by four primary roles:
- **CANDIDATE:** Users who can browse open listings, utilize a one-click apply feature, and raise support tickets if they encounter platform issues.
- **EMPLOYER:** Users authorized to create new job opportunities, track submitted applications in real-time, and submit support tickets.
- **ADMIN:** An overarching administrative account capable of viewing high-level system analytics and aggregate application metrics.
- **SUPPORT:** A specialized role focused entirely on claiming and resolving user-raised support tickets via a dedicated resolution dashboard.

---

## 2. Tech Stack & Architecture

### Frontend Technologies
- **React (Vite):** Utilized for an extremely fast development server and optimized production builds.
- **Tailwind CSS:** Employed for modern, utility-first styling ensuring a responsive and cohesive visual design.
- **React-Router-Dom:** Manages complex client-side routing, including logic-heavy protected pipelines.
- **Axios:** Handles asynchronous HTTP requests to our backend APIs, configured automatically to attach JWTs.
- **Lucide-React:** Provides sleek, scalable vector icons utilized heavily within the dashboards.

### Backend Technologies
- **Spring Boot 3 (Java 17):** The core framework mapping REST endpoints and managing application configuration context.
- **Spring Security & JJWT:** Secures the entire API schema through stateless tokenized validation rather than traditional Tomcat sessions.
- **MySQL & Spring Data JPA:** The underlying database engine managed by object-relational mapping (Hibernate), allowing rapid entity querying without raw SQL dependencies.

### Database Schema Overview
The architecture is supported by four heavily interlinked SQL tables:
- **`users`**: Contains core credentials, fully hashed passwords, and ENUM-based roles (`CANDIDATE`, `EMPLOYER`, `ADMIN`, `SUPPORT`).
- **`jobs`**: Tracks `title`, `description`, `status` (OPEN/CLOSED) and maintains a Many-to-One mapping linking back to the `employer_id`.
- **`applications`**: A junction-style table managing the Many-to-One associations between a `job_id` and a `candidate_id`, combined with an application lifecycle `status`.
- **`support_tickets`**: Tracks platform issues containing the `raised_by_id` and conditionally the `assigned_to_id` (once claimed by Support), along with completion tracking.

---

## 3. Key Upgrades and Bug Fixes (The Journey)

Getting the platform production-ready required hurdling several key integration challenges:

* **Tailwind CSS Rendering Issues:**
  Initially, the Vite pipeline was failing to render Tailwind utility classes out to the browser. This occurred because the `postcss.config.js` file scaffolding was missing. By explicitly generating the configuration to include the `tailwindcss` and `autoprefixer` plugins, the Vite compilation process was patched, instantly returning cohesive styles to the dashboards.

* **Backend Authentication & CORS Blocks:**
  The platform uses local React routing (`react-router-dom`) meaning the user accesses the UI via `localhost:5174` (or `5173`) while submitting `XMLHttpRequest` payloads to Tomcat on `localhost:8080`.
  Initially, attempting to log in with the default accounts threw aggressive "Login failed" messages and `403 Forbidden` Preflight blocks in the browser's Network tab. Once identified that the `DatabaseSeeder` was successfully executing and hitting the `BCryptPasswordEncoder` cleanly, the issue mapped directly to `SecurityConfig.java`. The configuration was updated to utilize `.setAllowedOriginPatterns(List.of("http://localhost:*"))` to dynamically support whatever port Vite spins up rather than aggressively white-listing just one specific port.

---

## 4. Core Features Implemented

### Role-Based Dashboards
- **Candidate Dashboard:** Features a dynamic grid of available job postings with live "Apply Now" buttons. It also holds a secondary internal component allowing candidates to track and submit queries to the Support team.
- **Employer Dashboard:** Split into a complex dual-view containing a rapid entry form for posting new positions, and an intelligent list-view analyzing their previous postings alongside the specific profiles of candidates who have applied to them.
- **Admin Dashboard:** Focused on raw metrics, providing Card-based analytics utilizing `Lucide` icons tracking global counts.
- **Support Dashboard:** Built as an overarching data-table tracking platform issues. Statuses are color-coded, and buttons conditionally render (e.g., "Claim" vs "Resolve") based on the lifecycle of the ticket.

### Stateless JWT Authentication Flow
When a user submits their credentials to `/api/auth/login`, Spring Security checks the MySQL base. Upon success, a `jjwt` signed payload is issued containing the user ID and Role. The React frontend snags this Token and stores it in `localStorage`. 
Using `axios.interceptors`, every single subsequent request automatically appends `Bearer {token}` to its headers. A High-Order Component named `<ProtectedRoute allowedRoles={[]}>` exists as a wrapper on the React Router to immediately reject component rendering if the local JWT role does not match the dashboard requirements.

---

## 5. Local Setup & Operational Guide

### 1. Database Initialization
Ensure that your local instance of MySQL is running on port `3306`.
The backend properties are already targeted to root. You do **not** need to manually define the schema; `hibernate.ddl-auto=update` and `createDatabaseIfNotExist=true` will handle everything.

### 2. Booting the Backend
Navigate to the Spring Boot instance and utilize your Maven wrapper:
```bash
cd backend
mvn spring-boot:run
```
*(Allow approx 5-10 seconds for the engine to initialize Tomcat on `localhost:8080` and populate the DatabaseSeeder records).*

### 3. Booting the Frontend
Navigate into the Vite folder and launch the developer server:
```bash
cd frontend
npm run dev
```
*(The React build will be accessible at `http://localhost:5173` or `5174`).*

---

### Default Seeded Testing Accounts

The database handles initialization dynamically. While you can register candidates and employers directly from the web registration form, the system relies on the following secure seeds for Administrative tasks:

| Role | Email Address | Password | Intended Use |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@jobportal.com` | `admin123` | Logging in to view high-level platform statistics. |
| **SUPPORT**| `support@jobportal.com` | `support123` | Generating, tracking, claiming, and closing tickets. |
