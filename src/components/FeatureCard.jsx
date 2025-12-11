import { Card } from 'react-bootstrap';

function FeatureCard({ icon: Icon, title, description, iconBackground, iconColor, delay = '0s' }) {
  return (
    <Card 
      className="h-100 border-0 text-center scroll-animate" 
      style={{ background: 'transparent', transitionDelay: delay }}
    >
      <Card.Body className="p-4">
        <div 
          className="feature-icon" 
          style={{ 
            background: iconBackground, 
            color: iconColor 
          }}
        >
          <Icon />
        </div>
        <Card.Title 
          as="h3" 
          style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}
        >
          {title}
        </Card.Title>
        <Card.Text className="text-muted">
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default FeatureCard;


