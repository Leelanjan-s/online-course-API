from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import aliased, Session
from app.models import Enrollment, User, Course
from app.database import get_db

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

@router.post("/")
def enroll(student_id: int, course_id: int, db: Session = Depends(get_db)):
    exists = db.query(Enrollment).filter_by(student_id=student_id, course_id=course_id).first()
    if exists:
        return {"message": "Student is already enrolled!"}
    
    e = Enrollment(student_id=student_id, course_id=course_id)
    db.add(e)
    db.commit()
    return {"message": "Student enrolled"}

@router.get("/")
def view_enrollments(db: Session = Depends(get_db)):
    StudentUser = aliased(User)
    TeacherUser = aliased(User)

    results = (
        db.query(
            Enrollment.id,
            StudentUser.name.label("student"),
            Course.title.label("course"),
            TeacherUser.name.label("teacher")
        )
        .select_from(Enrollment)
        .join(Course, Course.id == Enrollment.course_id)
        .join(TeacherUser, TeacherUser.id == Course.teacher_id)
        .join(StudentUser, StudentUser.id == Enrollment.student_id)
        .all()
    )

    return [
        {"id": row.id, "student": row.student, "course": row.course, "teacher": row.teacher}
        for row in results
    ]

@router.delete("/{enrollment_id}")
def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    e = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    db.delete(e)
    db.commit()
    return {"message": "Enrollment deleted"}