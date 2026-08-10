import re
from datetime import datetime


class ATSAnalyzer:

    # ---------------------------------
    # Skill Match
    # ---------------------------------

    def calculate_skill_match(self, resume_skills, job_skills):

        resume = {skill.lower() for skill in resume_skills}
        job = {skill.lower() for skill in job_skills}

        matched = sorted(resume & job)
        missing = sorted(job - resume)

        score = 100 if len(job) == 0 else (len(matched) / len(job)) * 100

        return {
            "matched_skills": matched,
            "missing_skills": missing,
            "score": round(score, 2)
        }

    # ---------------------------------
    # Education Score
    # ---------------------------------

    def education_score(self, resume_education, job_education):

        resume = resume_education.lower()

        bachelor = [
            "bachelor",
            "b.e",
            "be",
            "b.tech",
            "btech"
        ]

        master = [
            "master",
            "m.e",
            "me",
            "m.tech",
            "mtech"
        ]

        if "Bachelor" in job_education:

            if any(word in resume for word in bachelor):

                return 100

        if "Master" in job_education:

            if any(word in resume for word in master):

                return 100

        return 0

    # ---------------------------------
    # Internship Duration
    # ---------------------------------

    def internship_months(self, text):

        months = {
            "january": 1,
            "february": 2,
            "march": 3,
            "april": 4,
            "may": 5,
            "june": 6,
            "july": 7,
            "august": 8,
            "september": 9,
            "october": 10,
            "november": 11,
            "december": 12
        }

        pattern = re.findall(
            r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\s*-\s*(January|February|March|April|May|June|July|August|September|October|November|December|Present)\s*(\d{4})?",
            text,
            flags=re.IGNORECASE
        )

        total = 0

        for start_month, start_year, end_month, end_year in pattern:

            start_month = months[start_month.lower()]
            start_year = int(start_year)

            if end_month.lower() == "present":

                end = datetime.today()

            else:

                end_month = months[end_month.lower()]
                end_year = int(end_year)

                end = datetime(
                    end_year,
                    end_month,
                    1
                )

            start = datetime(
                start_year,
                start_month,
                1
            )

            total += (
                (end.year - start.year) * 12
                + (end.month - start.month)
                + 1
            )

        return total

    # ---------------------------------
    # Experience Score
    # ---------------------------------

    def experience_score(
        self,
        internship_months,
        required_years
    ):

        internship_years = internship_months / 12

        if required_years == 0:
            return 100

        score = min(
            (internship_years / required_years) * 100,
            100
        )

        return round(score, 2)

    # ---------------------------------
    # Projects
    # ---------------------------------

    def project_score(self, projects):

        return 100 if projects.strip() else 0

    # ---------------------------------
    # Certifications
    # ---------------------------------

    def certification_score(self, certifications):

        return 100 if certifications.strip() else 0

    # ---------------------------------
    # ATS Analysis
    # ---------------------------------

    def analyze(self, resume_data, job_data):
        
        # Safe access to resume data with defaults
        resume_skills = resume_data.get("skills", []) if isinstance(resume_data.get("skills"), list) else []
        resume_education = resume_data.get("education", "")
        resume_internships = resume_data.get("internships", "")
        resume_projects = resume_data.get("projects", "")
        resume_certifications = resume_data.get("certifications", "")
        
        # Safe access to job data with defaults
        job_skills = job_data.get("skills", []) if isinstance(job_data.get("skills"), list) else []
        job_education = job_data.get("education", "")
        job_experience = job_data.get("experience", 0)

        skills = self.calculate_skill_match(
            resume_skills,
            job_skills
        )

        education = self.education_score(
            resume_education,
            job_education
        )

        internship_months = self.internship_months(
            resume_internships
        )

        experience = self.experience_score(
            internship_months,
            job_experience
        )

        projects = self.project_score(
            resume_projects
        )

        certifications = self.certification_score(
            resume_certifications
        )

        ats_score = (
            skills["score"] * 0.50
            + education * 0.20
            + experience * 0.15
            + projects * 0.10
            + certifications * 0.05
        )

        score_breakdown = {
        
                    "Skills": {
                        "weight": "50%",
                        "score": skills["score"],
                        "contribution": round(skills["score"] * 0.50, 2)
                    },
        
                    "Education": {
                        "weight": "20%",
                        "score": education,
                        "contribution": round(education * 0.20, 2)
                    },
        
                    "Experience": {
                        "weight": "15%",
                        "score": experience,
                        "contribution": round(experience * 0.15, 2)
                    },
        
                    "Projects": {
                        "weight": "10%",
                        "score": projects,
                        "contribution": round(projects * 0.10, 2)
                    },
        
                    "Certifications": {
                        "weight": "5%",
                        "score": certifications,
                        "contribution": round(certifications * 0.05, 2)
                    }
        
                }

        strengths = []

        if skills["score"] >= 80:
            strengths.append("Strong technical skill match")

        if education == 100:
            strengths.append("Education meets job requirement")

        if projects == 100:
            strengths.append("Relevant projects found")

        if certifications == 100:
            strengths.append("Relevant certifications found")

        weaknesses = []

        if skills["missing_skills"]:
            weaknesses.append(
                "Missing skills: "
                + ", ".join(skills["missing_skills"])
            )

        if experience < 100:
            weaknesses.append(
                "Professional experience is below the job requirement."
            )

        return {

            "ATS_score": round(ats_score, 2),

            "skills": skills,

            "education_score": education,

            "experience_score": experience,

            "project_score": projects,

            "certification_score": certifications,

            "internship_months": internship_months,

            "score_breakdown": score_breakdown,

            "strengths": strengths,

            "weaknesses": weaknesses

        }