# MyBlogPost

A modern blog post application built with React and Node.js.

## Features

- Create, read, update, and delete blog posts
- Modern UI with Material-UI components
- Responsive design
- RESTful API architecture

## Tech Stack

### Frontend
- React.js
- Material-UI
- Axios for API calls

### Backend
- Node.js
- Express.js
- RESTful API

## Project Structure

```
myblogpost/
├── backend/           # Node.js + Express API server
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend application
│   └── client/      # React app files
└── package.json     # Project management
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd myblogpost
```

2. Install dependencies for all parts:
```bash
npm run install-all
```

### Running the Application

1. Development mode (runs both frontend and backend):
```bash
npm run dev
```

2. Run backend only:
```bash
npm run backend
```

3. Run frontend only:
```bash
npm run frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- GET /api/posts - Get all posts
- POST /api/posts - Create a new post
- PUT /api/posts/:id - Update a post
- DELETE /api/posts/:id - Delete a post


## License

This project is licensed under the MIT License - see the LICENSE file for details.
