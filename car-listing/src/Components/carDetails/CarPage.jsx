import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "./../../App";
import EditCarDetails from "./EditCarDetails";
import {
  fetchCarById,
} from '../../Redux/Slicer/Vendor/CarDetails/CarDetails';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 2;
  background: ${({ theme }) => theme.carbg};
  border-radius: 10px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CarImage = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
  height: 400px;

    @media (max-width: 768px) {
    height: 300px;
  }
`;

const CarDescription = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const CarSubtext = styled.p`
  font-size: 16px;
  margin-top: 10px;
`;

const Gallery = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const GalleryImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    border: 2px solid #fff;
  }

  &.active {
    border: 2px solid #ff0;
  }
`;

const RightSection = styled.div`
  flex: 3;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;


const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;



const CarPage = () => {
  const dispatch = useDispatch();
  const { carId } = useParams(); // Example car ID

  const { selectedCar, loading, error } = useSelector((state) => state.car);
  const [selectedImage, setSelectedImage] = useState('');
  useEffect(() => {
    dispatch(fetchCarById(carId));
    const img = selectedCar?.carImage?.[0] || null
    setSelectedImage(img)
  }, [carId, dispatch, selectedCar?.carImage?.[0]]);





  return (
    <PageContainer>
      {/* Left Section */}
      <LeftSection>
        <div>
          <CarDescription>Sports car with the best design and acceleration</CarDescription>
          <CarSubtext>
            Safety and comfort while driving a futuristic and elegant sports car
          </CarSubtext>
        </div>
        <CarImage src={selectedImage} alt="Car" />
        <Gallery>
          {selectedCar?.carImage?.map((image, index) => (
            <GalleryImage
              key={index}
              src={image}
              alt={`Gallery ${index + 1}`}
              className={selectedImage === image ? "active" : ""}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </Gallery>
      </LeftSection>

      {/* Right Section */}
      <RightSection>
        <PriceContainer>
          <EditCarDetails carId={carId} />
          {/* <RentButton>Rent Now</RentButton> */}
        </PriceContainer>
      </RightSection>
    </PageContainer>
  );
};

export default CarPage;
