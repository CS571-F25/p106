import { Card } from 'react-bootstrap';

function PaperCard({ title, authors, abstract, year }) {
  return (
    <Card className="mb-3">
      <Card.Header>
        <Card.Title>{title || 'Untitled Paper'}</Card.Title>
      </Card.Header>
      <Card.Body>
        {authors && (
          <Card.Subtitle className="mb-2 text-muted">
            {authors}
          </Card.Subtitle>
        )}
        {year && (
          <Card.Text className="text-muted small">Year: {year}</Card.Text>
        )}
        {abstract && (
          <Card.Text>{abstract.substring(0, 200)}...</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default PaperCard;

