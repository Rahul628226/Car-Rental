import React, { useState } from "react";
import styled from "styled-components";

// Styled components with theme integration
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

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.cardBorder};
  border-radius: 10px;
  padding: 20px;

  @media (min-width: 900px) {
    width: 30%;
    margin:10px;
  }
`;

const MobileFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  padding: 12px;

  @media (min-width: 900px) {
    display: none;
  }
`;

const MobileFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${(props) => props.theme.bg2};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.formBorder};

  @media (min-width: 900px) {
    display: none;
  }
`;

// Inputs
const SearchBox = styled.input`
  padding: 12px;
  border: 1px solid ${(props) => props.theme.formBorder};
  border-radius: 5px;
  width: 100%;
  color: black;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${(props) => props.theme.formBorder};
  border-radius: 5px;
  width: 100%;
  color: black;
`;

const CarFilterSection = () => {
  



  return (
    <>
   

      {/* Desktop Filters */}
      <FilterContainer>
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
      </FilterContainer>
    </>
  );
};

export default CarFilterSection;
