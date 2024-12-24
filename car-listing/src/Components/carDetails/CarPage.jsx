import React, { useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "./../../App";
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

const CarTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
`;

const ReviewCount = styled.span`
  font-size: 14px;
  color: #888;
`;

const CarDetails = styled.p`
  font-size: 16px;
  margin: 20px 0;
`;

const CarSpecs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const Spec = styled.div`
  font-size: 14px;
  color: #555;

  span {
    font-weight: bold;
     color: ${({ theme }) => theme.text};
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};

  span {
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    text-decoration: line-through;
    margin-left: 10px;
  }
`;

const RentButton = styled.button`
  background: #005bea;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #004bb7;
  }
`;

const CarPage = () => {
  const [selectedImage, setSelectedImage] = useState(
    "https://images.unsplash.com/photo-1556772485-b656564ae2f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGdyZWVuJTIwY2Fyc3xlbnwwfHwwfHx8MA%3D%3D"
  );

  const galleryImages = [
    "https://images.unsplash.com/photo-1556772485-b656564ae2f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGdyZWVuJTIwY2Fyc3xlbnwwfHwwfHx8MA%3D%3D",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5rGluaN8Qx6VkZo7weHb-oNOnlOdN3hyQKk-YlaZbJrIH8T2--Wl_dSc&s",
    "https://plus.unsplash.com/premium_photo-1661891539075-24b4e473f67f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNhciUyMHNpZGUlMjB2aWV3fGVufDB8fDB8fHww",
  ];

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
          {galleryImages.map((image, index) => (
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
        <CarTitle>Nissan GT – R</CarTitle>
        <Rating>
          ⭐⭐⭐⭐⭐ <ReviewCount>440+ Reviewer</ReviewCount>
        </Rating>
        <CarDetails>
          NISMO has become the embodiment of Nissan's outstanding performance, inspired by the most unforgiving proving
          ground, the "race track".
        </CarDetails>
        <CarSpecs>
          <Spec>
            Type Car: <span>Sport</span>
          </Spec>
          <Spec>
            Capacity: <span>2 Person</span>
          </Spec>
          <Spec>
            Steering: <span>Manual</span>
          </Spec>
          <Spec>
            Gasoline: <span>70L</span>
          </Spec>
        </CarSpecs>
        <PriceContainer>
          <Price>
            $80.00/day
          </Price>
          <RentButton>Rent Now</RentButton>
        </PriceContainer>
      </RightSection>
    </PageContainer>
  );
};

export default CarPage;
