# Braindump

A research paper organization tool that uses AI to automatically cluster and visualize connections between academic papers.

## Overview

Researchers accumulate papers faster than they can organize them. Braindump solves this by analyzing the semantic content of uploaded papers and automatically grouping related work together. The result is an interactive concept map that reveals how your papers connect to each other, surfacing relationships you might have missed.

## The Core Idea

The workflow is simple:

**Upload** your papers as PDFs. The system extracts the abstract from each document, since abstracts capture the essence of a paper in a compact form.

**Embed** each abstract into a high-dimensional vector space using a sentence transformer model. Papers with similar meanings end up with similar vectors, even if they use different terminology.

**Cluster** the papers by grouping vectors that are close together. The algorithm automatically determines the optimal number of clusters based on how cleanly the papers separate.

**Visualize** the results as an interactive graph. Similar papers appear closer together, and lines connect papers that share strong semantic overlap.

## How Clustering Works

Each paper's abstract is converted into a 384-dimensional embedding vector. These vectors capture semantic meaning, so two papers discussing the same concepts will have similar vectors regardless of the specific words used.

The clustering algorithm groups papers with nearby vectors. Rather than requiring you to specify how many clusters to create, the system tests different values and picks the one that produces the cleanest separation. This is measured using silhouette analysis, which scores how well each paper fits its assigned cluster versus neighboring clusters.

For visualization, the high-dimensional vectors are projected down to 2D using UMAP, which preserves both local neighborhoods and global structure. Papers that were close in 384 dimensions remain close on the screen.

## Tech Stack

**Frontend**: React with Vite, using D3.js for the interactive graph visualization and React Bootstrap for the interface.

**Backend**: FastAPI serving a REST API. Paper processing uses PyPDF2 for text extraction, Sentence Transformers for embeddings, scikit-learn for clustering, and UMAP for dimensionality reduction.

**Database**: Supabase providing PostgreSQL storage with row-level security for user data isolation.

## Architecture

```
PDF Upload
    |
    v
Text Extraction (PyPDF2)
    |
    v
Abstract Isolation
    |
    v
Embedding Generation (all-MiniLM-L6-v2)
    |
    v
K-Means Clustering (with silhouette optimization)
    |
    v
UMAP Projection (384D -> 2D)
    |
    v
Interactive Graph (D3.js)
```

## Features

- Upload research papers as PDF files with automatic text and metadata extraction
- AI-powered clustering that groups papers by semantic similarity
- Interactive concept map visualization with zoom and pan
- Multiple projects for organizing different research areas
- Automatic cluster naming with manual override option
- Paper detail view showing abstract, authors, and cluster assignment

## Limitations

- Works best with text-based PDFs rather than scanned documents
- The embedding model is optimized for English language content
- Requires at least two papers to perform clustering
- Very short or malformed abstracts may not cluster effectively
