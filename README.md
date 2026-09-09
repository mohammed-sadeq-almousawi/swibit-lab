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

### Tech Stack
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

### Running the Tests
To ensure everything is working correctly, you can run the automated test suite directly inside the running API container:
```bash
docker compose exec api pytest test_main.py -v
```

### Stopping the Application
To stop and safely remove the containers, run:
```bash
docker compose down
```

---

## Part 3: Mobile Frontend Application (Expo / React Native)
This section contains the cross-platform mobile client built to seamlessly consume the FastAPI backend. It demonstrates full-stack integration, secure token handling, and modern React Native architecture.

### Key Features
* **Seamless API Integration:** Connects directly to the FastAPI backend to perform full Task Management CRUD operations.
* **Secure Authentication:** Manages JWT tokens securely on the device, with dynamic routing based on the user's authentication state.
* **Advanced State Management:** Utilizes Zustand for global client state and TanStack React Query for efficient server-state caching, fetching, and mutations.
* **Smart Error Handling:** Global Axios interceptors for automatic 401 Unauthorized logouts, and user-friendly UI feedback for API network or validation errors.
* **Modern UI/UX:** Styled completely with NativeWind (Tailwind CSS v4) for a responsive and clean interface.
* **Component Testing:** Includes automated UI component tests written with Jest and React Native Testing Library to ensure stability.

### Tech Stack
* **Framework:** React Native with Expo (SDK 57)
* **Routing:** Expo Router (File-based routing)
* **Styling:** NativeWind (Tailwind CSS v4)
* **State Management:** Zustand & TanStack React Query
* **Network/HTTP:** Axios
* **Testing:** Jest & React Native Testing Library

### How to Run the Mobile App

**1. Install Dependencies:**
Navigate to the `mobile` directory and install the required packages:
```bash
npm install
```

**2. Environment Configuration:**
Create a `.env` file in the root of the `mobile` directory and link it to your running backend API:
```env
# For local Web testing:
EXPO_PUBLIC_API_URL=http://localhost:8000

# For physical device testing (replace with your machine's local IP):
# EXPO_PUBLIC_API_URL=[http://192.168.](http://192.168.)x.x:8000
```

**3. Start the Application:**
Run the Expo development server (clearing the cache is recommended for styling updates):
```bash
npx expo start -c
```
You can press `w` to open it in a web browser, or scan the QR code with the Expo Go app on your physical device.

### Running the Tests
To verify the UI components and user interactions, run the Jest test suite:
```bash
npm run test
```
