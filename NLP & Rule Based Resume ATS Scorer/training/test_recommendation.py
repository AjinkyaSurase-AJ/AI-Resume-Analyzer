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
# Import Recommendation Engine
# ==========================================================

from services.recommendation import RecommendationEngine

# ==========================================================
# Sample ATS Result
# ==========================================================

ats_result = {

    "ATS_score": 76.67,

    "skills": {

        "matched_skills": [
            "Python",
            "Java"
        ],

        "missing_skills": [
            "Spring Boot",
            "React",
            "Docker"
        ]

    },

    "education_score": 20,

    "experience_score": 10,

    "project_score": 15,

    "certification_score": 5

}

# ==========================================================
# Generate Recommendation
# ==========================================================

engine = RecommendationEngine()

result = engine.generate_recommendation(ats_result)

# ==========================================================
# Validate Output
# ==========================================================

assert isinstance(result, dict)

required_keys = [

    "strengths",

    "missing_skills",

    "recommendations"

]

for key in required_keys:

    assert key in result, f"{key} missing."

assert isinstance(result["strengths"], list)

assert isinstance(result["missing_skills"], list)

assert isinstance(result["recommendations"], list)

# ==========================================================
# Display Result
# ==========================================================

print("=" * 70)
print("RECOMMENDATION ENGINE TEST")
print("=" * 70)

print("\nStrengths:")
for item in result["strengths"]:
    print(f"• {item}")

print("\nMissing Skills:")
for item in result["missing_skills"]:
    print(f"• {item}")

print("\nRecommendations:")
for item in result["recommendations"]:
    print(f"• {item}")

print("\n" + "=" * 70)
print("RECOMMENDATION ENGINE TEST PASSED SUCCESSFULLY")
print("=" * 70)