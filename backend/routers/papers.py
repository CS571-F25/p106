from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
from database import get_supabase
from routers.auth import get_current_user
import httpx
import re
import PyPDF2
import io

router = APIRouter()

class PaperCreate(BaseModel):
    project_id: str
    doi: Optional[str] = None
    arxiv_id: Optional[str] = None
    title: Optional[str] = None
    abstract: Optional[str] = None
    authors: Optional[str] = None
    year: Optional[int] = None

class PaperResponse(BaseModel):
    id: str
    project_id: str
    title: str
    abstract: Optional[str]
    authors: Optional[str]
    doi: Optional[str]
    arxiv_id: Optional[str]
    year: Optional[int]
    embedding: Optional[List[float]]
    cluster_id: Optional[int]

def extract_arxiv_id(url_or_id: str) -> str:
    # Clean the input
    url_or_id = url_or_id.strip()
    
    patterns = [
        r'arxiv\.org/abs/(\d+\.\d+v?\d*)',
        r'arxiv\.org/pdf/(\d+\.\d+v?\d*)',
        r'^(\d+\.\d+v?\d*)$',
        # Also support old-style arXiv IDs like hep-th/9901001
        r'arxiv\.org/abs/([a-z-]+/\d+)',
        r'^([a-z-]+/\d+)$'
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_id, re.IGNORECASE)
        if match:
            return match.group(1)
    return url_or_id

def extract_doi(url_or_doi: str) -> str:
    patterns = [
        r'doi\.org/(10\.\d+/[^\s]+)',
        r'^(10\.\d+/[^\s]+)$'
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_doi)
        if match:
            return match.group(1)
    return url_or_doi

async def fetch_arxiv_metadata(arxiv_id: str) -> dict:
    url = f"http://export.arxiv.org/api/query?id_list={arxiv_id}"
    print(f"Fetching arXiv metadata for: {arxiv_id}")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            print(f"arXiv response status: {response.status_code}")
            if response.status_code == 200:
                import xml.etree.ElementTree as ET
                root = ET.fromstring(response.text)
                ns = {'atom': 'http://www.w3.org/2005/Atom'}
                entry = root.find('atom:entry', ns)
                if entry:
                    title_elem = entry.find('atom:title', ns)
                    abstract_elem = entry.find('atom:summary', ns)
                    authors = entry.findall('atom:author/atom:name', ns)
                    published = entry.find('atom:published', ns)
                    
                    title = title_elem.text.strip().replace('\n', ' ') if title_elem is not None and title_elem.text else None
                    abstract = abstract_elem.text.strip().replace('\n', ' ') if abstract_elem is not None and abstract_elem.text else None
                    
                    result = {
                        'title': title,
                        'abstract': abstract,
                        'authors': ', '.join([a.text for a in authors if a.text]) if authors else None,
                        'year': int(published.text[:4]) if published is not None and published.text else None
                    }
                    print(f"arXiv metadata fetched: {result.get('title', 'No title')[:50]}")
                    return result
                else:
                    print("No entry found in arXiv response")
    except Exception as e:
        print(f"Error fetching arXiv metadata: {e}")
    return {}

async def fetch_semantic_scholar_metadata(doi: str) -> dict:
    url = f"https://api.semanticscholar.org/graph/v1/paper/{doi}?fields=title,abstract,authors,year"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            authors = data.get('authors', [])
            return {
                'title': data.get('title'),
                'abstract': data.get('abstract'),
                'authors': ', '.join([a.get('name', '') for a in authors]) if authors else None,
                'year': data.get('year')
            }
    return {}

def clean_abstract_text(text: str) -> str:
    """Thoroughly clean up extracted abstract text."""
    import re
    
    if not text:
        return ""
    
    # Remove arXiv identifiers and dates
    text = re.sub(r'arXiv:[^\s]+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}', '', text, flags=re.IGNORECASE)
    
    # Remove email addresses
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '', text)
    
    # Remove section markers like "§"
    text = re.sub(r'§[^\s]*', '', text)
    
    # Remove "Contents" section and everything after
    contents_match = re.search(r'\bcontents\b', text, re.IGNORECASE)
    if contents_match:
        text = text[:contents_match.start()]
    
    # Remove numbered sections like "1 Introduction", "2.1 Methods"
    text = re.sub(r'\n\s*\d+\.?\d*\s+[A-Z][a-z]+.*', '', text)
    
    # Remove page numbers
    text = re.sub(r'\b\d+\s*$', '', text, flags=re.MULTILINE)
    
    # Remove institution/address lines (contain "University", "Institut", postal codes)
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        line_stripped = line.strip()
        # Skip lines that look like addresses or affiliations
        if re.search(r'(University|Institut|Department|Postfach|D-\d{5}|\d{5}\s+[A-Z])', line_stripped, re.IGNORECASE):
            continue
        # Skip lines that are just author names (short, title case, possibly with commas)
        if len(line_stripped) < 50 and re.match(r'^[A-Z][a-z]+(\s+[A-Z]\.?\s*)*[A-Z][a-z]+\s*,?$', line_stripped):
            continue
        # Skip lines with "correspondence" or "address"
        if re.search(r'(correspondence|address|email)', line_stripped, re.IGNORECASE):
            continue
        cleaned_lines.append(line)
    text = '\n'.join(cleaned_lines)
    
    # Fix hyphenated words split across lines (e.g., "inter-\nest" -> "interest")
    text = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', text)
    
    # Fix spacing issues from PDF extraction
    # Remove single character followed by space that's likely a broken word
    text = re.sub(r'\b([a-z])\s+([a-z]{1,2})\s+([a-z])', r'\1\2\3', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove any remaining "Abstract." or "Abstract:" at the start
    text = re.sub(r'^abstract[\s.:]+', '', text, flags=re.IGNORECASE)
    
    # Trim and clean up
    text = text.strip()
    
    # Remove trailing incomplete sentences (end mid-word or with weird chars)
    if text and not text[-1] in '.!?"\'':
        # Find last complete sentence
        last_period = text.rfind('.')
        if last_period > len(text) * 0.5:  # Only trim if we're keeping most of it
            text = text[:last_period + 1]
    
    return text

def extract_abstract_from_text(text: str) -> str:
    """Extract ONLY the abstract section from paper text."""
    import re
    
    if not text:
        return None
    
    # Find where "Abstract" starts
    abstract_match = re.search(r'\babstract\b[\s.:]*', text, re.IGNORECASE)
    
    if not abstract_match:
        return None
    
    # Start right after "Abstract"
    start_pos = abstract_match.end()
    
    # Find where abstract ends - look for common section headers
    remaining_text = text[start_pos:]
    
    end_markers = [
        r'\b(introduction|keywords|key\s*words|contents|1\s+introduction|1\.\s*introduction|i\.\s*introduction)\b',
        r'\n\s*\d+\s*\n',  # Page numbers
        r'\bCONTENTS\b',
        r'\n\s*1\s+[A-Z]',  # Section 1 starting
    ]
    
    end_pos = len(remaining_text)
    for marker in end_markers:
        match = re.search(marker, remaining_text, re.IGNORECASE)
        if match and match.start() < end_pos:
            end_pos = match.start()
    
    abstract = remaining_text[:end_pos]
    
    # Clean it up
    abstract = clean_abstract_text(abstract)
    
    # If abstract is too short, it probably failed
    if len(abstract) < 100:
        return None
    
    # If abstract is too long, truncate at a sentence boundary
    if len(abstract) > 2000:
        # Find a good breaking point
        truncated = abstract[:2000]
        last_period = truncated.rfind('.')
        if last_period > 1000:
            abstract = truncated[:last_period + 1]
        else:
            abstract = truncated
    
    return abstract

def extract_title_from_text(text: str) -> str:
    """Extract the paper title from the text."""
    import re
    
    if not text:
        return None
    
    lines = text.strip().split('\n')
    
    for line in lines[:15]:  # Check first 15 lines
        line = line.strip()
        
        # Skip empty lines
        if not line:
            continue
        
        # Skip arXiv identifiers
        if re.match(r'^arXiv:', line, re.IGNORECASE):
            continue
        
        # Skip dates
        if re.match(r'^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', line, re.IGNORECASE):
            continue
        
        # Skip lines with email
        if '@' in line:
            continue
        
        # Skip very short lines
        if len(line) < 10:
            continue
        
        # Skip lines that look like author names (short, mostly proper nouns)
        if len(line) < 40 and re.match(r'^[A-Z][a-z]+\s+[A-Z]', line):
            words = line.split()
            if len(words) <= 4:
                continue
        
        # Skip institution lines
        if re.search(r'(University|Institut|Department)', line, re.IGNORECASE):
            continue
        
        # Skip lines starting with section markers
        if line.startswith('§'):
            continue
        
        # This looks like a title!
        # Clean it up
        title = re.sub(r'\s+', ' ', line).strip()
        return title
    
    return None

def extract_text_from_pdf(file_content: bytes) -> dict:
    """Extract title and abstract from PDF."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        
        # Extract text from first 2 pages (abstract is usually on first page)
        full_text = ""
        for page in pdf_reader.pages[:2]:
            page_text = page.extract_text() or ""
            full_text += page_text + "\n"
        
        if not full_text.strip():
            return {"title": None, "abstract": None}
        
        # Extract title and abstract
        title = extract_title_from_text(full_text)
        abstract = extract_abstract_from_text(full_text)
        
        print(f"Extracted title: {title[:50] if title else 'None'}...")
        print(f"Extracted abstract length: {len(abstract) if abstract else 0}")
        
        return {
            "title": title,
            "abstract": abstract
        }
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return {"title": None, "abstract": None}

@router.get("/{project_id}")
async def list_papers(project_id: str, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        # Verify project belongs to user
        project = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
        if not project.data or len(project.data) == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        response = supabase.table("papers").select("*").eq("project_id", project_id).order("created_at", desc=True).execute()
        return {"papers": response.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_paper(
    project_id: str = Form(...),
    input_type: str = Form(...),  # 'doi', 'arxiv', 'pdf', 'manual'
    input_value: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    abstract: Optional[str] = Form(None),
    authors: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    authorization: str = Header(None)
):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    # Verify project belongs to user
    project = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not project.data or len(project.data) == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    paper_data = {
        "project_id": project_id,
        "title": title,
        "abstract": abstract,
        "authors": authors,
        "year": year
    }
    
    try:
        if input_type == "arxiv" and input_value:
            arxiv_id = extract_arxiv_id(input_value)
            metadata = await fetch_arxiv_metadata(arxiv_id)
            paper_data.update({
                "arxiv_id": arxiv_id,
                "title": metadata.get('title') or title,
                "abstract": metadata.get('abstract') or abstract,
                "authors": metadata.get('authors') or authors,
                "year": metadata.get('year') or year
            })
        
        elif input_type == "doi" and input_value:
            doi = extract_doi(input_value)
            metadata = await fetch_semantic_scholar_metadata(doi)
            paper_data.update({
                "doi": doi,
                "title": metadata.get('title') or title,
                "abstract": metadata.get('abstract') or abstract,
                "authors": metadata.get('authors') or authors,
                "year": metadata.get('year') or year
            })
        
        elif input_type == "pdf" and file:
            content = await file.read()
            extracted = extract_text_from_pdf(content)
            
            # Use extracted title if no title provided, fallback to filename
            extracted_title = extracted.get("title")
            final_title = title or extracted_title or file.filename.replace('.pdf', '').replace('_', ' ')
            
            # Use extracted abstract
            extracted_abstract = extracted.get("abstract")
            
            paper_data.update({
                "title": final_title,
                "abstract": abstract or extracted_abstract
            })
        
        # Ensure we have at least a title
        if not paper_data.get("title"):
            paper_data["title"] = "Untitled Paper"
        
        response = supabase.table("papers").insert(paper_data).execute()
        return {"paper": response.data[0]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{paper_id}")
async def delete_paper(paper_id: str, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        # Get paper and verify ownership through project
        paper = supabase.table("papers").select("*, projects(user_id)").eq("id", paper_id).execute()
        if not paper.data or len(paper.data) == 0:
            raise HTTPException(status_code=404, detail="Paper not found")
        
        paper_data = paper.data[0]
        if paper_data.get('projects', {}).get('user_id') != user.id:
            raise HTTPException(status_code=404, detail="Paper not found")
        
        supabase.table("papers").delete().eq("id", paper_id).execute()
        return {"message": "Paper deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

