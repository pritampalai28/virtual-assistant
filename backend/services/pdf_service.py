import io
from PyPDF2 import PdfReader


def extract_pdf_text(file_content: bytes) -> dict:
    """
    Extract text content from a PDF file.
    
    Args:
        file_content: Raw bytes of the PDF file
        
    Returns:
        dict with success status and extracted text
    """
    
    try:
        # Create a file-like object from bytes
        pdf_file = io.BytesIO(file_content)
        
        # Read PDF
        reader = PdfReader(pdf_file)
        
        # Extract text from all pages
        text_content = []
        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text_content.append(f"--- Page {page_num + 1} ---\n{page_text}")
        
        full_text = '\n\n'.join(text_content)
        
        # Get metadata
        metadata = {
            "num_pages": len(reader.pages),
            "title": reader.metadata.title if reader.metadata else None,
            "author": reader.metadata.author if reader.metadata else None
        }
        
        return {
            "success": True,
            "data": {
                "content": full_text[:20000],  # Limit content size
                "metadata": metadata,
                "source_type": "pdf"
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to extract PDF content: {str(e)}"
        }
