CREATE DATABASE IF NOT EXISTS ai_resume_analyzer;
USE ai_resume_analyzer;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('candidate', 'recruiter', 'admin') NOT NULL DEFAULT 'candidate',
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
  resume_id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NULL,
  uploaded_by INT NOT NULL,
  file_name VARCHAR(255),
  original_name VARCHAR(255),
  extracted_text LONGTEXT NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skills (
  skill_id INT AUTO_INCREMENT PRIMARY KEY,
  skill_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS job_descriptions (
  jd_id INT AUTO_INCREMENT PRIMARY KEY,
  recruiter_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description LONGTEXT NOT NULL,
  experience_required INT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recruiter_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_skills (
  resume_id INT,
  skill_id INT,
  PRIMARY KEY (resume_id, skill_id),
  FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jd_skills (
  jd_id INT,
  skill_id INT,
  PRIMARY KEY (jd_id, skill_id),
  FOREIGN KEY (jd_id) REFERENCES job_descriptions(jd_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  jd_id INT NOT NULL,
  ats_score DECIMAL(5,2) NOT NULL,
  quality_label VARCHAR(255) NOT NULL,
  ranking INT NULL,
  summary LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE CASCADE,
  FOREIGN KEY (jd_id) REFERENCES job_descriptions(jd_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matched_skills (
  result_id INT,
  skill_id INT,
  PRIMARY KEY (result_id, skill_id),
  FOREIGN KEY (result_id) REFERENCES results(result_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS missing_skills (
  result_id INT,
  skill_id INT,
  PRIMARY KEY (result_id, skill_id),
  FOREIGN KEY (result_id) REFERENCES results(result_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
  recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
  result_id INT NOT NULL,
  recommendation_text TEXT NOT NULL,
  FOREIGN KEY (result_id) REFERENCES results(result_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  event VARCHAR(80) NOT NULL,
  description VARCHAR(255),
  ip_address VARCHAR(80),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
