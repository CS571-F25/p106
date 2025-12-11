import { Button } from 'react-bootstrap';

const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 64, height: 64 }} aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
  </svg>
);

function EmptyState({ 
  icon: Icon = DefaultIcon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="text-center py-5">
      <div style={{ marginBottom: '1.5rem', opacity: 0.4, color: 'var(--color-text-muted)' }}>
        <Icon />
      </div>
      {title && (
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      )}
      {description && (
        <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;


