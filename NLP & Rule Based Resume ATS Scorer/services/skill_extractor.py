import os
import re
import pandas as pd


# ======================================================
# Project Paths
# ======================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

SKILLS_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "skills.csv"
)


# ======================================================
# Load Skills Dataset
# ======================================================

try:

    skills_df = pd.read_csv(
        SKILLS_PATH
    )

    SKILLS = sorted(

        set(

            skills_df["skill"]

            .dropna()

            .astype(str)

            .str.strip()

            .str.lower()

        ),

        key=len,

        reverse=True

    )
    
    print(f"\n✓ Skills dataset loaded successfully!")
    print(f"  Total skills in dataset: {len(SKILLS)}")
    print(f"  First 10 skills: {SKILLS[:10]}")
    print()

except Exception as e:

    print(
        f"❌ Error loading skills dataset: {e}"
    )

    SKILLS = []


# ======================================================
# Normalize Resume Text
# ======================================================

def normalize_text(text):
    """
    Normalize resume text before skill extraction.
    """

    if not isinstance(text, str):

        return ""

    text = text.lower()

    text = text.replace(
        "\t",
        " "
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    text = re.sub(
        r"[ ]{2,}",
        " ",
        text
    )

    return text.strip()

# ======================================================
# Extract Technical Skills
# ======================================================

def extract_skills(text):
    """
    Extract technical skills from the resume.

    Parameters
    ----------
    text : str
        Skills section or complete resume text.

    Returns
    -------
    list
        Sorted list of detected technical skills.
    """

    text = normalize_text(text)

    if not text:
        return []

    found_skills = set()

    for skill in SKILLS:

        # Match complete words only
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(

            pattern,

            text,

            flags=re.IGNORECASE

        ):

            found_skills.add(

                skill.title()

            )

    # Return alphabetically sorted list
    sorted_skills = sorted(
        found_skills,
        key=lambda x: len(x),
        reverse=True
    )
    
    return sorted_skills

