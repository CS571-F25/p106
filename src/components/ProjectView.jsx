import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner, Alert, Badge, Accordion } from 'react-bootstrap';
import { projectsApi, papersApi, clusteringApi } from '../services/api';
import GraphVisualization from './GraphVisualization';

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }} aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }} aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const GraphIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }} aria-hidden="true">
    <circle cx="12" cy="5" r="3"></circle>
    <circle cx="5" cy="19" r="3"></circle>
    <circle cx="19" cy="19" r="3"></circle>
    <line x1="12" y1="8" x2="5" y2="16"></line>
    <line x1="12" y1="8" x2="19" y2="16"></line>
  </svg>
);

function ProjectView() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [manualTitle, setManualTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [clustering, setClustering] = useState(false);
  const [clusterInfo, setClusterInfo] = useState(null);
  const [clusterNames, setClusterNames] = useState({});
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameClusterId, setRenameClusterId] = useState(null);
  const [newClusterName, setNewClusterName] = useState('');

  const clusterColors = ['#C4A77D', '#7A9E7E', '#9B8AA6', '#C49A6C', '#6B8E9F', '#B8877A', '#8FA87A', '#A68B7A'];

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const [projectData, papersData] = await Promise.all([
        projectsApi.get(projectId),
        papersApi.list(projectId)
      ]);
      setProject(projectData.project);
      setPapers(papersData.papers || []);
      
      if (papersData.papers && papersData.papers.length > 0) {
        try {
          const graph = await clusteringApi.getGraph(projectId);
          setGraphData(graph);
        } catch (e) {
          setGraphData(null);
        }
      } else {
        setGraphData(null);
        setClusterInfo(null);
        setClusterNames({});
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Please select a PDF file');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('input_type', 'pdf');
      formData.append('file', uploadFile);
      if (manualTitle) formData.append('title', manualTitle);
      
      await papersApi.upload(formData);
      setShowUploadModal(false);
      setUploadFile(null);
      setManualTitle('');
      setSuccess('Paper uploaded successfully!');
      loadProject();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCluster = async () => {
    setClustering(true);
    setError('');
    
    try {
      const result = await clusteringApi.cluster(projectId);
      setClusterInfo(result);
      
      const names = {};
      Object.entries(result.cluster_summaries || {}).forEach(([id, summary]) => {
        names[id] = summary.length > 40 ? summary.substring(0, 40) + '...' : summary;
      });
      setClusterNames(names);
      setSuccess(`Clustering complete! Found ${result.n_clusters} clusters.`);
      
      const graph = await clusteringApi.getGraph(projectId);
      setGraphData(graph);
      loadProject();
    } catch (err) {
      setError(err.message);
    } finally {
      setClustering(false);
    }
  };

  const handleDeletePaper = async (paperId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this paper?')) return;
    
    try {
      await papersApi.delete(paperId);
      setSuccess('Paper deleted');
      if (selectedPaper?.id === paperId) {
        setSelectedPaper(null);
        setShowPaperModal(false);
      }
      if (papers.length <= 1) {
        setGraphData(null);
        setClusterInfo(null);
        setClusterNames({});
      }
      loadProject();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRenameCluster = (clusterId) => {
    setRenameClusterId(clusterId);
    setNewClusterName(clusterNames[clusterId] || `Cluster ${parseInt(clusterId) + 1}`);
    setShowRenameModal(true);
  };

  const saveClusterName = () => {
    setClusterNames(prev => ({ ...prev, [renameClusterId]: newClusterName }));
    setShowRenameModal(false);
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setShowPaperModal(true);
  };

  const getClusterName = (clusterId) => {
    return clusterNames[clusterId] || clusterInfo?.cluster_summaries?.[clusterId] || `Cluster ${parseInt(clusterId) + 1}`;
  };

  const papersByCluster = papers.reduce((acc, paper) => {
    const clusterId = paper.cluster_id ?? 'unclustered';
    if (!acc[clusterId]) acc[clusterId] = [];
    acc[clusterId].push(paper);
    return acc;
  }, {});

  const clusterIds = Object.keys(papersByCluster).filter(id => id !== 'unclustered').sort();
  const unclusteredPapers = papersByCluster['unclustered'] || [];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--color-primary)' }} />
        <p className="mt-3 text-muted">Loading project...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4" style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Link to="/dashboard" className="text-decoration-none d-inline-flex align-items-center mb-2" style={{ color: '#5A4334', fontWeight: 500 }}>
            ← Back to Projects
          </Link>
          <h1 style={{ marginBottom: '0.25rem' }}>{project?.name}</h1>
          {project?.description && <p className="text-muted mb-0">{project.description}</p>}
        </div>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => setShowUploadModal(true)} style={{ background: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>+ Upload PDF</Button>
          <Button variant="primary" onClick={handleCluster} disabled={clustering || papers.length < 2}>
            {clustering ? <><Spinner size="sm" className="me-2" />Analyzing...</> : 'Analyze & Cluster'}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="mb-4" style={{ border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Card.Header className="d-flex justify-content-between align-items-center" style={{ background: '#fff', borderBottom: '1px solid var(--color-border)' }}>
              <h2 className="mb-0" style={{ fontSize: '1.25rem' }}>Concept Map</h2>
              <Badge bg="light" text="dark" style={{ fontWeight: 500 }}>{papers.length} papers</Badge>
            </Card.Header>
            <Card.Body className="p-0" style={{ height: '550px', background: 'linear-gradient(180deg, #FDFCFA 0%, #F5F2ED 100%)' }}>
              {graphData && graphData.nodes.length > 0 ? (
                <GraphVisualization data={graphData} onNodeClick={handlePaperClick} clusterColors={clusterColors} clusterNames={clusterNames} />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center p-4">
                    <div style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--color-text-muted)' }}><GraphIcon /></div>
                    <h3 className="text-muted" style={{ fontSize: '1.1rem' }}>Your concept map will appear here</h3>
                    <p className="text-muted small mb-0">Upload at least 2 PDFs and click "Analyze & Cluster"</p>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Card.Header style={{ background: '#fff', borderBottom: '1px solid var(--color-border)' }}>
              <h2 className="mb-0" style={{ fontSize: '1.25rem' }}>Research Clusters</h2>
            </Card.Header>
            <Card.Body style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {clusterIds.length === 0 && unclusteredPapers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-1">No papers yet</p>
                  <Button variant="link" onClick={() => setShowUploadModal(true)} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    Upload your first PDF
                  </Button>
                </div>
              ) : (
                <Accordion defaultActiveKey={clusterIds[0]} alwaysOpen>
                  {clusterIds.map((clusterId) => (
                    <Accordion.Item key={clusterId} eventKey={clusterId} style={{ borderLeft: `4px solid ${clusterColors[clusterId % clusterColors.length]}`, marginBottom: '0.75rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <Accordion.Header style={{ flex: 1, margin: 0, padding: 0, border: 'none' }}>
                          <div className="d-flex align-items-center" style={{ width: '100%' }}>
                            <Badge className="me-2" style={{ backgroundColor: clusterColors[clusterId % clusterColors.length], minWidth: '24px' }}>{papersByCluster[clusterId].length}</Badge>
                            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{getClusterName(clusterId).substring(0, 30)}{getClusterName(clusterId).length > 30 ? '...' : ''}</span>
                          </div>
                        </Accordion.Header>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 ms-2" 
                          style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRenameCluster(clusterId); }} 
                          aria-label={`Rename cluster ${getClusterName(clusterId)}`} 
                          title="Rename cluster"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Button>
                      </div>
                      <Accordion.Body className="pt-2 pb-3">
                        {papersByCluster[clusterId].map((paper) => (
                          <div key={paper.id} className="paper-item d-flex justify-content-between align-items-start" onClick={() => handlePaperClick(paper)} style={{ cursor: 'pointer' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.3 }}>{paper.title || 'Untitled'}</div>
                              {paper.authors && <div className="text-muted small mt-1" style={{ fontSize: '0.8rem' }}>{paper.authors.length > 40 ? paper.authors.substring(0, 40) + '...' : paper.authors}</div>}
                            </div>
                            <Button variant="link" size="sm" className="text-danger p-0 ms-2" onClick={(e) => handleDeletePaper(paper.id, e)} style={{ fontSize: '1rem', opacity: 0.6 }} aria-label={`Delete paper: ${paper.title || 'Untitled'}`} title="Delete paper">×</Button>
                          </div>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                  {unclusteredPapers.length > 0 && (
                    <Accordion.Item eventKey="unclustered" style={{ borderLeft: '4px solid #ccc', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <Badge bg="secondary" className="me-2">{unclusteredPapers.length}</Badge>
                          <span style={{ fontWeight: 500 }}>Unclustered</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="pt-2 pb-3">
                        {unclusteredPapers.map((paper) => (
                          <div key={paper.id} className="paper-item d-flex justify-content-between align-items-start" onClick={() => handlePaperClick(paper)} style={{ cursor: 'pointer' }}>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{paper.title || 'Untitled'}</div></div>
                            <Button variant="link" size="sm" className="text-danger p-0 ms-2" onClick={(e) => handleDeletePaper(paper.id, e)} aria-label={`Delete paper: ${paper.title || 'Untitled'}`} title="Delete paper">×</Button>
                          </div>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  )}
                </Accordion>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Upload Research Paper</Modal.Title></Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="pdf-input">PDF File</Form.Label>
              <div 
                className="border rounded p-4 text-center" 
                style={{ borderStyle: 'dashed', backgroundColor: 'var(--color-bg)', cursor: 'pointer' }} 
                onClick={() => document.getElementById('pdf-input').click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('pdf-input').click(); } }}
                tabIndex="0"
                role="button"
                aria-label={uploadFile ? `Selected file: ${uploadFile.name}. Press Enter to change file.` : 'Click or press Enter to select a PDF file'}
              >
                {uploadFile ? (
                  <div>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}><FileIcon /></div>
                    <div style={{ fontWeight: 500 }}>{uploadFile.name}</div>
                    <div className="text-muted small">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '0.5rem', opacity: 0.5, color: 'var(--color-text-muted)' }}><UploadIcon /></div>
                    <div className="text-muted">Click to select a PDF file</div>
                  </div>
                )}
                <Form.Control id="pdf-input" type="file" accept=".pdf" onChange={(e) => setUploadFile(e.target.files[0])} className="visually-hidden" aria-describedby="pdf-help" />
              </div>
              <Form.Text id="pdf-help" className="text-muted">Supported format: PDF</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Paper Title (optional)</Form.Label>
              <Form.Control type="text" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} placeholder="Leave blank to extract from PDF" />
              <Form.Text className="text-muted">If not provided, we'll try to extract the title from the PDF</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={uploading || !uploadFile}>{uploading ? <><Spinner size="sm" className="me-2" />Uploading...</> : 'Upload Paper'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showPaperModal} onHide={() => setShowPaperModal(false)} size="lg" centered>
        {selectedPaper && (
          <>
            <Modal.Header closeButton style={{ borderBottom: `3px solid ${clusterColors[selectedPaper.cluster_id % clusterColors.length] || '#ccc'}` }}>
              <Modal.Title style={{ fontSize: '1.2rem' }}>{selectedPaper.title || 'Untitled Paper'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                {selectedPaper.authors && <p className="mb-2"><strong>Authors:</strong> {selectedPaper.authors}</p>}
                {selectedPaper.year && <p className="mb-2"><strong>Year:</strong> {selectedPaper.year}</p>}
                {selectedPaper.cluster_id !== null && selectedPaper.cluster_id !== undefined && (
                  <p className="mb-2"><strong>Cluster:</strong> <Badge style={{ backgroundColor: clusterColors[selectedPaper.cluster_id % clusterColors.length] }}>{getClusterName(selectedPaper.cluster_id)}</Badge></p>
                )}
              </div>
              {selectedPaper.abstract && (
                <div>
                  <h3 className="mb-2" style={{ fontSize: '1rem' }}>Abstract</h3>
                  <div className="p-3 rounded" style={{ backgroundColor: 'var(--color-bg)', lineHeight: 1.7, fontSize: '0.95rem', maxHeight: '350px', overflowY: 'auto' }}>{selectedPaper.abstract}</div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={() => handleDeletePaper(selectedPaper.id)}>Delete Paper</Button>
              <Button variant="primary" onClick={() => setShowPaperModal(false)}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Rename Cluster</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Cluster Name</Form.Label>
            <Form.Control type="text" value={newClusterName} onChange={(e) => setNewClusterName(e.target.value)} placeholder="Enter a descriptive name" autoFocus />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowRenameModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveClusterName}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProjectView;
