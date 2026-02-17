import os
from typing import List

from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

limiter = Limiter(key_func=get_remote_address)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")


def verify_admin(x_admin_password: str = Header(default="")):
    if not ADMIN_PASSWORD or x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

# Create DB tables on startup (simple and fine for this small demo)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rental Bedroom Applications API",
    description="Simple API to store rental bedroom applications for students.",
    version="1.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
    dependencies=[Depends(verify_admin)],
)
@limiter.limit("10/minute")
def list_applications(request: Request, db: Session = Depends(get_db)):
    """Return all applications ordered from oldest to newest."""
    apps = (
        db.query(models.Application)
        .order_by(models.Application.created_at.asc())
        .all()
    )
    return apps

