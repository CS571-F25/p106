from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import auth, projects, papers, clustering

app = FastAPI(title="Braindump API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(papers.router, prefix="/api/papers", tags=["Papers"])
app.include_router(clustering.router, prefix="/api", tags=["Clustering"])

@app.get("/")
def root():
    return {"message": "Braindump API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

