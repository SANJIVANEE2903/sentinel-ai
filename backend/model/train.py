import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import numpy as np
from audio_model import build_model
from preprocess import load_data
from sklearn.model_selection import train_test_split

# ================= LOAD DATA =================
X, y = load_data()

# ================= SPLIT =================
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ================= MODEL =================
model = build_model(input_shape=X.shape[1:])

# ================= TRAIN =================
model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=8,
    validation_data=(X_val, y_val)
)

# ================= SAVE =================
model.save("audio_model.keras")
print("✅ CNN Model trained successfully!")