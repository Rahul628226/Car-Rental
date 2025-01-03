import React from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AddButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.primaryColor || '#007bff'};
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-size: 30px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHoverColor || '#0056b3'};
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;

const RoundButton = () => {
  return (
    <AddButton className="step-2">
      <Link to="/car-details" style={{ textDecoration: 'none', color: 'white' }}>
        <FaPlus />
      </Link>
    </AddButton>
  );
};

export default RoundButton;
