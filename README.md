# 🎮 PokéGuess

PokéGuess is a fullstack Pokémon guessing game. The goal is to guess the Pokémon of the day using a series of clues about its characteristics, evolution line, and physical attributes.

The project was built primarily as a **fullstack/software engineering portfolio project**, with a focus on Java/Spring Boot, React/TypeScript, PostgreSQL, Docker, automated testing, CI/CD, and cloud deployment.

## 🎥 System Demo


---

## 🚀 Live Demo

**Play PokéGuess:**  
https://pokeguess-rsfm.onrender.com

- If it does not work the 30 day free trial on render has ran out
- You can also run it locally (instructions further down)
---

## ✨ Features

- 🎯 One daily Pokémon challenge
- 🔟 Maximum of 10 guesses per game
- 🔎 Pokémon search with autocomplete
- 🖼️ Pokémon artwork displayed for each guess
- 🟢🟡🔴 Type matching clues
- 🧬 Generation matching
- 🌳 Habitat matching
- 📏 Height comparison with directional clues
- ⚖️ Weight comparison with directional clues
- 🔄 Evolution distance calculation
- 🏆 Game completion and result screen
- 📊 Statistics and guess distribution
- 💾 Persistent game sessions
- 📱 Responsive design
- 🌙 Light/dark mode
- ♿ Accessibility and visual settings
- 🔗 Shareable results

---

## 🧠 How the Game Works

Every day, PokéGuess selects a Pokémon for the daily challenge.

The player can search for and submit Pokémon guesses. After every guess, the backend compares the guessed Pokémon against the target Pokémon and returns a set of clues.

### Example clues

| Category | Result |
|---|---|
| Type | 🟢 Exact / 🟡 Partial / 🔴 No match |
| Generation | 🟢 Same / 🔴 Different |
| Habitat | 🟢 Same / 🔴 Different |
| Height | ⬆️ Higher / ⬇️ Lower / 🟢 Match |
| Weight | ⬆️ Heavier / ⬇️ Lighter / 🟢 Match |
| Evolution | Number of steps between Pokémon |

The game ends when the player correctly identifies the Pokémon or uses all 10 attempts.

---

## 🏗️ Architecture

### Local / Development Architecture

```text
                         ┌──────────────────────┐
                         │      Browser         │
                         │ React + TypeScript   │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP/REST
                                    ▼
                         ┌──────────────────────┐
                         │    Spring Boot      │
                         │       Backend       │
                         │        Java         │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌────────────┐    ┌──────────────┐   ┌──────────────┐
          │ PostgreSQL │    │   PokéAPI    │   │ Game Logic   │
          │  Database  │    │ External API │   │ & Services   │
          └────────────┘    └──────────────┘   └──────────────┘
```

### Production Deployment

```text
GitHub
   │
   ├── CI
   │    ├── Backend tests
   │    ├── Frontend build
   │    └── Docker builds
   │
   └── CD
        │
        ▼
GitHub Container Registry
        │
        ▼
      Render
     ┌───────────────┐
     │ React         │
     │ Spring Boot   │
     │ PostgreSQL    │
     └───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Hooks
- Responsive UI

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

### Database

- PostgreSQL

### Testing

- JUnit 5
- Mockito
- Spring Boot Test
- Testcontainers
- PostgreSQL integration tests

### DevOps / Infrastructure

- Docker
- Docker Compose
- Nginx
- GitHub Actions
- GitHub Container Registry
- Render

### External API

- [PokéAPI](https://pokeapi.co/)

---

## 📂 Project Structure

```text
PokeGuess/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/pokeguess/backend/
│   │   │           ├── config/
│   │   │           ├── controller/
│   │   │           ├── dto/
│   │   │           ├── model/
│   │   │           ├── repository/
│   │   │           └── service/
│   │   │
│   │   └── test/
│   │       └── java/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── mvnw
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── App.tsx
│
├── Dockerfile.frontend
├── nginx.conf
├── compose.yaml
├── package.json
└── README.md
```

---

## 🔌 Backend API

The Spring Boot backend exposes REST endpoints for the game.

### Pokémon

```text
GET /api/pokemon/{name}
```

Returns Pokémon data used by the game.

### Start Game

```text
POST /api/game/start
```

Creates a persistent game session for the current daily challenge.

### Game State

```text
GET /api/game/state?sessionId={id}
```

Returns the current game state, including attempts, guesses, and completion state.

### Submit Guess

```text
POST /api/game/guess?sessionId={id}&name={pokemon}
```

Submits a Pokémon guess and returns the generated clues.

The backend is responsible for the actual game logic and acts as the source of truth for:

- Daily challenge selection
- Game sessions
- Guesses
- Pokémon comparison
- Clue generation
- Evolution distance
- Win/loss state
- Persistence

---

## 🧬 Evolution Distance

One of the more interesting backend features is the evolution distance calculation.

PokéAPI represents Pokémon evolution chains as a recursive tree. The application transforms this structure into a graph and uses **Breadth-First Search (BFS)** to calculate the shortest distance between two Pokémon.

For example:

```text
Bulbasaur
    │
    ▼
Ivysaur
    │
    ▼
Venusaur
```

This produces:

```text
Bulbasaur → Ivysaur = 1
Bulbasaur → Venusaur = 2
Ivysaur  → Venusaur = 1
```

Pokémon belonging to different evolution chains have no evolution distance.

This logic is implemented in the backend rather than in the frontend, keeping the game rules on the server side.

---

## 🗄️ Persistence

The backend uses PostgreSQL to persist important game information.

Main entities include:

```text
DailyChallenge
GameSession
Guess
```

The daily challenge is stored by date, while individual game sessions and guesses are stored in PostgreSQL.

This means game sessions are not purely stored in application memory and can survive backend restarts.

The backend uses:

- Spring Data JPA
- Hibernate
- PostgreSQL

to manage persistence.

---

## 🧪 Testing

The backend includes both **unit tests** and **integration tests**.

### Unit Tests

Mockito is used to isolate services and test business logic independently.

Examples include:

```text
ClueServiceTest
GameServiceTest
```

The game service tests cover scenarios such as:

- Creating a game session
- Saving guesses
- Increasing attempts
- Winning the game
- Reaching 10 incorrect guesses
- Rejecting an 11th guess
- Rejecting guesses after winning

### Integration Tests

Testcontainers is used to start a real PostgreSQL container during testing.

```text
GameServiceIntegrationTest
        │
        ▼
Testcontainers
        │
        ▼
PostgreSQL
```

This allows the application to test its persistence layer against an actual PostgreSQL database rather than relying only on mocks.

Run the backend test suite with:

```bash
cd backend
./mvnw clean test
```

---

## 🐳 Docker

The application can be run locally using Docker Compose.

The stack consists of:

```text
Frontend
   ↓
Nginx
   ↓
Spring Boot
   ↓
PostgreSQL
```

### Start the application

```bash
docker compose up --build
```

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:8080
```

### Stop the containers

```bash
docker compose down
```

Docker is also used in CI/CD to build production container images for both the backend and frontend.

---

## 🔄 CI/CD

GitHub Actions is used to automate the software delivery workflow.

### Continuous Integration

Every push to `main` and pull request runs:

```text
Backend tests
      ↓
Frontend build
      ↓
Docker builds
```

The backend tests include the Testcontainers PostgreSQL integration tests.

This means a change must pass automated testing and builds before it can progress through the delivery pipeline.

### Continuous Delivery

After CI succeeds on `main`, the CD workflow builds and publishes Docker images to GitHub Container Registry.

```text
Successful CI
      ↓
Build Docker images
      ↓
Tag images
      ↓
Push images to GHCR
```

The CD workflow is triggered only after the CI workflow completes successfully on `main`.

This prevents failed builds or failed tests from being published as production images.

---

## ☁️ Deployment

The application is deployed to Render.

### Frontend

The React/Vite frontend is deployed as a Render Static Site.

### Backend

The Spring Boot application is deployed as a Render Web Service using the Dockerfile.

### Database

The application uses a Render PostgreSQL database.

The production architecture is therefore:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              │ Render Static   │
              │      Site       │
              └────────┬────────┘
                       │
                       │ HTTPS / REST
                       ▼
              ┌─────────────────┐
              │  Spring Boot    │
              │ Render Web      │
              │    Service      │
              └────────┬────────┘
                       │
                       │ PostgreSQL
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │     Render      │
              └─────────────────┘
```

Production configuration is managed through environment variables such as:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
CORS_ALLOWED_ORIGIN
VITE_API_BASE_URL
```

Database credentials are not stored in the source code.

---

## 🎨 Frontend Development

The frontend was **vibe coded using Bolt.new** to accelerate UI development.

The frontend was then integrated with the manually developed Spring Boot backend through REST APIs.

The frontend development focused on:

- Responsive UI
- Pokémon search
- Game state visualization
- Clue presentation
- Modals and settings
- Statistics
- Accessibility
- User experience

The backend, database architecture, game logic, persistence, testing, Docker setup, CI/CD, and deployment configuration were developed as part of the project implementation.

The use of Bolt.new was intentional: it allowed the project to move quickly through UI development while the primary engineering focus remained on the backend, architecture, infrastructure, and integration.

---

## 💡 Design Philosophy

PokéGuess was intentionally designed as a **software engineering/fullstack project rather than an AI project**.

The primary focus areas were:

```text
Backend architecture
REST API development
Business logic
Database persistence
Testing
Docker
CI/CD
Cloud deployment
Frontend/backend integration
```

The project was designed to demonstrate how different parts of a modern fullstack application work together:

```text
Frontend
   ↓
REST API
   ↓
Business Logic
   ↓
Persistence
   ↓
Database
```

At the same time, the application integrates with an external API and handles data transformation and game-specific logic in the backend.

---

## ▶️ Running Locally

### Prerequisites

- Java 21
- Node.js 22+
- Docker Desktop
- Git

### Clone the repository

```bash
git clone https://github.com/18alba1/PokeGuess.git
cd PokeGuess
```

### Start PostgreSQL

```bash
docker compose up -d postgres
```

### Start the backend

Open a terminal in the backend directory:

```bash
cd backend
./mvnw spring-boot:run
```

### Start the frontend

From the repository root:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### Run everything with Docker

Alternatively:

```bash
docker compose up --build
```

---

## 📊 Key Engineering Decisions

### Backend owns game logic

The frontend displays the game, but the backend determines:

- Which Pokémon is the target
- Whether a guess is correct
- How clues are generated
- Whether the game is over
- Evolution distance
- Persistence

This prevents the frontend from being the source of truth for game rules.

### Persistent sessions

Game sessions and guesses are stored in PostgreSQL rather than only in application memory.

### Daily challenge persistence

The daily Pokémon is stored by date so multiple sessions receive the same daily challenge.

### Integration testing with a real database

Testcontainers was used to verify database-related behavior against an actual PostgreSQL instance.

### Dockerized application

Both frontend and backend have Docker images, allowing the application to run consistently across development, CI, and deployment environments.

### Automated delivery

GitHub Actions automatically validates the project and publishes container images after successful CI.

---

## 🎯 What This Project Demonstrates

PokéGuess demonstrates practical experience with:

- Java 21
- Spring Boot
- REST API development
- React
- TypeScript
- Vite
- PostgreSQL
- Spring Data JPA
- Hibernate
- DTO-based API integration
- Service-layer architecture
- Business logic implementation
- Graph traversal and BFS
- External API integration
- Unit testing
- Integration testing
- Mockito
- JUnit 5
- Testcontainers
- Docker
- Docker Compose
- Nginx
- GitHub Actions
- CI/CD
- GitHub Container Registry
- Cloud deployment
- Environment-based configuration
- Frontend/backend integration

The project demonstrates the complete lifecycle of a fullstack application:

```text
Development
     ↓
Testing
     ↓
Containerization
     ↓
CI
     ↓
CD
     ↓
Container Registry
     ↓
Cloud Deployment
     ↓
Live Application
```

---