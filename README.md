# 🎓 NepCourses - Learning Management System

A full-stack **Learning Management System (LMS)** built with the **MERN stack**, enabling educators to create and manage courses while students can discover, purchase, and learn from quality content.

---

## 🌟 Features

### 👨‍🏫 For Educators / Creators
- ✅ Create and publish courses  
- ✅ Upload and manage video lectures  
- ✅ Edit course details and pricing  
- ✅ Track enrollments and revenue  
- ✅ Dashboard analytics  

### 🎓 For Students
- ✅ Browse and explore courses  
- ✅ Purchase via **eSewa** or **Khalti**  
- ✅ Access enrolled courses and video lectures  
- ✅ Write reviews and rate courses  
- ✅ Track learning progress  

### ⚙️ General Features
- ✅ User authentication (Email/Password + Google OAuth)  
- ✅ Secure payment integration (eSewa & Khalti)  
- ✅ Cloud-based video and file storage (Cloudinary)  
- ✅ Responsive design (Tailwind CSS)  
- ✅ Email notifications  
- ✅ AI-powered features (Gemini API integration)

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React.js  
- Redux  
- React Router  
- Tailwind CSS  
- Firebase (Google OAuth)  
- Vite  

### 🧠 Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- JWT Authentication  
- Cloudinary (Media Storage)  
- Multer (File Upload Handling)  

### 💳 Payment Gateways
- eSewa  
- Khalti  

---

## 🛠️ Installation & Setup

### 📋 Prerequisites
- Node.js (v14 or higher)  
- MongoDB (local or Atlas)  
- npm or yarn  
- Cloudinary account  
- eSewa merchant account (for production)  
- Khalti merchant account (for production)  
- Google Firebase project (for OAuth)

---

### ⚙️ Backend Setup

1. Clone the repository  
   ```bash
   git clone <repository-url>
   cd NepCourses/Backend

   npm install
   npm start

   
# or for development
npm run dev

cd ../Frontend
npm install

npm run dev
Frontend will run on http://localhost:5173
Database Models

User - Authentication & profile info

Course - Course details & metadata

Lecture - Video lectures within a course

Enrollment - Student course enrollments

Payment - Transaction records

Review - Course reviews & ratings

🔐 Authentication

The system supports:

Email/Password login (JWT based)

Google OAuth (via Firebase)

💳 Payment Integration
Supported Payment Gateways

eSewa - Popular Nepali payment gateway

Khalti - Digital wallet payment system

💡 Payment Flow

User selects a course

Chooses eSewa or Khalti

Redirected to payment gateway

Upon success → Enrollment created

User gains access to course content

🧪 Test Payment Credentials
🟢 eSewa Test Account
eSewa ID: 9806800001 / 2 / 3 / 4 / 5
Password: Nepal@123
MPIN: 1122
Token: 123456

🟣 Khalti Test Accounts
Test Khalti IDs:
- 9800000000
- 9800000001
- 9800000002
- 9800000003
- 9800000004
- 9800000005

Test MPIN: 1111
Test OTP: 987654


⚠️ Note: These credentials are for sandbox testing only.
Do not use production credentials in code or documentation.

📧 Email Notifications

Sent via Gmail SMTP:

Account verification

Password reset

Enrollment confirmation

Course update notifications





