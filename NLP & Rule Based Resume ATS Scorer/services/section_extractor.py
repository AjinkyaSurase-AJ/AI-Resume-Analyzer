

import re
import spacy

from spacy.matcher import PhraseMatcher


# ==========================================================
# Load spaCy Model
# ==========================================================

try:

    nlp = spacy.load("en_core_web_sm")

except OSError:

    raise RuntimeError(
        "spaCy model 'en_core_web_sm' is not installed.\n"
        "Run:\n"
        "python -m spacy download en_core_web_sm"
    )


# ==========================================================
# Phrase Matcher
# ==========================================================

matcher = PhraseMatcher(
    nlp.vocab,
    attr="LOWER"
)


# ==========================================================
# Resume Section Headings
# ==========================================================

SECTION_HEADINGS = {

    "summary": [

        "summary",
        "professional summary",
        "career summary",
        "executive summary",
        "profile",
        "professional profile",
        "career objective",
        "objective"

    ],

    "skills": [

        "skills",
        "technical skills",
        "technical expertise",
        "technical competencies",
        "core competencies",
        "core skills",
        "key skills",
        "competencies"

    ],

    "education": [

        "education",
        "academic background",
        "academic qualifications",
        "qualification",
        "qualifications"

    ],

    "experience": [

        "experience",
        "work experience",
        "professional experience",
        "employment history",
        "career history",
        "work history"

    ],

    "projects": [

        "projects",
        "project",
        "academic projects",
        "project experience"

    ],

    "internships": [

        "internship",
        "internships",
        "internship experience"

    ],

    "certifications": [

        "certification",
        "certifications",
        "certificate",
        "certificates",
        "licenses",
        "license"

    ],

    "achievements": [

        "achievement",
        "achievements",
        "awards",
        "honors"

    ],

    "publications": [

        "publication",
        "publications"

    ],

    "languages": [

        "language",
        "languages"

    ],

    "hobbies": [

        "hobbies",
        "interests",
        "interest"

    ]

}


# ==========================================================
# Register Phrase Patterns
# ==========================================================

for section, headings in SECTION_HEADINGS.items():

    patterns = [

        nlp.make_doc(
            heading
        )

        for heading in headings

    ]

    matcher.add(

        section,

        patterns

    )


# ==========================================================
# Email Extraction
# ==========================================================

def extract_email(text):

    pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

    match = re.search(
        pattern,
        text
    )

    if match:

        return match.group()

    return ""


# ==========================================================
# Phone Extraction
# ==========================================================

def extract_phone(text):

    pattern = r"(\+91[\-\s]?)?[6-9]\d{9}"

    match = re.search(
        pattern,
        text
    )

    if match:

        return match.group()

    return ""


# ==========================================================
# Resume Preprocessing
# ==========================================================

def preprocess_resume(text):
    """
    Clean resume text before NLP processing.
    """

    if not isinstance(text, str):

        return []

    text = text.replace(
        "\r",
        "\n"
    )

    text = text.replace(
        "\t",
        " "
    )

    text = re.sub(
        r"[ ]+",
        " ",
        text
    )

    text = re.sub(
        r"\n{2,}",
        "\n",
        text
    )

    lines = []

    for line in text.split("\n"):

        line = line.strip()

        if line:

            lines.append(line)

    return lines

# ==========================================================
# Normalize Heading
# ==========================================================

def normalize_heading(line):
    """
    Normalize a possible section heading.
    """

    line = line.strip().lower()

    # Remove trailing ':' or '-'
    line = re.sub(
        r'[:\-]+$',
        '',
        line
    )

    # Collapse multiple spaces
    line = re.sub(
        r'\s+',
        ' ',
        line
    )

    return line


# ==========================================================
# Detect Heading using spaCy PhraseMatcher
# ==========================================================

def detect_heading(line):
    """
    Detect whether a line is a resume heading.
    Returns the standardized section name.
    """

    heading = normalize_heading(line)

    if not heading:

        return None

    doc = nlp(heading)

    matches = matcher(doc)

    if not matches:

        return None

    # Accept only complete-line matches
    for match_id, start, end in matches:

        if start == 0 and end == len(doc):

            return nlp.vocab.strings[match_id]

    return None


# ==========================================================
# Detect Resume Sections
# ==========================================================

def detect_sections(text):
    """
    Detect all resume sections.
    """

    lines = preprocess_resume(text)

    sections = {}

    current_section = "other"

    sections[current_section] = []

    for line in lines:

        heading = detect_heading(line)

        # Switch to a new section
        if heading:

            current_section = heading

            if current_section not in sections:

                sections[current_section] = []

            continue

        # Skip blank lines
        if not line.strip():

            continue

        sections[current_section].append(line)

    # Convert lists to strings
    for section in sections:

        sections[section] = "\n".join(
            sections[section]
        ).strip()

    return sections


# ==========================================================
# Ensure Every Section Exists
# ==========================================================

def initialize_sections(sections):
    """
    Ensure all supported sections are present.
    """

    default_sections = [

        "summary",

        "skills",

        "education",

        "experience",

        "projects",

        "internships",

        "certifications",

        "achievements",

        "publications",

        "languages",

        "hobbies",

        "other"

    ]

    final_sections = {}

    for section in default_sections:

        final_sections[section] = sections.get(
            section,
            ""
        )

    return final_sections


# ==========================================================
# Clean Extracted Sections
# ==========================================================

def clean_sections(sections):
    """
    Remove unnecessary blank lines and spaces.
    """

    cleaned = {}

    for section, content in sections.items():

        if not content:

            cleaned[section] = ""

            continue

        content = re.sub(
            r"\n{2,}",
            "\n",
            content
        )

        cleaned[section] = content.strip()

    return cleaned

# ==========================================================
# Main Extraction Function
# ==========================================================

def extract_sections(text):
    """
    Extract all resume information.

    Returns
    -------
    dict
        Dictionary containing all extracted resume sections.
    """

    detected_sections = detect_sections(text)

    detected_sections = clean_sections(
        detected_sections
    )

    detected_sections = initialize_sections(
        detected_sections
    )

    result = {

        "email": extract_email(
            text
        ),

        "phone": extract_phone(
            text
        ),

        "summary": detected_sections[
            "summary"
        ],

        "skills": detected_sections[
            "skills"
        ],

        "education": detected_sections[
            "education"
        ],

        "experience": detected_sections[
            "experience"
        ],

        "projects": detected_sections[
            "projects"
        ],

        "internships": detected_sections[
            "internships"
        ],

        "certifications": detected_sections[
            "certifications"
        ],

        "achievements": detected_sections[
            "achievements"
        ],

        "publications": detected_sections[
            "publications"
        ],

        "languages": detected_sections[
            "languages"
        ],

        "hobbies": detected_sections[
            "hobbies"
        ],

        "other": detected_sections[
            "other"
        ]

    }

    return result   