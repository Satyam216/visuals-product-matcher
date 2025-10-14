import os
import cloudinary
import cloudinary.uploader
from db import products
from model import get_embedding
import numpy as np
from numpy.linalg import norm
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_URL").split("@")[1],
    api_key=os.getenv("CLOUDINARY_URL").split(":")[1].split("//")[1],
    api_secret=os.getenv("CLOUDINARY_URL").split(":")[2].split("@")[0]
)

BASE_DIR = os.path.join(os.getcwd(), "images")

products.delete_many({})

def clean_name(filename):
    name = filename.split(".")[0]
    return name.replace("_", " ").title()

for category_folder in os.listdir(BASE_DIR):
    category_path = os.path.join(BASE_DIR, category_folder)
    if not os.path.isdir(category_path):
        continue

    for file_name in os.listdir(category_path):
        if not file_name.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        file_path = os.path.join(category_path, file_name)
        product_name = clean_name(file_name)

        try:
            upload_result = cloudinary.uploader.upload(file_path, folder=f"visual-product-matcher/{category_folder}")
            image_url = upload_result["secure_url"]

            with open(file_path, "rb") as f:
                img_bytes = f.read()

            emb = np.array(get_embedding(img_bytes))
            emb = emb / norm(emb)

            products.insert_one({
                "name": product_name,
                "category": category_folder.replace("_", " "),
                "imageUrl": image_url,
                "embedding": emb.tolist()
            })

        except Exception as e:
            print(f"Failed to process {file_name}: {e}")

print("Seeding complete! All products uploaded and stored in MongoDB.")
