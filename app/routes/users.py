from fastapi import APIRouter
from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def add_user(user: UserCreate):
    db = SessionLocal()
    u = User(**user.dict())
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

@router.get("/")
def list_users():
    db = SessionLocal()
    return db.query(User).all()
