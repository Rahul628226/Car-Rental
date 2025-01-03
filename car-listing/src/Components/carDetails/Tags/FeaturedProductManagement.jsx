import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeaturetagDropdown from './FeaturetagDropdown';
import { Spin, List, Input, Empty, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCars } from '../../../Redux/Slicer/Vendor/CarDetails/CarDetails';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Search = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.formBorder};
  border-radius: 5px;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.formBorder};
  border-radius: 5px;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-width:100%;
  min-height: 100vh;
  padding: 30px;
  background: ${({ theme }) => theme.bg2};
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: ${({ theme }) => theme.text};

  @media (min-width: 768px) {
    padding: 60px;
  }
`;

const Header = styled.h2`
  text-align: left;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  min-width: 100%;
  justify-content: space-between;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 10px;
  padding: 20px;

  @media (min-width: 900px) {
    width: 30%;
    margin: 10px;
  }
`;

const ResetButton = styled(Button)`
  background: #f97316;
  color: ${({ theme }) => theme.text};
  padding: 12px;
  height: 40px;

  &:hover {
    background: #ea580c;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text};
  min-height:100%;

    @media (max-width: 768px) {
   width:300px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const CarImage = styled.img`
  width: 4rem;
  height: 4rem;
  margin-left:5px;
  // object-fit: cover;
  border-radius: 8px;
`;

const ListItem = styled(List.Item)`
  cursor: pointer;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s;

  color: ${({ theme }) => theme.text};

  &:hover {
    background: gray;
    color:black;
  }

  &.selected {
    background: gray;
    border: 1px solid #fcd34d;
    color:black;
    
  }
`;

const Label = styled.p`
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
  
`;

const CenteredMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text};
  padding: 2rem;
`;

const FeaturedProductManagement = () => {
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const dispatch = useDispatch();
  const { cars, loading } = useSelector((state) => state.car);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleRefresh = () => {
    setSearchText('');
    setSelectedBrand('');
    setSelectedCarId(null);
  };

  const filteredCars = cars?.filter(
    (car) =>
      (!searchText || car.registrationNumber.toLowerCase().includes(searchText.toLowerCase())) &&
      (!selectedBrand || car.brand === selectedBrand)
  );

  const uniqueBrands = [...new Set(cars?.map((car) => car.brand))];

  return (
    <Container>
      <Header>Featured Car Management</Header>

      <FiltersContainer>
        <FilterSection>
          <Search
            placeholder="Search by car name"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </FilterSection>
        <FilterSection>
          <Select
            onChange={(e) => setSelectedBrand(e.target.value)}
            value={selectedBrand}
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </FilterSection>
        <FilterSection>
          <ResetButton icon={<ReloadOutlined />} onClick={handleRefresh}>
            Reset Filters
          </ResetButton>
        </FilterSection>
      </FiltersContainer>

      <Grid>
        <Card>
          <CardTitle>Cars</CardTitle>
          {loading ? (
            <CenteredMessage>
              {/* <Spin size="large" /> */}
            </CenteredMessage>
          ) : !filteredCars.length ? (
            <Empty description="No cars available" />
          ) : (
            <List
              dataSource={filteredCars}
              pagination={{ pageSize: 5 }}
              renderItem={(car) => (
                <ListItem
                  className={selectedCarId === car._id ? 'selected' : ''}
                  onClick={() => setSelectedCarId(car._id)}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <CarImage src={car.carImage?.[0] || 'placeholder.jpg'} alt={car.name} />
                    <div>
                      <Label style={{ margin: 0 }}>{car.registrationNumber}</Label>
                      <Label>Brand: {car.brand || 'N/A'}</Label>
                      <Label>Fuel Type: {car.fuelType}</Label>
                    </div>
                  </div>
                </ListItem>
              )}
            />
          )}
        </Card>

        <Card>
          <CardTitle>Feature Tag Management</CardTitle>
          {selectedCarId ? (
            <FeaturetagDropdown productId={selectedCarId} />
          ) : (
            <CenteredMessage>
              Select a car from the list to manage feature tags
            </CenteredMessage>
          )}
        </Card>
      </Grid>
    </Container>
  );
};

export default FeaturedProductManagement;
