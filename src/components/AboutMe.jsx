import { Container, Card, Row, Col } from 'react-bootstrap';

function AboutMe() {
  return (
    <div style={{ minHeight: 'calc(100vh - 76px)', background: 'var(--color-bg)' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <h1 className="text-center mb-5">About Braindump</h1>
            
            <Card className="mb-4 border-0" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)' }}>
              <Card.Body className="p-4">
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-primary)' }}>
                  The Problem
                </h4>
                <p className="text-muted" style={{ lineHeight: 1.8 }}>
                  Researchers often accumulate dozens or hundreds of papers across different topics. 
                  Traditional tools like spreadsheets or reference managers help store papers but 
                  don't reveal the conceptual landscape of your literature. Understanding how papers 
                  relate to each other - finding clusters, themes, and gaps - remains a manual, 
                  time-consuming process.
                </p>
              </Card.Body>
            </Card>

            <Card className="mb-4 border-0" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)' }}>
              <Card.Body className="p-4">
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-primary)' }}>
                  Our Solution
                </h4>
                <p className="text-muted" style={{ lineHeight: 1.8 }}>
                  Braindump uses AI to analyze your research papers and automatically discover 
                  connections between them. By converting paper abstracts into semantic embeddings, 
                  we can compute similarity scores and group papers into meaningful clusters. 
                  The result is a beautiful, interactive concept map that lets you explore your 
                  literature visually.
                </p>
              </Card.Body>
            </Card>

            <Card className="mb-4 border-0" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)' }}>
              <Card.Body className="p-4">
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-primary)' }}>
                  How It Works
                </h4>
                <ol className="text-muted" style={{ lineHeight: 2 }}>
                  <li><strong>Upload PDFs</strong> - Add your research papers to a project</li>
                  <li><strong>AI Analysis</strong> - We extract text and generate semantic embeddings</li>
                  <li><strong>Clustering</strong> - Papers are grouped by conceptual similarity</li>
                  <li><strong>Visualization</strong> - Explore connections through an interactive graph</li>
                  <li><strong>Organization</strong> - Rename clusters, move papers, and refine your understanding</li>
                </ol>
              </Card.Body>
            </Card>

            <Card className="border-0" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)' }}>
              <Card.Body className="p-4">
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-primary)' }}>
                  Technology
                </h4>
                <p className="text-muted" style={{ lineHeight: 1.8 }}>
                  Built with React and D3.js on the frontend, FastAPI on the backend, and PostgreSQL 
                  via Supabase for data storage. Paper embeddings are generated using the 
                  sentence-transformers library (all-MiniLM-L6-v2 model), and clustering is performed 
                  using K-Means. The 2D visualization coordinates are computed using UMAP dimensionality 
                  reduction.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutMe;
