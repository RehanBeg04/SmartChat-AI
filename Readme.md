# NeuroChat 💬  
*A Real-Time Chat Application*

## 🚀 Overview
NeuroChat is a full-stack real-time chat application designed to deliver fast, secure, and seamless communication.  
It supports one-to-one messaging, friend requests, unseen message tracking, and real-time updates using WebSockets.

The project is built with a production-ready architecture, focusing on scalability, clean state management, and responsive UI.

---

## ✨ Features
- 🔐 User Authentication (JWT + Cookies)
- 💬 Real-time Messaging using Socket.IO
- 👥 Friend Requests (Send / Accept / Delete)
- 🔔 Unseen Message Count
- 🖼️ Profile Image Upload (Cloudinary)
- ⚡ Instant UI updates without refresh
- 📱 Fully Responsive Design
- 🌙 Dark Mode Ready UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Zustand (State Management)
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- Cloudinary (Media Storage)

---

## 🧠 Architecture Highlights
- Centralized auth & socket context
- Event-driven UI updates using WebSockets
- Optimized database queries with selective field fetching
- Clear separation of development & production configurations
- Secure cookie and CORS handling for production