import os
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.utils import to_categorical

DATASET_PATH = r"G:\Voice\dataset"

# =========================
# FEATURE EXTRACTION
# =========================
def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000)

    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)

    return np.mean(mfcc.T, axis=0)

# =========================
# LOAD DATA
# =========================
X = []
y = []

labels = {"real": 0, "fake": 1}

for label in labels:
    folder = os.path.join(DATASET_PATH, label)

    for file in os.listdir(folder):
        if file.endswith(".wav"):
            path = os.path.join(folder, file)

            features = extract_features(path)

            X.append(features)
            y.append(labels[label])

X = np.array(X)
y = np.array(y)

# =========================
# TRAIN/TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# MODEL (IMPROVED CNN-LIKE DENSE MODEL)
# =========================
model = Sequential()

model.add(Dense(256, activation="relu", input_shape=(40,)))
model.add(Dropout(0.3))

model.add(Dense(128, activation="relu"))
model.add(Dropout(0.3))

model.add(Dense(64, activation="relu"))

model.add(Dense(1, activation="sigmoid"))

# =========================
# COMPILE
# =========================
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# =========================
# TRAIN
# =========================
model.fit(
    X_train, y_train,
    epochs=30,
    batch_size=16,
    validation_data=(X_test, y_test)
)

# =========================
# SAVE MODEL
# =========================
model.save("audio_model.h5")

print("✅ Model trained and saved successfully!")