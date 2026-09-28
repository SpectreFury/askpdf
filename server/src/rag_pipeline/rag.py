import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import requests
from ..utils.cloudinary import secure_download_url
from .store import collection_name, open_collection

def download_file(public_id: str):

    cleaned_public_id = (
        public_id.rsplit(".")[0] if public_id.endswith(".pdf") else public_id
    )

    output_path = "downloaded/" + cleaned_public_id + "/" + "file.pdf"

    secure_url = secure_download_url(cleaned_public_id)

    response = requests.get(secure_url)

    if response.status_code != 200:
        raise RuntimeError(
            f"Failed to fetch PDF: {response.status_code} - {response.text}"
        )

    (
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        if os.path.dirname(output_path)
        else None
    )

    with open(output_path, "wb") as f:
        f.write(response.content)

    print(f"File saved successfully to {output_path}")
    return output_path


def injest_pdf(output_path: str, session_id: str):
    pdf_list = load_pdf(output_path)
    if not len(pdf_list):
        raise RuntimeError(f"Unable to load PDF: {pdf_list}")

    chunks = create_chunks(pdf_list)

    last_chunk_id = None
    chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")

        current_chunk_id = f"{source}:{page}"
        if last_chunk_id == current_chunk_id:
            chunk_index += 1
        else:
            chunk_index = 0
            last_chunk_id = current_chunk_id

        new_id = f"{source}:{page}:{chunk_index}"

        chunk.metadata["id"] = new_id

    vector_store = open_collection(session_id)

    chunk_ids = [chunk.metadata["id"] for chunk in chunks]

    vector_store.add_documents(chunks, ids=chunk_ids)
    print(
        f"Successfully ingested {len(chunks)} chunks into isolated collection: "
        f"{collection_name(session_id)}"
    )

    return len(pdf_list), "\n".join(page.page_content for page in pdf_list)


def load_pdf(path: str):
    loader = PyPDFLoader(path)
    return loader.load()


def create_chunks(docs: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)

    chunks = text_splitter.split_documents(docs)
    print(f"Created {len(chunks)} chunks from {len(docs)} documents")

    return chunks
