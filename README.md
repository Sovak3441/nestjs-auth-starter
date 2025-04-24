# NestJS Auth Starter

A robust and secure authentication starter kit for NestJS applications, integrating JWT-based access tokens with HTTP-only cookie-based refresh tokens. Designed with Prisma ORM and PostgreSQL, this starter provides a solid foundation for building scalable and secure backend services.

## ✨ Features

- **JWT Authentication**: Implements access tokens for secure API access.
- **HTTP-only Refresh Tokens**: Utilizes cookies to store refresh tokens securely, mitigating XSS attacks.
- **Role-Based Access Control (RBAC)**: Supports user roles and permissions for fine-grained access control.
- **Prisma ORM Integration**: Seamlessly integrates with Prisma for database interactions.
- **Scheduled Token Cleanup**: Automatically removes expired refresh tokens daily using NestJS Cron jobs.
- **Input Validation**: Ensures data integrity using `class-validator` and `class-transformer`.
- **Environment Configuration**: Manages configuration using environment variables.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Sovak3441/nestjs-auth-starter.git
   cd nestjs-auth-starter
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to configure your database connection and JWT secrets:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/database_name
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   PORT=3000
   ```

4. **Run database migrations**:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the application**:

   ```bash
   npm run start:dev
   ```

   The server will start on `http://localhost:3000`.

## 📚 API Endpoints

- **POST `/auth/register`**: Register a new user with email and password.
- **POST `/auth/login`**: Authenticate user and receive access token; refresh token is set in HTTP-only cookie.
- **POST `/auth/refresh`**: Obtain a new access token using the refresh token from cookies.
- **POST `/auth/logout`**: Clear the refresh token cookie to log out the user.
- **GET `/auth/me`**: Retrieve authenticated user's information; requires a valid access token.

## 🛡️ Security Considerations

- **HTTP-only Cookies**: Refresh tokens are stored in HTTP-only cookies to prevent client-side access.
- **Token Rotation**: Refresh tokens are rotated upon use, and old tokens are invalidated.
- **Scheduled Cleanup**: A daily cron job removes expired refresh tokens from the database.

## 🛠️ Project Structure

```bash
src/
├── auth/             # Authentication module
├── user/             # User module
├── prisma/           # Prisma service and schema
├── main.ts           # Application entry point
├── app.module.ts     # Root module
```


This command runs the unit tests for the application.

## 📅 Scheduled Tasks

The application includes a scheduled task that runs daily to clean up expired refresh tokens from the database. This is implemented using the `@nestjs/schedule` package and a dedicated service.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
