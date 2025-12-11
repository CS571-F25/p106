import { Button } from 'react-bootstrap';

function PaperCard({ paper, onClick, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(paper.id, e);
  };

  return (
    <div 
      className="paper-item d-flex justify-content-between align-items-start" 
      onClick={() => onClick(paper)} 
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(paper); }}
      aria-label={`View paper: ${paper.title || 'Untitled'}`}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.3 }}>
          {paper.title || 'Untitled'}
        </div>
        {paper.authors && (
          <div className="text-muted small mt-1" style={{ fontSize: '0.8rem' }}>
            {paper.authors.length > 40 ? paper.authors.substring(0, 40) + '...' : paper.authors}
          </div>
        )}
      </div>
      <Button 
        variant="link" 
        size="sm" 
        className="text-danger p-0 ms-2" 
        onClick={handleDelete} 
        style={{ fontSize: '1rem', opacity: 0.6 }} 
        aria-label={`Delete paper: ${paper.title || 'Untitled'}`} 
        title="Delete paper"
      >
        x
      </Button>
    </div>
  );
}

export default PaperCard;


