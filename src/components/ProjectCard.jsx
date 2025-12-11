import { Card, Button, Form } from 'react-bootstrap';

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

function ProjectCard({ 
  project, 
  editMode, 
  isEditing, 
  editName, 
  editDesc, 
  onEditNameChange, 
  onEditDescChange, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete, 
  onClick 
}) {
  if (isEditing) {
    return (
      <Card className="h-100" style={{ borderTop: '4px solid var(--color-primary)' }}>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">Project Name</Form.Label>
            <Form.Control 
              type="text" 
              value={editName} 
              onChange={(e) => onEditNameChange(e.target.value)} 
              onClick={(e) => e.stopPropagation()} 
              autoFocus 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} 
              value={editDesc} 
              onChange={(e) => onEditDescChange(e.target.value)} 
              onClick={(e) => e.stopPropagation()} 
              placeholder="Optional description" 
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" onClick={onSaveEdit}>Save</Button>
            <Button variant="outline-secondary" size="sm" onClick={onCancelEdit}>Cancel</Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card 
      className={`h-100 project-card ${editMode ? 'edit-mode-border' : ''}`} 
      onClick={onClick} 
      style={{ 
        borderTop: '4px solid var(--color-primary)', 
        cursor: editMode ? 'default' : 'pointer', 
        position: 'relative', 
        overflow: 'visible' 
      }}
    >
      {!editMode && (
        <div 
          className="project-card-overlay" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'transparent', 
            transition: 'background 0.3s ease', 
            pointerEvents: 'none', 
            zIndex: 1 
          }} 
        />
      )}
      <Card.Body className="d-flex flex-column" style={{ position: 'relative', zIndex: 2 }}>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-2 project-card-title" style={{ transition: 'color 0.3s ease' }}>
            {project.name}
          </Card.Title>
          {editMode && (
            <div className="d-flex gap-2">
              <Button 
                variant="link" 
                className="p-1" 
                onClick={onStartEdit} 
                style={{ color: 'var(--color-primary)' }} 
                aria-label={`Edit project: ${project.name}`}
              >
                <PencilIcon />
              </Button>
              <Button 
                variant="link" 
                className="p-1" 
                onClick={onDelete} 
                style={{ color: 'var(--color-danger)' }} 
                aria-label={`Delete project: ${project.name}`}
              >
                <TrashIcon />
              </Button>
            </div>
          )}
        </div>
        <Card.Text className="text-muted flex-grow-1 project-card-desc" style={{ fontSize: '0.9rem', transition: 'color 0.3s ease' }}>
          {project.description || 'No description'}
        </Card.Text>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <small className="text-muted project-card-date" style={{ transition: 'color 0.3s ease' }}>
            {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCard;


