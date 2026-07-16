from fastapi import APIRouter
from fastapi.responses import FileResponse

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from database.messages import messages

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)


@router.get("/{user_id}/{thread_id}")
async def export_chat(
    user_id: str,
    thread_id: str
):

    filename = (
        f"chat_{thread_id}.pdf"
    )

    pdf = SimpleDocTemplate(
        filename
    )

    styles = getSampleStyleSheet()

    content = []

    async for msg in messages.find(
        {
            "user_id": user_id,
            "thread_id": thread_id
        }
    ):

        content.append(
            Paragraph(
                f"<b>You:</b> {msg['user_message']}",
                styles["BodyText"]
            )
        )

        content.append(
            Spacer(
                1,
                10
            )
        )

        content.append(
            Paragraph(
                f"<b>AI:</b> {msg['ai_response']}",
                styles["BodyText"]
            )
        )

        content.append(
            Spacer(
                1,
                20
            )
        )

    pdf.build(content)

    return FileResponse(
        filename,
        filename=filename,
        media_type="application/pdf"
    )