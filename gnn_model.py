import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import classification_report, confusion_matrix

# ----------------------------
# Load Dataset
# ----------------------------
df = pd.read_csv("data/synthetic_ics_dataset.csv")

features = df.drop(["attack_label", "timestamp"], axis=1).values
labels = df["attack_label"].values

# Scale
scaler = MinMaxScaler()
features = scaler.fit_transform(features)

# Window size
window = 50

X = []
y = []

for i in range(len(features) - window):
    X.append(features[i:i+window].flatten())
    y.append(labels[i+window])

X = np.array(X)
y = np.array(y)

# ----------------------------
# Create Graph
# Nodes = time windows
# Edge = connect t → t+1
# ----------------------------

edge_index = []

for i in range(len(X)-1):
    edge_index.append([i, i+1])
    edge_index.append([i+1, i])

edge_index = torch.tensor(edge_index).t().contiguous()

x = torch.tensor(X, dtype=torch.float)
y = torch.tensor(y, dtype=torch.long)

data = Data(x=x, edge_index=edge_index, y=y)

# ----------------------------
# GNN Model
# ----------------------------

class GNN(nn.Module):
    def __init__(self, in_channels):
        super(GNN, self).__init__()
        self.conv1 = GCNConv(in_channels, 64)
        self.conv2 = GCNConv(64, 32)
        self.fc = nn.Linear(32, 2)

    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        x = F.relu(self.conv1(x, edge_index))
        x = F.relu(self.conv2(x, edge_index))
        x = self.fc(x)
        return x

model = GNN(X.shape[1])
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

# ----------------------------
# Train
# ----------------------------

for epoch in range(20):
    model.train()
    optimizer.zero_grad()
    out = model(data)
    loss = criterion(out, data.y)
    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch}, Loss {loss.item()}")

# ----------------------------
# Evaluate
# ----------------------------

model.eval()
pred = model(data).argmax(dim=1).numpy()

print(confusion_matrix(y, pred))
print(classification_report(y, pred))

# Save scores
gnn_scores = model(data).softmax(dim=1)[:,1].detach().numpy()
np.save("results/gnn_scores.npy", gnn_scores)
