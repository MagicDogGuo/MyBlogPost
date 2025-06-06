# Wordwalker: Your Personal Content Publishing Platform

**Wordwalker** is a full-stack MERN (MongoDB, Express.js, React, Node.js) blog application designed as a personal content publishing hub. A standout feature is the ability for users to **automatically generate striking images for their articles using AI**, enhancing their content effortlessly. It emphasizes a "creator-centric, reader-focused" model where content creation and overall site management are primarily handled by an administrator, while registered users can manage their own contributions and personalize their reading experience.

Users can enjoy a seamless reading experience, save their favorite articles, manage their profiles, and publish their own posts. 

## 🌐 Live Demo

*   **Demo URL:** [https://myblogpost-frontend-static-site.onrender.com/](https://myblogpost-frontend-static-site.onrender.com/)


![Wordwalker Screenshot](assets/A.png) 

![Wordwalker Screenshot2](assets/B.png) 

![Wordwalker Screenshot3](assets/E.png) 

![Wordwalker Screenshot4](assets/H.png) 

## ✨ Key Features

*   **User Authentication & Authorization:**
    *   Secure user registration and login using JSON Web Tokens (JWT).
    *   Role-based access control (Admin, User).
*   **Content Creation & Management:**
    *   **For All Users:**
        *   Create, read, update, and delete their own blog posts.
        *   Dedicated "My Posts" page for managing personal articles.
    *   **Admin Privileges:**
        *   Full CRUD (Create, Read, Update, Delete) operations on all articles across the platform.
        *   Access to manage all comments and subscriber data.
    *   **Post Features:**
        *   Rich text content support for articles.
        *   Tagging system for content categorization.
        *   **AI-Powered Image Generation:** Users can generate a featured image for their post based on the title using OpenAI's DALL-E. The generated image is then automatically uploaded to Imgur for a persistent URL, which is stored with the post.
*   **User Experience & Engagement:**
    *   **Favorite Posts:** Logged-in users can bookmark/unbookmark articles and view their personalized list of favorites.
    *   **Public Article Browsing:** All visitors can browse the list of public articles and view individual post details.
    *   **Responsive Design:** Optimized for a seamless experience across desktops, tablets, and mobile devices.
    *   **Modern UI:** Clean and intuitive user interface built with Material UI.

## 🚀 Technology Stack

*   **Frontend:**
    *   React (v18+)
    *   Material UI (MUI v5)
    *   React Router DOM (v6) for navigation
    *   Axios for API communication
    *   React Context API for global state management
*   **Backend:**
    *   Node.js (v18+ recommended)
    *   Express.js framework
    *   MongoDB (with Mongoose ODM for object modeling)
    *   JSON Web Tokens (JWT) for authentication
    *   Axios for making requests to external APIs (e.g., OpenAI)
    *   `form-data` library for handling image uploads to Imgur
*   **Database:**
    *   MongoDB Atlas (cloud-hosted NoSQL database) or a local MongoDB instance.
*   **Image Services:**
    *   OpenAI DALL-E API for AI image generation.
    *   Imgur API for image hosting and storage.



## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v18 or higher recommended)
*   npm (comes with Node.js) or yarn
*   MongoDB (if running a local database instance)

## ⚙️ Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/MagicDogGuo/MyBlogPost.git
    cd blog-post
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend/client
    npm install
    ```

4.  **Configure Environment Variables:**

    *   **Backend (`backend/.env`):**
        Create a `.env` file in the `backend` directory with the following content:
        ```env
        MONGODB_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/wordwalker or your Atlas connection string

        PORT=5000 # Port for the backend server

        # OpenAI API Key (for AI image generation)
        OPENAI_API_KEY=your_openai_api_key # Get this from the OpenAI Platform

        # Imgur Client ID (for uploading AI-generated images to Imgur)
        IMGUR_CLIENT_ID=your_imgur_client_id # Register an application on Imgur to get this
        ```
        *   **Obtaining `OPENAI_API_KEY`**: Visit the [OpenAI Platform](https://platform.openai.com/account/api-keys) to create your API key.
        *   **Obtaining `IMGUR_CLIENT_ID`**: Register your application on the [Imgur API Documentation page](https://apidocs.imgur.com/#registerapp). Choose anonymous usage type; an OAuth2 callback URL is not required for this functionality.

    *   **Frontend (`frontend/client/.env`):**
        Create a `.env` file in the `frontend/client` directory with the following content:
        ```env
        REACT_APP_API_URL=http://localhost:5000/api # Base URL for your backend API
        ```

## ▶️ Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm start
    ```
    The backend server will run on `http://localhost:5000` (or the `PORT` specified in your `.env` file).

2.  **Start the Frontend Development Server:**
    (In a new terminal window)
    ```bash
    cd frontend/client
    npm start
    ```
    The frontend application will run on `http://localhost:3000` and should open automatically in your browser.

## 📂 Project Structure

```
wordwalker/
├── backend/
│   ├── config/         # Configuration files (e.g., database connection)
│   ├── middleware/     # Express middleware (e.g., auth, error handling)
│   ├── models/         # Mongoose data models (User, Post, Comment, etc.)
│   ├── routes/         # API route definitions
│   ├── scripts/        # Initialization scripts (e.g., default data)
│   └── app.js          # Express application entry point and main configuration
├── frontend/
│   └── client/
│       ├── public/     # Static assets (index.html, favicon, images)
│       ├── src/
│       │   ├── assets/       # Image, font resources
│       │   ├── components/   # React components
│       │   ├── config/       # Frontend configuration (e.g., API endpoints)
│       │   ├── context/      # React Context API (e.g., AuthContext)
│       │   ├── hooks/        # Custom React Hooks
│       │   ├── pages/        # Page-level components
│       │   ├── services/     # API service wrappers
│       │   ├── styles/       # Global styles, theme configuration
│       │   ├── utils/        # Utility functions
│       │   ├── App.js        # Root React component and router setup
│       │   └── index.js      # React application entry point
│       └── package.json
└── README.md
```

## 🗺️ API Endpoints (Key Functionalities)

### Authentication (Auth)
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Log in an existing user
*   `GET /api/auth/me` - Get current logged-in user's information (Token required)

### Posts (Articles)
*   `GET /api/posts` - Fetch all public posts (supports pagination, filtering via query params)
*   `GET /api/posts/me/myposts` - Fetch all posts by the currently logged-in user (Token required)
*   `GET /api/posts/:id` - Fetch details of a single post
*   `POST /api/posts` - Create a new post (Token required; users create their own, admin can create any)
*   `PUT /api/posts/:id` - Update an existing post (Token required; users can only update their own posts, admin can update any)
*   `DELETE /api/posts/:id` - Delete a post (Token required; users can only delete their own posts, admin can delete any)
*   `POST /api/posts/:id/like` - Like/Unlike a post (Token required)
*   `GET /api/posts/user/:userId` - Fetch all posts by a specific user ID

### Comments (Assumed implemented or planned)
*   `POST /api/posts/:postId/comments` - Add a comment to a post (Token required)
*   `GET /api/posts/:postId/comments` - Fetch all comments for a post
*   `PUT /api/comments/:commentId` - Update a comment (Token required; commenter or admin)
*   `DELETE /api/comments/:commentId` - Delete a comment (Token required; commenter or admin)

### AI Image Generation
*   `POST /api/ai/generate-image` - Generate an image based on a prompt and upload to Imgur (Token required)


## 👤 Default Users

The application may include default users if initialized via the `backend/scripts/initData.js` script:

1.  **Admin User**
    *   Email: `admin@example.com`
    *   Password: `admin123`
    *   Role: `admin`

2.  **Regular User**
    *   Email: `user@example.com`
    *   Password: `user123`
    *   Role: `user`




## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.


