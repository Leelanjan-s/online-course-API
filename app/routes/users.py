from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, Course, Enrollment
from app.schemas import UserCreate
from app.database import get_db 

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    u = User(name=user.name, email=user.email, role=user.role)
    db.add(u)
    db.commit()
    return {"message": "User added"}

@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.query(Course).filter(Course.teacher_id == user_id).delete()
    db.query(Enrollment).filter(Enrollment.student_id == user_id).delete()
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}