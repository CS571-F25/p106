import { Container } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      background: 'var(--color-bg-dark)',
      color: 'rgba(255,255,255,0.7)',
      padding: '2rem 0',
      marginTop: 'auto'
    }}>
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0">
            <span style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '1.25rem',
              color: 'var(--color-accent-light)'
            }}>
              Braindump
            </span>
            <p className="mb-0 mt-1" style={{ fontSize: '0.85rem' }}>
              Organize your research, visually.
            </p>
          </div>
          <div className="text-center text-md-end">
            <p className="mb-1" style={{ fontSize: '0.85rem' }}>
              Built for CS571 coursework
            </p>
            <p className="mb-0" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
              {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;


