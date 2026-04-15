import tensorflow as tf
import numpy as np

# ================= CNN MODEL =================
def build_model(input_shape):
    model = tf.keras.Sequential([

        tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=input_shape),
        tf.keras.layers.MaxPooling2D(2,2),

        tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2,2),

        tf.keras.layers.Conv2D(128, (3,3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2,2),

        tf.keras.layers.Flatten(),

        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.3),

        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    return model


# ================= LOAD =================
def load_model(model_path):
    return tf.keras.models.load_model(model_path)


# ================= PREDICT =================
def predict_audio(model, spectrogram):
    spectrogram = np.array(spectrogram)

    if len(spectrogram.shape) == 2:
        spectrogram = spectrogram.reshape(1, 128, 128, 1)

    prediction = model.predict(spectrogram)[0][0]

    result = "fake" if prediction > 0.5 else "real"
    confidence = float(prediction if prediction > 0.5 else 1 - prediction)

    return {
        "result": result,
        "confidence": confidence
    }