from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from io import BytesIO

from gtts import gTTS

router = APIRouter(
    prefix="/voice",
    tags=["Voice"]
)

SUPPORTED_LANGS = {"en", "te"}


class VoiceRequest(BaseModel):
    text: str
    lang: str = "en"


@router.post("/speak")
async def speak(data: VoiceRequest):
    """
    Converts text to speech and streams back an MP3.
    lang: "en" for English, "te" for Telugu.
    Works on any server (Render included) since gTTS
    just calls Google's TTS API — no local audio hardware needed.
    """

    if not data.text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text provided"
        )

    lang = data.lang if data.lang in SUPPORTED_LANGS else "en"

    try:
        buffer = BytesIO()

        tts = gTTS(
            text=data.text,
            lang=lang
        )

        tts.write_to_fp(buffer)
        buffer.seek(0)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Speech generation failed: {e}"
        )

    return StreamingResponse(
        buffer,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": "inline; filename=speech.mp3"
        }
    )
