import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.bg2};
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 508px;
  height: 230px;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    padding: 16px;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 999;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Row = styled.div`
  width: 90%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const DialogTitle = styled.h2`
  margin: 0;
  margin-bottom: 16px;
  font-size: 20px;
  justify-content: center;
  align-text: center;
  display: flex;
  

  @media (max-width: 768px) {
    font-size: 18px;
    text-align: center;
  }
`;

const DialogContent = styled.div`
  margin-bottom: 16px;
`;

const TextField = styled.input`
  width: 280px;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 16px;
  border: 1px solid black;
  height: 40px;
  color:black;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const AddDialogButton = styled.button`
  background-color: #d31818;
  border: none;
  padding: 10px;
  color: white;
  cursor: pointer;
  width: 120px;
  height: 40px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CloseDialogButton = styled.button`
  background-color: white;
  border: 1px solid black;
  padding: 10px;
  color: #0f224c;
  cursor: pointer;
  width: 120px;
  height: 40px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AddDialog = ({ type, currentItem, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
    }
  }, [currentItem]);

  const handleSubmit = () => {
    onSubmit(name);
  };

  return (
    <>
      <DialogOverlay onClick={onClose} />
      <Dialog>
        <DialogTitle>{currentItem ? `Edit ${type}` : `Add ${type}`}</DialogTitle>
        <DialogContent>
          <Row>
            <Title> Name</Title>
            <TextField
              autoFocus
              placeholder={`Enter ${type} name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Row>
        </DialogContent>
        <ButtonWrapper>
         
          <AddDialogButton primary onClick={handleSubmit}>
            {currentItem ? 'UPDATE' : 'ADD'}
          </AddDialogButton>
          <CloseDialogButton onClick={onClose}>CANCEL</CloseDialogButton>
        </ButtonWrapper>
      </Dialog>
    </>
  );
};

export default AddDialog;
