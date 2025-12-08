import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { projectsApi } from '../services/api';

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }} aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }} aria-hidden="true">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }} aria-hidden="true">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 64, height: 64 }} aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadProjects(); }, []);

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

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project? All papers will be permanently deleted.')) return;
    try {
      await projectsApi.delete(projectId);
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProjectClick = (projectId) => {
    if (!editMode) navigate(`/project/${projectId}`);
  };

  const handleStartEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject(project.id);
    setEditName(project.name);
    setEditDesc(project.description || '');
  };

  const handleSaveEdit = async (projectId, e) => {
    e.stopPropagation();
    try {
      await projectsApi.update(projectId, { name: editName, description: editDesc });
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingProject(null);
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
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="mb-0">Projects</h1>
          <Button 
            variant="primary"
            onClick={() => { setEditMode(!editMode); setEditingProject(null); }}
            style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: editMode ? 'linear-gradient(135deg, var(--color-success) 0%, #5A8A5E 100%)' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}
            aria-label={editMode ? "Done editing" : "Edit projects"}
          >
            {editMode ? <CheckIcon /> : <PencilIcon />}
          </Button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {projects.length === 0 && !editMode ? (
          <Card className="text-center py-5 border-0" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 100%)' }}>
            <Card.Body className="py-5">
              <div style={{ marginBottom: '1.5rem', opacity: 0.4, color: 'var(--color-text-muted)' }}><BookIcon /></div>
              <h2 style={{ fontSize: '1.5rem' }}>Create your first research project</h2>
              <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>Projects help you organize papers around a specific topic, thesis, or literature review.</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>Create Project</Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {projects.map((project) => (
              <Col md={6} lg={4} key={project.id}>
                {editingProject === project.id ? (
                  <Card className="h-100" style={{ borderTop: '4px solid var(--color-primary)' }}>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Project Name</Form.Label>
                        <Form.Control type="text" value={editName} onChange={(e) => setEditName(e.target.value)} onClick={(e) => e.stopPropagation()} autoFocus />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-muted">Description</Form.Label>
                        <Form.Control as="textarea" rows={2} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} onClick={(e) => e.stopPropagation()} placeholder="Optional description" />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button variant="primary" size="sm" onClick={(e) => handleSaveEdit(project.id, e)}>Save</Button>
                        <Button variant="outline-secondary" size="sm" onClick={handleCancelEdit}>Cancel</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  <Card className={`h-100 project-card ${editMode ? 'edit-mode-border' : ''}`} onClick={() => handleProjectClick(project.id)} style={{ borderTop: '4px solid var(--color-primary)', cursor: editMode ? 'default' : 'pointer', position: 'relative', overflow: 'visible' }}>
                    {!editMode && <div className="project-card-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'transparent', transition: 'background 0.3s ease', pointerEvents: 'none', zIndex: 1 }} />}
                    <Card.Body className="d-flex flex-column" style={{ position: 'relative', zIndex: 2 }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <Card.Title className="mb-2 project-card-title" style={{ transition: 'color 0.3s ease' }}>{project.name}</Card.Title>
                        {editMode && (
                          <div className="d-flex gap-2">
                            <Button variant="link" className="p-1" onClick={(e) => handleStartEdit(project, e)} style={{ color: 'var(--color-primary)' }} aria-label={`Edit project: ${project.name}`}><PencilIcon /></Button>
                            <Button variant="link" className="p-1" onClick={(e) => handleDeleteProject(project.id, e)} style={{ color: 'var(--color-danger)' }} aria-label={`Delete project: ${project.name}`}><TrashIcon /></Button>
                          </div>
                        )}
                      </div>
                      <Card.Text className="text-muted flex-grow-1 project-card-desc" style={{ fontSize: '0.9rem', transition: 'color 0.3s ease' }}>{project.description || 'No description'}</Card.Text>
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <small className="text-muted project-card-date" style={{ transition: 'color 0.3s ease' }}>{new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            ))}
            <Col md={6} lg={4}>
              <Card className="h-100 d-flex align-items-center justify-content-center new-project-card" style={{ border: '2px dashed var(--color-border)', background: 'transparent', cursor: 'pointer', minHeight: '200px', transition: 'all 0.3s ease' }} onClick={() => setShowModal(true)}>
                <Card.Body className="text-center">
                  <div style={{ fontSize: '2.5rem', color: 'var(--color-text-light)', marginBottom: '0.5rem', transition: 'color 0.3s ease' }} className="new-project-icon">+</div>
                  <div style={{ color: 'var(--color-text-muted)', fontWeight: '500', transition: 'color 0.3s ease' }} className="new-project-text">New Project</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>Create New Project</Modal.Title></Modal.Header>
          <Form onSubmit={handleCreateProject}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>
                <Form.Control type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g., Machine Learning Literature Review" autoFocus required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description <span className="text-muted">(optional)</span></Form.Label>
                <Form.Control as="textarea" rows={3} value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder="What is this research project about?" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={creating || !newProjectName.trim()}>{creating ? <><Spinner size="sm" className="me-2" />Creating...</> : 'Create Project'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>

      <style>{`
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 4px rgba(139, 115, 85, 0.4), 0 0 25px rgba(139, 115, 85, 0.25); } 50% { box-shadow: 0 0 0 4px rgba(139, 115, 85, 0.9), 0 0 35px rgba(139, 115, 85, 0.5); } }
        .edit-mode-border { position: relative; overflow: visible !important; animation: pulseGlow 1.2s ease-in-out infinite; }
        .project-card { transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease !important; }
        .project-card:not(.edit-mode-border):hover { transform: scale(1.05) translateY(-4px); box-shadow: 0 12px 40px rgba(139, 115, 85, 0.35); background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%) !important; }
        .project-card:not(.edit-mode-border):hover .project-card-title { color: #FFFFFF !important; }
        .project-card:not(.edit-mode-border):hover .project-card-desc { color: rgba(255, 255, 255, 0.85) !important; }
        .project-card:not(.edit-mode-border):hover .project-card-date { color: rgba(255, 255, 255, 0.7) !important; }
        .new-project-card:hover { border-color: var(--color-primary) !important; background: rgba(139, 115, 85, 0.08) !important; transform: scale(1.03); }
        .new-project-card:hover .new-project-icon { color: var(--color-primary) !important; }
        .new-project-card:hover .new-project-text { color: var(--color-primary) !important; }
      `}</style>
    </div>
  );
}

export default Dashboard;
