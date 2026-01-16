from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    role: str

class CourseCreate(BaseModel):
    title: str
    teacher_id: int

class EnrollCreate(BaseModel):
    student_id: int
    course_id: int
