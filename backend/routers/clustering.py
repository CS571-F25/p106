from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from database import get_supabase
from routers.auth import get_current_user
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import os
import requests
import hashlib

router = APIRouter()

HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

def generate_simple_embedding(text: str, dim: int = 384) -> List[float]:
    """Fallback: Generate simple hash-based embedding when HF API fails."""
    import re
    from collections import Counter
    
    # Tokenize and normalize
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    word_counts = Counter(words)
    
    # Create a hash-based feature vector
    embedding = [0.0] * dim
    for word, count in word_counts.items():
        # Hash word to a position in the vector
        hash_val = int(hashlib.md5(word.encode()).hexdigest(), 16)
        idx = hash_val % dim
        # Add weighted count (log scale to reduce impact of very common words)
        embedding[idx] += np.log1p(count)
    
    # Normalize
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = [x / norm for x in embedding]
    
    return embedding

def generate_embedding(text: str) -> List[float]:
    """Generate embeddings using Hugging Face Inference API (free), with fallback."""
    if not text or len(text.strip()) < 10:
        print(f"Text too short for embedding: {len(text) if text else 0} chars")
        return None
    
    hf_token = os.getenv("HF_TOKEN", "")
    headers = {"Authorization": f"Bearer {hf_token}"} if hf_token else {}
    
    # Try HuggingFace API first
    try:
        response = requests.post(
            HF_API_URL,
            headers=headers,
            json={"inputs": text, "options": {"wait_for_model": True}},
            timeout=30
        )
        
        if response.status_code == 200:
            embedding = response.json()
            if isinstance(embedding, list) and len(embedding) > 0:
                if isinstance(embedding[0], list):
                    result = embedding[0]
                else:
                    result = embedding
                
                if isinstance(result, list) and len(result) > 0:
                    print(f"✓ HF API embedding: {len(result)} dimensions")
                    return result
        
        print(f"HF API error {response.status_code}: {response.text[:200]}")
        
        # If model is loading (503), wait and retry once
        if response.status_code == 503:
            import time
            print("Model loading, waiting 15 seconds...")
            time.sleep(15)
            response = requests.post(
                HF_API_URL,
                headers=headers,
                json={"inputs": text, "options": {"wait_for_model": True}},
                timeout=30
            )
            if response.status_code == 200:
                embedding = response.json()
                if isinstance(embedding, list) and len(embedding) > 0:
                    if isinstance(embedding[0], list):
                        print(f"✓ HF API embedding (retry): {len(embedding[0])} dimensions")
                        return embedding[0]
                    print(f"✓ HF API embedding (retry): {len(embedding)} dimensions")
                    return embedding
        
    except requests.exceptions.Timeout:
        print("HF API timeout - using fallback embedding")
    except Exception as e:
        print(f"HF API error ({type(e).__name__}): {e} - using fallback embedding")
    
    # Fallback to simple embedding
    print("Using fallback hash-based embedding")
    return generate_simple_embedding(text)

def compute_2d_projection(embeddings: np.ndarray) -> np.ndarray:
    """Project high-dimensional embeddings to 2D using PCA."""
    from sklearn.decomposition import PCA
    
    n_samples = len(embeddings)
    
    if n_samples <= 2:
        positions = np.zeros((n_samples, 2))
        for i in range(n_samples):
            positions[i] = [i * 200 + 100, 250]
        return positions
    
    try:
        if np.allclose(embeddings, embeddings[0]):
            positions = np.zeros((n_samples, 2))
            for i in range(n_samples):
                angle = 2 * np.pi * i / n_samples
                positions[i] = [300 + 200 * np.cos(angle), 300 + 200 * np.sin(angle)]
            return positions
        
        n_components = min(2, n_samples - 1, embeddings.shape[1])
        pca = PCA(n_components=n_components)
        result = pca.fit_transform(embeddings)
        
        if result.shape[1] == 1:
            result = np.column_stack([result, np.zeros(n_samples)])
        
        return result
    except Exception as e:
        print(f"PCA error: {e}")
        positions = np.zeros((n_samples, 2))
        cols = int(np.ceil(np.sqrt(n_samples)))
        for i in range(n_samples):
            positions[i] = [(i % cols) * 150 + 100, (i // cols) * 150 + 100]
        return positions

def extract_keywords_from_papers(papers: List[dict]) -> List[str]:
    """Extract common keywords from paper titles and abstracts."""
    import re
    from collections import Counter
    
    # Common stopwords to ignore
    stopwords = set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
        'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom',
        'their', 'its', 'our', 'your', 'his', 'her', 'my', 'more', 'most', 'other',
        'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too', 'very',
        'just', 'also', 'now', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
        'each', 'every', 'both', 'few', 'many', 'much', 'any', 'between', 'into',
        'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out',
        'off', 'over', 'under', 'again', 'further', 'then', 'once', 'paper', 'study',
        'research', 'results', 'method', 'methods', 'approach', 'using', 'based', 'new',
        'show', 'shows', 'shown', 'present', 'presents', 'proposed', 'propose', 'use',
        'used', 'using', 'however', 'although', 'while', 'since', 'because', 'therefore',
        'thus', 'hence', 'moreover', 'furthermore', 'nevertheless', 'nonetheless',
        'work', 'works', 'article', 'review', 'introduction', 'conclusion', 'abstract'
    ])
    
    words = Counter()
    
    for paper in papers:
        text = f"{paper.get('title', '')} {paper.get('abstract', '')}"
        # Extract words (2+ chars, alphabetic)
        found_words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        for word in found_words:
            if word not in stopwords:
                words[word] += 1
    
    # Get most common words that appear in multiple papers
    common_words = [word for word, count in words.most_common(20) if count >= max(1, len(papers) // 2)]
    
    return common_words[:5]

def generate_cluster_name_from_keywords(keywords: List[str]) -> str:
    """Generate a readable cluster name from keywords."""
    if not keywords:
        return "General Research"
    
    # Capitalize and join
    capitalized = [k.capitalize() for k in keywords[:3]]
    return " & ".join(capitalized)

async def generate_cluster_summary(papers_in_cluster: List[dict]) -> str:
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    # First try Groq API if available
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        try:
            from groq import Groq
            client = Groq(api_key=groq_api_key)
            
            # Prepare context from papers
            context = ""
            for p in papers_in_cluster[:5]:
                context += f"Title: {p.get('title', 'N/A')}\n"
                if p.get('abstract'):
                    context += f"Abstract: {p.get('abstract', '')[:300]}\n\n"
            
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a research assistant. Given research paper titles and abstracts, provide a SHORT label (3-6 words max) that describes the main topic. Just the label, no explanation. Examples: 'Machine Learning in Healthcare', 'Quantum Computing Theory', 'Natural Language Processing'."
                    },
                    {
                        "role": "user",
                        "content": f"What is the main topic of these papers? Give a short label:\n\n{context}"
                    }
                ],
                max_tokens=30,
                temperature=0.3
            )
            
            summary = response.choices[0].message.content.strip()
            # Clean up any quotes or extra punctuation
            summary = summary.strip('"\'')
            return summary
        except Exception as e:
            print(f"Groq API error: {e}")
    
    # Fallback: generate name from extracted keywords
    keywords = extract_keywords_from_papers(papers_in_cluster)
    return generate_cluster_name_from_keywords(keywords)

@router.post("/cluster/{project_id}")
async def cluster_papers(project_id: str, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    # Verify project ownership
    project = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not project.data or len(project.data) == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get all papers in project
    papers_response = supabase.table("papers").select("*").eq("project_id", project_id).execute()
    papers = papers_response.data
    
    if len(papers) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 papers to cluster")
    
    # Generate embeddings for papers that don't have them
    updated_papers = []
    failed_papers = []
    
    for paper in papers:
        if not paper.get('embedding'):
            title = paper.get('title', '') or ''
            abstract = paper.get('abstract', '') or ''
            text = f"{title} {abstract}".strip()
            
            if not text or len(text) < 10:
                print(f"Paper {paper.get('id', 'unknown')} has no text content (title: {len(title)} chars, abstract: {len(abstract)} chars)")
                failed_papers.append(paper.get('title', 'Untitled'))
                continue
            
            print(f"Generating embedding for paper: {paper.get('title', 'Untitled')[:50]}...")
            embedding = generate_embedding(text)
            
            if embedding and len(embedding) > 0:
                try:
                    supabase.table("papers").update({"embedding": embedding}).eq("id", paper['id']).execute()
                    paper['embedding'] = embedding
                    print(f"✓ Embedding saved for: {paper.get('title', 'Untitled')[:50]}")
                except Exception as e:
                    print(f"✗ Failed to save embedding: {e}")
                    failed_papers.append(paper.get('title', 'Untitled'))
            else:
                print(f"✗ Failed to generate embedding for: {paper.get('title', 'Untitled')[:50]}")
                failed_papers.append(paper.get('title', 'Untitled'))
        
        updated_papers.append(paper)
    
    # Filter papers with embeddings
    papers_with_embeddings = [p for p in updated_papers if p.get('embedding')]
    
    print(f"Total papers: {len(papers)}, Papers with embeddings: {len(papers_with_embeddings)}")
    
    if len(papers_with_embeddings) < 2:
        error_msg = f"Not enough papers with text content to cluster. Only {len(papers_with_embeddings)} out of {len(papers)} papers have embeddings."
        if failed_papers:
            error_msg += f" Failed papers: {', '.join(failed_papers[:5])}"
        raise HTTPException(status_code=400, detail=error_msg)
    
    embeddings = np.array([p['embedding'] for p in papers_with_embeddings])
    n_papers = len(papers_with_embeddings)
    
    # Find optimal number of clusters using silhouette score
    from sklearn.metrics import silhouette_score
    
    def find_optimal_clusters(embeddings, max_clusters=8):
        """Find the optimal number of clusters using silhouette score."""
        n_samples = len(embeddings)
        
        # Can't cluster if too few samples
        if n_samples < 2:
            return 1, np.zeros(n_samples, dtype=int)
        
        # If only 2 samples, either 1 or 2 clusters
        if n_samples == 2:
            # Check if they're similar enough to be in one cluster
            similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            if similarity > 0.7:  # High similarity = 1 cluster
                return 1, np.zeros(2, dtype=int)
            else:
                return 2, np.array([0, 1])
        
        # Try different numbers of clusters and find the best
        max_k = min(max_clusters, n_samples - 1)  # Can't have more clusters than samples-1
        best_score = -1
        best_k = 1
        best_labels = np.zeros(n_samples, dtype=int)
        
        for k in range(2, max_k + 1):
            try:
                kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
                labels = kmeans.fit_predict(embeddings)
                
                # Calculate silhouette score (higher is better, range -1 to 1)
                score = silhouette_score(embeddings, labels)
                print(f"  k={k}: silhouette score = {score:.3f}")
                
                if score > best_score:
                    best_score = score
                    best_k = k
                    best_labels = labels
            except Exception as e:
                print(f"  k={k}: error - {e}")
                continue
        
        # If best score is very low, maybe everything should be in one cluster
        if best_score < 0.1:
            print(f"  Low silhouette score ({best_score:.3f}), checking if 1 cluster is better...")
            # Check average pairwise similarity
            sim_matrix = cosine_similarity(embeddings)
            avg_similarity = (sim_matrix.sum() - n_samples) / (n_samples * (n_samples - 1))
            if avg_similarity > 0.6:  # All papers are quite similar
                print(f"  High average similarity ({avg_similarity:.3f}), using 1 cluster")
                return 1, np.zeros(n_samples, dtype=int)
        
        print(f"  Optimal: k={best_k} with score={best_score:.3f}")
        return best_k, best_labels
    
    # Find optimal clustering
    print(f"Finding optimal clusters for {n_papers} papers...")
    n_clusters, cluster_labels = find_optimal_clusters(embeddings)
    
    # Update papers with cluster IDs
    for i, paper in enumerate(papers_with_embeddings):
        cluster_id = int(cluster_labels[i])
        supabase.table("papers").update({"cluster_id": cluster_id}).eq("id", paper['id']).execute()
        paper['cluster_id'] = cluster_id
    
    # Generate cluster summaries
    cluster_summaries = {}
    for cluster_id in range(n_clusters):
        cluster_papers = [p for p in papers_with_embeddings if p.get('cluster_id') == cluster_id]
        if cluster_papers:
            summary = await generate_cluster_summary(cluster_papers)
            cluster_summaries[cluster_id] = summary
    
    return {
        "message": "Clustering complete",
        "n_clusters": n_clusters,
        "cluster_summaries": cluster_summaries,
        "papers_clustered": len(papers_with_embeddings)
    }

@router.get("/graph/{project_id}")
async def get_graph_data(project_id: str, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    # Verify project ownership
    project = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user.id).execute()
    if not project.data or len(project.data) == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get all papers with embeddings
    papers_response = supabase.table("papers").select("*").eq("project_id", project_id).execute()
    papers = papers_response.data
    
    # If no papers at all, return empty graph
    if not papers or len(papers) == 0:
        return {
            "nodes": [],
            "edges": [],
            "clusters": {}
        }
    
    papers_with_embeddings = [p for p in papers if p.get('embedding')]
    
    # If less than 2 papers with embeddings, show papers without clustering visualization
    if len(papers_with_embeddings) < 2:
        # Only show actual papers (not empty/fake nodes)
        nodes = []
        for i, p in enumerate(papers):
            if p.get('title') and p.get('title') != 'Untitled Paper':
                nodes.append({
                    "id": p['id'],
                    "title": p.get('title', 'Untitled'),
                    "abstract": p.get('abstract', ''),
                    "authors": p.get('authors', ''),
                    "year": p.get('year'),
                    "cluster_id": p.get('cluster_id', 0),
                    "x": 200 + (i % 3) * 200,
                    "y": 200 + (i // 3) * 150
                })
        return {
            "nodes": nodes,
            "edges": [],
            "clusters": {}
        }
    
    embeddings = np.array([p['embedding'] for p in papers_with_embeddings])
    
    # Compute 2D positions using PCA
    positions = compute_2d_projection(embeddings)
    
    # Normalize positions to a reasonable range
    positions = (positions - positions.min(axis=0)) / (positions.max(axis=0) - positions.min(axis=0) + 1e-6)
    positions = positions * 800 + 100  # Scale to 100-900 range
    
    # Build nodes
    nodes = []
    for i, paper in enumerate(papers_with_embeddings):
        nodes.append({
            "id": paper['id'],
            "title": paper.get('title', 'Untitled'),
            "abstract": paper.get('abstract', ''),
            "authors": paper.get('authors', ''),
            "year": paper.get('year'),
            "cluster_id": paper.get('cluster_id', 0),
            "x": float(positions[i][0]),
            "y": float(positions[i][1])
        })
    
    # Compute similarity edges
    similarity_matrix = cosine_similarity(embeddings)
    edges = []
    threshold = 0.3  # Lower threshold to show more connections
    
    for i in range(len(papers_with_embeddings)):
        for j in range(i + 1, len(papers_with_embeddings)):
            similarity = float(similarity_matrix[i][j])
            paper_i = papers_with_embeddings[i]
            paper_j = papers_with_embeddings[j]
            
            # Always connect papers in the same cluster, or if similarity is above threshold
            same_cluster = (paper_i.get('cluster_id') is not None and 
                          paper_i.get('cluster_id') == paper_j.get('cluster_id'))
            
            if similarity > threshold or same_cluster:
                edges.append({
                    "source": paper_i['id'],
                    "target": paper_j['id'],
                    "similarity": max(similarity, 0.4) if same_cluster else similarity
                })
    
    # Get cluster summaries
    clusters = {}
    unique_clusters = set(p.get('cluster_id') for p in papers_with_embeddings if p.get('cluster_id') is not None)
    for cluster_id in unique_clusters:
        cluster_papers = [p for p in papers_with_embeddings if p.get('cluster_id') == cluster_id]
        titles = [p.get('title', 'Untitled') for p in cluster_papers[:3]]
        clusters[cluster_id] = {
            "id": cluster_id,
            "paper_count": len(cluster_papers),
            "sample_titles": titles
        }
    
    return {
        "nodes": nodes,
        "edges": edges,
        "clusters": clusters
    }

