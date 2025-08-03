# 🚗 Ride Booking System

A  Ride Booking System where users can register as Riders or Drivers, apply for roles, post rides, book available rides, and manage their activities. The system includes robust authentication, role-based access control (Admin/Super Admin), and booking flow management.

---

## 🌟 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication**
- User roles: `USER`, `ADMIN`, `SUPER_ADMIN`
- Only `SUPER_ADMIN` can promote a user to `ADMIN`
- Secure login and registration with proper validations

### 👤 User Roles
- **USER**: Default role for every registered user
- **RIDER / DRIVER**: Users can apply to become a Rider or Driver via the Apply system
- **ADMIN**: Can manage users and bookings
- **SUPER_ADMIN**: Has full control, including promoting users to `ADMIN`

---

## 📥 Apply System
- Regular users can apply for **RIDER** or **DRIVER** role
- Application approval handled by `ADMIN` or `SUPER_ADMIN`
- Applicants can **cancel** their own applications before approval
- Once approved, user role updates to `RIDER` or `DRIVER`

---

## 🚘 Driver and Rider Posts
- Only `DRIVER` adn `RIDER`s can create posts
- Post includes: `title`, `from`, `to`, `amount`, and auto-attached driver info
- All users can view all posts
- Drivers can delete their own posts
- `ADMIN`/`SUPER_ADMIN` can block any post

---

## 📦 Booking System
- All users (including Riders and Drivers) can **book rides**
- Only the **creator** of the booking can view and cancel (unless status is restricted)
- Booking statuses: `PENDING`, `ACCEPTED`, `PICKED_UP`, `IN_TRANSIT`, `COMPLETED`, `CANCELLED`
- Drivers or Riders can update status for bookings on their own posts

---

## 🛠️ Tech Stack 

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose
- JWT for Authentication

---


-[Visit the Live Site](https://bakend-ride-booking-system.vercel.app)
---
-[Visit the server github](https://github.com/Masudur400/backend-ride-booking-management-system)