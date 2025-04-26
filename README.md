# Blog Post Application

A full-stack blog application built with React, Node.js, and MongoDB.

## Features

- User authentication (Login/Register)
- Role-based access control (Admin/User)
- Blog post management
  - Create, read, update, and delete posts
  - Tag system
  - Rich text content
- Responsive design
- Modern UI with Material-UI

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Axios
- Context API for state management

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/blog-post.git
cd blog-post
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend/client
npm install
```

3. Environment Setup

Create `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

Create `.env` file in the frontend/client directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend/client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
blog-post/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   └── app.js
├── frontend/
│   └── client/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── config/
│       │   └── App.js
│       └── package.json
└── README.md
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user info

### Posts
- GET /api/posts - Get all posts
- GET /api/posts/:id - Get single post
- POST /api/posts - Create new post (Admin only)
- PUT /api/posts/:id - Update post (Admin only)
- DELETE /api/posts/:id - Delete post (Admin only)

## Default Users

The application comes with two default users:

1. Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. Regular User
   - Email: user@example.com
   - Password: user123
   - Role: user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React for the frontend framework
