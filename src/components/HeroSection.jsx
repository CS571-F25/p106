import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';

function HeroSection({ isAuthenticated }) {
  return (
    <section 
      aria-labelledby="hero-heading" 
      style={{ 
        background: 'linear-gradient(135deg, #FAF7F2 0%, #E8DCC8 50%, #D4C4A8 100%)', 
        padding: '6rem 0 5rem', 
        marginBottom: '4rem', 
        position: 'relative', 
        overflow: 'hidden' 
      }}
    >
      <div 
        aria-hidden="true" 
        style={{ 
          position: 'absolute', 
          top: '10%', 
          right: '5%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(196,167,125,0.2) 0%, transparent 70%)', 
          animation: 'float 6s ease-in-out infinite' 
        }} 
      />
      <div 
        aria-hidden="true" 
        style={{ 
          position: 'absolute', 
          bottom: '10%', 
          left: '10%', 
          width: '200px', 
          height: '200px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(139,115,85,0.15) 0%, transparent 70%)', 
          animation: 'float 8s ease-in-out infinite', 
          animationDelay: '1s' 
        }} 
      />
      <Container>
        <Row className="align-items-center">
          <Col lg={7}>
            <h1 
              id="hero-heading" 
              className="animate-fade-in-up" 
              style={{ fontSize: '3.5rem', lineHeight: 1.2, marginBottom: '1.5rem' }}
            >
              Organize Your Research,<br />
              <span style={{ color: 'var(--color-primary)' }}>Visually.</span>
            </h1>
            <p 
              className="animate-fade-in-up delay-200" 
              style={{ 
                fontSize: '1.25rem', 
                color: 'var(--color-text-muted)', 
                marginBottom: '2rem', 
                maxWidth: '540px' 
              }}
            >
              Braindump helps researchers make sense of their papers through AI-powered 
              clustering and beautiful concept maps. Upload PDFs, discover connections, 
              and organize your literature effortlessly.
            </p>
            <div className="animate-fade-in-up delay-300">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    style={{ padding: '0.875rem 2.5rem', fontSize: '1.1rem' }} 
                    aria-label="Go to your dashboard"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    style={{ padding: '0.875rem 2.5rem', fontSize: '1.1rem' }} 
                    aria-label="Get started with Braindump for free"
                  >
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>
          </Col>
          <Col lg={5} className="d-none d-lg-block">
            <HeroIllustration />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div 
      className="animate-scale-in delay-400" 
      style={{ 
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)', 
        borderRadius: '24px', 
        padding: '2rem', 
        boxShadow: '0 25px 80px rgba(0,0,0,0.12)', 
        transform: 'rotate(2deg)' 
      }}
    >
      <svg 
        viewBox="0 0 300 200" 
        style={{ width: '100%' }} 
        aria-label="Animated illustration of a concept map showing connected research papers" 
        role="img"
      >
        <title>Concept map visualization</title>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <line x1="80" y1="60" x2="150" y2="40" stroke="#8B7355" strokeWidth="2" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/>
        </line>
        <line x1="150" y1="40" x2="220" y2="70" stroke="#8B7355" strokeWidth="2" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="0.5s"/>
        </line>
        <line x1="80" y1="60" x2="100" y2="140" stroke="#8B7355" strokeWidth="2" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="1s"/>
        </line>
        <line x1="150" y1="40" x2="180" y2="150" stroke="#8B7355" strokeWidth="2" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="1.5s"/>
        </line>
        <line x1="220" y1="70" x2="250" y2="130" stroke="#8B7355" strokeWidth="2" opacity="0.3"/>
        <line x1="100" y1="140" x2="180" y2="150" stroke="#8B7355" strokeWidth="2" opacity="0.3"/>
        <line x1="180" y1="150" x2="250" y2="130" stroke="#8B7355" strokeWidth="2" opacity="0.3"/>
        <circle cx="80" cy="60" r="20" fill="#C4A77D" filter="url(#glow)">
          <animate attributeName="r" values="20;23;20" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="40" r="16" fill="#7A9E7E" filter="url(#glow)">
          <animate attributeName="r" values="16;19;16" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        </circle>
        <circle cx="220" cy="70" r="18" fill="#9B8AA6" filter="url(#glow)">
          <animate attributeName="r" values="18;21;18" dur="2s" repeatCount="indefinite" begin="0.6s"/>
        </circle>
        <circle cx="100" cy="140" r="14" fill="#C49A6C" filter="url(#glow)">
          <animate attributeName="r" values="14;17;14" dur="2s" repeatCount="indefinite" begin="0.9s"/>
        </circle>
        <circle cx="180" cy="150" r="20" fill="#6B8E9F" filter="url(#glow)">
          <animate attributeName="r" values="20;23;20" dur="2s" repeatCount="indefinite" begin="1.2s"/>
        </circle>
        <circle cx="250" cy="130" r="12" fill="#B8877A" filter="url(#glow)">
          <animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite" begin="1.5s"/>
        </circle>
        <circle cx="77" cy="57" r="5" fill="rgba(255,255,255,0.4)"/>
        <circle cx="147" cy="37" r="4" fill="rgba(255,255,255,0.4)"/>
        <circle cx="217" cy="67" r="4" fill="rgba(255,255,255,0.4)"/>
        <circle cx="97" cy="137" r="3" fill="rgba(255,255,255,0.4)"/>
        <circle cx="177" cy="147" r="5" fill="rgba(255,255,255,0.4)"/>
        <circle cx="247" cy="127" r="3" fill="rgba(255,255,255,0.4)"/>
      </svg>
    </div>
  );
}

export default HeroSection;

