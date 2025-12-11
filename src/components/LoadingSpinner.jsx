import { Spinner, Container } from 'react-bootstrap';

function LoadingSpinner({ message = 'Loading...', fullPage = true }) {
  const content = (
    <div className="text-center py-5">
      <Spinner 
        animation="border" 
        style={{ 
          color: 'var(--color-primary)',
          width: '3rem',
          height: '3rem'
        }} 
      />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
        {content}
      </Container>
    );
  }

  return content;
}

export default LoadingSpinner;


