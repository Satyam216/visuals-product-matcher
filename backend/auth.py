from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from db import users
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Signup Route
@router.post("/signup")
def signup(user: UserSignup):
    existing = users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_pw.decode('utf-8'),
        "created_at": datetime.utcnow()
    })
    return {"message": "User registered successfully!"}

# ✅ Login Route
@router.post("/login")
def login(user: UserLogin):
    existing = users.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.checkpw(user.password.encode('utf-8'), existing["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid password")

    payload = {
        "user_id": str(existing["_id"]),
        "email": existing["email"],
        "exp": datetime.utcnow() + timedelta(hours=6)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"message": "Login successful", "token": token}

# /auth/verify-email
@router.post("/verify-email")
async def verify_email(data: dict):
    user = users.find_one({"email": data["email"]})
    return {"exists": bool(user)}


# /auth/reset-password
@router.post("/reset-password")
async def reset_password(data: dict):
    email = data.get("email")
    new_password = data.get("newPassword")
    user = users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_pw = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
    users.update_one(
        {"email": email}, {"$set": {"password": hashed_pw.decode("utf-8")}}
    )
    return {"message": "Password updated successfully"}
