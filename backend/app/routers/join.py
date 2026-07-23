from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import JoinRequest
from app.schemas import JoinRequestCreate, JoinRequestResponse

router = APIRouter(prefix="/join", tags=["join"])


@router.post("", response_model=JoinRequestResponse)
async def submit_join_request(request: JoinRequestCreate, db: AsyncSession = Depends(get_db)):
    db_request = JoinRequest(**request.model_dump())
    db.add(db_request)
    await db.commit()
    await db.refresh(db_request)
    return db_request
