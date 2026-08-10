import os
import json
import pandas as pd

# Project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print("Current Working Directory:")
print(os.getcwd())

print("\nLocation of this file:")
print(os.path.abspath(__file__))

print("\nBase Directory:")
print(BASE_DIR)

# Dataset path
dataset_path = os.path.join(BASE_DIR, "dataset", "resumes_dataset.jsonl")

print("\nDataset Path:")
print(dataset_path)

print("\nFile Exists:")
print(os.path.exists(dataset_path))

# Stop here if file doesn't exist
if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"Dataset not found:\n{dataset_path}")

records = []

with open(dataset_path, "r", encoding="utf-8") as file:
    for line in file:
        records.append(json.loads(line))

print("\nTotal Records:", len(records))

df = pd.DataFrame(records)

print("\nShape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())