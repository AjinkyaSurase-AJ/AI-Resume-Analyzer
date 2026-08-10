-- Update existing database schema to fix column size issues
USE ai_resume_analyzer;

-- Alter the results table to fix quality_label and summary column sizes
ALTER TABLE results 
  MODIFY COLUMN quality_label VARCHAR(255) NOT NULL,
  MODIFY COLUMN summary LONGTEXT;

-- Verify the changes
DESCRIBE results;
