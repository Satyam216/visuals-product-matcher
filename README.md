🧠 Visual Product Matcher
An AI-powered web app that finds visually similar products using deep learning and cloud image storage.

📸 Overview
The Visual Product Matcher is a full-stack AI application built using FastAPI (backend) and React (frontend).
It allows users to upload an image or paste an image URL, then finds visually similar products stored in a database.
It uses MobileNetV2 to generate image embeddings and compares them using cosine similarity to identify matches.

This project also includes user authentication, responsive UI, and real-time feedback via toast notifications.

🚀 Features
✅ User Signup / Login using JWT Authentication
✅ Upload image or paste an image URL
✅ AI-based similarity detection (MobileNetV2 + TensorFlow)
✅ Store and retrieve products via MongoDB Atlas
✅ Cloud image hosting via Cloudinary
✅ Responsive frontend built with React + TailwindCSS
✅ Real-time toast notifications for user feedback
✅ Adjustable similarity filter slider
✅ Secure password hashing using bcrypt

🧩 Tech Stack
Layer	Technology Used
Frontend	React, Vite, TailwindCSS, Framer Motion, Lucide Icons, React Hot Toast
Backend	FastAPI, TensorFlow, NumPy, Scikit-learn, Bcrypt, JWT
Database	MongoDB Atlas
Storage	Cloudinary
Deployment (optional)	Vercel (Frontend) / Render or Railway (Backend)
⚙️ Installation and Setup
🧠 Backend Setup (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
🌐 Frontend Setup (React)
cd frontend
npm install
npm run dev
🧱 Folder Structure
visual-product-matcher/
│
├── backend/
│   ├── main.py               # FastAPI routes and logic
│   ├── model.py              # MobileNetV2 embedding generator
│   ├── db.py                 # MongoDB connection
│   ├── .env                  # API keys and environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Home, Login, Signup, Landing
│   │   ├── components/       # ProductCard
│   │   ├── api.js            # Axios API setup
│   │   ├── App.jsx           # Routing + Toasts
│   │   └── main.jsx          # Entry point
│
└── README.md
🧮 How It Works
User Authentication:

New users register via /auth/signup → stored in MongoDB with hashed passwords.
Login generates a JWT token for secured requests.
Image Upload or URL Input:

Uploaded image or URL is converted into bytes.
MobileNetV2 model generates a feature embedding (numerical representation).
Similarity Matching:

Cosine similarity compares embeddings between uploaded image and database images.
Returns top matches sorted by similarity score (%).
Frontend Visualization:

The React UI displays matched products with similarity %.
User can filter results using a similarity range slider.
🔐 Environment Variables (.env)
Create a .env file in the backend/ folder:

MONGO_URI="your_mongodb_atlas_connection"
CLOUDINARY_URL="your_cloudinary_api_url"
JWT_SECRET="your_secret_key"
🧰 Example Usage
Sign up or log in
Upload an image (e.g., a shoe photo)
Click “Find Similar Products”
Get Top 10 most visually similar items with similarity % values
Adjust filter slider to refine results
📱 Responsive Design
Fully mobile-optimized
Gradient backgrounds and animations
Intuitive upload and filtering interface
🚀 Live Demo
Frontend: https://visuals-product-matcher.vercel.app/
Backend API: https://visuals-product-matcher.onrender.com

🏁 Future Improvements
Add user search history
Category-based filtering
Dark mode toggle 🌙
👨‍💻 Author
Satyam Jain