import React, { useState } from 'react';
import Joyride from 'react-joyride';
import styled from 'styled-components';

const HowItWorks = () => {
  const [runTour, setRunTour] = useState(true); // Controls the state of the tour

  const steps = [
    {
      target: '.feature-1', 
      content: 'This is Feature 1, it does XYZ.',
    },
    {
      target: '.feature-2', 
      content: 'This is Feature 2, it does ABC.',
    },
    {
      target: '.feature-3',
      content: 'This is Feature 3, it helps with MNO.',
    },
    {
      target: '.feature-4',
      content: 'This is Feature 4, learn more about it here.',
    },
    {
      target: '.skip-btn',
      content: 'Click here to skip the tour if you are in a hurry!',
    },
  ];

  return (
    <Container>
      {/* Joyride component handles the tour */}
      <Joyride
        steps={steps}
        run={runTour}
        showSkipButton={true} // Enables skip button
        continuous={true} // Keeps the tour running until finished or skipped
        scrollToFirstStep={true}
        callback={(data) => {
          if (data.action === 'skip') {
            setRunTour(false); // Stops the tour if skipped
          }
        }}
      />

      {/* Your website content */}
      <Feature className="feature-1">
        <h2>Feature 1</h2>
        <p>Details about feature 1.</p>
      </Feature>
      <Feature className="feature-2">
        <h2>Feature 2</h2>
        <p>Details about feature 2.</p>
      </Feature>
      <Feature className="feature-3">
        <h2>Feature 3</h2>
        <p>Details about feature 3.</p>
      </Feature>
      <Feature className="feature-4">
        <h2>Feature 4</h2>
        <p>Details about feature 4.</p>
      </Feature>

      {/* Skip button */}
      <SkipButton className="skip-btn" onClick={() => setRunTour(false)}>
        Skip Tour
      </SkipButton>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Feature = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const SkipButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #e53935;
  }
`;

export default HowItWorks;
