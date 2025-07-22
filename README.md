# Medium Clone - NestJS Backend

A modern Medium clone backend built with NestJS, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth system
- **User Management** - User profiles and following system
- **Article Management** - CRUD operations for articles
- **Tags System** - Article categorization
- **Comments** - Article commenting system
- **Favorites** - Article bookmarking
- **Database Migrations** - TypeORM migrations and seeds

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **Validation:** class-validator
- **Password Hashing:** bcrypt

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Yarn or npm

## 🔧 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/mediumclone-nestjs.git
cd mediumclone-nestjs
```

2. **Install dependencies:**

```bash
yarn install
```

3. **Environment setup:**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Database setup:**

```bash
# Create database
createdb mediumclone

# Run migrations
yarn db:migrate

# Seed initial data
yarn seed:run
```

5. **Start the application:**

```bash
# Development
yarn start:dev

# Production
yarn build
yarn start:prod
```

## 🗄️ Database

### Migrations

```bash
# Generate new migration
yarn db:migration:generate src/migrations/MigrationName

# Run migrations
yarn db:migrate

# Revert last migration
yarn db:revert
```

### Seeds

```bash
# Run seeds
yarn seed:run

# Revert seeds
yarn seed:revert

# Check seed status
yarn seed:show
```

## 📚 API Documentation

The API follows RESTful conventions:

- **Authentication:** `/api/auth`
- **Users:** `/api/users`
- **Articles:** `/api/articles`
- **Tags:** `/api/tags`
- **Comments:** `/api/comments`

## 🔑 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=mediumclone

# JWT
JWT_SECRET=your_jwt_secret

# App
PORT=3000
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📁 Project Structure

```
src/
├── article/          # Article module
├── auth/            # Authentication module
├── comment/         # Comment module
├── migrations/      # Database migrations
├── seeds/          # Database seeds
├── tag/            # Tag module
├── user/           # User module
├── shared/         # Shared utilities
├── ormconfig.ts    # TypeORM configuration
└── main.ts         # Application entry point
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dmytro Kornieiev**

- GitHub: [@kornieiev](https://github.com/kornieiev)
- Email: mail.korneev@gmail.com
