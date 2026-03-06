# 🌿 Employee Leave Management System

A full-stack **Employee Leave Management System** that allows employees to apply for leaves and managers to approve or reject them — with real-time balance tracking, a calendar view, and role-based access control.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Backend Setup & Installation](#-backend-setup--installation)
- [Frontend Setup & Usage](#-frontend-setup--usage)
- [API Reference](#-api-reference)
- [Features & Usage Guide](#-features--usage-guide)
- [Role-Based Access](#-role-based-access)
- [Database Schema](#-database-schema)

---

## 🎯 Overview

The Employee Leave Management System is a web application that streamlines the leave request workflow within an organization. Employees can submit leave requests, view their leave history, and check their leave balance. Managers have additional access to approve/reject pending requests and view all employee leaves.

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Java** | 21 | Core programming language |
| **Spring Boot** | 4.0.1 | Application framework |
| **Spring Data JPA** | — | ORM & database interaction |
| **Spring Security** | — | Authentication & authorization (HTTP Basic Auth) |
| **MySQL** | 8.x | Relational database |
| **Lombok** | — | Boilerplate code reduction |
| **Maven** | — | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **HTML5** | — | Page structure & markup |
| **CSS3 (Vanilla)** | — | Custom styling |
| **JavaScript (ES6+)** | — | Logic, API calls, DOM manipulation |
| **Bootstrap** | 5.3.3 | UI components & responsive layout |
| **Bootstrap Icons** | 1.11.3 | Icon library |
| **Google Fonts (Inter)** | — | Typography |

---

## 📁 Project Structure

```
Employee Leave Management System/
│
├── README.md                                        ← You are here
│
├── Employee-Leave-Management-System-Bakend/         ← Spring Boot Backend
│   ├── pom.xml                                      ← Maven dependencies & build config
│   ├── mvnw / mvnw.cmd                              ← Maven wrapper scripts
│   └── src/
│       ├── main/
│       │   ├── java/com/example/Employee/Leave/Management/System/
│       │   │   │
│       │   │   ├── EmployeeLeaveManagementSystemApplication.java  ← Main entry point
│       │   │   │
│       │   │   ├── Config/
│       │   │   │   └── SecurityConfig.java          ← Spring Security & CORS config
│       │   │   │
│       │   │   ├── controller/
│       │   │   │   ├── UserController.java          ← Register, Login, Get all users
│       │   │   │   ├── LeaveController.java         ← Apply, approve, reject, list leaves
│       │   │   │   └── LeaveBalanceController.java  ← Get leave balance by user
│       │   │   │
│       │   │   ├── dto/
│       │   │   │   └── LoginRequest.java            ← Login request payload DTO
│       │   │   │
│       │   │   ├── entity/
│       │   │   │   ├── User.java                    ← User entity (id, name, email, role)
│       │   │   │   ├── LeaveRequest.java            ← Leave request entity
│       │   │   │   └── LeaveBalance.java            ← Leave balance entity
│       │   │   │
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── LeaveRepository.java
│       │   │   │   └── LeaveBalanceRepository.java
│       │   │   │
│       │   │   └── service/
│       │   │       ├── UserService.java
│       │   │       ├── LeaveService.java
│       │   │       ├── LeaveBalanceService.java
│       │   │       └── MyUserDetailsService.java    ← Spring Security UserDetailsService
│       │   │
│       │   └── resources/
│       │       └── application.properties           ← DB config, server port, JPA settings
│       │
│       └── test/
│           └── java/                                ← Unit/Integration tests
│
└── Employee-Leave-Management-System-Front-End/      ← Vanilla JS Frontend
    ├── Index.html                                   ← Single-page application shell
    ├── main.js                                      ← All JavaScript logic & API calls
    └── styling.css                                  ← Custom CSS styles
```

---

## ✅ Prerequisites

Make sure the following tools are installed on your system before proceeding:

| Tool | Minimum Version | Download |
|---|---|---|
| **Java JDK** | 21 | [adoptium.net](https://adoptium.net) |
| **Maven** | 3.8+ | [maven.apache.org](https://maven.apache.org) *(or use included mvnw)* |
| **MySQL Server** | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| **A modern browser** | — | Chrome, Firefox, Edge |
| **IDE (optional)** | — | IntelliJ IDEA / VS Code |

---

## 🔧 Backend Setup & Installation

### Step 1 — Create the MySQL Database

Open your MySQL client (MySQL Workbench, CLI, etc.) and run:

```sql
CREATE DATABASE leave_management;
```

> ⚠️ The schema tables (`tbl_user`, `leave_request`, `leave_balance`) are **auto-generated** by Hibernate on first startup. You do **not** need to run any SQL scripts.

---

### Step 2 — Configure Database Credentials

Open the file:

```
Employee-Leave-Management-System-Bakend/src/main/resources/application.properties
```

Update the credentials to match your local MySQL setup:

```properties
spring.application.name=Employee-Leave-Management-System

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/leave_management
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server port (backend will run on port 1005)
server.port=1005
```

---

### Step 3 — Build & Run the Backend

Navigate to the backend directory:

```powershell
cd "Employee-Leave-Management-System-Bakend"
```

**Option A — Using Maven Wrapper (Recommended, no Maven install needed):**

```powershell
# Windows
.\mvnw.cmd spring-boot:run
```

**Option B — Using system Maven:**

```powershell
mvn spring-boot:run
```

**Option C — Build JAR and run:**

```powershell
.\mvnw.cmd clean package
java -jar target\Employee-Leave-Management-System-0.0.1-SNAPSHOT.jar
```

---

### Step 4 — Verify Backend is Running

Once started, the backend will be accessible at:

```
http://localhost:1005
```

You should see Spring Boot startup logs ending with:
```
Started EmployeeLeaveManagementSystemApplication in X.XXX seconds
```

---

## 🖥️ Frontend Setup & Usage

The frontend is a **pure HTML/JS/CSS Single Page Application (SPA)** — no build step or npm required.

### Step 1 — Open the Frontend

Simply open the `Index.html` file in your browser:

**Option A — Double-click:**
```
Employee-Leave-Management-System-Front-End/Index.html
```

**Option B — Using VS Code Live Server:**
1. Install the **Live Server** extension in VS Code
2. Right-click `Index.html` → **"Open with Live Server"**

**Option C — Using Python HTTP Server:**
```powershell
cd "Employee-Leave-Management-System-Front-End"
python -m http.server 5500
# Then open: http://localhost:5500/Index.html
```

> ✅ Make sure the backend is already running on port `1005` before using the frontend.

---

### Step 2 — Register an Account

1. On the login screen, click the **"Register"** tab
2. Fill in:
   - **Full Name**
   - **Email Address**
   - **Password**
   - **Role** → `Employee` or `Manager`
3. Click **"Create Account"**

---

### Step 3 — Login

1. Switch to the **"Login"** tab
2. Enter your **Email** and **Password**
3. Click **"Login"**
4. You will be redirected to the **Dashboard**

---

## 📡 API Reference

> **Base URL:** `http://localhost:1005`
>
> All endpoints (except registration and login) require **HTTP Basic Authentication**.
> Send `Authorization: Basic base64(email:password)` header with every request.

### 👤 User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/user/reg` | ❌ Public | Register a new user |
| `POST` | `/api/user/login` | ❌ Public | Login and retrieve user info |
| `GET` | `/api/user/alluser` | ✅ Required | Get list of all users |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "EMPLOYEE"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### 📝 Leave Request Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/leaves` | ✅ Required | Apply for a new leave |
| `GET` | `/api/leaves/my` | ✅ Required | Get current user's leaves |
| `GET` | `/api/leaves/pending` | ✅ Required | Get all pending leave requests |
| `GET` | `/api/leaves/all` | ✅ Required | Get all leave requests (Manager) |
| `PUT` | `/api/leaves/approve/{id}` | ✅ Required | Approve a leave by ID |
| `PUT` | `/api/leaves/reject/{id}` | ✅ Required | Reject a leave by ID |
| `GET` | `/api/leaves/calendar?year={y}&month={m}` | ✅ Required | Get leaves for a specific month |
| `GET` | `/api/leaves/user/{userId}` | ✅ Required | Get leaves for a specific user |

**Apply Leave Request Body:**
```json
{
  "leaveType": "Vacation",
  "startDate": "2026-03-10",
  "endDate": "2026-03-15",
  "reason": "Family trip"
}
```

---

### 📊 Leave Balance Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/leave-balance/{userId}` | ✅ Required | Get leave balance for a user |

---

## 🚀 Features & Usage Guide

### Dashboard
- View **summary statistics**: Total Leaves, Pending, Approved, Rejected
- See a table of your **recent leave requests**

### Apply Leave
- Select **Leave Type**: Vacation, Sick Leave, Personal, Maternity
- Choose **Start Date** and **End Date**
- Enter a **reason**
- Click **"Submit Request"**

### My Leaves
- View a complete history of all your leave applications
- See current **status** (Pending / Approved / Rejected)

### Leave Balance
- Check how many leaves you have **used** vs **remaining** for the current year

### Calendar
- Browse a monthly calendar view showing all approved leave days
- Navigate between months using **Prev / Next** buttons

### Approvals *(Manager Only)*
- View all **pending leave requests** from employees
- Click **Approve** or **Reject** and confirm with your Manager ID

### All Leaves *(Manager Only)*
- View the **complete leave history** for all employees in the organization

### All Users *(Manager Only)*
- View a list of all registered users in the system

---

## 🔒 Role-Based Access

| Feature | Employee | Manager |
|---------|----------|---------|
| Dashboard | ✅ | ✅ |
| Apply Leave | ✅ | ✅ |
| My Leaves | ✅ | ✅ |
| Leave Balance | ✅ | ✅ |
| Calendar | ✅ | ✅ |
| Approvals | ❌ | ✅ |
| All Leaves | ❌ | ✅ |
| All Users | ❌ | ✅ |

> Role-based navigation is enforced on the **frontend** by conditionally showing/hiding sidebar buttons based on the logged-in user's `role` field.

---

## 🗄️ Database Schema

The tables are auto-created by **Hibernate JPA** (`ddl-auto=update`).

### `tbl_user`
| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT (PK) | Auto-generated user ID |
| `name` | VARCHAR | Full name |
| `email` | VARCHAR (unique) | Email / login credential |
| `password` | VARCHAR | Plain-text password *(dev only)* |
| `role` | VARCHAR | `EMPLOYEE` or `MANAGER` |

### `leave_request`
| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT (PK) | Auto-generated leave ID |
| `employee_name` | VARCHAR | Name of the requester |
| `leave_type` | VARCHAR | Vacation / Sick Leave / Personal / Maternity |
| `start_date` | DATE | Leave start date |
| `end_date` | DATE | Leave end date |
| `reason` | VARCHAR | Reason for leave |
| `status` | VARCHAR | `PENDING` / `APPROVED` / `REJECTED` |
| `user_id` | BIGINT (FK) | Reference to `tbl_user` |

### `leave_balance`
| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT (PK) | Auto-generated ID |
| `user_id` | BIGINT (FK) | Reference to `tbl_user` |
| `year` | INT | Balance year |
| `total_leaves` | INT | Total allocated leaves |
| `used_leaves` | INT | Leaves already taken |
| `remaining_leaves` | INT | Leaves left |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available for personal and educational use.

---

> Built with ❤️ using Spring Boot & Vanilla JavaScript
