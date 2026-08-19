# Swibit Lab - Python & Backend Practice

This is my Python practice and backend training project, showcasing the progression from basic Python scripts to a fully containerized FastAPI backend system.

## Part 1: Python Practice Scripts
It has a simple menu to run these programs:
* **Welcome:** Says Welcome to you using your name.
* **Sum List:** Adds a list of numbers together.
* **FizzBuzz:** Plays the FizzBuzz game up to a number you choose.

### How to run the scripts
To start the program, just run this code from the main folder:
```bash
python main.py
```

---

## Part 2: FastAPI Backend API
This section contains a robust backend RESTful API built with FastAPI. It features secure user authentication, database management, caching, and is fully containerized using Docker.

### Key Features
* **Authentication:** Secure user registration and login using JWT (JSON Web Tokens) and password hashing (bcrypt).
* **Task Management (CRUD):** Users can securely create, read, update, and delete their own specific tasks.
* **Data Isolation:** Complete data privacy ensuring users can only access and modify their own tasks.
* **Database:** PostgreSQL integration using SQLAlchemy ORM.
* **Caching:** Implemented Cache-Aside pattern using Redis to optimize the `GET /tasks` endpoint.
* **Testing:** Comprehensive test suite using `pytest` covering authentication flows and data isolation.
* **Containerization:** The entire application (API, PostgreSQL, Redis) is orchestrated using Docker Compose.

###  Tech Stack
* **Framework:** FastAPI (Python 3.11)
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Cache:** Redis
* **Authentication:** OAuth2 with JWT
* **Deployment:** Docker & Docker Compose
* **Testing:** Pytest & HTTPX

### How to Run with Docker 
You do not need to install databases locally; Docker handles everything.

**1. Start the complete application stack:**
Run this command from the `backend` directory to build and start the API, PostgreSQL, and Redis containers in the background:
```bash
docker compose up -d --build
```

**2. Access the API:**
Once the containers are running, open your browser and visit:
* **Interactive API Docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

###  Running the Tests
To ensure everything is working correctly, you can run the automated test suite directly inside the running API container:
```bash
docker compose exec api pytest test_main.py -v
```

###  Stopping the Application
To stop and safely remove the containers, run:
```bash
docker compose down
```
