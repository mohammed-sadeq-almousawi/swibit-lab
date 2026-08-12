# Swibit Lab - Python & Backend Practice

This is my Python practice and backend training project.

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

## Part 2: FastAPI Backend Setup
This section contains the backend server built with FastAPI. It includes a basic health check endpoint to verify the server is running correctly.

### Prerequisites
Make sure you have Python 3.11 or newer installed on your machine.

### How to set up and run the server

**1. Create a Virtual Environment**
Create an isolated environment to keep the project dependencies separate:
```bash
python -m venv venv
```

**2. Activate the Virtual Environment**
* On Windows:
  ```bash
  .\venv\Scripts\activate
  ```
**3. Install Dependencies**
Install FastAPI and Uvicorn:
```bash
pip install fastapi "uvicorn[standard]"
```

**4. Run the Server**
Navigate to the `backend` folder and start the server with live reload:
```bash
cd backend
uvicorn main:app --reload
```

**5. Test the API**
Once the server is running, open your browser and visit:
* **Health Check Endpoint:** [http://127.0.0.1:8000/health]
* **Interactive API Docs (Swagger UI):** [http://127.0.0.1:8000/docs]
