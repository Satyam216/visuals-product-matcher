from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
from PIL import Image
import io

model = MobileNetV2(weights="imagenet", include_top=False, pooling='avg')

def get_embedding(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((224, 224))
    x = np.expand_dims(np.array(img), axis=0)
    x = preprocess_input(x)
    embedding = model.predict(x)
    return embedding[0].tolist()
