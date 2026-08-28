from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from core.database import Base, get_db

# ==========================================
# Database Setup
# ==========================================
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# ==========================================
# Users Data
# ==========================================
user1 = {
    "username": "tester1",
    "email": "tester1@example.com",
    "password": "password123"
}

user2 = {
    "username": "tester2",
    "email": "tester2@example.com",
    "password": "password456"
}

def get_headers(user_data):
    response = client.post(
        "/auth/login",
        data={"username": user_data["username"], "password": user_data["password"]}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

# ==========================================
# Test 1: Register Users
# ==========================================
def test_1_register_users():
    res1 = client.post("/auth/register", json=user1)
    assert res1.status_code == 200

    res2 = client.post("/auth/register", json=user2)
    assert res2.status_code == 200

# ==========================================
# Test 2: Login Users
# ==========================================
def test_2_login_users():
    res = client.post(
        "/auth/login",
        data={"username": user1["username"], "password": user1["password"]}
    )
    assert res.status_code == 200
    assert "access_token" in res.json()

# ==========================================
# Test 3: Create Tasks (User 1)
# ==========================================
def test_3_create_tasks():
    headers1 = get_headers(user1)

    task1_data = {"title": "Task 1", "desc": "First task for user 1", "done": False}
    res_t1 = client.post("/tasks/", json=task1_data, headers=headers1)
    assert res_t1.status_code == 200

    task2_data = {"title": "Task 2", "desc": "Second task for user 1", "done": False}
    res_t2 = client.post("/tasks/", json=task2_data, headers=headers1)
    assert res_t2.status_code == 200

# ==========================================
# Test 4: Update & Delete Tasks (User 1)
# ==========================================
def test_4_update_and_delete():
    headers1 = get_headers(user1)


    update_data = {"title": "Task 1 Updated", "desc": "Done with testing", "done": True}
    res_update = client.put("/tasks/1", json=update_data, headers=headers1)
    assert res_update.status_code == 200
    assert res_update.json()["title"] == "Task 1 Updated"


    res_delete = client.delete("/tasks/2", headers=headers1)
    assert res_delete.status_code == 200

# ==========================================
# Test 5: Search for non-existent task
# ==========================================
def test_5_task_not_found():
    headers1 = get_headers(user1)


    update_data = {"title": "Ghost Task", "desc": "Not here", "done": True}
    res_not_found = client.put("/tasks/999", json=update_data, headers=headers1)


    assert res_not_found.status_code == 404
    assert res_not_found.json()["detail"] == "the task not found"

# ==========================================
# Test 6: Isolation (User 2 hacks User 1)
# ==========================================
def test_6_user2_isolation():
    headers2 = get_headers(user2)


    hack_data = {"title": "Hacked Task", "desc": "Hacked", "done": True}


    res_hack_put = client.put("/tasks/1", json=hack_data, headers=headers2)


    assert res_hack_put.status_code == 404


    res_list = client.get("/tasks/", headers=headers2)
    assert res_list.status_code == 200
    assert len(res_list.json()) == 0
