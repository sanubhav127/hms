# 🏥 Hospital Management System (MERN Stack)

A complete hospital management system built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** that enables admins, doctors, and patients to manage appointments, patients, and billing efficiently.

---

## 🚀 Features

### 👨‍⚕️ Admin
- Manage doctors and patients  
- Manage appointments (create, update, delete)  
- View and generate billing reports  

### 👩‍⚕️ Doctor
- View assigned patients  
- Manage and update appointments  
- Access medical records  

### 🧑‍💻 Patient
- Book, view, or cancel appointments  
- View billing and reports  

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Token) |
| State Management | React Hooks / Context (if applicable) |

---

## ⚙️ Folder Structure

hospital-management-system/
│
├── backend/ # Express + MongoDB backend
├── frontend/ # React frontend (with Tailwind CSS)
├── README.md # Main readme (this file)
└── .gitignore

## 🧠 Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sanubhav127/hms.git
cd HMS

2️⃣ Setup Backend
cd backend
npm install

Create a .env file in the backend folder and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Then run
npm start

3️⃣ Setup Frontend
cd frontend
cd vite-project
npm install
npm run dev

🧑‍💻 Author

Anubhav Singh
MERN Stack Developer | DevOps | Passionate about AI & Full Stack Development
