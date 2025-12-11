import { useEffect, useRef } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import HeroSection from './HeroSection';
import FeatureCard from './FeatureCard';
import { StatCard } from './StatCard';

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Document icon" role="img">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Brain icon" role="img">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
  </svg>
);

const NetworkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Network graph icon" role="img">
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
      <HeroSection isAuthenticated={isAuthenticated} />

      <section aria-labelledby="features-heading">
        <Container className="mb-5" ref={featuresRef}>
          <div className="text-center mb-5 scroll-animate">
            <h2 id="features-heading" style={{ marginBottom: '1rem' }}>How It Works</h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>Three simple steps to transform how you organize your research</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <FeatureCard
                icon={DocumentIcon}
                title="Upload PDFs"
                description="Simply drag and drop your research papers. We automatically extract text, titles, and abstracts from your PDFs."
                iconBackground="linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 100%)"
                iconColor="var(--color-bg-dark)"
                delay="0.1s"
              />
            </Col>
            <Col md={4}>
              <FeatureCard
                icon={BrainIcon}
                title="AI Analysis"
                description="Our AI analyzes semantic similarity between papers, automatically discovering hidden connections and grouping related research."
                iconBackground="linear-gradient(135deg, #E8F5E9 0%, #7A9E7E 100%)"
                iconColor="#2D4A35"
                delay="0.2s"
              />
            </Col>
            <Col md={4}>
              <FeatureCard
                icon={NetworkIcon}
                title="Visualize"
                description="Explore your literature through beautiful, interactive concept maps. See clusters, connections, and themes at a glance."
                iconBackground="linear-gradient(135deg, #EDE7F6 0%, #9B8AA6 100%)"
                iconColor="#4A3D5C"
                delay="0.3s"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section aria-labelledby="benefits-heading" className="scroll-animate" style={{ background: 'linear-gradient(180deg, #F5F2ED 0%, #FAF7F2 100%)', padding: '4rem 0', marginTop: '3rem' }}>
        <Container>
          <h2 id="benefits-heading" className="visually-hidden">Benefits</h2>
          <Row className="text-center">
            <StatCard label="Fast" description="Analyze papers in seconds" />
            <StatCard label="Free" description="No credit card required" />
            <StatCard label="Private" description="Your research stays yours" />
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
