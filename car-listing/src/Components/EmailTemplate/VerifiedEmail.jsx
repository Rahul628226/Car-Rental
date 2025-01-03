import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import emailIcon from '../../assets/emailIcon.png';
import greenTick from '../../assets/greenTick.png';
import { isTokenValid } from '../SignUp/GenerateToken/GeneratorToken';
import { verifyVendor } from '../../Redux/Slicer/Vendor/VendorReg/VendorReg';

const VerifiedEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorId, token } = useParams();

  const { loading, vendor, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (vendorId && token) {
      if (isTokenValid(token)) {
        dispatch(verifyVendor(vendorId  ));
      } else {
        toast.error('Token has expired or is invalid.');
      }
    }
  }, [dispatch, vendorId, token]);

  useEffect(() => {
    if (vendor && vendor.verify) {
      toast.success('Email verified successfully!');
    } else if (error) {
      toast.error(`Error verifying email: ${error}`);
    }
  }, [vendor, error]);

  return (
    <Container>
      {loading && <p>Loading...</p>}
      {!loading && vendor && vendor.verify && (
        <Card>
          <Title>
            <img src={emailIcon} alt="Email Icon" />
            EMAIL VERIFICATION
          </Title>
          <Icon>
            <img src={greenTick} alt="Verified" />
          </Icon>
          <Message>Your email was verified. You can continue using the application.</Message>
          <CloseButton onClick={() => navigate('/')}>CLOSE</CloseButton>
        </Card>
      )}
    </Container>
  );
};

export default VerifiedEmail;

// Styled-components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  background-color: white;
  padding: 20px;
`;

const Card = styled.div`
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  color: #0f224c;
  font-size: 1.5em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  img {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    font-size: 1.2em;

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;

  img {
    width: 55px;
    height: 55px;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background-color: white;
  color: #0f224c;
  border: 1px solid #0f224c;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 142px;
  height: 40px;

  @media (max-width: 576px) {
    width: 101px;
    height: 31px;
    font-size: 13px;
    padding: 5px;
  }
`;
