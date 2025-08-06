# 💬 ChatHub  

![React](https://img.shields.io/badge/Frontend-React-61DBFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-68A063?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4DB33D?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.IO-000000?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A **real‑time chat application** built with **Node.js, Express, MongoDB, React, and Socket.IO**.  
ChatHub lets you connect instantly with friends, manage your profile, and enjoy seamless real‑time messaging with modern UI and secure authentication.  

---

## 🚀 Features

- 🔐 **Authentication** with JWT  
- 📧 **Password reset** with OTP via email  
- 💬 **Realtime one‑to‑one chat** using Socket.IO  
- 📜 **Infinite scroll pagination** for chat history  
- 👥 **Friends system** (auto‑add on first chat)  
- 🎨 **Neumorphic responsive UI**  
- 📸 **Profile picture support**

---

## 🏗️ Tech Stack

- **Frontend:** React, CSS (Neumorphism), Axios, Socket.IO Client  
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, bcrypt  
- **Email:** Nodemailer (Gmail App Password)  
- **Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas  

---

## ⚙️ Setup & Installation

### 🔑 Environment Variables
Create a `.env` file in the backend folder with:

```env

````   BACKEND   ````
PORT=<your_port_no>
MONGODB=<your_mongodb_uri>
JWT_SECRET_KEY=<your_jwt_secret>
GMAIL_USER=<your_gmail_address>
GMAIL_APP_PASS=<your_16_digit_app_password>
CLIENT_ORIGIN=http://localhost:5173

````   FRONTEND   ````
VITE_API_URL=<backend_origin/api>