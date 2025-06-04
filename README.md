## Wordwalker: Your Personal Content Publishing Platform

**Wordwalker** is a dynamic full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js), designed as a personal content publishing hub. It operates on a "creator-centric, reader-focused" model where content creation and overall management are primarily handled by an administrator (the site owner). 

Registered users can enjoy a seamless reading experience, save their favorite articles, and manage their own profiles. Future enhancements aim to introduce more interactive features such as commenting, personalized user pages, and newsletter subscriptions to foster greater user engagement and retention.

### Key Features:
*   **User Authentication:** Secure registration and login using JWT for access control.
*   **Content Management:** 
    *   **Admin:** Full control to create, edit, and delete all articles. Access to view all comments and subscriber data.
    *   **User:** Ability to create, edit, and delete their own articles. Can also read all public articles, and manage their favorites and profile.
*   **Favorites:** Logged-in users can bookmark/unbookmark articles and view their personalized list of favorites.
*   **Article Reading:** All visitors can browse the list of articles and view individual post details.

Our technology stack leverages:
*   **Frontend:** React.js with Material UI for a responsive and modern user interface, React Router DOM for navigation, and Axios for API communication.
*   **Backend:** Node.js and Express.js for robust server-side logic, Mongoose for MongoDB object modeling.
*   **Database:** MongoDB Atlas (cloud-hosted NoSQL database).
*   **Authentication:** JSON Web Tokens (JWT) for secure and stateless authentication.

Wordwalker aims to provide a clean, intuitive, and engaging platform for both content creators and readers.

---

## Demo

Live Demo: [https://myblogpost-frontend-static-site.onrender.com/](https://myblogpost-frontend-static-site.onrender.com/)

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
