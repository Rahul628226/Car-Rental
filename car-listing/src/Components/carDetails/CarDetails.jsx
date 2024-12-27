import React, { useContext, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeContext } from "./../../App";
import { FaFileUpload } from 'react-icons/fa'; // Importing a file upload icon
import { useDispatch, useSelector } from 'react-redux';
import { createCar } from '../../Redux/Slicer/Vendor/CarDetails/CarDetails';
import {
  fetchMainCategories,
  fetchCategoriesByParent,
  selectMainCategory,
  selectCategory,

} from '../../Redux/Slicer/Admin/CarBrand/Categoryslicer'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchSeats,
} from '../../Redux/Slicer/Vendor/CarDetails/Seat';
import {
  fetchCarFeatures,
} from '../../Redux/Slicer/Vendor/CarDetails/carFeaturesSlice';

import {
  fetchCarCategories,
} from '../../Redux/Slicer/Vendor/CarDetails/carCategories';

import {
  fetchCarColors,
} from '../../Redux/Slicer/Vendor/CarDetails/carColorsSlice';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the left */
  justify-content: flex-start;
  min-height: 100vh;
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
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
  background: ${({ theme }) => theme.bg4};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  gap: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(50% - 10px); /* Two fields in a row with gap */
  min-width: 250px; /* Minimum width for smaller screens */
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #F6F7F9; /* Added background color */
  color:black;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
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

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  label {
    display: flex;
    gap:5px;
    padding:10px;
    align-items: center; /* Align label text with the radio input */
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

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  width: 100px; /* Set width to 100px */
  align-self: flex-end; /* Align button to the right */

  &:hover {
    background: ${({ theme }) => theme.active};
  }
`;

const ImageUploadContainer = styled(FieldContainer)`
  position: relative;
  border: 2px dashed ${({ theme }) => theme.primary};
  background: rgba(52, 131, 235, 0.1); /* Light background for highlight */
  cursor: pointer;
  padding: 20px;
  text-align: center;
`;

const HighlightedImageInput = styled(Input)`
  display: none; /* Hide the default file input */
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  margin-top: 10px;
`;

export default function CarDetails() {
  const theme = useContext(ThemeContext);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    vendorId: '',
    color: '',
    capacity: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    registrationNumber: '',
    price: '',
    carImage: '',
    additionalFeatures: [],
    category: '',
    vehicleAge: '',
    images: []
  });

  const {
    mainCategories,
    categories,
  } = useSelector(state => state.categories);

  const {
    categories: carCategories,  
  } = useSelector(state => state.carCategories);

  const { seats } = useSelector((state) => state.seats);
  const { features } = useSelector((state) => state.carFeatures);
  const { colors } = useSelector((state) => state.carColors);

  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  useEffect(() => {
    dispatch(fetchMainCategories());
    dispatch(fetchCarFeatures());
    dispatch(fetchSeats());
    dispatch(fetchCarCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCarColors());
  }, [dispatch]);

  useEffect(() => {
    if (selectedMainCat) {
      dispatch(fetchCategoriesByParent(selectedMainCat._id));
      setSelectedCat('');
      setFormData(prev => ({ ...prev, brand: selectedMainCat._id }));
    }
  }, [dispatch, selectedMainCat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    const mainCat = mainCategories.find(cat => cat._id === selectedId);
    if (mainCat) {
      setSelectedMainCat(mainCat);
      dispatch(selectMainCategory(selectedId));
      setFormData(prev => ({ ...prev, model: '' }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const category = categories.find(cat => cat._id === selectedId);
    if (category) {
      setSelectedCat(category);
      dispatch(selectCategory(selectedId));
      setFormData(prev => ({ ...prev, model: category._id }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedFeatures = checked
        ? [...prev.additionalFeatures, value]
        : prev.additionalFeatures.filter((feature) => feature !== value);
      return { ...prev, additionalFeatures: updatedFeatures };
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Convert files to base64 strings
    const base64Images = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    setImages(prevImages => [...prevImages, ...base64Images]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Convert files to base64 strings
    const base64Images = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    setImages(prevImages => [...prevImages, ...base64Images]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.brand) {
      toast.error('Please select a brand');
      return;
    }
    if (!formData.model) {
      toast.error('Please select a model');
      return;
    }
    if (!formData.color) {
      toast.error('Please select a color');
      return;
    }
    if (!formData.capacity) {
      toast.error('Please select seating capacity');
      return;
    }
    if (!formData.registrationNumber) {
      toast.error('Please enter registration number');
      return;
    }
    if (!formData.price) {
      toast.error('Please enter price');
      return;
    }
    if (!formData.category) {
      toast.error('Please select car category');
      return;
    }
    if (!formData.vehicleAge) {
      toast.error('Please enter vehicle age');
      return;
    }
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const result = await dispatch(createCar(formData));

      if(result.error)
      {
       toast.success(result.message); 
      }
      toast.success('Car added successfully!');
      // Reset form
      setFormData({
        brand: '',
        model: '',
        vendorId: '',
        color: '',
        capacity: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        registrationNumber: '',
        price: '',
        carImage: [],
        additionalFeatures: [],
        category: '',
        vehicleAge: '',
        images: []
      });
      setImages([]);
      setSelectedMainCat('');
      setSelectedCat('');
    } catch (error) {
      toast.error(error.message || 'Failed to add car');
    }
  };

  return (
    <Container>
      <ToastContainer/>
      <Title>Add Car Details</Title>
      <Form >
        <FieldContainer>
          <Label htmlFor="brand">Brand</Label>
          <Select
            id="mainCategory"
            value={selectedMainCat._id || ''}
            onChange={handleMainCategoryChange}
          >
            <option value="">Select Brand</option>
            {mainCategories.map(mainCat => (
              <option key={mainCat._id} value={mainCat._id}>
                {mainCat.name}
              </option>
            ))}
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="model">Model</Label>
          <Select
            id="category"
            value={selectedCat._id || ''}
            onChange={handleCategoryChange}
            disabled={!selectedMainCat}
          >
            <option value="">Select Model</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="color">Color</Label>
          <Select id="color" name="color" onChange={handleChange}>
            <option value="">Select Color</option>
            {colors.map(color => (
              <option key={color._id} value={color._id}>
                {color.CarColor}
              </option>
            ))}
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="capacity">Capacity (Seater)</Label>
          <Select id="capacity" name="capacity" onChange={handleChange}>
            <option value="">Select Capacity</option>
            {seats.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.seatNumber}
              </option>
            ))}
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select id="fuelType" name="fuelType" onChange={handleChange}>
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label>Car Transmission</Label>
          <RadioGroup onChange={(e) => handleChange(e)}>
            <label>
              <Input
                type="radio"
                name="transmission"
                value="Automatic"
                checked={formData.transmission === "Automatic"}
              />{" "}
              Automatic
            </label>
            <label>
              <Input
                type="radio"
                name="transmission"
                value="Manual"
                checked={formData.transmission === "Manual"}
              />{" "}
              Manual
            </label>
          </RadioGroup>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="registration">Registration Number</Label>
          <Input type="text" id="registration" placeholder="Enter Registration Number" name="registrationNumber" onChange={handleChange} />
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="price">Price</Label>
          <Input type="number" id="price" placeholder="Enter Price" name="price" onChange={handleChange} />
        </FieldContainer>

        <FieldContainer>
          <Label>Additional Features</Label>
          <CheckboxGroup>
            {features.map((feature) => (
              <label key={feature._id}>
                <Input
                  type="checkbox"
                  value={feature._id}
                  checked={formData.additionalFeatures.includes(feature._id)}
                  onChange={(e) => handleCheckboxChange(e)}
                />{" "}
                {feature.featureName}
              </label>
            ))}
          </CheckboxGroup>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="category">Car Category</Label>
          <Select id="category" name="category" onChange={handleChange}>
            <option value="">Select Category</option>
            {carCategories.map(mainCat => (
              <option key={mainCat._id} value={mainCat._id}>
                {mainCat.Carcategory}
              </option>
            ))}
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="vehicleAge">Vehicle Age (in years)</Label>
          <Input type="number" id="vehicleAge" placeholder="Enter Vehicle Age" name="vehicleAge" onChange={handleChange} />
        </FieldContainer>

        <ImageUploadContainer onDrop={handleDrop} onDragOver={handleDragOver}>
          <UploadButton htmlFor="carImage">
            <FaFileUpload style={{ marginRight: '5px' }} /> Upload or Drag & Drop Car Images (Max 5)
          </UploadButton>
          <HighlightedImageInput type="file" id="carImage" multiple onChange={handleImageChange} accept="image/*" />
          <PreviewContainer>
            {images.map((image, index) => (
              <PreviewImage key={index} src={image} alt={`Preview ${index + 1}`} />
            ))}
          </PreviewContainer>
        </ImageUploadContainer>

        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      </Form>
    </Container>
  );
}