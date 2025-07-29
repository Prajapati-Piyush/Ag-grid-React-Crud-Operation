# 🚀 Employee Management System with AG Grid

A full-stack Employee Management System built using **React**, **AG Grid**, **Node.js (Express)**, and **PostgreSQL**. This project demonstrates CRUD operations, custom column filtering, and a modern grid UI.

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## ✅ Features

- Create, Read, Update, and Delete employees
- Custom filter on **Name** column using AG Grid
- AG Grid pagination and sorting
- Responsive and clean UI with Tailwind CSS
- Backend validations and PostgreSQL integration
- Modular and scalable codebase

---

## ⚙️ Tech Stack

**Frontend:**
- React.js
- AG Grid (Community version)
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM (or `pg` package, if used directly)

---

## 📸 Screenshots

| Feature | Preview |
|--------|--------|
| Employee Grid | ![Employee Grid]<img width="1588" height="887" alt="image" src="https://github.com/user-attachments/assets/6871cdec-0216-479c-b57c-9c495601e890" />
 |
| Add/Edit Modal | ![Form Modal](<img width="1428" height="122" alt="image" src="https://github.com/user-attachments/assets/bbc83d01-2457-4618-bd5e-d507df75d9da" />
 |

> Screenshots are stored in the `/screenshots` folder.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/employee-management-system.git
cd employee-management-system
```


### 2. Install dependencies
#### For frontend
cd client
npm install

#### For backend
cd ../server
npm install


3. Setup .env file for server
Create a .env file inside /server:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_password
DB_NAME=employee_db


4. Run both servers
#### Run backend
cd server
npm run dev

#### Run frontend
cd ../client
npm start
