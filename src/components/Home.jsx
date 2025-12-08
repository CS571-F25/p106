import { useEffect, useRef } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
  </svg>
);

const NetworkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="3"></circle>
    <circle cx="5" cy="19" r="3"></circle>
    <circle cx="19" cy="19" r="3"></circle>
    <line x1="12" y1="8" x2="5" y2="16"></line>
    <line x1="12" y1="8" x2="19" y2="16"></line>
  </svg>
);

function Home() {
  const { isAuthenticated } = useAuth();
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ overflow: 'hidden' }}>
      <section aria-labelledby="hero-heading" style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #E8DCC8 50%, #D4C4A8 100%)', padding: '6rem 0 5rem', marginBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,167,125,0.2) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '10%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,115,85,0.15) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }} />
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 id="hero-heading" className="animate-fade-in-up" style={{ fontSize: '3.5rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                Organize Your Research,<br /><span style={{ color: 'var(--color-primary)' }}>Visually.</span>
              </h1>
              <p className="animate-fade-in-up delay-200" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '540px' }}>
                Braindump helps researchers make sense of their papers through AI-powered clustering and beautiful concept maps. Upload PDFs, discover connections, and organize your literature effortlessly.
              </p>
              <div className="animate-fade-in-up delay-300">
                {isAuthenticated ? (
                  <Link to="/dashboard"><Button variant="primary" size="lg" style={{ padding: '0.875rem 2.5rem', fontSize: '1.1rem' }} aria-label="Go to your dashboard">Go to Dashboard</Button></Link>
                ) : (
                  <Link to="/login"><Button variant="primary" size="lg" style={{ padding: '0.875rem 2.5rem', fontSize: '1.1rem' }} aria-label="Get started with Braindump for free">Get Started Free</Button></Link>
                )}
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="animate-scale-in delay-400" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)', borderRadius: '24px', padding: '2rem', boxShadow: '0 25px 80px rgba(0,0,0,0.12)', transform: 'rotate(2deg)' }}>
                <svg viewBox="0 0 300 200" style={{ width: '100%' }} aria-label="Animated illustration of a concept map showing connected research papers" role="img">
                  <title>Concept map visualization</title>
                  <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                  <line x1="80" y1="60" x2="150" y2="40" stroke="#8B7355" strokeWidth="2" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/></line>
                  <line x1="150" y1="40" x2="220" y2="70" stroke="#8B7355" strokeWidth="2" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="0.5s"/></line>
                  <line x1="80" y1="60" x2="100" y2="140" stroke="#8B7355" strokeWidth="2" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="1s"/></line>
                  <line x1="150" y1="40" x2="180" y2="150" stroke="#8B7355" strokeWidth="2" opacity="0.3"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="1.5s"/></line>
                  <line x1="220" y1="70" x2="250" y2="130" stroke="#8B7355" strokeWidth="2" opacity="0.3"/>
                  <line x1="100" y1="140" x2="180" y2="150" stroke="#8B7355" strokeWidth="2" opacity="0.3"/>
                  <line x1="180" y1="150" x2="250" y2="130" stroke="#8B7355" strokeWidth="2" opacity="0.3"/>
                  <circle cx="80" cy="60" r="20" fill="#C4A77D" filter="url(#glow)"><animate attributeName="r" values="20;23;20" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="150" cy="40" r="16" fill="#7A9E7E" filter="url(#glow)"><animate attributeName="r" values="16;19;16" dur="2s" repeatCount="indefinite" begin="0.3s"/></circle>
                  <circle cx="220" cy="70" r="18" fill="#9B8AA6" filter="url(#glow)"><animate attributeName="r" values="18;21;18" dur="2s" repeatCount="indefinite" begin="0.6s"/></circle>
                  <circle cx="100" cy="140" r="14" fill="#C49A6C" filter="url(#glow)"><animate attributeName="r" values="14;17;14" dur="2s" repeatCount="indefinite" begin="0.9s"/></circle>
                  <circle cx="180" cy="150" r="20" fill="#6B8E9F" filter="url(#glow)"><animate attributeName="r" values="20;23;20" dur="2s" repeatCount="indefinite" begin="1.2s"/></circle>
                  <circle cx="250" cy="130" r="12" fill="#B8877A" filter="url(#glow)"><animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite" begin="1.5s"/></circle>
                  <circle cx="77" cy="57" r="5" fill="rgba(255,255,255,0.4)"/>
                  <circle cx="147" cy="37" r="4" fill="rgba(255,255,255,0.4)"/>
                  <circle cx="217" cy="67" r="4" fill="rgba(255,255,255,0.4)"/>
                  <circle cx="97" cy="137" r="3" fill="rgba(255,255,255,0.4)"/>
                  <circle cx="177" cy="147" r="5" fill="rgba(255,255,255,0.4)"/>
                  <circle cx="247" cy="127" r="3" fill="rgba(255,255,255,0.4)"/>
                </svg>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section aria-labelledby="features-heading">
        <Container className="mb-5" ref={featuresRef}>
          <div className="text-center mb-5 scroll-animate">
            <h2 id="features-heading" style={{ marginBottom: '1rem' }}>How It Works</h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>Three simple steps to transform how you organize your research</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 text-center scroll-animate" style={{ background: 'transparent', transitionDelay: '0.1s' }}>
                <Card.Body className="p-4">
                  <div className="feature-icon" style={{ background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 100%)', color: 'var(--color-bg-dark)' }} aria-hidden="true"><DocumentIcon /></div>
                  <Card.Title as="h3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>Upload PDFs</Card.Title>
                  <Card.Text className="text-muted">Simply drag and drop your research papers. We automatically extract text, titles, and abstracts from your PDFs.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 text-center scroll-animate" style={{ background: 'transparent', transitionDelay: '0.2s' }}>
                <Card.Body className="p-4">
                  <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #7A9E7E 100%)', color: '#2D4A35' }} aria-hidden="true"><BrainIcon /></div>
                  <Card.Title as="h3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>AI Analysis</Card.Title>
                  <Card.Text className="text-muted">Our AI analyzes semantic similarity between papers, automatically discovering hidden connections and grouping related research.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 text-center scroll-animate" style={{ background: 'transparent', transitionDelay: '0.3s' }}>
                <Card.Body className="p-4">
                  <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #EDE7F6 0%, #9B8AA6 100%)', color: '#4A3D5C' }} aria-hidden="true"><NetworkIcon /></div>
                  <Card.Title as="h3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>Visualize</Card.Title>
                  <Card.Text className="text-muted">Explore your literature through beautiful, interactive concept maps. See clusters, connections, and themes at a glance.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section aria-labelledby="benefits-heading" className="scroll-animate" style={{ background: 'linear-gradient(180deg, #F5F2ED 0%, #FAF7F2 100%)', padding: '4rem 0', marginTop: '3rem' }}>
        <Container>
          <h2 id="benefits-heading" className="visually-hidden">Benefits</h2>
          <Row className="text-center">
            <Col md={4} className="mb-4 mb-md-0"><h3 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Fast</h3><p className="text-muted mb-0">Analyze papers in seconds</p></Col>
            <Col md={4} className="mb-4 mb-md-0"><h3 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Free</h3><p className="text-muted mb-0">No credit card required</p></Col>
            <Col md={4}><h3 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Private</h3><p className="text-muted mb-0">Your research stays yours</p></Col>
          </Row>
        </Container>
      </section>

      <section ref={ctaRef} aria-labelledby="cta-heading" className="scroll-animate" style={{ background: 'var(--color-bg-dark)', padding: '5rem 0' }}>
        <Container className="text-center">
          <h2 id="cta-heading" style={{ color: 'var(--color-accent-light)', marginBottom: '1rem', fontSize: '2.5rem' }}>Ready to organize your research?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Join researchers who are discovering new connections in their literature every day.</p>
          {!isAuthenticated && (
            <Link to="/login"><Button variant="outline-light" size="lg" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', padding: '0.875rem 3rem', fontSize: '1.1rem' }} aria-label="Start using Braindump for free">Start for Free</Button></Link>
          )}
        </Container>
      </section>
    </main>
  );
}

export default Home;
