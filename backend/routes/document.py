from fastapi import APIRouter, UploadFile, File

from models.document import DocumentQuery
from services.rag_service import ingest_pdf, search_documents
from services.gemini_service import ask_gemini
from services.rag_service import (
    ingest_pdf,
    ingest_docx,
    search_documents
)
router = APIRouter(
    prefix="/document",
    tags=["Documents"]
)


@router.post("/upload")
async def upload_document(
    user_id: str,
    file: UploadFile = File(...)
):

    path = f"uploads/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    if file.filename.endswith(".pdf"):

        ingest_pdf(
            path,
            user_id
        )

    elif file.filename.endswith(".docx"):

        ingest_docx(
            path,
            user_id
        )

    else:

        return {
            "message":
            "Unsupported File Type"
        }

    return {
        "message":
        "Document Uploaded"
    }

@router.post("/ask")
async def ask_document(
    data: DocumentQuery
):

    context = search_documents(
        data.user_id,
        data.question
    )

    prompt = f"""
You are a document assistant.

Answer ONLY from the provided document context.

If the answer is not found in the document, reply:
"I could not find that information in the uploaded document."

Document Context:
{context}

Question:
{data.question}
"""

    answer = await ask_gemini(
        prompt
    )

    return {
        "answer": answer
    }