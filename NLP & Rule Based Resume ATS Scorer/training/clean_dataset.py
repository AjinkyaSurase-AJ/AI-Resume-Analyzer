import os
import json
import pandas as pd

# -----------------------------
# Project Path
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

dataset_path = os.path.join(
    BASE_DIR,
    "dataset",
    "resumes_dataset.jsonl"
)

cleaned_dataset_path = os.path.join(
    BASE_DIR,
    "dataset",
    "cleaned_resumes.csv"
)

# -----------------------------
# Read JSONL
# -----------------------------
records = []

with open(dataset_path, "r", encoding="utf-8") as file:

    for line in file:

        records.append(json.loads(line))

# Convert into DataFrame
df = pd.DataFrame(records)

print("Original Shape")
print(df.shape)

# -----------------------------
# Remove Duplicate Rows
# -----------------------------
df = df.drop_duplicates()

print("\nAfter Removing Duplicates")
print(df.shape)

# -----------------------------
# Remove Duplicate Resume Text
# -----------------------------
df = df.drop_duplicates(subset=["Text"])

print("\nAfter Removing Duplicate Resume Text")
print(df.shape)

# -----------------------------
# Remove Missing Resume Text
# -----------------------------
df = df.dropna(subset=["Text"])

print("\nAfter Removing Missing Text")
print(df.shape)

# -----------------------------
# Fill Missing Values
# -----------------------------
df["Skills"] = df["Skills"].fillna("")
df["Education"] = df["Education"].fillna("")
df["Experience"] = df["Experience"].fillna("")
df["Summary"] = df["Summary"].fillna("")
df["Location"] = df["Location"].fillna("")

# -----------------------------
# Remove Extra Spaces
# -----------------------------
df["Text"] = df["Text"].str.strip()

# -----------------------------
# Save Clean Dataset
# -----------------------------
df.to_csv(cleaned_dataset_path, index=False)

print("\nClean Dataset Saved")

print(cleaned_dataset_path)

print("\nFinal Shape")

print(df.shape)