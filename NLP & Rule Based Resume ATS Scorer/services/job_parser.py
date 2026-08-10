import re

from services.skill_extractor import extract_skills


class JobParser:

    # -----------------------------
    # Extract Skills
    # -----------------------------

    def extract_skills(self, text):

        return extract_skills(text)

    # -----------------------------
    # Extract Education
    # -----------------------------

    def extract_education(self, text):

        text = text.lower()

        education = []

        keywords = {

            "Bachelor": [

                "bachelor",

                "b.e",

                "B.E.",

                "b.e.",

                "be",

                "b.tech",

                "B.tech",

                "B.Tech",

                "btech"

            ],

            "Master": [

                "master",

                "m.e",

                "M.E.",

                "m.e.",

                "me",

                "m.tech",

                "M.tech",

                "M.Tech",

                "mtech"

            ],

            "PhD": [

                "phd",

                "PHD",

                "p.h.d",

                "P.H.D",

                "doctorate"

            ]

        }

        for degree, words in keywords.items():

            if any(word in text for word in words):

                education.append(degree)

        return education

    # -----------------------------
    # Extract Experience
    # -----------------------------

    def extract_experience(self, text):

        pattern = r"(\d+)\+?\s*years?"

        match = re.search(

            pattern,

            text,

            flags=re.IGNORECASE

        )

        if match:

            return int(match.group(1))

        return 0

    # -----------------------------
    # Parse Job Description
    # -----------------------------

    def parse_job(self, text):
        
        print(f"\n========== JOB PARSER DEBUG ==========")
        print(f"Input text type: {type(text)}")
        print(f"Input text length: {len(text) if text else 0}")
        print(f"Input text (first 300 chars): {text[:300] if text else '(empty)'}")

        skills = self.extract_skills(text)
        print(f"Extracted skills: {skills}")
        print(f"Skills count: {len(skills)}")
        
        education = self.extract_education(text)
        print(f"Extracted education: {education}")
        
        experience = self.extract_experience(text)
        print(f"Extracted experience (years): {experience}")
        print("====================================\n")

        return {

            "skills": skills,

            "education": education,

            "experience": experience

        }