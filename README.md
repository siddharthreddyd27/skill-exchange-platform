# 🔄 Skill Exchange Platform

A modern, full-stack, peer-to-peer informal skill-sharing web application built with **Java Spring Boot**, **Spring Data JPA**, **Spring Security (JWT)**, **MySQL**, and **React (Vite + Tailwind CSS)**.

> **Core Philosophy**: A friendly peer community where users teach skills they already know and learn skills from others. Informal knowledge exchange with no courses, subscriptions, or paywalls.

---

## 🛠️ Technology Stack

### Backend
- **Java 17+** (tested and compatible with Java 17 to Java 26)
- **Spring Boot 3.3.4**
- **Spring Web** (RESTful API architecture)
- **Spring Data JPA & Hibernate 6**
- **Spring Security** (Stateless JWT token authentication, BCrypt password hashing, role-based security)
- **Database**: **MySQL** (database name: `skill_exchange`), plus portable zero-config in-memory profile (`application-h2.properties`)
- **Maven 3.9+**

### Frontend
- **React.js 19**
- **Vite 8**
- **Tailwind CSS 4**
- **React Router 7**
- **Axios** (with JWT Bearer interceptor & auto-session handling)
- **Lucide React** (modern iconography)

---

## 🚀 Core Features

### 1. User Authentication & Security
- User registration and login with form validation and informative error messages.
- Secure BCrypt password hashing.
- Stateless JSON Web Token (JWT) authorization header on private endpoints.
- Role-based authorization (`ROLE_USER`, `ROLE_ADMIN`).
- One-click demo login buttons for fast local exploration.

### 2. User Profile Management
- Customizable user profiles: Full Name, Email, Profile Picture / Avatar, Bio, Location, Interests tags.
- Tabbed showcase of **Skills I Can Teach** and **Skills I Want to Learn**.
- Stats counters showing connected peers and total completed exchanges.

### 3. Skill Management
- Add, edit, and remove skills you can teach (`TEACH`).
- Add, edit, and remove skills you want to learn (`LEARN`).
- Select from an initial pre-seeded catalog or add custom skills and categories on the fly.
- Categorization and proficiency levels: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`.
- Card-based layout with proficiency badges, experience counters, and descriptions.

### 4. Skill Discovery & Search
- Live search bar filtering by skill name, programming language, instrument, or topic.
- Filter by skill categories (Programming, Design, Languages, Music, Creative, Business, Strategy).
- Peer card display showing teaching skills, learning wishlist, bio snippet, and real-time connection status.
- Detailed peer profile modal.

### 5. Connection Requests
- Send connection requests to peers with custom introduction notes.
- Built-in business rules preventing duplicate requests or self-connection.
- Three organized connection views: **Connected Peers**, **Incoming Requests** (with instant Accept/Decline), and **Sent Requests**.

### 6. Peer-to-Peer Skill Exchanges
- Connected peers can coordinate 1-on-1 informal skill exchanges.
- Configure what you will teach and what your peer will teach in return.
- Set meeting cadences, schedules, and learning goals.
- Full exchange lifecycle: `PROPOSED` ➔ `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED` (or `CANCELLED`).
- Built-in session notes and learning logs.
- Strictly peer-to-peer: **Zero paid courses or payment gateways**.

### 7. Interactive Dashboard & Smart Matching
- Profile summary widget with quick navigation.
- Real-time counters: Skills Taught, Skills Wanted, Connections, Active Exchanges.
- **Smart Matching Engine**: Calculates mutual match percentages (e.g., 95% mutual match when user A teaches what user B wants, and user B teaches what user A wants).
- Quick-action banner for pending incoming requests.
- Active exchanges tracker.

---

## 🗄️ Database Architecture

The application defines 5 core JPA entities mapped to relational database tables:

| Table | Entity Class | Description |
|---|---|---|
| `users` | `User` | User accounts, credentials, bio, interests, location, role |
| `skills` | `Skill` | Master skill catalog with names, categories, and descriptions |
| `user_skills` | `UserSkill` | Many-to-Many mapping for skills a user teaches or wants to learn |
| `connection_requests` | `ConnectionRequest` | Peer connection requests with `PENDING`, `ACCEPTED`, `REJECTED` states |
| `skill_exchanges` | `SkillExchange` | Coordinated learning exchanges between connected peers |

A complete SQL creation script is available at [`skill_exchange_schema.sql`](file:///c:/Users/siddh/OneDrive/Desktop/hari%2013/skill_exchange_schema.sql).

---

## 🔑 Pre-Seeded Demo Accounts

For immediate testing, the database is automatically seeded with demo accounts (`Password@123` for all):

| Name | Username | Email | Key Teaching Skills | Learning Wishlist |
|---|---|---|---|---|
| **Alex Morgan** | `demouser` | `demo@skillexchange.io` | Java Spring Boot, React.js | Spanish, Acoustic Guitar |
| **Sophia Chen** | `sophiac` | `sophia@skillexchange.io` | UI/UX Design, Acoustic Guitar | Java Spring Boot |
| **Carlos Mendoza** | `carlosm` | `carlos@skillexchange.io` | Spanish Language | React.js |
| **Priya Sharma** | `priyas` | `priya@skillexchange.io` | Python, Machine Learning | UI/UX Design |

---

## ⚙️ Configuration & Execution Guide

### 1. Database Configuration
In `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/skill_exchange?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:your_mysql_password}
```
You can also set environment variables:
```powershell
$env:SPRING_DATASOURCE_USERNAME = "root"
$env:SPRING_DATASOURCE_PASSWORD = "your_mysql_password"
```

To run with the portable, zero-config in-memory database profile (for testing or instant demo):
```powershell
java -jar target\backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=h2
```

### 2. Run the Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
# or run the pre-built jar:
java -jar target\backend-0.0.1-SNAPSHOT.jar
```
Backend runs at `http://localhost:8080`.

### 3. Run the Frontend
```powershell
cd frontend
npm.cmd run dev
```
Frontend runs at `http://localhost:5173`.

---

## 📡 REST API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Sign in and obtain JWT token
- `POST /api/auth/logout` — Invalidate user session

### Users & Profiles
- `GET /api/users/me` — Current user's full profile
- `PUT /api/users/me` — Update current user's profile
- `GET /api/users/{id}` — Get public profile of a user
- `GET /api/users/search?query=...` — Search users by keyword or skill
- `GET /api/users/filter-by-skill?skill=...&category=...` — Filter users teaching a specific skill

### Skills Management
- `GET /api/skills` — List all skills in catalog
- `GET /api/skills/search?q=...` — Search skills
- `GET /api/skills/categories` — List all available skill categories
- `POST /api/skills` — Add a new skill to catalog
- `GET /api/user-skills/my?type=TEACH|LEARN` — Get logged-in user's skills
- `POST /api/user-skills` — Add a skill to teach or learn
- `PUT /api/user-skills/{id}` — Update proficiency or notes
- `DELETE /api/user-skills/{id}` — Remove a skill

### Connection Requests
- `POST /api/connections/request` — Send connection request
- `PUT /api/connections/request/{id}/respond?status=ACCEPTED|REJECTED` — Accept or reject request
- `GET /api/connections/incoming` — List incoming connection requests
- `GET /api/connections/outgoing` — List sent connection requests
- `GET /api/connections/peers` — List connected peers

### Skill Exchanges
- `POST /api/exchanges` — Propose a new skill exchange with a connected peer
- `PUT /api/exchanges/{id}/status` — Update exchange status (`ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) or notes
- `GET /api/exchanges?status=...` — List user's skill exchanges
- `GET /api/exchanges/{id}` — Get specific exchange details

### Dashboard & Matching
- `GET /api/dashboard` — Get full dashboard stats, incoming requests, and active exchanges
- `GET /api/dashboard/matches` — Get smart algorithmic skill matches for the logged-in user
