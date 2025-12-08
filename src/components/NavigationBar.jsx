import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function NavigationBar() {
  const { isAuthenticated, user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" style={{ padding: '0.75rem 0' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Braindump
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/dashboard">
                Projects
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {isAuthenticated ? (
              <>
                <span style={{ color: 'rgba(255,255,255,0.7)', marginRight: '1rem', fontSize: '0.9rem' }}>
                  {user?.email?.split('@')[0]}
                </span>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleSignOut}
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
