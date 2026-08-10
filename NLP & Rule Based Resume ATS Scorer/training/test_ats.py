import os
import sys

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
# Import ATS Analyzer
# ==========================================================

from services.ats_analyzer import ATSAnalyzer

# ==========================================================
# Sample Resume Data
# ==========================================================

resume_data = {

    "skills": [
        "Python",
        "Java",
        "MySQL"
    ],

    "education": "Bachelor of Technology in Computer Science",

    "internships": """
Software Developer Intern
January 2025 - June 2025
""",

    "projects": """
AI Resume Analyzer
Hospital Command Center
""",

    "certifications": """
AWS Cloud Practitioner
"""

}

# ==========================================================
# Sample Job Description Data
# ==========================================================

job_data = {

    "skills": [
        "Python",
        "SQL",
        "Java",
        "Git",
        "Docker"
    ],

    "education": [
        "Bachelor"
    ],

    "experience": 1

}

# ==========================================================
# Run ATS Analysis
# ==========================================================

analyzer = ATSAnalyzer()

result = analyzer.analyze(
    resume_data,
    job_data
)

# ==========================================================
# Validate Output
# ==========================================================

assert isinstance(result, dict)

required_keys = [

    "ATS_score",

    "skills",

    "education_score",

    "experience_score",

    "project_score",

    "certification_score",

    "internship_months",

    "score_breakdown",

    "strengths",

    "weaknesses"

]

for key in required_keys:
    assert key in result, f"{key} missing."

assert isinstance(result["ATS_score"], (int, float))
assert isinstance(result["skills"], dict)
assert isinstance(result["strengths"], list)
assert isinstance(result["weaknesses"], list)

# ==========================================================
# Display Result
# ==========================================================

print("=" * 70)
print("ATS ANALYZER TEST")
print("=" * 70)

for key, value in result.items():
    print(f"{key} : {value}")

print("\n" + "=" * 70)
print("ATS ANALYZER TEST PASSED SUCCESSFULLY")
print("=" * 70)