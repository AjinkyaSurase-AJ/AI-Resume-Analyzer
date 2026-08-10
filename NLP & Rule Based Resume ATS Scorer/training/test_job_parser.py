import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from services.job_parser import JobParser



job_description="""

We need Java Developer.

Required skills:
Java
Spring Boot
Hibernate
MySQL

Education:
B.Tech Computer Science

Experience:
2+ years

"""


parser=JobParser()


result=parser.parse_job(job_description)


print(result)