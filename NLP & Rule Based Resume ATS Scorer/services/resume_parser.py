import PyPDF2


class ResumeParser:


    def extract_text(self, file_path):

        text = ""


        with open(file_path, "rb") as file:

            reader = PyPDF2.PdfReader(file)


            for page in reader.pages:

                text += page.extract_text()


        return text


