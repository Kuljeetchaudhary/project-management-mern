# Project Management Backend API

A backend-focused Project Management Application built using Node.js, Express.js, and MongoDB, following a modular and production-oriented architecture.

## Features

- User Registration and Login
- Secure Authentication and Authorization
- Password Hashing using bcrypt
- Forgot Password API
- Reset Password API
- Email Verification
- Email Notifications using Nodemailer and Mailtrap
- JWT-based Authentication
- Secure Token Generation and Validation
- Modular MVC-based Project Structure
- Centralized Error Handling
- Request Validation and Middleware

## Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcrypt
- **Email Service:** Nodemailer and Mailtrap
- **Validation:** Custom Validation Middleware

## Project Structure

```text
Project-Management-Backend/
│
├── Public/
│
├── src/
│   ├── Controllers/
│   ├── DB/
│   ├── Middlewares/
│   ├── Routes/
│   ├── Utils/
│   └── Validators/
│
├── .env.example
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── package-lock.json
└── README.md
```

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/Kuljeetchaudhary/project-management-mern.git
```

**2. Navigate to the project directory**

```bash
cd project-management-mern
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory and add the required environment variables using `.env.example` as a reference.

**5. Start the application**

Use the start script defined in `package.json`.

## Security

- Passwords are hashed before storing them.
- Authentication is handled using JWT.
- Sensitive credentials are managed through environment variables.
- Email verification and password recovery use secure token-based workflows.

## Author

**Kuljeet Chaudhary**

- GitHub: [Kuljeetchaudhary](https://github.com/Kuljeetchaudhary)

---

Developed as a backend development project with a focus on secure authentication, modular architecture, and maintainable API development.