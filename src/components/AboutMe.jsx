import { Container, Card } from 'react-bootstrap';

function AboutMe() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">About Braindump</h1>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Project Overview</Card.Title>
          <Card.Text>
            Braindump is a web application designed to help students and
            researchers organize and synthesize their academic sources through
            interactive visualization. Rather than discovering new papers,
            Braindump focuses on making sense of the ones you already have.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>How It Works</Card.Title>
          <Card.Text>
            Users can paste in a list of research paper URLs, DOIs, or upload a
            reference file. The app automatically retrieves each paper's title,
            abstract, and metadata, then converts these abstracts into
            numerical embeddings that capture their semantic meaning. Using these
            embeddings, the application computes similarity scores between
            papers and generates a dynamic concept graph.
          </Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Technology Stack</Card.Title>
          <Card.Text>
            Built with React for the frontend and D3.js for interactive graph
            rendering. The backend uses FastAPI to handle fetching from the
            Semantic Scholar API and compute text embeddings. Data is stored in
            PostgreSQL via Supabase.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AboutMe;