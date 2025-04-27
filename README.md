
# Gym Management Backend

This is the backend API for a Gym Management system that handles various operations like user authentication, schedule management, bookings, and admin functions. The backend is built using Node.js, Express.js, and Prisma ORM with MongoDB.

## Features

- **Authentication**: Secure login for users (Trainees, Trainers, Admin)
- **Schedule Management**: Allows trainees to book schedules, and trainers can manage their schedules.
- **Admin Functions**: Admin can manage users, trainers, schedules, and bookings.
- **Role-based Access Control**: Different routes are protected based on user roles (Admin, Trainer, Trainee).

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend server
- **Express.js**: Web framework for building the REST API
- **Prisma ORM**: ORM for interacting with the database
- **MongoDB**: NoSQL database for data storage
- **JWT Authentication**: For secure login and access control
- **argon2**: Password hashing library
- **TypeScript**: Type-safe JavaScript

## Setup Instructions

### Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (locally or through a cloud provider like MongoDB Atlas)

### Clone the Repository

```bash
git clone https://github.com/your-username/gym-management-backend.git
cd gym-management-backend
```

### Install Dependencies

Use **pnpm** or **npm** to install the required dependencies.

```bash
pnpm install
# or
npm install
```

### Database Setup

1. Make sure MongoDB is running locally, or configure the connection string to your MongoDB Atlas cluster.
2. Run Prisma migrations to set up the database schema.

```bash
pnpm prisma migrate dev
```

### Environment Variables

Create a `.env` file at the root of the project and add the following environment variables:

```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret-key"
```

### Run the Application

To start the application in development mode:

```bash
pnpm dev
# or
npm run dev
```

The backend should now be running on [http://localhost:3000](http://localhost:3000).

## API Endpoints

#### Authentication

- **POST** `/auth` - Logs in a user and returns a JWT token.

#### Trainee Routes

- **POST** `/trainee/create-account` - Creates a new trainee account.
- **GET** `/trainee/schedule` - Retrieves available schedules for booking.
- **POST** `/trainee/booking-schedule` - Books a schedule for a trainee.
- **GET** `/trainee/mybookinglist/:traineeId` - Retrieves a list of a trainee's bookings.
- **DELETE** `/trainee/mybookinglist/:id` - Deletes a trainee's booking.

#### Trainer Routes

- **GET** `/trainer/schedules/:id` - Retrieves all schedules for a trainer.

#### Admin Routes

- **GET** `/admin/get-users` - Gets all users in the system.
- **POST** `/admin/create-user` - Creates a new trainer.
- **GET** `/admin/trainers` - Retrieves all trainers.
- **PUT** `/admin/update-trainer-profile/:id` - Updates a trainer's profile.
- **DELETE** `/admin/delete-trainer-profile/:id` - Deletes a trainer's profile.
- **POST** `/admin/create-schedule` - Creates a new schedule.
- **DELETE** `/admin/delete-schedule/:id` - Deletes a schedule.

## Example

### Login Example

**Request:**

```http
POST /auth
Content-Type: application/json

{
  "email": "trainee@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "id": "123",
    "email": "trainee@example.com",
    "role": "TRAINEE",
    "BearerToken": "your-jwt-token"
  }
}
```

### Schedule Booking Example

**Request:**

```http
POST /trainee/booking-schedule
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "scheduleId": "456",
  "traineeId": "123"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "success": true,
    "message": "Class booked successfully",
    "data": {
      "scheduleId": "456",
      "traineeId": "123",
      "bookingDate": "2025-04-27"
    }
  }
}
```

## System Architecture

The **Gym Management Backend** follows a modular and scalable architecture. Here's a breakdown of its components:

### Project Structure

```bash
gym-management-backend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── authController.ts       # Authentication 
│   │   │   ├── authRoutes.ts           # Authentication routes
│   │   │   └── authService.ts          # Auth logic (JWT handling, login)
│   │   ├── Admin/
│   │   │   ├── adminController.ts      # Admin-specific logic
│   │   │   ├── adminRoutes.ts          # Admin routes
│   │   │   └── adminService.ts         # Admin-related services
│   │   ├── Trainer/
│   │   │   ├── trainerController.ts    # Trainer-specific logic
│   │   │   ├── trainerRoutes.ts        # Trainer routes
│   │   │   └── trainerService.ts       # Trainer-related services
│   │   └── Trainee/
│   │       ├── traineeController.ts    # Trainee-specific logic
│   │       ├── traineeRoutes.ts        # Trainee routes
│   │       └── traineeService.ts       # Trainee-related services
│   ├── jwt/                    
│   │   └── Authorize.ts                # Authentication checks
│   ├── middlewares/                    
│   │   └── varifyAuthrize.ts           # Authentication checks and Role-based access control
│   ├── lib/                    
│   │   ├── globle.route.ts             # globle route provider
│   │   └── prismaClient.ts  
│   ├── app.ts                          # Main application setup and server
│   └── server.ts                       # Server configuration
│
├── prisma/                             # Prisma generate and schema with JS
│   ├── schema.prisma
│   └── generate/
│       └── client/
├── .env 
├── .nodemon.json
├── package.json                        # Project dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # Project documentation                   
```

### Key Components

- **Controllers**: Each controller handles requests for specific routes. For example, `authController.ts` manages the logic for user login and registration, while `trainerController.ts` manages trainer-related actions.
  
- **Models**: The database schema is managed using Prisma ORM. Models like `User`, `Trainer`, `Schedule`, and `Booking` are defined to interact with the MongoDB database.

- **Routes**: Defines API routes for the application, grouping them by functionality (e.g., `authRoutes.ts`, `trainerRoutes.ts`).

- **Services**: Contains the business logic of the application. Services like `authService.ts` handle authentication tasks like token generation, while `scheduleService.ts` manages schedule creation and bookings.

- **Middlewares**: Includes authentication checks and role-based access control middleware to ensure that only authorized users can access certain routes.

- **Utilities**: Utility files like `passwordUtils.ts` and `jwtUtils.ts` manage hashing passwords and generating JWT tokens.

### Database Schema

The Prisma schema defines four main models for the application:

- **User**: Stores information about users (Trainees, Trainers, Admin).
- **Trainer**: Contains trainer-specific information like specialties and schedules.
- **Schedule**: Represents available gym schedules for booking.
- **Booking**: Stores records of trainee bookings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
