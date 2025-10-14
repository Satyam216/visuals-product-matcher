from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sklearn.metrics.pairwise import cosine_similarity
from numpy.linalg import norm
from datetime import datetime, timedelta
from dotenv import load_dotenv
from PIL import Image, UnidentifiedImageError
import numpy as np
import bcrypt
import jwt
import requests
import io
import os
import ssl
import time

from db import products, users
from model import get_embedding

# ============================================================
# 🌍 Setup
# ============================================================

load_dotenv()
app = FastAPI(title="Visual Product Matcher API")

# ✅ CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 🔐 Authentication Config
# ============================================================

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"

# ============================================================
# 🧩 Models
# ============================================================

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ============================================================
# 🧩 Authentication Routes
# ============================================================

@app.post("/auth/signup", tags=["Authentication"])
def signup(user: UserSignup):
    existing = users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_pw.decode("utf-8"),
        "created_at": datetime.utcnow()
    })
    return {"message": "User registered successfully!"}


@app.post("/auth/login", tags=["Authentication"])
def login(user: UserLogin):
    existing = users.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.checkpw(user.password.encode("utf-8"), existing["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid password")

    payload = {
        "user_id": str(existing["_id"]),
        "email": existing["email"],
        "exp": datetime.utcnow() + timedelta(hours=6)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"message": "Login successful", "token": token}

# ============================================================
# 🔒 JWT Middleware (Global)
# ============================================================

@app.middleware("http")
async def jwt_middleware(request: Request, call_next):
    """
    Automatically validates JWT for all non-public routes.
    Public routes: /, /docs, /openapi.json, /auth/*
    """
    public_paths = ["/", "/docs", "/openapi.json", "/auth/login", "/auth/signup"]
    if any(request.url.path.startswith(path) for path in public_paths):
        return await call_next(request)

    token = request.headers.get("Authorization")
    if not token:
        return JSONResponse(status_code=401, content={"error": "Missing token"})
    try:
        jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return JSONResponse(status_code=401, content={"error": "Token expired"})
    except jwt.InvalidTokenError:
        return JSONResponse(status_code=401, content={"error": "Invalid token"})

    return await call_next(request)

# ============================================================
# 🧠 Visual Product Matching Route (File or URL)
# ============================================================

@app.post("/upload", tags=["Product Matching"])
async def upload_image(file: UploadFile = None, image_url: str = Form(None)):
    """
    Upload an image OR provide an image URL to find visually similar products.
    JWT required.
    """
    try:
        img_bytes = None

        # --- Step 1️⃣: Handle file or URL input ---
        if file:
            img_bytes = await file.read()
            print("📂 File upload received.")
        elif image_url:
            print(f"🌐 Fetching image from URL: {image_url}")
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "image/*,*/*;q=0.8"
            }

            ssl._create_default_https_context = ssl._create_unverified_context

            # Retry fetching image up to 3 times
            for attempt in range(3):
                try:
                    response = requests.get(image_url, headers=headers, timeout=10, verify=False)
                    if response.status_code in [200, 302] and "image" in response.headers.get("Content-Type", ""):
                        img_bytes = response.content
                        print(f"✅ Image fetched successfully (attempt {attempt + 1})")
                        break
                    print(f"⚠️ Attempt {attempt + 1} failed: {response.status_code}")
                    time.sleep(1)
                except Exception as e:
                    print(f"⚠️ Attempt {attempt + 1} error: {e}")
                    time.sleep(1)

            if img_bytes is None:
                raise HTTPException(status_code=400, detail="Failed to fetch image from provided URL.")
        else:
            raise HTTPException(status_code=400, detail="No image file or image URL provided.")

        # --- Step 2️⃣: Validate image format ---
        try:
            image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Invalid image format or unreadable file.")

        # Convert back to bytes for embedding
        buf = io.BytesIO()
        image.save(buf, format="JPEG")
        final_img_bytes = buf.getvalue()

        # --- Step 3️⃣: Generate embedding ---
        uploaded_emb = np.array(get_embedding(final_img_bytes))
        uploaded_emb = uploaded_emb / norm(uploaded_emb)

        # --- Step 4️⃣: Compare with MongoDB product embeddings ---
        all_products = list(products.find({}, {"_id": 0}))
        if not all_products:
            raise HTTPException(status_code=404, detail="No products in database")

        embeddings = np.array([p["embedding"] for p in all_products])
        embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)

        sims = cosine_similarity([uploaded_emb], embeddings)[0]
        sorted_idx = np.argsort(-sims)

        results = []
        for i in sorted_idx[:10]:
            p = all_products[i]
            results.append({
                "name": p.get("name", "Unknown"),
                "category": p.get("category", "N/A"),
                "image_url": p.get("imageUrl") or p.get("image_url") or "",
                "similarity": round(float(sims[i]) * 100, 2)
            })

        print(f"✅ Returned {len(results)} matches")
        return {"matches": results}

    except HTTPException:
        raise
    except Exception as e:
        print("🔥 [ERROR] Upload failed:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# 🏠 Root Route
# ============================================================

@app.get("/", tags=["Root"])
def home():
    return {"message": "🚀 Visual Product Matcher API with Authentication is running!"}
