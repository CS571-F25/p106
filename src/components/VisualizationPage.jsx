import { Container } from 'react-bootstrap';
import GraphVisualization from './GraphVisualization';

function VisualizationPage() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Concept Graph Visualization</h1>
      <p className="mb-4">
        Explore the relationships between your research papers through an
        interactive concept graph. Each node represents a paper, and edges
        represent conceptual connections based on semantic similarity.
      </p>
      <GraphVisualization />
    </Container>
  );
}

export default VisualizationPage;

