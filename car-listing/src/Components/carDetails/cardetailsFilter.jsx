import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaFilter, FaSearch } from "react-icons/fa";

// Styled components
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  margin: 20px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
  border: none;
  border-radius: 5px;
  background: none;
  padding: 12px;
  cursor: pointer;

  @media (min-width: 900px) {
    display: none;
  }
`;

const MobileFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  background: ${(props) => props.theme.bg2};
  border-radius: 10px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.formBorder};

  @media (min-width: 900px) {
    display: none;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.cardBorder};
  border-radius: 10px;
  padding: 20px;
`;

const SearchBox = styled.input`
  padding: 12px;
  border: 1px solid ${(props) => props.theme.formBorder};
  border-radius: 5px;
  width: 100%;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${(props) => props.theme.formBorder};
  border-radius: 5px;
  width: 100%;
`;

const SearchBarMobile = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.bg2};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: 75%;
  box-shadow: 0px 2px 4px ${(props) => props.theme.bgAlpha};
`;

const SearchIcon = styled.div`
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${(props) => props.theme.text};
  font-size: 1rem;

  @media (max-width: 900px) {
    font-size: 0.9rem;
  }
`;

const MobileSearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;

  @media (min-width: 900px) {
    display: none;
  }
`;

const CarDetailsFilterSection = () => {
  const location = useLocation();
  const isCarListPage = location.pathname === "http://localhost:5173/car-page";
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = () => {
  
      setShowFilters(!showFilters);
  
  };

  return (
    <>
      {/* Mobile Search and Filter Button */}
      <MobileSearchContainer>
        <SearchBarMobile>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput type="text" placeholder="Search something here" />
        </SearchBarMobile>
        <MobileFilterButton onClick={handleFilter}>
          <FaFilter /> 
        </MobileFilterButton>
      </MobileSearchContainer>

      {/* Mobile Filters */}
      {showFilters && (
        <MobileFilters>
          <FilterSection>
            <SearchBox type="text" placeholder="Search for cars..." />
          </FilterSection>
          <FilterSection>
            <Select>
              <option value="">Select Car Category</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
            </Select>
          </FilterSection>
          <FilterSection>
            <Select>
              <option value="">Sold Cars</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FilterSection>
          <FilterSection>
            <Select>
              <option value="">Select Capacity</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </Select>
          </FilterSection>
        </MobileFilters>
      )}
    </>
  );
};

export default CarDetailsFilterSection;
