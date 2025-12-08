import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { projectsApi } from '../services/api';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.list();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    setCreating(true);
    try {
      await projectsApi.create(newProjectName, newProjectDesc);
      setShowModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All papers will be permanently deleted.')) {
      return;
    }
    
    try {
      await projectsApi.delete(projectId);
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--color-primary)' }} />
        <p className="mt-3 text-muted">Loading your projects...</p>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 76px)', background: 'var(--color-bg)' }}>
      <Container className="py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <h1 className="mb-2">Your Research Projects</h1>
            <p className="text-muted mb-0">Welcome back, {user?.email?.split('@')[0]}</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + New Project
          </Button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="fade-in">{error}</Alert>}

        {projects.length === 0 ? (
          <Card className="text-center py-5 border-0" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)' }}>
            <Card.Body className="py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.6 }}>&#128218;</div>
              <h4>Create your first research project</h4>
              <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                Projects help you organize papers around a specific topic, thesis, or literature review.
              </p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Create Project
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {projects.map((project) => (
              <Col md={6} lg={4} key={project.id}>
                <Card className="h-100 fade-in" style={{ borderTop: '4px solid var(--color-primary)' }}>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="mb-2">{project.name}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                      {project.description || 'No description'}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <small className="text-muted">
                        {new Date(project.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </small>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Delete
                        </Button>
                        <Link to={`/project/${project.id}`}>
                          <Button variant="primary" size="sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                            Open
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            
            {/* Add New Project Card */}
            <Col md={6} lg={4}>
              <Card 
                className="h-100 d-flex align-items-center justify-content-center"
                style={{ 
                  border: '2px dashed var(--color-border)',
                  background: 'transparent',
                  cursor: 'pointer',
                  minHeight: '200px'
                }}
                onClick={() => setShowModal(true)}
              >
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>+</div>
                  <div style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>New Project</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Create Project Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Project</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateProject}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., Machine Learning Literature Review"
                  autoFocus
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description <span className="text-muted">(optional)</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="What is this research project about?"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={creating || !newProjectName.trim()}>
                {creating ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Creating...
                  </>
                ) : 'Create Project'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default Dashboard;
