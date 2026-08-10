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
# Import Section Extractor
# ==========================================================

from services.section_extractor import extract_sections

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
# Test 1 : Extract Sections from Dataset Resume
# ==========================================================

print("=" * 70)
print("TEST 1 : DATASET RESUME")
print("=" * 70)

result = extract_sections(resume)

# ----------------------------
# Validate Return Type
# ----------------------------

assert isinstance(result, dict), "Result should be a dictionary."

# ----------------------------
# Validate Required Keys
# ----------------------------

expected_sections = [

    "email",
    "phone",
    "summary",
    "skills",
    "education",
    "experience",
    "projects",
    "internships",
    "certifications",
    "achievements",
    "publications",
    "languages",
    "hobbies",
    "other"

]

for section in expected_sections:

    assert section in result, f"{section} is missing."

print("✓ All required keys found.")

# ----------------------------
# Validate Data Types
# ----------------------------

for section in expected_sections:

    assert isinstance(
        result[section],
        str
    ), f"{section} should be a string."

print("✓ All section values are strings.")

# ----------------------------
# Display Extracted Sections
# ----------------------------

for key, value in result.items():

    print(f"\n{'='*20} {key.upper()} {'='*20}")

    print(value if value else "[EMPTY]")

# ==========================================================
# Test 2 : Alternative Headings
# ==========================================================

print("\n")
print("=" * 70)
print("TEST 2 : ALTERNATIVE HEADINGS")
print("=" * 70)

sample_resume = """
John Doe

john@gmail.com

9876543210

Career Objective
To become a Python Developer.

Technical Skills
Python
SQL
Machine Learning
FastAPI

Academic Background
Bachelor of Engineering in Computer Science

Professional Experience
Software Developer Intern

Academic Projects
AI Resume Analyzer

Certifications
AWS Cloud Practitioner

Languages
English
Hindi

Interests
Reading
Cricket
"""

sample_result = extract_sections(sample_resume)

assert sample_result["email"] == "john@gmail.com"

assert sample_result["phone"] == "9876543210"

assert "Python" in sample_result["skills"]

assert "Bachelor" in sample_result["education"]

assert "Software Developer Intern" in sample_result["experience"]

assert "AI Resume Analyzer" in sample_result["projects"]

assert "AWS" in sample_result["certifications"]

assert "English" in sample_result["languages"]

assert "Reading" in sample_result["hobbies"]

print("✓ Alternative heading detection passed.")

# ==========================================================
# Test 3 : Missing Sections
# ==========================================================

print("\n")
print("=" * 70)
print("TEST 3 : MISSING SECTIONS")
print("=" * 70)

sample_resume = """
Jane Smith

jane@gmail.com

Skills
Python
SQL

Education
Bachelor of Technology
"""

sample_result = extract_sections(sample_resume)

assert sample_result["projects"] == ""

assert sample_result["internships"] == ""

assert sample_result["certifications"] == ""

assert sample_result["experience"] == ""

print("✓ Missing sections handled correctly.")

# ==========================================================
# Test Completed
# ==========================================================

print("\n")
print("=" * 70)
print("ALL SECTION EXTRACTOR TESTS PASSED SUCCESSFULLY")
print("=" * 70)