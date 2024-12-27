import React, { useEffect } from "react";
import styled from "styled-components";
import { FaGasPump, FaUsers, FaCogs, FaHeart } from "react-icons/fa";
import CarFilterSection from "./CarFilterSection";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import RoundButton from "../Common/RoundButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../Redux/Slicer/Vendor/CarDetails/CarDetails";

const CarListing = () => {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.car);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  return (
    <>
      <CarFilterSection />
      <Container>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : cars.length === 0 ? (
          <p>No cars available</p>
        ) : (
          cars.map((car, index) => (
            <Card key={index}>
              <Link to={`/car-page/${car._id}`} style={{ textDecoration: "none" }}>
                <Header>
                  <h2>{car.name}</h2>
                  <span>{car.brand}</span>
                  <HeartIcon />
                </Header>
                <ImageContainer>
                  <img src={car.carImage[0] || "placeholder.jpg"} alt={car.name} />
                </ImageContainer>
                <Details>
                  <Info>
                    <FaGasPump /> {car.fuelType}
                  </Info>
                  <Info>
                    <FaCogs /> {car.transmission}
                  </Info>
                  <Info>
                    <FaUsers /> {car.capacity}
                  </Info>
                </Details>
                <Footer>
                  <Price>
                    <strong>AED {car.price}.00</strong>
                  </Price>
                </Footer>
              </Link>
            </Card>
          ))
        )}
        <RoundButton />
      </Container>
    </>
  );
};

export default CarListing;

// Styled Components
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* 1 card in a row for mobile */
  gap: 15px;
  padding: 30px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr); /* 2 cards in a row for tablet */
  }

  @media (min-width: 1100px) {
    grid-template-columns: repeat(4, 1fr); /* 4 cards in a row for larger screens */
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s;
  padding: 15px;

  &:hover {
    transform: translateY(-10px);
  }
`;

const Header = styled.div`
  padding: 10px;
  z-index: 1;
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.cardText};
  }

  span {
    color: #7f8c8d;
    font-size: 1rem;
  }
`;

const HeartIcon = styled(FaSignOutAlt)`
  color: #dcdcdc;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #e74c3c;
  }
`;

const ImageContainer = styled.div`
  img {
    width: 100%;
    height: 200px;
  }
`;

const Details = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  color: ${({ theme }) => theme.cardText};
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Footer = styled.div`
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.div`
  font-size: 1.2rem;
  strong {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.cardText};
  }
`;
