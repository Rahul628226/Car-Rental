import React, { useContext, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeContext } from "./../../App";
import { FaFileUpload } from 'react-icons/fa'; // Importing a file upload icon
import { useDispatch } from 'react-redux';
import { addCar } from '../../Redux/Slicer/Vendor/CarDetails/CarDetails';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCar(formData));
  };

  return (
    <Container>
      <Title>Add Car Details</Title>
      <Form>
        <FieldContainer>
          <Label htmlFor="brand">Brand</Label>
          <Select id="brand" name="brand" onChange={handleChange}>
            <option value="">Select Brand</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Tesla">Tesla</option>
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="model">Model</Label>
          <Input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Enter Model"
          />
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="color" name="color" onChange={handleChange}>Color</Label>
          <Select id="color">
            <option value="">Select Color</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="White">White</option>
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="capacity">Capacity (Seater)</Label>
          <Select id="capacity" name="capacity" onChange={handleChange}>
            <option value="">Select Capacity</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="7">7</option>
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
            <label>
              <Input
                type="checkbox"
                value="GPS"
                checked={formData.additionalFeatures.includes("GPS")}
                onChange={(e) => handleCheckboxChange(e)}
              />{" "}
              GPS
            </label>
            <label>
              <Input
                type="checkbox"
                value="Bluetooth"
                checked={formData.additionalFeatures.includes("Bluetooth")}
                onChange={(e) => handleCheckboxChange(e)}
              />{" "}
              Bluetooth
            </label>
          </CheckboxGroup>
        </FieldContainer>


        <FieldContainer>
          <Label htmlFor="category">Car Category</Label>
          <Select id="category" name="category" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
          </Select>
        </FieldContainer>

        <FieldContainer>
          <Label htmlFor="vehicleAge">Vehicle Age (in years)</Label>
          <Input type="number" id="vehicleAge" placeholder="Enter Vehicle Age" name="vehicleAge" onChange={handleChange} />
        </FieldContainer>

        <ImageUploadContainer onDrop={handleDrop} onDragOver={handleDragOver}>
          <UploadButton htmlFor="carImage">
            <FaFileUpload style={{ marginRight: '5px' }} /> Upload or Drag & Drop Car Images
          </UploadButton>
          <HighlightedImageInput type="file" id="carImage" multiple onChange={handleImageChange} />
          <PreviewContainer>
            {images.map((image, index) => (
              <PreviewImage key={index} src={image} alt={`Preview ${index + 1}`} />
            ))}
          </PreviewContainer>
        </ImageUploadContainer>

        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}
