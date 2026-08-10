import os
import sys
import pandas as pd

# ==========================================================
# Project Path
# ==========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

sys.path.append(BASE_DIR)

# ==========================================================
# Import Skill Extractor
# ==========================================================

from services.skill_extractor import extract_skills

# ==========================================================
# Load Sample Resume
# ==========================================================

DATASET = os.path.join(
    BASE_DIR,
    "dataset",
    "cleaned_resumes.csv"
)

df = pd.read_csv(DATASET)

resume = df.loc[0, "Text"]

# ==========================================================
# Test 1 : Dataset Resume
# ==========================================================

print("=" * 70)
print("TEST 1 : DATASET RESUME")
print("=" * 70)

skills = extract_skills(resume)

assert isinstance(skills, list), "Skills should be returned as a list."

print(f"Total Skills Found : {len(skills)}")
print(skills)

# ==========================================================
# Test 2 : Resume With Skills Section
# ==========================================================

print("\n")
print("=" * 70)
print("TEST 2 : SKILLS SECTION")
print("=" * 70)

sample_text = """
Skills

Python
SQL
Machine Learning
Deep Learning
FastAPI
Docker
"""

skills = extract_skills(sample_text)

assert "Python" in skills
assert "Sql" in skills or "SQL" in skills
assert "Machine Learning" in skills
assert "Deep Learning" in skills
assert "Fastapi" in skills or "FastAPI" in skills

print("✓ Skills extracted successfully.")
print(skills)

# ==========================================================
# Test 3 : Duplicate Skills
# ==========================================================

print("\n")
print("=" * 70)
print("TEST 3 : DUPLICATE SKILLS")
print("=" * 70)

sample_text = """
Python
Python
SQL
SQL
Machine Learning
Machine Learning
"""

skills = extract_skills(sample_text)

assert len(skills) == len(set(skills))

print("✓ Duplicate skills removed.")
print(skills)

# ==========================================================
# Test 4 : Empty Resume
# ==========================================================

print("\n")
print("=" * 70)
print("TEST 4 : EMPTY INPUT")
print("=" * 70)

skills = extract_skills("")

assert skills == []

print("✓ Empty input handled correctly.")

# ==========================================================
# Test 5 : Resume Without Skills Heading
# ==========================================================

print("\n")
print("=" * 70)
print("TEST 5 : NO SKILLS HEADING")
print("=" * 70)

sample_text = """
John Doe

Worked as a Python Developer.

Built Machine Learning models.

Experience with SQL databases.
"""

skills = extract_skills(sample_text)

assert "Python" in skills
assert "Machine Learning" in skills
assert "Sql" in skills or "SQL" in skills

print("✓ Skills extracted from general resume text.")
print(skills)

# ==========================================================
# Test Completed
# ==========================================================

print("\n")
print("=" * 70)
print("ALL SKILL EXTRACTOR TESTS PASSED SUCCESSFULLY")
print("=" * 70)