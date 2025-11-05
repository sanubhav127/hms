# ⚙️ Hospital Management System - Backend

This is the **backend server** for the Hospital Management System, built using **Node.js**, **Express.js**, and **MongoDB**.

---

## 🚀 Features
- RESTful API endpoints for patients, doctors, and appointments  
- JWT-based authentication  
- Role-based access (Admin, Doctor, Patient)  
- Secure password handling with bcrypt  
- Cookie-based token management  

---

## 🧰 Tech Stack
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Cookie Parser  
- bcrypt  

---

## ⚙️ Environment Variables
Create a `.env` file in this folder:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

🧩 Run Backend
Install dependencies
npm install

Start development server
npx nodemon
The backend will start on:
http://localhost:3000

🧠 Folder Structure
backend/
├── src/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   └── routes
├── .env
└── app.js