import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_curve
from sklearn.metrics import precision_recall_curve
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping
import os
from tensorflow.keras.layers import Input, LSTM, RepeatVector, TimeDistributed, Dense, Dropout
import tensorflow as tf
np.random.seed(42)
tf.random.set_seed(42)


os.makedirs("results", exist_ok=True)
os.makedirs("models", exist_ok=True)

# ----------------------------
# 1️⃣ Load Dataset
# ----------------------------
df = pd.read_csv("data/synthetic_ics_dataset.csv")

# ----------------------------
# 2️⃣ Split Normal vs Full
# ----------------------------
df_normal = df[df["attack_label"] == 0]
df_full   = df.copy()

features_normal = df_normal.drop(["attack_label", "timestamp"], axis=1)
features_full   = df_full.drop(["attack_label", "timestamp"], axis=1)

labels_full = df_full["attack_label"].values

# ----------------------------
# 3️⃣ Create Sequences
# ----------------------------
window_size = 50

def create_sequences(X, window=50):
    X_seq = []
    for i in range(len(X) - window):
        X_seq.append(X[i:i+window])
    return np.array(X_seq)

X_normal_seq = create_sequences(features_normal.values, window_size)
X_full_seq   = create_sequences(features_full.values, window_size)

labels_seq = labels_full[window_size:]

# ----------------------------
# 4️⃣ Train/Test Split (Normal Only)
# ----------------------------
X_train, X_val = train_test_split(
    X_normal_seq,
    test_size=0.2,
    random_state=42
)

# ----------------------------
# 5️⃣ Scaling
# ----------------------------
scaler = MinMaxScaler()

X_train_2d = X_train.reshape(-1, X_train.shape[2])
X_val_2d   = X_val.reshape(-1, X_val.shape[2])
X_full_2d  = X_full_seq.reshape(-1, X_full_seq.shape[2])

X_train_scaled = scaler.fit_transform(X_train_2d)
X_val_scaled   = scaler.transform(X_val_2d)
X_full_scaled  = scaler.transform(X_full_2d)

X_train = X_train_scaled.reshape(X_train.shape)
X_val   = X_val_scaled.reshape(X_val.shape)
X_full_seq = X_full_scaled.reshape(X_full_seq.shape)

# ----------------------------
# 6️⃣ Build Autoencoder
# ----------------------------
timesteps = window_size
num_features = X_train.shape[2]

inputs = Input(shape=(timesteps, num_features))

encoded = LSTM(64, activation='tanh', return_sequences=False)(inputs)
encoded = Dropout(0.2)(encoded)

decoded = RepeatVector(timesteps)(encoded)
decoded = LSTM(64, activation='relu', return_sequences=True)(decoded)
decoded = Dropout(0.2)(decoded)
decoded = TimeDistributed(Dense(num_features))(decoded)

autoencoder = Model(inputs, decoded)
autoencoder.compile(optimizer='adam', loss='mse')

autoencoder.summary()

# ----------------------------
# 7️⃣ Train
# ----------------------------
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

history = autoencoder.fit(
    X_train,
    X_train,
    epochs=50,
    batch_size=64,
    validation_data=(X_val, X_val),
    callbacks=[early_stop]
)


# ----------------------------
# 8️⃣ Compute Threshold Using NORMAL Validation Data
# ----------------------------



# print("Chosen threshold for >=85% precision:", threshold)

# print("Anomaly Threshold:", threshold)

# ----------------------------
# Reconstruction on FULL dataset
# ----------------------------

X_full_pred = autoencoder.predict(X_full_seq)

mse = np.mean(np.square(X_full_seq - X_full_pred), axis=(1,2))

mse_smooth = pd.Series(mse).rolling(window=5).mean().fillna(0)
# ----------------------------
# 🎯 Choose threshold for >=85% precision
# ----------------------------

# Use ONLY normal validation data to compute threshold
X_val_pred = autoencoder.predict(X_val)
val_mse = np.mean(np.square(X_val - X_val_pred), axis=(1,2))

# 97th percentile of normal behavior
threshold = np.percentile(val_mse, 97)

print("Unsupervised Threshold (97th percentile):", threshold)


predictions = (mse_smooth > threshold).astype(int)



# ----------------------------
# 9️⃣ Evaluation
# ----------------------------
print("\nConfusion Matrix:")
print(confusion_matrix(labels_seq, predictions))

print("\nClassification Report:")
print(classification_report(labels_seq, predictions))

print("\nROC-AUC Score:")
print(roc_auc_score(labels_seq, mse_smooth))

# ----------------------------
# 🔟 Plot Reconstruction Error
# ----------------------------
plt.figure(figsize=(10,5))
plt.plot(mse, label="Reconstruction Error")
plt.axhline(threshold, color='r', linestyle='--', label="Threshold")
plt.legend()
plt.title("Reconstruction Error Over Time")
plt.savefig("results/reconstruction_plot.png")
plt.close()


from sklearn.metrics import roc_curve

fpr, tpr, _ = roc_curve(labels_seq, mse_smooth)

plt.plot(fpr, tpr)
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve")
plt.savefig("results/roc_curve.png")
plt.close()

autoencoder.save("models/lstm_autoencoder.h5")
np.save("results/lstm_scores.npy", mse_smooth)
