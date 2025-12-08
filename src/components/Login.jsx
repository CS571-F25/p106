import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signin, signup } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signin(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signup(email, password);
      if (result.access_token) {
        navigate('/dashboard');
      } else {
        setSuccess('Account created! You can now sign in.');
        setActiveTab('signin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 76px)', 
      background: 'linear-gradient(135deg, #FAF7F2 0%, #E8DCC8 100%)',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem 0'
    }}>
      <Container style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Braindump
          </h1>
          <p className="text-muted">Organize your research, visually</p>
        </div>
        
        <Card className="border-0" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <Card.Body className="p-4">
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
            
            <Tabs 
              activeKey={activeTab} 
              onSelect={setActiveTab} 
              className="mb-4 login-tabs"
            >
              <Tab eventKey="signin" title="Sign In">
                <Form onSubmit={handleSignIn} className="mt-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                    style={{ padding: '0.75rem' }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>
              </Tab>
              
              <Tab eventKey="signup" title="Create Account">
                <Form onSubmit={handleSignUp} className="mt-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                    style={{ padding: '0.75rem' }}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
        
        <p className="text-center text-muted mt-4" style={{ fontSize: '0.85rem' }}>
          By signing up, you agree to our Terms of Service
        </p>
      </Container>
    </div>
  );
}

export default Login;
