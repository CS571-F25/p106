import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// SVG Icons
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ServerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const CpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

function AboutMe() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const techStack = [
    { name: 'React', category: 'Frontend', color: '#61DAFB' },
    { name: 'Vite', category: 'Frontend', color: '#646CFF' },
    { name: 'D3.js', category: 'Frontend', color: '#F9A03C' },
    { name: 'Bootstrap', category: 'Frontend', color: '#7952B3' },
    { name: 'FastAPI', category: 'Backend', color: '#009688' },
    { name: 'Python', category: 'Backend', color: '#3776AB' },
    { name: 'Supabase', category: 'Database', color: '#3ECF8E' },
    { name: 'PostgreSQL', category: 'Database', color: '#336791' },
    { name: 'Sentence Transformers', category: 'ML', color: '#FF6F00' },
    { name: 'scikit-learn', category: 'ML', color: '#F7931E' },
    { name: 'UMAP', category: 'ML', color: '#E91E63' },
    { name: 'Groq', category: 'AI', color: '#8B7355' },
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF7F2 0%, #E8DCC8 50%, #D4C4A8 100%)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,115,85,0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite'
        }} />

        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 
                className="animate-fade-in-up"
                style={{ fontSize: '3rem', marginBottom: '1.5rem' }}
              >
                About <span style={{ color: 'var(--color-primary)' }}>Braindump</span>
              </h1>
              <p 
                className="animate-fade-in-up delay-200"
                style={{ 
                  fontSize: '1.2rem', 
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.7,
                  maxWidth: '650px'
                }}
              >
                Braindump was created to solve a common problem faced by researchers: 
                making sense of a growing pile of papers. By combining modern NLP techniques 
                with intuitive visualization, we help you discover connections you might have missed.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* How It Works - Technical */}
      <Container style={{ padding: '4rem 0' }}>
        <div className="text-center mb-5 scroll-animate">
          <h2 style={{ marginBottom: '1rem' }}>Under the Hood</h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            A look at the technology powering Braindump
          </p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card className="h-100 scroll-animate" style={{ transitionDelay: '0s' }}>
              <Card.Body className="text-center p-4">
                <div 
                  style={{ 
                    width: 60, height: 60, borderRadius: 12,
                    background: 'linear-gradient(135deg, #E8F5F2 0%, #B8D8D0 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', color: '#2D5A4A'
                  }}
                  aria-label="Frontend code icon"
                  role="img"
                >
                  <CodeIcon aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>Frontend</h3>
                <p className="text-muted small mb-0">
                  React with Vite for blazing fast development. D3.js powers our interactive visualizations.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 scroll-animate" style={{ transitionDelay: '0.1s' }}>
              <Card.Body className="text-center p-4">
                <div 
                  style={{ 
                    width: 60, height: 60, borderRadius: 12,
                    background: 'linear-gradient(135deg, #E8EAF6 0%, #9FA8DA 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', color: '#3D47A3'
                  }}
                  aria-label="Backend server icon"
                  role="img"
                >
                  <ServerIcon aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>Backend</h3>
                <p className="text-muted small mb-0">
                  FastAPI (Python) handles requests with async speed. Clean REST API architecture.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 scroll-animate" style={{ transitionDelay: '0.2s' }}>
              <Card.Body className="text-center p-4">
                <div 
                  style={{ 
                    width: 60, height: 60, borderRadius: 12,
                    background: 'linear-gradient(135deg, #FFF8E1 0%, #FFCC80 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', color: '#E65100'
                  }}
                  aria-label="Database icon"
                  role="img"
                >
                  <DatabaseIcon aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>Database</h3>
                <p className="text-muted small mb-0">
                  Supabase provides PostgreSQL with real-time capabilities and built-in auth.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 scroll-animate" style={{ transitionDelay: '0.3s' }}>
              <Card.Body className="text-center p-4">
                <div 
                  style={{ 
                    width: 60, height: 60, borderRadius: 12,
                    background: 'linear-gradient(135deg, #FCE4EC 0%, #F48FB1 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', color: '#AD1457'
                  }}
                  aria-label="Machine learning and AI icon"
                  role="img"
                >
                  <CpuIcon aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>ML/AI</h3>
                <p className="text-muted small mb-0">
                  Sentence Transformers generate embeddings. K-Means & UMAP for clustering and projection.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Tech Stack Pills */}
      <div style={{ 
        background: 'linear-gradient(180deg, #F5F2ED 0%, #FAF7F2 100%)',
        padding: '4rem 0'
      }}>
        <Container>
          <div className="text-center mb-4 scroll-animate">
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Tech Stack</h2>
            <p className="text-muted">The building blocks of Braindump</p>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 scroll-animate" style={{ maxWidth: 700, margin: '0 auto' }}>
            {techStack.map((tech, index) => (
              <span
                key={tech.name}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  background: `${tech.color}15`,
                  border: `1px solid ${tech.color}30`,
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                  animationDelay: `${index * 0.05}s`
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${tech.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: tech.color
                }} />
                {tech.name}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* Algorithm Section */}
      <Container style={{ padding: '4rem 0' }}>
        <Row className="align-items-center">
          <Col lg={6} className="scroll-animate-left">
            <h2 style={{ marginBottom: '1.5rem' }}>The Algorithm</h2>
            <div className="mb-4">
              <h3 style={{ color: 'var(--color-primary)', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem' }}>
                1. Text Extraction
              </h3>
              <p className="text-muted">
                We extract text from your PDFs using PyPDF2, then clean and isolate abstracts using 
                pattern matching and heuristics.
              </p>
            </div>
            <div className="mb-4">
              <h3 style={{ color: 'var(--color-primary)', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem' }}>
                2. Semantic Embeddings
              </h3>
              <p className="text-muted">
                Each paper's abstract is converted to a 384-dimensional vector using the 
                all-MiniLM-L6-v2 sentence transformer model.
              </p>
            </div>
            <div className="mb-4">
              <h3 style={{ color: 'var(--color-primary)', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem' }}>
                3. Clustering
              </h3>
              <p className="text-muted">
                K-Means clustering groups papers by semantic similarity. We automatically 
                determine the optimal number of clusters using silhouette analysis.
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-primary)', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem' }}>
                4. Visualization
              </h3>
              <p className="text-muted">
                UMAP projects high-dimensional embeddings to 2D while preserving local structure, 
                creating meaningful spatial relationships on the map.
              </p>
            </div>
          </Col>
          <Col lg={6} className="d-none d-lg-block scroll-animate-right">
            <div style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
            }}>
              <svg 
                viewBox="0 0 300 250" 
                style={{ width: '100%' }}
                aria-label="Algorithm flow diagram showing the process from PDF upload through text extraction, semantic embedding, K-Means clustering, UMAP projection, to final graph visualization"
                role="img"
              >
                <title>Algorithm Flow: PDF → Embedding → Clustering → Visualization</title>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#8B7355" />
                  </marker>
                </defs>
                
                {/* PDF Box */}
                <rect x="20" y="20" width="80" height="50" rx="8" fill="#E8DCC8" stroke="#8B7355" strokeWidth="2"/>
                <text x="60" y="50" textAnchor="middle" fill="#3D3229" fontSize="12" fontWeight="500">PDF</text>
                
                {/* Arrow 1 */}
                <line x1="100" y1="45" x2="130" y2="45" stroke="#8B7355" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Embedding Box */}
                <rect x="140" y="20" width="80" height="50" rx="8" fill="#E8F5E9" stroke="#7A9E7E" strokeWidth="2"/>
                <text x="180" y="50" textAnchor="middle" fill="#2D4A35" fontSize="12" fontWeight="500">Embed</text>
                
                {/* Arrow 2 */}
                <line x1="220" y1="45" x2="250" y2="45" stroke="#7A9E7E" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Vector visualization */}
                <rect x="260" y="15" width="30" height="60" rx="4" fill="#F5F5F5" stroke="#999" strokeWidth="1"/>
                <rect x="265" y="20" width="20" height="4" fill="#7A9E7E"/>
                <rect x="265" y="28" width="15" height="4" fill="#9B8AA6"/>
                <rect x="265" y="36" width="18" height="4" fill="#C4A77D"/>
                <rect x="265" y="44" width="12" height="4" fill="#6B8E9F"/>
                <rect x="265" y="52" width="20" height="4" fill="#B8877A"/>
                <rect x="265" y="60" width="10" height="4" fill="#8FA87A"/>
                
                {/* Arrow down */}
                <line x1="275" y1="85" x2="275" y2="110" stroke="#9B8AA6" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* K-Means Box */}
                <rect x="230" y="120" width="90" height="50" rx="8" fill="#EDE7F6" stroke="#9B8AA6" strokeWidth="2"/>
                <text x="275" y="150" textAnchor="middle" fill="#4A3D5C" fontSize="12" fontWeight="500">K-Means</text>
                
                {/* Arrow left */}
                <line x1="220" y1="145" x2="190" y2="145" stroke="#6B8E9F" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* UMAP Box */}
                <rect x="100" y="120" width="80" height="50" rx="8" fill="#E3F2FD" stroke="#6B8E9F" strokeWidth="2"/>
                <text x="140" y="150" textAnchor="middle" fill="#1565C0" fontSize="12" fontWeight="500">UMAP</text>
                
                {/* Arrow down */}
                <line x1="140" y1="180" x2="140" y2="205" stroke="#C49A6C" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Graph visualization */}
                <circle cx="100" cy="225" r="12" fill="#C4A77D"/>
                <circle cx="130" cy="230" r="8" fill="#7A9E7E"/>
                <circle cx="155" cy="220" r="10" fill="#9B8AA6"/>
                <circle cx="180" cy="228" r="9" fill="#6B8E9F"/>
                <line x1="100" y1="225" x2="130" y2="230" stroke="#8B7355" strokeWidth="1" opacity="0.5"/>
                <line x1="130" y1="230" x2="155" y2="220" stroke="#8B7355" strokeWidth="1" opacity="0.5"/>
                <line x1="155" y1="220" x2="180" y2="228" stroke="#8B7355" strokeWidth="1" opacity="0.5"/>
              </svg>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer CTA */}
      <div style={{ 
        background: 'var(--color-bg-dark)', 
        padding: '4rem 0'
      }}>
        <Container className="text-center scroll-animate">
          <h2 style={{ color: 'var(--color-accent-light)', marginBottom: '1rem', fontSize: '1.5rem' }}>
            Built for Researchers
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto' }}>
            Braindump is a project developed as part of CS571 coursework, 
            designed to help researchers organize their literature more effectively.
          </p>
        </Container>
      </div>
    </div>
  );
}

export default AboutMe;
