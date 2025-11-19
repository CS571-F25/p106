import { Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';

function UploadForm() {
  const [inputType, setInputType] = useState('urls');
  const [urls, setUrls] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { inputType, urls, file });
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Upload Research Papers</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Input Method</Form.Label>
            <Form.Select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
            >
              <option value="urls">URLs or DOIs</option>
              <option value="file">Reference File (BibTeX)</option>
            </Form.Select>
          </Form.Group>

          {inputType === 'urls' ? (
            <Form.Group className="mb-3">
              <Form.Label>Paper URLs or DOIs</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter one URL or DOI per line"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
              />
              <Form.Text className="text-muted">
                Paste URLs or DOIs, one per line
              </Form.Text>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Reference File</Form.Label>
              <Form.Control
                type="file"
                accept=".bib,.txt"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Upload a BibTeX file (.bib) or text file
              </Form.Text>
            </Form.Group>
          )}

          <Button variant="primary" type="submit">
            Process Papers
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UploadForm;

