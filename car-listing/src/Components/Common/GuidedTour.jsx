import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { useNavigate } from 'react-router-dom';

const GuidedTour = ({ stepNo = 0, onTourComplete }) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(stepNo);
  const [runTour, setRunTour] = useState(false);

  const steps = [
    {
      target: 'body',
      content: 'Welcome to the guided tour! Let’s explore the features step by step.',
      placement: 'center',
    },
    {
      target: '.step-1',
      content: 'Here you can view all cars.',
      placement: 'bottom',
    },
    {
      target: '.step-2',
      content: 'Click here to add a new car.',
      placement: 'bottom',
    },
    {
      target: 'body', // Adjust for the new page
      content: 'This is the car details page.',
      placement: 'bottom',
    },
    {
      target: 'body',
      content: 'You’ve completed the tour! Thank you for exploring.',
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { action, index, type, status } = data;

    if ((type === 'step:after' && action === 'next') || action === 'close') {
      const nextIndex = index + 1;

      if (index === 1) {
        navigate('/car-list');
      } else if (index === 2) {
        navigate('/car-details');
      }

      // Wait briefly to ensure DOM is ready
      setTimeout(() => {
        setCurrentStepIndex(nextIndex);
      }, 500); // Adjust delay as needed
    }

    if (status === 'finished') {
      if (onTourComplete) {
        onTourComplete();
      }
      localStorage.setItem('TC', true);
      setCurrentStepIndex(0);
    }
  };

  useEffect(() => {
    // Check localStorage for the 'TC' value
    const isTourCompleted = localStorage.getItem('TC') === 'true';
    if (!isTourCompleted) {
      setRunTour(true); // Enable the tour only if 'TC' is not true
    }
  }, []);

  useEffect(() => {
    setCurrentStepIndex(stepNo);
  }, [stepNo]);

  return runTour ? (
    <Joyride
      steps={steps}
      stepIndex={currentStepIndex}
      run={true}
      continuous={true}
      showSkipButton={true}
      scrollToFirstStep={true}
      callback={handleJoyrideCallback}
      showProgress={true}
      showStepsProgress={true}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  ) : null; // Don't render Joyride if the tour is completed
};

export default GuidedTour;
