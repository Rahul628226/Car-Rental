import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
    fetchCarById,
    updateCarById,
} from '../../Redux/Slicer/Vendor/CarDetails/CarDetails';
import { fetchCarCategories } from '../../Redux/Slicer/Vendor/CarDetails/carCategories';
import {
    fetchMainCategories,
    fetchCategoriesByParent,
    selectMainCategory,
    selectCategory,
} from '../../Redux/Slicer/Admin/CarBrand/Categoryslicer';
import { fetchCarFeatures } from '../../Redux/Slicer/Vendor/CarDetails/carFeaturesSlice';
import { fetchSeats } from '../../Redux/Slicer/Vendor/CarDetails/Seat';
import { fetchCarColors } from '../../Redux/Slicer/Vendor/CarDetails/carColorsSlice';

const EditCarContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  background: transparent;
  border-radius: 12px;
  max-height: 80vh; /* Adjust this value as needed */
  overflow-y: auto; /* Enables vertical scrolling */
 

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin: 0.5rem;
    max-height: 60vh; /* Adjust for smaller screens */
  }
`;

const Title = styled.h2`
  text-align: left; /* Align title to the left */
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px; /* Reduced margin */
  font-size: 1.5rem; /* Reduced font size */
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
 font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 0.85rem;
  border: 1px solid ${({ theme }) => theme.borderColor || '#ddd'};
  border-radius: 8px;
   box-sizing: border-box;
  background-color: #F6F7F9; /* Added background color */
  color:black;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primaryColor || '#007bff'};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primaryColor}33` || '#007bff33'};
  }
`;

const Select = styled.select`
  padding: 12px 16px; /* Adjusted padding for a more balanced look */
  border: none;
  border-radius: 8px; /* Slightly increased border radius for a softer appearance */
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #F6F7F9; /* Added background color */
  transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition for focus effects */
  color:black;
  option {
    padding: 10px; /* Added padding for options for better touch targets */
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 10px; /* Adjusted to align checkboxes and labels in the same row */
  align-items: center; /* Align items vertically centered */
  
  label {
    display: flex;
    gap:5px;
    padding:10px;
    align-items: center; /* Align label text with the checkbox input */
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: ${({ theme }) => theme.primaryColor || '#007bff'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primaryColorHover || '#0056b3'};
  }

  &:disabled {
    background: ${({ theme }) => theme.disabledColor || '#ccc'};
    cursor: not-allowed;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;


const AddToSoldButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkred;
  }

  &:active {
    background-color: crimson;
  }

  &:focus {
    outline: 2px solid white;
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  color:red;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const AddImageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.bg2};; /* Green background */
  color: ${({ theme }) => theme.text};; /* White text */
  font-size: 12px;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.text};;
  border-radius: 8px;
  
  cursor: pointer;
 
 

  input {
    display: none; /* Hide the actual file input */
  }
`;

const EditCarDetails = ({ carId }) => {
    const dispatch = useDispatch();
    const { selectedCar, loading, error } = useSelector((state) => state.car);
    const { categories: carCategories } = useSelector(
        (state) => state.carCategories
    );
    const { mainCategories, categories } = useSelector(
        (state) => state.categories
    );
    const { features } = useSelector((state) => state.carFeatures);
    const { colors } = useSelector((state) => state.carColors);
    const { seats } = useSelector((state) => state.seats);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        color: '',
        capacity: '',
        fuelType: '',
        transmission: '',
        registrationNumber: '',
        price: '',
        vehicleAge: '',
        category: '',
        additionalFeatures: [],
        carImage: []
    });

    const [selectedMainCat, setSelectedMainCat] = useState(null);
    const [selectedCat, setSelectedCat] = useState(null);

    useEffect(() => {
        dispatch(fetchCarById(carId));
        dispatch(fetchCarCategories());
        dispatch(fetchMainCategories());
        dispatch(fetchCarFeatures());
        dispatch(fetchSeats());
        dispatch(fetchCarColors());
    }, [carId, dispatch]);

    useEffect(() => {
        if (selectedMainCat) {
            dispatch(fetchCategoriesByParent(selectedMainCat._id));
            setSelectedCat('');
            setFormData((prev) => ({ ...prev, brand: selectedMainCat._id }));
        }
    }, [dispatch, selectedMainCat]);

    useEffect(() => {
        if (selectedCar) {
            setFormData({
                brand: selectedCar.brand || '',
                model: selectedCar.model || '',
                color: selectedCar.color || '',
                capacity: selectedCar.capacity || '',
                fuelType: selectedCar.fuelType || '',
                transmission: selectedCar.transmission || '',
                registrationNumber: selectedCar.registrationNumber || '',
                price: selectedCar.price || '',
                vehicleAge: selectedCar.vehicleAge || '',
                category: selectedCar.category || '',
                additionalFeatures: selectedCar.additionalFeatures || [],
                carImage: selectedCar.carImage || []
            });

            if (selectedCar.brand) {
                const mainCat = mainCategories.find(
                    (cat) => cat._id === selectedCar.brand
                );
                setSelectedMainCat(mainCat || null);
                dispatch(selectMainCategory(selectedCar.brand));
            }

            if (selectedCar.model) {
                const cat = categories.find((cat) => cat._id === selectedCar.model);
                setSelectedCat(cat || null);
                dispatch(selectCategory(selectedCar.model));
            }
        }
    }, [selectedCar, mainCategories, categories, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMainCategoryChange = (e) => {
        const selectedId = e.target.value;
        const mainCat = mainCategories.find((cat) => cat._id === selectedId);
        if (mainCat) {
            setSelectedMainCat(mainCat);
            dispatch(selectMainCategory(selectedId));
            setFormData((prev) => ({ ...prev, model: '' }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    carImage: [...prev.carImage, reader.result],
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            carImage: prev.carImage.filter((_, i) => i !== index),
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        const category = categories.find((cat) => cat._id === selectedId);
        if (category) {
            setSelectedCat(category);
            dispatch(selectCategory(selectedId));
            setFormData((prev) => ({ ...prev, model: category._id }));
        }
    };

    const handleCheckboxChange = (e) => {
        const featureId = e.target.value;
        setFormData((prev) => {
            const updatedFeatures = prev.additionalFeatures.includes(featureId)
                ? prev.additionalFeatures.filter((id) => id !== featureId)
                : [...prev.additionalFeatures, featureId];
            return { ...prev, additionalFeatures: updatedFeatures };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCarById(carId, formData));
        toast.success('Car details updated successfully!');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <EditCarContainer>
            <ToastContainer />
            <Title>Edit Car Details</Title>

            <Form onSubmit={handleSubmit}>

                <FormGroup>

                </FormGroup>
                <FormGroup>
                    <AddToSoldButton>Add To Sold List</AddToSoldButton>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                        id="brand"
                        value={formData.brand || ''}
                        onChange={handleMainCategoryChange}
                    >
                        <option value="">Select Brand</option>
                        {mainCategories.map((mainCat) => (
                            <option key={mainCat._id} value={mainCat._id}>
                                {mainCat.name}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="model">Model</Label>
                    <Select
                        id="model"
                        value={formData.model || ''}
                        onChange={handleCategoryChange}
                        disabled={!selectedMainCat}
                    >
                        <option value="">Select Model</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Color</Label>
                    <Select
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                    >
                        <option value="">Select Color</option>
                        {colors.map((color) => (
                            <option key={color._id} value={color._id}>
                                {color.CarColor}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Capacity</Label>
                    <Select
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                    >
                        <option value="">Select capacity</option>
                        {seats.map((seat) => (
                            <option key={seat._id} value={seat._id}>
                                {seat.seatNumber}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Fuel Type</Label>
                    <Select
                        id="fuelType"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                    >
                        <option value="">Select fuelType</option>
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Transmission</Label>
                    <Input
                        type="text"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="additionalFeatures">Additional Features</Label>
                    <CheckboxGroup>
                        {features.map((feature) => (
                            <CheckboxLabel key={feature._id}>
                                <Input
                                    type="checkbox"
                                    value={feature._id}
                                    checked={formData.additionalFeatures.includes(feature._id)}
                                    onChange={handleCheckboxChange}
                                />{' '}
                                {feature.featureName}
                            </CheckboxLabel>
                        ))}
                    </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                    <Label>Registration Number</Label>
                    <Input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Car Category</Label>
                    <Select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select Category</option>
                        {carCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.Carcategory}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Price</Label>
                    <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Vehicle Age</Label>
                    <Input
                        type="number"
                        name="vehicleAge"
                        value={formData.vehicleAge}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Car Images</Label>
                    <ImageGrid>
                        {formData.carImage.map((image, index) => (
                            <ImageContainer key={index}>
                                <Image src={image} alt={`Car ${index + 1}`} />
                                <RemoveButton onClick={() => handleRemoveImage(index)}><FaTrash /></RemoveButton>
                            </ImageContainer>
                        ))}
                    </ImageGrid>
                    <AddImageButton as="label">
                        Add Image
                        <Input type="file" style={{ display: 'none' }} onChange={handleImageUpload} />
                    </AddImageButton>
                </FormGroup>

                <Button type="submit">Save Changes</Button>
            </Form>
        </EditCarContainer>
    );
};

export default EditCarDetails;