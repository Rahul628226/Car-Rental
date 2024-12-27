import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    fetchCarFeatures,
    createCarFeature,
    updateCarFeature,
    deleteCarFeature,
} from '../../Redux/Slicer/Vendor/CarDetails/carFeaturesSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CarColors from './CarColors';
import CarSeat from './CarSeat';
import CarCategories from './CarCategory';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the left */
  justify-content: flex-start;
//   min-height: 100vh;
  padding: 30px; /* Reduced padding for mobile view */
  background: ${({ theme }) => theme.bg2};
  font-family: 'Helvetica Neue', Arial, sans-serif;

  @media (min-width: 768px) {
    padding: 60px; /* Increased padding for larger screens */
  }
`;

const Title = styled.h2`
  text-align: left; /* Align title to the left */
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px; /* Reduced margin */
  font-size: 1.5rem; /* Reduced font size */
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius:4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.danger ? '#ff4d4d' : '#4CAF50')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ListContainer = styled.div`
  max-height: 300px; /* Set a max height for the list */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ddd;
  
  border-radius: 5px;
  min-width:100%;
`;

const List = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
  gap:10px;

  &:last-child {
    border-bottom: none;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;

  svg {
    cursor: pointer;
    font-size: 1.2rem;
    color: #555;

    &:hover {
      color: #000;
    }

    &.delete {
      color: #ff4d4d;

      
    }

    &.edit {
      color: ${({ theme }) => theme.text};

     
    }
  }
`;

const CarFeatures = () => {
    const [feature, setFeature] = useState('');
    const [editFeature, setEditFeature] = useState(null);
    const dispatch = useDispatch();
    const { features, loading, error } = useSelector((state) => state.carFeatures);

    useEffect(() => {
        dispatch(fetchCarFeatures());
    }, [dispatch]);

    const handleAddOrUpdate = (e) => {
        e.preventDefault();
        if (editFeature) {
            dispatch(updateCarFeature({ id: editFeature._id, featureName: feature }));
        } else {
            dispatch(createCarFeature({ featureName: feature }));
        }
        setFeature('');
        setEditFeature(null);
    };

    const handleEdit = (feature) => {
        setFeature(feature.featureName);
        setEditFeature(feature);
    };

    const handleDelete = (id) => {
        dispatch(deleteCarFeature(id));
    };

    return (
        <><Container>
            <Title>Car Features Management</Title>
            <Form onSubmit={handleAddOrUpdate}>
                <Input
                    type="text"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    placeholder="Enter car feature"
                    required />
                <Button type="submit">{editFeature ? 'Update' : 'Add'}</Button>
            </Form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ListContainer>
                <List>
                    {features.map((feature) => (
                        <ListItem key={feature._id}>
                            <span>{feature.featureName}</span>
                            <Actions>
                                <FaEdit className='edit' onClick={() => handleEdit(feature)} />
                                <FaTrash className="delete" onClick={() => handleDelete(feature._id)} />
                            </Actions>
                        </ListItem>
                    ))}
                </List>
            </ListContainer>
        </Container>
<CarCategories/>
            <CarColors />
            <CarSeat/>

        </>
    );
};

export default CarFeatures;
