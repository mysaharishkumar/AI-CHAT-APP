import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


async def ask_gemini(
    prompt: str,
    memories: dict = None
):

    memory_text = ""

    if memories:

        for key, value in memories.items():
            memory_text += f"{key}: {value}\n"

    final_prompt = f"""
You are a personal AI assistant.

Known facts about the user:

{memory_text}

Use these facts when answering.

If the user asks:
- What is my name?

Answer using the stored name from memory.

If "relevant_document_excerpts" is present above, it is text pulled from
a document the user uploaded (e.g. a resume). Use it to answer questions
about that document (e.g. their skills, projects, CGPA, experience) even
if the user doesn't re-attach the file, and even in a brand new chat.
If the answer truly isn't in those excerpts, say so rather than guessing.

If the user tells you new information, acknowledge it naturally.

User Message:
{prompt}
"""

    response = model.generate_content(
        final_prompt
    )

    return response.text