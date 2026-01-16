from fastapi import APIRouter
from sqlalchemy.orm import aliased
from app.database import SessionLocal
from app.models import Enrollment, User, Course

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

@router.post("/")
def enroll(student_id: int, course_id: int):
    db = SessionLocal()
    e = Enrollment(student_id=student_id, course_id=course_id)
    db.add(e)
    db.commit()
    db.refresh(e)
    return e

@router.get("/")
def view_enrollments():
    db = SessionLocal()
    Student = aliased(User)
    Teacher = aliased(User)
    return (
        db.query(
            Student.name.label("student"),
            Course.title.label("course"),
            Teacher.name.label("teacher")
        )
        .join(Course, Course.id == Enrollment.course_id)
        .join(Teacher, Teacher.id == Course.teacher_id)
        .join(Student, Student.id == Enrollment.student_id)
        .all()
    )
