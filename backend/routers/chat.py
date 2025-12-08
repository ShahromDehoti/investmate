from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import get_ai_response

router = APIRouter(prefix="/chat", tags=["chat"])


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = None


class ChatResponse(BaseModel):
    reply: str


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the AI assistant and get a response
    """
    try:
        # Convert history to format expected by AI service
        conversation_history = None
        if request.history:
            conversation_history = [
                {"role": msg.role, "content": msg.content} 
                for msg in request.history
            ]
        
        # Get AI response
        ai_reply = get_ai_response(request.message, conversation_history)
        
        return ChatResponse(reply=ai_reply)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")
