from fastapi import APIRouter
from app.database import SessionLocal
from app.models import Course, User
from app.schemas import CourseCreate

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/")
def create_course(course: CourseCreate):
    db = SessionLocal()
    c = Course(**course.dict())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/")
def list_courses():
    db = SessionLocal()
    return (
        db.query(
            Course.id,
            Course.title,
            User.name.label("teacher")
        )
        .join(User, Course.teacher_id == User.id)
        .all()
    )
