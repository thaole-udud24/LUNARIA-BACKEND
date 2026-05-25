import React from 'react';
import AboutContent from '../UI/AboutContent';

const AboutSection: React.FC = () => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AboutContent />
    </div>
  );
};

export default AboutSection;