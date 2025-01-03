import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import emailIcon from '../../assets/emailIcon.png'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  padding: 20px;
`;

const Card = styled.div`
  background: #fff;
  padding: 20px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 300px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 280px;
  }
`;

const Title = styled.h2`
  color: #0F224C;
  font-size: 1.5em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap:10px;
  img{
  width:28px;
  height:28px;
  }

  &::before {
   
    font-size: 1.5em;
    margin-right: 10px;
  }

  @media (max-width: 768px) {
    font-size: 1.2em;

    &::before {
      font-size: 1.2em;
    }
  }

  @media (max-width: 480px) {
    font-size: 1em;

    &::before {
      font-size: 1em;
    }
       img{
  width:24px;
  height:24px;
  }
  }
`;

const Message = styled.p`
  color: #333;
  font-size: 1em;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    font-size: 0.8em;
  }
`;

const Email = styled.span`
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background: #0F224C;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #092c58;
  }

  &:nth-child(2) {
    background: #fff;
    color: #0F224C;
    border: 1px solid #0F224C;

    &:hover {
      background: #f0f0f0;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8em;
  }
`;

const EmailVerificationUi = ({ email, handleresendemail }) => {
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsResending(true);
    handleresendemail();
    setTimeout(() => {
      setIsResending(false);
    }, 5000);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <Container>
      <Card>
        <Title> <img src={emailIcon} alt='emailIcon'></img>EMAIL VERIFICATION</Title>
        <Message>
          We have sent a verification link to <Email>{email}</Email>
        </Message>
        <Message>
          Click on the link to complete the verification process. You might need to check the spam folder.
        </Message>
        <ButtonGroup>
          <Button onClick={handleClick} disabled={isResending}>
            {isResending ? 'Loading...' : 'RESEND'}
          </Button>
          <Button onClick={handleClose}>CANCEL</Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default EmailVerificationUi;
