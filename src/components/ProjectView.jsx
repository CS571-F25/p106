import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner, Alert, Badge, Dropdown, Accordion } from 'react-bootstrap';
import { projectsApi, papersApi, clusteringApi } from '../services/api';
import GraphVisualization from './GraphVisualization';

function ProjectView() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [manualTitle, setManualTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Clustering state
  const [clustering, setClustering] = useState(false);
  const [clusterInfo, setClusterInfo] = useState(null);
  const [clusterNames, setClusterNames] = useState({});
  
  // Selected paper for detail view
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showPaperModal, setShowPaperModal] = useState(false);
  
  // Cluster rename modal
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameClusterId, setRenameClusterId] = useState(null);
  const [newClusterName, setNewClusterName] = useState('');

  const clusterColors = [
    '#C4A77D', '#7A9E7E', '#9B8AA6', '#C49A6C', 
    '#6B8E9F', '#B8877A', '#8FA87A', '#A68B7A'
  ];

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
      
      // Load graph data if papers exist
      if (papersData.papers && papersData.papers.length > 0) {
        try {
          const graph = await clusteringApi.getGraph(projectId);
          setGraphData(graph);
        } catch (e) {
          console.log('Graph not available yet');
        }
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
      
      // Set default cluster names from summaries
      const names = {};
      Object.entries(result.cluster_summaries || {}).forEach(([id, summary]) => {
        names[id] = summary.length > 40 ? summary.substring(0, 40) + '...' : summary;
      });
      setClusterNames(names);
      
      setSuccess(`Clustering complete! Found ${result.n_clusters} clusters.`);
      
      // Reload graph data
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
    setClusterNames(prev => ({
      ...prev,
      [renameClusterId]: newClusterName
    }));
    setShowRenameModal(false);
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setShowPaperModal(true);
  };

  const getClusterName = (clusterId) => {
    return clusterNames[clusterId] || clusterInfo?.cluster_summaries?.[clusterId] || `Cluster ${parseInt(clusterId) + 1}`;
  };

  // Group papers by cluster
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
      <Container className="mt-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--color-primary)' }} />
        <p className="mt-3 text-muted">Loading project...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Link to="/dashboard" className="text-decoration-none d-inline-flex align-items-center mb-2" style={{ color: 'var(--color-primary)' }}>
            <span className="me-1">&larr;</span> Back to Dashboard
          </Link>
          <h1 className="mb-1">{project?.name}</h1>
          {project?.description && <p className="text-muted mb-0">{project.description}</p>}
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary"
            onClick={() => setShowUploadModal(true)}
          >
            + Upload PDF
          </Button>
          <Button 
            variant="primary"
            onClick={handleCluster}
            disabled={clustering || papers.length < 2}
          >
            {clustering ? (
              <>
                <Spinner size="sm" className="me-2" />
                Analyzing...
              </>
            ) : 'Analyze & Cluster'}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="fade-in">{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible className="fade-in">{success}</Alert>}

      <Row>
        {/* Graph Section */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Concept Map</h5>
              <small className="text-muted">{papers.length} papers</small>
            </Card.Header>
            <Card.Body className="graph-container p-0" style={{ height: '550px' }}>
              {graphData && graphData.nodes.length > 0 ? (
                <GraphVisualization 
                  data={graphData} 
                  onNodeClick={handlePaperClick}
                  clusterColors={clusterColors}
                  clusterNames={clusterNames}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center p-4">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>&#128218;</div>
                    <h5 className="text-muted">Your concept map will appear here</h5>
                    <p className="text-muted small mb-0">Upload at least 2 PDFs and click "Analyze & Cluster"</p>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Clusters Sidebar */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Research Clusters</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {clusterIds.length === 0 && unclusteredPapers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No papers yet</p>
                  <Button 
                    variant="link" 
                    onClick={() => setShowUploadModal(true)}
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Upload your first PDF
                  </Button>
                </div>
              ) : (
                <Accordion defaultActiveKey={clusterIds[0]} alwaysOpen>
                  {clusterIds.map((clusterId) => (
                    <Accordion.Item 
                      key={clusterId} 
                      eventKey={clusterId}
                      style={{ 
                        borderLeft: `4px solid ${clusterColors[clusterId % clusterColors.length]}`,
                        marginBottom: '0.5rem',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <Accordion.Header>
                        <div className="d-flex justify-content-between align-items-center w-100 pe-2">
                          <div className="d-flex align-items-center">
                            <Badge 
                              className="me-2"
                              style={{ 
                                backgroundColor: clusterColors[clusterId % clusterColors.length],
                                minWidth: '24px'
                              }}
                            >
                              {papersByCluster[clusterId].length}
                            </Badge>
                            <span className="fw-medium" style={{ fontSize: '0.95rem' }}>
                              {getClusterName(clusterId).substring(0, 35)}
                              {getClusterName(clusterId).length > 35 ? '...' : ''}
                            </span>
                          </div>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 ms-2"
                            style={{ color: 'var(--color-text-muted)' }}
                            onClick={(e) => { e.stopPropagation(); handleRenameCluster(clusterId); }}
                          >
                            &#9998;
                          </Button>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="pt-2 pb-3">
                        {papersByCluster[clusterId].map((paper) => (
                          <div 
                            key={paper.id}
                            className="paper-item d-flex justify-content-between align-items-start"
                            onClick={() => handlePaperClick(paper)}
                          >
                            <div style={{ flex: 1 }}>
                              <div className="fw-medium" style={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
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
                              onClick={(e) => handleDeletePaper(paper.id, e)}
                              style={{ fontSize: '0.9rem' }}
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                  
                  {unclusteredPapers.length > 0 && (
                    <Accordion.Item 
                      eventKey="unclustered"
                      style={{ 
                        borderLeft: '4px solid #ccc',
                        marginBottom: '0.5rem',
                        borderRadius: '8px'
                      }}
                    >
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <Badge bg="secondary" className="me-2">{unclusteredPapers.length}</Badge>
                          <span className="fw-medium">Unclustered</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="pt-2 pb-3">
                        {unclusteredPapers.map((paper) => (
                          <div 
                            key={paper.id}
                            className="paper-item d-flex justify-content-between align-items-start"
                            onClick={() => handlePaperClick(paper)}
                          >
                            <div style={{ flex: 1 }}>
                              <div className="fw-medium" style={{ fontSize: '0.9rem' }}>
                                {paper.title || 'Untitled'}
                              </div>
                            </div>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-danger p-0 ms-2"
                              onClick={(e) => handleDeletePaper(paper.id, e)}
                            >
                              &times;
                            </Button>
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

      {/* Upload Modal - PDF Only */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Research Paper</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label>PDF File</Form.Label>
              <div 
                className="border rounded-3 p-4 text-center"
                style={{ 
                  borderStyle: 'dashed !important',
                  backgroundColor: 'var(--color-bg)',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('pdf-input').click()}
              >
                {uploadFile ? (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#128196;</div>
                    <div className="fw-medium">{uploadFile.name}</div>
                    <div className="text-muted small">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>&#128448;</div>
                    <div className="text-muted">Click to select a PDF file</div>
                    <div className="text-muted small">or drag and drop</div>
                  </div>
                )}
                <Form.Control
                  id="pdf-input"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </div>
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Paper Title (optional)</Form.Label>
              <Form.Control
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Leave blank to extract from PDF"
              />
              <Form.Text className="text-muted">
                If not provided, we'll try to extract the title from the PDF
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading || !uploadFile}>
              {uploading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Uploading...
                </>
              ) : 'Upload Paper'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Paper Detail Modal */}
      <Modal show={showPaperModal} onHide={() => setShowPaperModal(false)} size="lg" centered>
        {selectedPaper && (
          <>
            <Modal.Header closeButton style={{ borderBottom: `4px solid ${clusterColors[selectedPaper.cluster_id % clusterColors.length] || '#ccc'}` }}>
              <Modal.Title style={{ fontSize: '1.25rem' }}>{selectedPaper.title || 'Untitled Paper'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                {selectedPaper.authors && (
                  <p className="mb-2">
                    <strong>Authors:</strong> {selectedPaper.authors}
                  </p>
                )}
                {selectedPaper.year && (
                  <p className="mb-2">
                    <strong>Year:</strong> {selectedPaper.year}
                  </p>
                )}
                {selectedPaper.cluster_id !== null && selectedPaper.cluster_id !== undefined && (
                  <p className="mb-2">
                    <strong>Cluster:</strong>{' '}
                    <Badge style={{ backgroundColor: clusterColors[selectedPaper.cluster_id % clusterColors.length] }}>
                      {getClusterName(selectedPaper.cluster_id)}
                    </Badge>
                  </p>
                )}
              </div>
              
              {selectedPaper.abstract && (
                <div>
                  <h6 className="mb-3">Abstract</h6>
                  <div 
                    className="p-3 rounded"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      lineHeight: 1.8,
                      fontSize: '0.95rem',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}
                  >
                    {selectedPaper.abstract}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="outline-danger" 
                onClick={() => handleDeletePaper(selectedPaper.id)}
              >
                Delete Paper
              </Button>
              <Button variant="primary" onClick={() => setShowPaperModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Rename Cluster Modal */}
      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rename Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Cluster Name</Form.Label>
            <Form.Control
              type="text"
              value={newClusterName}
              onChange={(e) => setNewClusterName(e.target.value)}
              placeholder="Enter a descriptive name"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowRenameModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveClusterName}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProjectView;
