from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import Course, User, Enrollment
from app.schemas import CourseCreate
from app.database import get_db

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    if not course.title or course.title.strip() == "":
        raise HTTPException(status_code=400, detail="Course title cannot be empty")
        
    c = Course(**course.dict())
    db.add(c)
    db.commit()
    return {"message": "Course created"}

@router.get("/")
def list_courses(db: Session = Depends(get_db)):
    results = (
        db.query(Course.id, Course.title, User.name.label("teacher"))
        .join(User, Course.teacher_id == User.id)
        .filter(Course.title != "")
        .all()
    )
    return [{"id": r.id, "title": r.title, "teacher": r.teacher} for r in results]

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.query(Enrollment).filter(Enrollment.course_id == course_id).delete()
    
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}