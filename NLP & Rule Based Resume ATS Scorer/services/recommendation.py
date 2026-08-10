class RecommendationEngine:

    # ---------------------------------
    # Skill Recommendations
    # ---------------------------------

    def generate_skill_recommendation(self, missing_skills):

        recommendations = []

        for skill in missing_skills:

            recommendations.append(
                f"Improve your profile by learning {skill}."
            )

        return recommendations

    # ---------------------------------
    # Education Recommendation
    # ---------------------------------

    def generate_education_recommendation(self, score):

        if score == 100:
            return None

        return (
            "Your education does not fully match the job requirements."
        )

    # ---------------------------------
    # Experience Recommendation
    # ---------------------------------

    def generate_experience_recommendation(self, score):

        if score >= 100:

            return None

        elif score >= 60:

            return (
                "Your internship experience is relevant, but gaining more professional experience will strengthen your profile."
            )

        elif score >= 30:

            return (
                "You have some internship experience. Consider gaining additional internships or entry-level professional experience."
            )

        else:

            return (
                "Gain internships or professional work experience related to this job role."
            )


    # ---------------------------------
    # Project Recommendation
    # ---------------------------------

    def generate_project_recommendation(self, score):

        if score == 100:
            return None

        return (
            "Include academic or personal projects related to the job role."
        )

    # ---------------------------------
    # Certification Recommendation
    # ---------------------------------

    def generate_certification_recommendation(self, score):

        if score == 100:
            return None

        return (
            "Add relevant certifications to strengthen your profile."
        )

    # ---------------------------------
    # Overall Feedback
    # ---------------------------------

    def generate_score_feedback(self, ats_score):

        if ats_score >= 80:

            return (
                "Excellent match. Your resume strongly matches this job."
            )

        elif ats_score >= 60:

            return (
                "Good match. Improve a few areas to increase your chances."
            )

        elif ats_score >= 40:

            return (
                "Average match. Improve your resume before applying."
            )

        else:

            return (
                "Low match. Major improvements are recommended."
            )

    # ---------------------------------
    # Generate Recommendations
    # ---------------------------------

    def generate_recommendation(self, ats_result):

        recommendations = []

        recommendations.extend(

            self.generate_skill_recommendation(

                ats_result["skills"]["missing_skills"]

            )

        )

        education = self.generate_education_recommendation(

            ats_result["education_score"]

        )

        if education:

            recommendations.append(education)

        experience = self.generate_experience_recommendation(

            ats_result["experience_score"]

        )

        if experience:

            recommendations.append(experience)

        project = self.generate_project_recommendation(

            ats_result["project_score"]

        )

        if project:

            recommendations.append(project)

        certification = self.generate_certification_recommendation(

            ats_result["certification_score"]

        )

        if certification:

            recommendations.append(certification)

        return {

            "ATS_score": ats_result["ATS_score"],

            "feedback": self.generate_score_feedback(

                ats_result["ATS_score"]

            ),

            "recommendations": recommendations

        }