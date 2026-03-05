import os

print("Running LSTM...")
os.system("python lstm_model.py")

print("Running GNN...")
os.system("python gnn_model.py")

print("Running Fusion...")
os.system("python fusion_model.py")
