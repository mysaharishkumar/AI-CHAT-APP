import chromadb
from docx import Document
from pypdf import PdfReader

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="documents"
)


def ingest_pdf(
    file_path: str,
    user_id: str
):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    collection.add(
        documents=[text],
        metadatas=[
            {
                "user_id": user_id,
                "file_path": file_path
            }
        ],
        ids=[
            f"{user_id}_{file_path}"
        ]
    )

    return text

def ingest_docx(
    file_path: str,
    user_id: str
):

    doc = Document(file_path)

    text = ""

    for para in doc.paragraphs:

        text += para.text + "\n"

    collection.add(
        documents=[text],
        metadatas=[
            {
                "user_id": user_id,
                "file_path": file_path
            }
        ],
        ids=[
            f"{user_id}_{file_path}"
        ]
    )

    return text

def search_documents(
    user_id: str,
    question: str
):

    results = collection.query(
    query_texts=[question],
    n_results=3,
    where={
        "user_id": user_id
    }
)

    if (
        not results
        or "documents" not in results
        or not results["documents"]
        or not results["documents"][0]
    ):
        return ""

    return "\n".join(
        results["documents"][0]
    )