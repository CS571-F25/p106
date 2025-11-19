import { Container } from 'react-bootstrap';
import UploadForm from './UploadForm';
import PaperCard from './PaperCard';

function PapersPage() {
  const samplePapers = [
    {
      title: 'Sample Paper 1',
      authors: 'Author A, Author B',
      abstract: 'This is a sample abstract for demonstration purposes. The full implementation will fetch real paper data from Semantic Scholar API.',
      year: '2024',
    },
    {
      title: 'Sample Paper 2',
      authors: 'Author C, Author D',
      abstract: 'Another sample abstract showing how papers will be displayed in the application.',
      year: '2023',
    },
  ];

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Research Papers</h1>
      <div className="mb-5">
        <UploadForm />
      </div>
      <h2 className="mb-3">Your Papers</h2>
      {samplePapers.map((paper, index) => (
        <PaperCard
          key={index}
          title={paper.title}
          authors={paper.authors}
          abstract={paper.abstract}
          year={paper.year}
        />
      ))}
    </Container>
  );
}

export default PapersPage;

