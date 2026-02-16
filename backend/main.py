from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

# Create DB tables on startup (simple and fine for this small demo)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rental Bedroom Applications API",
    description="Simple API to store rental bedroom applications for students.",
    version="1.0.0",
)

# CORS configuration – adjust origins as needed to match your frontend port
# In production with nginx proxy, CORS is handled at the nginx level
# but we keep this for development and flexibility
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    """Basic health check endpoint."""
    return {"status": "ok"}


@app.post(
    "/applications",
    response_model=schemas.ApplicationRead,
    status_code=status.HTTP_201_CREATED,
    tags=["applications"],
)
def create_application(
    application_in: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
):
    """
    Store a new rental application.

    Adds a creation timestamp automatically and persists to SQLite.
    """
    try:
        db_app = models.Application(
            full_name=application_in.full_name.strip(),
            email=application_in.email.strip(),
            phone=application_in.phone.strip() if application_in.phone else None,
            course=application_in.course.strip(),
            sex=application_in.sex,
            age=application_in.age,
            message=application_in.message.strip()
            if application_in.message
            else None,
        )
        db.add(db_app)
        db.commit()
        db.refresh(db_app)
        return db_app
    except Exception as exc:  # basic error handling for this demo
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save application.",
        ) from exc


@app.get(
    "/applications",
    response_model=List[schemas.ApplicationRead],
    tags=["applications"],
)
def list_applications(db: Session = Depends(get_db)):
    """Return all applications ordered from oldest to newest."""
    apps = (
        db.query(models.Application)
        .order_by(models.Application.created_at.asc())
        .all()
    )
    return apps

