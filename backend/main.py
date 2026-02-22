import os
import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Request, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from passlib.context import CryptContext
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

# ─── Setup ────────────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

IMAGES_DIR = Path(os.getenv("IMAGES_DIR", "/app/data/images"))
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Roomates API",
    description="Multi-room rental marketplace API.",
    version="2.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

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


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _image_url(request: Request, filename: str) -> str:
    base = str(request.base_url).rstrip("/")
    return f"{base}/images/{filename}"


def _room_to_schema(room: models.Room, request: Request) -> schemas.RoomRead:
    images = [
        schemas.RoomImageRead(
            id=img.id,
            room_id=img.room_id,
            filename=img.filename,
            url=_image_url(request, img.filename),
        )
        for img in room.images
    ]
    return schemas.RoomRead(
        id=room.id,
        title=room.title,
        description=room.description,
        location=room.location,
        price=room.price,
        is_closed=room.is_closed,
        owner_id=room.owner_id,
        owner_name=room.owner.name,
        images=images,
        created_at=room.created_at,
    )


# ─── Auth dependency ─────────────────────────────────────────────────────────

def get_current_user(
    x_auth_token: str = Header(default=""),
    db: Session = Depends(get_db),
) -> models.User:
    if not x_auth_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token_row = db.query(models.AuthToken).filter(models.AuthToken.token == x_auth_token).first()
    if not token_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return token_row.user


def get_optional_user(
    x_auth_token: str = Header(default=""),
    db: Session = Depends(get_db),
) -> Optional[models.User]:
    if not x_auth_token:
        return None
    token_row = db.query(models.AuthToken).filter(models.AuthToken.token == x_auth_token).first()
    return token_row.user if token_row else None


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}


# ─── Auth endpoints ───────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED, tags=["auth"])
def register(body: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == body.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = models.User(
        email=body.email.strip().lower(),
        password_hash=hash_password(body.password),
        name=body.name.strip(),
    )
    db.add(user)
    db.flush()
    token_val = uuid.uuid4().hex
    token = models.AuthToken(user_id=user.id, token=token_val)
    db.add(token)
    db.commit()
    db.refresh(user)
    return schemas.TokenResponse(token=token_val, user_id=user.id, email=user.email, name=user.name)


@app.post("/auth/login", response_model=schemas.TokenResponse, tags=["auth"])
def login(body: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email.strip().lower()).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token_val = uuid.uuid4().hex
    token = models.AuthToken(user_id=user.id, token=token_val)
    db.add(token)
    db.commit()
    return schemas.TokenResponse(token=token_val, user_id=user.id, email=user.email, name=user.name)


@app.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT, tags=["auth"])
def logout(
    x_auth_token: str = Header(default=""),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db.query(models.AuthToken).filter(models.AuthToken.token == x_auth_token).delete()
    db.commit()


@app.get("/auth/me", response_model=schemas.UserRead, tags=["auth"])
def me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ─── Room endpoints (public) ──────────────────────────────────────────────────

@app.get("/rooms", response_model=List[schemas.RoomRead], tags=["rooms"])
def list_rooms(
    request: Request,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Room).filter(models.Room.is_closed == False)
    if min_price is not None:
        query = query.filter(models.Room.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Room.price <= max_price)
    rooms = query.order_by(models.Room.created_at.desc()).all()
    return [_room_to_schema(r, request) for r in rooms]


@app.get("/rooms/{room_id}", response_model=schemas.RoomRead, tags=["rooms"])
def get_room(room_id: int, request: Request, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return _room_to_schema(room, request)


# ─── Room endpoints (authenticated) ──────────────────────────────────────────

@app.post("/rooms", response_model=schemas.RoomRead, status_code=status.HTTP_201_CREATED, tags=["rooms"])
def create_room(
    body: schemas.RoomCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = models.Room(
        title=body.title.strip(),
        description=body.description.strip() if body.description else None,
        location=body.location.strip() if body.location else None,
        price=body.price,
        owner_id=current_user.id,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return _room_to_schema(room, request)


@app.put("/rooms/{room_id}", response_model=schemas.RoomRead, tags=["rooms"])
def update_room(
    room_id: int,
    body: schemas.RoomUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if body.title is not None:
        room.title = body.title.strip()
    if body.description is not None:
        room.description = body.description.strip()
    if body.location is not None:
        room.location = body.location.strip()
    if body.price is not None:
        room.price = body.price
    db.commit()
    db.refresh(room)
    return _room_to_schema(room, request)


@app.delete("/rooms/{room_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["rooms"])
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    # Delete image files from disk
    for img in room.images:
        img_path = IMAGES_DIR / img.filename
        if img_path.exists():
            img_path.unlink()
    db.delete(room)
    db.commit()


@app.post("/rooms/{room_id}/close", response_model=schemas.RoomRead, tags=["rooms"])
def close_room(
    room_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    room.is_closed = True
    db.commit()
    db.refresh(room)
    return _room_to_schema(room, request)


# ─── Image endpoints ──────────────────────────────────────────────────────────

@app.post("/rooms/{room_id}/images", response_model=schemas.RoomImageRead, status_code=status.HTTP_201_CREATED, tags=["images"])
async def upload_image(
    room_id: int,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    content = await file.read()
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="Image too large (max 10 MB)")

    filename = f"{uuid.uuid4().hex}{ext}"
    (IMAGES_DIR / filename).write_bytes(content)

    img = models.RoomImage(room_id=room_id, filename=filename)
    db.add(img)
    db.commit()
    db.refresh(img)
    return schemas.RoomImageRead(
        id=img.id,
        room_id=img.room_id,
        filename=img.filename,
        url=_image_url(request, img.filename),
    )


@app.delete("/rooms/{room_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["images"])
def delete_image(
    room_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    img = db.query(models.RoomImage).filter(
        models.RoomImage.id == image_id,
        models.RoomImage.room_id == room_id,
    ).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    img_path = IMAGES_DIR / img.filename
    if img_path.exists():
        img_path.unlink()
    db.delete(img)
    db.commit()


# ─── Application endpoints ────────────────────────────────────────────────────

@app.post(
    "/rooms/{room_id}/applications",
    response_model=schemas.ApplicationRead,
    status_code=status.HTTP_201_CREATED,
    tags=["applications"],
)
@limiter.limit("5/minute")
def create_application(
    room_id: int,
    request: Request,
    body: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.is_closed:
        raise HTTPException(status_code=409, detail="This room is no longer accepting applications")
    try:
        app_obj = models.Application(
            room_id=room_id,
            full_name=body.full_name.strip(),
            email=body.email.strip(),
            phone=body.phone.strip() if body.phone else None,
            course=body.course.strip(),
            sex=body.sex,
            age=body.age,
            message=body.message.strip() if body.message else None,
        )
        db.add(app_obj)
        db.commit()
        db.refresh(app_obj)
        return app_obj
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save application") from exc


@app.get(
    "/rooms/{room_id}/applications",
    response_model=List[schemas.ApplicationRead],
    tags=["applications"],
)
def list_room_applications(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return (
        db.query(models.Application)
        .filter(models.Application.room_id == room_id)
        .order_by(models.Application.created_at.asc())
        .all()
    )


# ─── Owner: list my rooms (including closed) ─────────────────────────────────

@app.get("/my-rooms", response_model=List[schemas.RoomRead], tags=["rooms"])
def list_my_rooms(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    rooms = (
        db.query(models.Room)
        .filter(models.Room.owner_id == current_user.id)
        .order_by(models.Room.created_at.desc())
        .all()
    )
    return [_room_to_schema(r, request) for r in rooms]
