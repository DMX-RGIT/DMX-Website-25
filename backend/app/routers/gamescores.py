import time
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import GameScore
from app.schemas import GameScoreCreate, GameScoreResponse

router = APIRouter(prefix="/gamescores", tags=["Gamescores"])


# Simple in-memory rate limiter: max 10 requests per minute per IP
ip_records = defaultdict(list)

def rate_limit_submit(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    # Keep only requests from the last 60 seconds
    ip_records[ip] = [t for t in ip_records[ip] if now - t < 60]
    if len(ip_records[ip]) >= 10:
        raise HTTPException(status_code=429, detail="Too many score submissions. Please wait a minute.")
    ip_records[ip].append(now)


@router.get("", response_model=list[GameScoreResponse])
async def get_top_scores(limit: int = 50, db: AsyncSession = Depends(get_db)):
    """
    Get the top global game scores, ordered by highest score first.
    """
    result = await db.execute(
        select(GameScore).order_by(desc(GameScore.score)).limit(limit)
    )
    return result.scalars().all()


@router.post("", response_model=GameScoreResponse, dependencies=[Depends(rate_limit_submit)])
async def submit_score(score_data: GameScoreCreate, db: AsyncSession = Depends(get_db)):
    """
    Submit a new score to the global leaderboard.
    """
    new_score = GameScore(
        name=score_data.name[:20].strip(),  # Enforce max 20 chars and strip
        score=score_data.score,
        level=score_data.level
    )
    if not new_score.name:
        raise HTTPException(status_code=400, detail="Name cannot be empty")
        
    db.add(new_score)
    await db.commit()
    await db.refresh(new_score)
    return new_score
