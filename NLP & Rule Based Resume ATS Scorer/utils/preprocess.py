import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):

    if text is None:
        return ""

    if not isinstance(text, str):
        text = str(text)

    # lowercase
    text = text.lower()

    # remove urls
    text = re.sub(r"http\S+|www\S+", " ", text)

    # remove emails
    text = re.sub(r"\S+@\S+", " ", text)

    # remove phone numbers
    text = re.sub(r"\+?\d[\d\s\-\(\)]{8,}\d", " ", text)

    # remove words containing 'resume' or 'example'
    text = re.sub(r"\b\w*(resume|example)\w*\b", " ", text)

    # keep only alphabets
    text = re.sub(r"[^a-zA-Z ]", " ", text)

    # remove single letters
    text = re.sub(r"\b[a-z]\b", " ", text)

    # remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    words = text.split()

    # remove stop words
    words = [w for w in words if w not in stop_words]

    # lemmatize
    words = [lemmatizer.lemmatize(w) for w in words]

    return " ".join(words)