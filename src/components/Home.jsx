import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

function Home() {
  return (
    <Container className="mt-4">
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to Braindump</h1>
          <p className="col-md-8 fs-4">
            Organize and synthesize your academic sources through interactive
            visualization. Make sense of the papers you already have by exploring
            their conceptual relationships.
          </p>
          <Link to="/papers">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Upload Papers</Card.Title>
              <Card.Text>
                Paste URLs, DOIs, or upload reference files to import your
                research papers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Visualize Connections</Card.Title>
              <Card.Text>
                Explore how papers relate to one another through an interactive
                concept graph.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Discover Insights</Card.Title>
              <Card.Text>
                Identify clusters, themes, and research gaps in your literature
                collection.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;