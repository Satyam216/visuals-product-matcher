from db import products
from model import get_embedding
from numpy.linalg import norm
import numpy as np
import requests

# Get all products from MongoDB (IN CASE OF ANY PRODUCT NEEDS RE-EMBEDDING)
all_products = list(products.find({}))
print(f"Found {len(all_products)} products to re-embed.")

for p in all_products:
    img_url = p.get("imageUrl") or p.get("image_url")
    if not img_url:
        continue

    print(f"Processing: {p['name']} ...")
    try:
        img_bytes = requests.get(img_url.strip()).content
        emb = np.array(get_embedding(img_bytes))

        emb = emb / norm(emb)

        products.update_one(
            {"_id": p["_id"]},
            {"$set": {"embedding": emb.tolist()}}
        )

        print(f"Updated {p['name']}")
    except Exception as e:
        print(f"Failed {p['name']}: {e}")

print("All product embeddings updated successfully!")
