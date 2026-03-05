import numpy as np
from sklearn.metrics import classification_report, confusion_matrix

# Load scores
lstm_scores = np.load("results/lstm_scores.npy")
gnn_scores = np.load("results/gnn_scores.npy")

# Match length
min_len = min(len(lstm_scores), len(gnn_scores))

lstm_scores = lstm_scores[:min_len]
gnn_scores = gnn_scores[:min_len]

# Combine
final_score = 0.6*lstm_scores + 0.4*gnn_scores

threshold = np.percentile(final_score, 85)

pred = (final_score > threshold).astype(int)

# Load labels
import pandas as pd
df = pd.read_csv("data/synthetic_ics_dataset.csv")
labels = df["attack_label"].values[50:50+min_len]

print(confusion_matrix(labels, pred))
print(classification_report(labels, pred))
