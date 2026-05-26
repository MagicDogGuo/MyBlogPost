# System Overview

High-level view of how the browser, frontend, backend, database, and external services connect in **Wordwalker**.

## Architecture diagram

```mermaid
flowchart TB
    subgraph Client["User Browser"]
        UI["React SPA<br/>Material UI + React Router"]
        LS["localStorage<br/>JWT token"]
        CTX["AuthContext<br/>Global auth state"]
        UI --> CTX
        CTX --> LS
    end

    subgraph Frontend["Frontend (port 3000)"]
        Pages["Pages<br/>FavoritePosts / UserPosts / TagPosts / Profile"]
        Comps["Components<br/>Login / Posts / PostDetail / CommentList..."]
        API_CFG["config/api.js<br/>API_ENDPOINTS"]
        Pages --> Comps
        Comps --> API_CFG
    end

    subgraph Backend["Backend Express (port 5000)"]
        APP["app.js<br/>CORS + JSON + Routes"]
        MW["middleware/auth.js<br/>JWT verify + isAdmin"]
        ROUTES["Routes"]
        MODELS["Mongoose Models"]
        INIT["scripts/initData.js"]
        APP --> MW
        APP --> ROUTES
        ROUTES --> MODELS
        APP --> INIT
    end

    subgraph DB["Database"]
        MONGO[("MongoDB<br/>User / Post / Comment / Subscriber")]
    end

    subgraph External["External Services"]
        OPENAI["OpenAI DALL-E API"]
        IMGUR["Imgur API"]
    end

    UI -->|"Axios + Bearer Token"| APP
    ROUTES --> MONGO
    ROUTES -->|"AI image gen"| OPENAI
    ROUTES -->|"Image upload"| IMGUR
    INIT --> MONGO
```

## Layers

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Client** | React SPA + AuthContext + localStorage | UI, routing, JWT persistence in the browser |
| **Frontend** | React, MUI, Axios, `config/api.js` | Pages and components; calls backend with `Authorization: Bearer <token>` |
| **Backend** | Express, Mongoose, JWT middleware | REST API, authorization, business logic, API secrets |
| **Database** | MongoDB | Users, posts, comments, subscribers |
| **External** | OpenAI + Imgur | AI cover images; stable public image URLs on posts |

## Request flow examples

### Login

```
Browser → POST /api/auth/login → verify password (bcrypt) → JWT → localStorage + AuthContext
```

### Read a post

```
Browser → GET /api/posts/:id → Express → Mongoose → MongoDB → JSON → React (PostDetail)
```

### Create post with AI image (authenticated)

```
Browser (JWT) → POST /api/ai/generate-image → OpenAI → download → Imgur → imageUrl
Browser (JWT) → POST /api/posts { title, content, imageUrl } → save to MongoDB
```

## Security note

The browser **never** talks to MongoDB or external APIs (OpenAI, Imgur) directly. Only the Express server does, keeping credentials on the server.

## Related pages

- [Frontend Architecture](Frontend-Architecture)
- [Backend Architecture](Backend-Architecture)

