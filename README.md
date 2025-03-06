# Job Search App

A Job Search App built with Node.js, Express.js, and MongoDB (Mongoose).

## Features

- User Authentication (Register, Login, JWT)
- Post Job Listings (Admin only)
- Apply for Jobs
- View Job Listings
- Search Jobs by Title or Category
- Profile Management

## Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt.js for Password Hashing
- Dotenv
- Joi for Validation
- Multer for File Uploads

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-search-app.git
cd job-search-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file inside `/src/config/.env` with the following:

```env
PORT=5000
MONGO_URI=your_mongo_db_uri
JWT_SECRET=your_jwt_secret
```

### 4. Run the App

```bash
npm run dev
```

The app will run at: `http://localhost:5000`

## API Endpoints

### Authentication

- POST `/api/auth/register` ➡ Register User
- POST `/api/auth/login` ➡ Login User

### Jobs

- GET `/api/jobs` ➡ Get All Jobs
- POST `/api/jobs` ➡ Create Job (Admin Only)
- GET `/api/jobs/:id` ➡ Get Job by ID
- PUT `/api/jobs/:id` ➡ Update Job (Admin Only)
- DELETE `/api/jobs/:id` ➡ Delete Job (Admin Only)

### Applications

- POST `/api/applications` ➡ Apply for Job
- GET `/api/applications` ➡ Get User Applications

## Folder Structure

```
├─ src
│  ├─ config
│  │  └─ .env
│  ├─ controllers
│  ├─ middleware
│  ├─ models
│  ├─ routes
│  └─ index.js
├─ package.json
└─ README.md
```

## License

This project is licensed under the MIT License.

## Author

[Ahmed Khaled AbdAllah]
