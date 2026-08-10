from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import shutil
import os

from services.resume_parser import ResumeParser
from services.section_extractor import extract_sections
from services.skill_extractor import extract_skills
from services.job_parser import JobParser
from services.ats_analyzer import ATSAnalyzer
from services.recommendation import RecommendationEngine



app = FastAPI()

resume_parser = ResumeParser()
job_parser = JobParser()
ats_analyzer = ATSAnalyzer()
recommendation = RecommendationEngine()


@app.get("/")
def home():

    return {
        "message": "AI Resume Analyzer API Running"
    }


@app.post("/analyze")
async def analyze_resume(

    resume: UploadFile = File(...),

    job_description: str = Form(default="")

):
    try:
        # Validate resume file
        if not resume or not resume.filename:
            raise HTTPException(status_code=400, detail="Resume file is required")
        
        print(f"\n========== FASTAPI PROCESSING ==========")
        print(f"Resume: {resume.filename}")
        print(f"Job Description: {len(job_description)} characters")
        print("=========================================\n")

        # Save Uploaded Resume
        os.makedirs("uploads", exist_ok=True)

        file_path = os.path.join("uploads", resume.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        
        await resume.close()

        # Extract Resume Text
        resume_text = resume_parser.extract_text(file_path)

        # Extract Resume Sections with error handling
        try:
            sections = extract_sections(resume_text)
        except Exception as e:
            print(f"❌ Error extracting sections: {str(e)}")
            # Return minimal sections if extraction fails
            sections = {
                "email": "",
                "phone": "",
                "summary": "",
                "skills": "",
                "education": "",
                "experience": "",
                "projects": "",
                "internships": "",
                "certifications": "",
                "achievements": "",
                "publications": "",
                "languages": "",
                "hobbies": "",
                "other": ""
            }

        # Safely get sections with defaults
        def safe_get_section(sections, key, default=""):
            try:
                return sections.get(key, default) if sections else default
            except:
                return default

        # Extract Resume Skills with error handling
        try:
            skills_text = safe_get_section(sections, "skills")
            print(f"\n========== RESUME SKILL EXTRACTION ==========")
            print(f"Skills section text (first 200 chars): {skills_text[:200] if skills_text else '(empty)'}")
            print(f"Skills section length: {len(skills_text)}")
            
            if skills_text:
                resume_skills = extract_skills(skills_text)
                print(f"Extracted from skills section: {resume_skills}")
            else:
                resume_skills = extract_skills(resume_text)
                print(f"Extracted from full resume text: {resume_skills}")
            
            print(f"Final resume_skills list: {resume_skills}")
            print("============================================\n")
        except Exception as e:
            print(f"⚠️  Warning extracting skills: {str(e)}")
            resume_skills = []

        # Build Resume Data with safe access
        resume_data = {
            "email": safe_get_section(sections, "email"),
            "phone": safe_get_section(sections, "phone"),
            "summary": safe_get_section(sections, "summary"),
            "skills": resume_skills,
            "education": safe_get_section(sections, "education"),
            "experience": safe_get_section(sections, "experience"),
            "projects": safe_get_section(sections, "projects"),
            "internships": safe_get_section(sections, "internships"),
            "certifications": safe_get_section(sections, "certifications"),
            "achievements": safe_get_section(sections, "achievements"),
            "publications": safe_get_section(sections, "publications"),
            "languages": safe_get_section(sections, "languages"),
            "hobbies": safe_get_section(sections, "hobbies"),
            "other": safe_get_section(sections, "other"),
            "resume_text": resume_text
        }

        # Parse Job Description
        try:
            print(f"\n========== JOB DESCRIPTION PARSING ==========")
            print(f"Job Description provided: {bool(job_description)}")
            print(f"Job Description length: {len(job_description)}")
            print(f"Job Description (first 200 chars): {job_description[:200] if job_description else '(empty)'}")
            
            if job_description:
                job_data = job_parser.parse_job(job_description)
                print(f"Parsed job_data: {job_data}")
                print(f"Job skills extracted: {job_data.get('skills', [])}")
            else:
                job_data = {"skills": []}
                print(f"No job description - using empty job_data")
            
            print("===========================================\n")
        except Exception as e:
            print(f"⚠️  Warning parsing job description: {str(e)}")
            job_data = {"skills": []}

        # ATS Analysis
        print(f"\n========== BEFORE ATS ANALYSIS ==========")
        print(f"Resume Skills (count): {len(resume_data.get('skills', []))}")
        print(f"Resume Skills: {resume_data.get('skills', [])}")
        print(f"Job Skills (count): {len(job_data.get('skills', []))}")
        print(f"Job Skills: {job_data.get('skills', [])}")
        print("=========================================\n")
        
        ats_result = ats_analyzer.analyze(resume_data, job_data)
        
        print(f"\n========== AFTER ATS ANALYSIS ==========")
        print(f"ATS Result Keys: {ats_result.keys()}")
        print(f"Skills in result: {ats_result.get('skills', {})}")
        print(f"Matched Skills: {ats_result.get('skills', {}).get('matched_skills', [])}")
        print(f"Missing Skills: {ats_result.get('skills', {}).get('missing_skills', [])}")
        print("=========================================\n")

        # Recommendations
        try:
            recommendation_result = recommendation.generate_recommendation(ats_result)
        except Exception as e:
            print(f"⚠️  Warning generating recommendations: {str(e)}")
            recommendation_result = {"recommendations": []}

        print("✓ Analysis completed successfully\n")
        
        return {
            "resume_data": resume_data,
            "job_data": job_data,
            "ats_result": ats_result,
            "recommendation": recommendation_result
        }

    except Exception as e:
        print(f"❌ Error in /analyze: {str(e)}\n")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")