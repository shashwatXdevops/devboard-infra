from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_client import summarize_task
from app.api.dependencies import get_current_active_user
from app.db.models.user import User

router = APIRouter()

@router.post("/summarize")
async def request_ai_summary(
    text: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Pass raw text to the background AI gRPC service for summarization.
    """
    summary = summarize_task(text)
    if "Error" in summary:
        raise HTTPException(status_code=503, detail=summary)
    
    return {"original_length": len(text), "summary": summary}
