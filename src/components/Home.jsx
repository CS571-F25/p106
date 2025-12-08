import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #FAF7F2 0%, #E8DCC8 50%, #D4C4A8 100%)',
        padding: '5rem 0 4rem',
        marginBottom: '3rem'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 style={{ fontSize: '3.5rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                Organize Your Research,<br />
                <span style={{ color: 'var(--color-primary)' }}>Visually.</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '540px' }}>
                Braindump helps researchers make sense of their papers through AI-powered clustering and beautiful concept maps. Upload PDFs, discover connections, and organize your literature effortlessly.
              </p>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" style={{ padding: '0.75rem 2rem' }}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="primary" size="lg" style={{ padding: '0.75rem 2rem' }}>
                    Get Started Free
                  </Button>
                </Link>
              )}
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                transform: 'rotate(2deg)'
              }}>
                <svg viewBox="0 0 300 200" style={{ width: '100%' }}>
                  {/* Conceptual graph illustration */}
                  <circle cx="80" cy="60" r="25" fill="#C4A77D" opacity="0.8"/>
                  <circle cx="150" cy="40" r="20" fill="#7A9E7E" opacity="0.8"/>
                  <circle cx="220" cy="70" r="22" fill="#9B8AA6" opacity="0.8"/>
                  <circle cx="100" cy="140" r="18" fill="#C49A6C" opacity="0.8"/>
                  <circle cx="180" cy="150" r="24" fill="#6B8E9F" opacity="0.8"/>
                  <circle cx="250" cy="130" r="16" fill="#B8877A" opacity="0.8"/>
                  
                  <line x1="80" y1="60" x2="150" y2="40" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                  <line x1="150" y1="40" x2="220" y2="70" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                  <line x1="80" y1="60" x2="100" y2="140" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                  <line x1="150" y1="40" x2="180" y2="150" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                  <line x1="220" y1="70" x2="250" y2="130" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                  <line x1="100" y1="140" x2="180" y2="150" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                  <line x1="180" y1="150" x2="250" y2="130" stroke="#8B7355" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0" style={{ background: 'transparent' }}>
              <Card.Body className="text-center p-4">
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.8rem'
                }}>
                  &#128196;
                </div>
                <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>Upload PDFs</Card.Title>
                <Card.Text className="text-muted">
                  Simply upload your research papers as PDFs. We extract the text and metadata automatically.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0" style={{ background: 'transparent' }}>
              <Card.Body className="text-center p-4">
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #7A9E7E 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.8rem'
                }}>
                  &#129504;
                </div>
                <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>AI-Powered Clustering</Card.Title>
                <Card.Text className="text-muted">
                  Our AI analyzes your papers and groups them by semantic similarity, revealing hidden connections.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0" style={{ background: 'transparent' }}>
              <Card.Body className="text-center p-4">
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  background: 'linear-gradient(135deg, #EDE7F6 0%, #9B8AA6 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.8rem'
                }}>
                  &#127912;
                </div>
                <Card.Title style={{ fontFamily: "'Playfair Display', serif" }}>Visual Concept Maps</Card.Title>
                <Card.Text className="text-muted">
                  Explore your literature through beautiful, interactive graphs that make research intuitive.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div style={{ 
        background: 'var(--color-bg-dark)', 
        padding: '4rem 0',
        marginTop: '3rem'
      }}>
        <Container className="text-center">
          <h2 style={{ color: 'var(--color-accent-light)', marginBottom: '1rem' }}>
            Ready to organize your research?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Start mapping your literature today. No credit card required.
          </p>
          {!isAuthenticated && (
            <Link to="/login">
              <Button 
                variant="outline-light" 
                size="lg"
                style={{ 
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                  padding: '0.75rem 2.5rem'
                }}
              >
                Create Free Account
              </Button>
            </Link>
          )}
        </Container>
      </div>
    </div>
  );
}

export default Home;
