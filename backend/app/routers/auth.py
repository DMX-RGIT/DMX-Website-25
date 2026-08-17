from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel

from app.config import get_settings
from app.services.cloudinary import upload_image

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

router = APIRouter(prefix="/auth", tags=["auth"])

ROLE_SUPERADMIN = "superadmin"
ROLE_EVENTS = "events"


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class TokenData(BaseModel):
    username: str | None = None
    role: str | None = None


def verify_password(plain_password: str, correct_password: str) -> bool:
    return plain_password == correct_password


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm="HS256")


def _decode_token(token: str) -> dict:
    """Decode JWT and return payload, raising 401 on any error."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception


async def get_current_admin(token: str = Depends(oauth2_scheme)) -> str:
    """Requires superadmin role only."""
    payload = _decode_token(token)
    if payload.get("role") != ROLE_SUPERADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin access required",
        )
    return payload["sub"]


async def require_events_or_super_admin(token: str = Depends(oauth2_scheme)) -> str:
    """Accepts either superadmin or events role. Used for event create/update."""
    payload = _decode_token(token)
    role = payload.get("role")
    if role not in (ROLE_SUPERADMIN, ROLE_EVENTS):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return payload["sub"]


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Check superadmin credentials first
    if form_data.username == settings.admin_username:
        if not verify_password(form_data.password, settings.admin_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )
        access_token = create_access_token(data={"sub": form_data.username, "role": ROLE_SUPERADMIN})
        return Token(access_token=access_token, token_type="bearer", role=ROLE_SUPERADMIN)

    # Check events-admin credentials
    if (
        settings.events_admin_password
        and form_data.username == settings.events_admin_username
        and verify_password(form_data.password, settings.events_admin_password)
    ):
        access_token = create_access_token(data={"sub": form_data.username, "role": ROLE_EVENTS})
        return Token(access_token=access_token, token_type="bearer", role=ROLE_EVENTS)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
    )


@router.get("/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    payload = _decode_token(token)
    return {"username": payload["sub"], "role": payload.get("role")}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = "dmx",
    _: str = Depends(require_events_or_super_admin),
):
    """Upload an image to Cloudinary (requires admin or events-admin auth)."""
    content_type = file.content_type or ""
    filename = file.filename.lower() if file.filename else ""
    is_image = content_type.startswith("image/") or filename.endswith(
        (".heic", ".heif", ".png", ".jpg", ".jpeg", ".webp", ".gif")
    )

    if not is_image:
        raise HTTPException(status_code=400, detail="Only image files are allowed. Please ensure the file is a valid image (e.g., .jpg, .png, .heic).")

    url = await upload_image(file, folder=folder)
    return {"url": url}
