from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path

from app.database import Base, engine
from app.routes import users, courses, enrollments

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.include_router(courses.router)
app.include_router(enrollments.router)

app.mount("/static", StaticFiles(directory="static"), name="static")

BASE_DIR = Path(__file__).resolve().parent.parent

@app.get("/", response_class=HTMLResponse)
def home():
    return (BASE_DIR / "templates/index.html").read_text()
