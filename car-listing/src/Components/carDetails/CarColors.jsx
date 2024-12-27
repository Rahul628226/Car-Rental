import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  fetchCarColors,
  createCarColor,
  updateCarColor,
  deleteCarColor,
} from '../../Redux/Slicer/Vendor/CarDetails/carColorsSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
 
  padding: 30px;
  background: ${({ theme }) => theme.bg2};
  font-family: 'Helvetica Neue', Arial, sans-serif;

  @media (min-width: 768px) {
    padding: 60px;
  }
`;

const Title = styled.h2`
  text-align: left;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
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
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 100%;
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
  gap: 10px;

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

const CarColors = () => {
  const [color, setColor] = useState('');
  const [editColor, setEditColor] = useState(null);
  const dispatch = useDispatch();
  const { colors, loading, error } = useSelector((state) => state.carColors);

  useEffect(() => {
    dispatch(fetchCarColors());
  }, [dispatch]);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editColor) {
      dispatch(updateCarColor({ id: editColor._id, CarColor: color }));
    } else {
      dispatch(createCarColor({ CarColor: color }));
    }
    setColor('');
    setEditColor(null);
  };

  const handleEdit = (color) => {
    setColor(color.CarColor);
    setEditColor(color);
  };

  const handleDelete = (id) => {
    dispatch(deleteCarColor(id));
  };

  return (
    <Container>
      <Title>Car Colors Management</Title>
      <Form onSubmit={handleAddOrUpdate}>
        <Input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter car color"
          required
        />
        <Button type="submit">{editColor ? 'Update' : 'Add'}</Button>
      </Form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ListContainer>
        <List>
          {colors.map((color) => (
            <ListItem key={color._id}>
              <span>{color.CarColor}</span>
              <Actions>
                <FaEdit className="edit" onClick={() => handleEdit(color)} />
                <FaTrash className="delete" onClick={() => handleDelete(color._id)} />
              </Actions>
            </ListItem>
          ))}
        </List>
      </ListContainer>
    </Container>
  );
};

export default CarColors;
