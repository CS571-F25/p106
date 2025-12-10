import { Col } from 'react-bootstrap';

function StatCard({ label, description }) {
  return (
    <Col md={4} className="mb-4 mb-md-0">
      <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
        {label}
      </h3>
      <p className="text-muted mb-0">{description}</p>
    </Col>
  );
}

function StatsSection({ stats }) {
  return (
    <section 
      aria-labelledby="stats-heading" 
      className="scroll-animate" 
      style={{ 
        background: 'linear-gradient(180deg, #F5F2ED 0%, #FAF7F2 100%)', 
        padding: '4rem 0', 
        marginTop: '3rem' 
      }}
    >
      <h2 id="stats-heading" className="visually-hidden">Key Benefits</h2>
      {stats.map((stat, index) => (
        <StatCard key={index} label={stat.label} description={stat.description} />
      ))}
    </section>
  );
}

export { StatCard, StatsSection };
export default StatCard;

