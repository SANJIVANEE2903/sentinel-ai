import os
import librosa
import numpy as np

IMG_SIZE = (128, 128)

def extract_spectrogram(file_path):
    audio, sr = librosa.load(file_path, sr=16000)

    spectrogram = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=128
    )

    spectrogram = librosa.power_to_db(spectrogram)

    # Resize to fixed size
    spectrogram = spectrogram[:128, :128]

    if spectrogram.shape != IMG_SIZE:
        padded = np.zeros(IMG_SIZE)
        padded[:spectrogram.shape[0], :spectrogram.shape[1]] = spectrogram
        spectrogram = padded

    return spectrogram


def load_data(dataset_path="G:/Voice/dataset"):
    X, y = [], []

    for label, category in enumerate(["real", "fake"]):
        path = os.path.join(dataset_path, category)

        for root, _, files in os.walk(path):
            for file in files:
                if file.endswith(".wav"):
                    file_path = os.path.join(root, file)

                    try:
                        spec = extract_spectrogram(file_path)
                        X.append(spec)
                        y.append(label)
                    except Exception as e:
                        print("Skipping:", file_path, e)

    X = np.array(X)
    X = X[..., np.newaxis]  # CNN needs channel

    return X, np.array(y)