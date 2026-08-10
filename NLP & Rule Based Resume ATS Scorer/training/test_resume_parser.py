import os
import sys
import tempfile

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
# Imports
# ==========================================================

from services.resume_parser import ResumeParser
from reportlab.pdfgen import canvas

# ==========================================================
# Create Sample PDF
# ==========================================================

temp_pdf = tempfile.NamedTemporaryFile(
    suffix=".pdf",
    delete=False
)

pdf_path = temp_pdf.name
temp_pdf.close()

c = canvas.Canvas(pdf_path)

c.drawString(100, 800, "Rahul Patil")
c.drawString(100, 780, "Email: rahul@gmail.com")
c.drawString(100, 760, "Phone: 9876543210")
c.drawString(100, 740, "Skills: Python, Java, SQL")
c.drawString(100, 720, "Education: Bachelor of Technology")
c.drawString(100, 700, "Experience: Software Developer Intern")

c.save()

# ==========================================================
# Parse Resume
# ==========================================================

parser = ResumeParser()

text = parser.extract_text(pdf_path)

# ==========================================================
# Validations
# ==========================================================

assert isinstance(text, str)

assert "Rahul Patil" in text

assert "Python" in text

assert "Java" in text

assert "Bachelor" in text

assert len(text.strip()) > 0

# ==========================================================
# Output
# ==========================================================

print("=" * 70)
print("RESUME PARSER TEST")
print("=" * 70)

print(text)

print("\n" + "=" * 70)
print("RESUME PARSER TEST PASSED SUCCESSFULLY")
print("=" * 70)

# ==========================================================
# Cleanup
# ==========================================================

os.remove(pdf_path)