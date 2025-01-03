import React, { useContext, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemeContext } from "./../../App";
import { FaFileUpload, FaTrash } from 'react-icons/fa'; // Importing a file upload icon and delete icon
import { useDispatch, useSelector } from 'react-redux';
import { createCar } from '../../Redux/Slicer/Vendor/CarDetails/CarDetails';
import {
  fetchMainCategories,
  fetchCategoriesByParent,
  selectMainCategory,
  selectCategory,
} from '../../Redux/Slicer/Admin/CarBrand/Categoryslicer';

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
import GuidedTour from '../Common/GuidedTour';
import DescriptionGenerator from './DescriptionGenerator';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  padding-top: 30px;
  background: ${({ theme }) => theme.bg2};
  font-family: 'Helvetica Neue', Arial, sans-serif;
  width: 90%;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 60px;
    width: 100%;
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
  flex-direction: column;
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
  width: 100%;
  min-width: 250px;

  @media (min-width: 768px) {
    width: 48%;
  }
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
  background-color: #F6F7F9;
  color: black;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #F6F7F9;
  transition: border-color 0.3s, box-shadow 0.3s;
  color: black;
  option {
    padding: 10px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  label {
    display: flex;
    gap: 5px;
    padding: 10px;
    align-items: center;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FeatureLabel = styled.label`
  font-size: 14px;
   color: ${({ theme }) => theme.text};
  width: 300px;

`;

const Input1 = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #007bff; /* Customize the checkbox color */
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
  width: 100px;
  align-self: flex-end;

  &:hover {
    background: ${({ theme }) => theme.active};
  }
`;

const ImageUploadContainer = styled(FieldContainer)`
  position: relative;
  border: 2px dashed ${({ theme }) => theme.primary};
  background: rgba(52, 131, 235, 0.1);
  cursor: pointer;
  padding: 20px;
  text-align: center;
`;

const HighlightedImageInput = styled(Input)`
  display: none;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.primary};
    border-radius: 5px;
  }
  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 5px;
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  margin-top: 10px;
`;

const Section = styled.div`
  display: ${({ active }) => (active ? 'block' : 'none')};
  @media (min-width: 768px) {
    display:  ${({ active }) => (active ? 'flex' : 'none')};
    flex-wrap: wrap;
    gap: 20px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  // margin-top: 20px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bg4};
  border-top: 1px solid ${({ theme }) => theme.primary};
`;

const FooterButton = styled.button`
 
  padding: 10px 20px;
  height:45px;
  &:nth-child(1) {
    background: gray;
    
  }
  &:nth-child(2) {
    background: ${({ theme }) => theme.success};
    margin-left:5px;
  }
  &:nth-child(3) {
    background: ${({ theme }) => theme.success};
  }
`;

export default function CarDetails() {
  const theme = useContext(ThemeContext);
  const [images, setImages] = useState([]);
  const [exteriorImages, setExteriorImages] = useState([]);
  const { error } = useSelector((state) => state.car);
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
    yearOfManufacture: '',
    images: [],
    exteriorImages: [],
    vin: '',
    mileage: '',
    doors: '',
    driveTerrain: '',
    tireCondition: '',
    tradingOption: '',
    priceNegotiation: '',
    description: ''
  });

  const [currentSection, setCurrentSection] = useState(0);

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
      localStorage.setItem('carFormData', JSON.stringify(formData));
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

  const handleExteriorImageChange = async (e) => {
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

    setExteriorImages(prevImages => [...prevImages, ...base64Images]);
    setFormData(prev => ({
      ...prev,
      exteriorImages: [...(prev.exteriorImages || []), ...base64Images], // Default to empty array if undefined
    }));
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

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const validateSection = (section) => {
    const missingFields = [];

    switch (section) {
      case 0:
        if (!formData.brand) missingFields.push("Brand");
        if (!formData.model) missingFields.push("Model");
        if (!formData.yearOfManufacture) missingFields.push("Year of Manufacture");
        if (!formData.registrationNumber) missingFields.push("Registration Number");
        if (!formData.vin) missingFields.push("VIN");
        if (!formData.category) missingFields.push("Car Categories");
        if (!formData.transmission) missingFields.push("Transmission");
        if (!formData.fuelType) missingFields.push("Fuel Type");
        break;
      case 1:
        if (!formData.color) missingFields.push("Color");
        if (!formData.capacity) missingFields.push("Capacity");
        if (!formData.mileage) missingFields.push("Mileage");
        if (!formData.doors) missingFields.push("Doors");
        if (!formData.driveTerrain) missingFields.push("Drive Terrain");
        if (!formData.tireCondition) missingFields.push("Tire Condition");
        if (!formData.tradingOption) missingFields.push("Trading Option");
        break;
      case 2:
        if (!formData.price) missingFields.push("Price");
        if (!formData.vehicleAge) missingFields.push("Vehicle Age");
        if (!formData.priceNegotiation) missingFields.push("Price Negotiation");
        if (!formData.description) missingFields.push("Description");
        break;
      case 3:
        if (formData.images.length === 0) missingFields.push("Images");
        if (formData.exteriorImages.length === 0) missingFields.push("Exterior Images");
        break;
      default:
        return true;
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
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
    if (!formData.yearOfManufacture) {
      toast.error('Please select year of manufacture');
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    if (!formData.exteriorImages || formData.exteriorImages.length === 0) {
      toast.error('Please upload at least one exterior image');
      return;
    }
    if (!formData.vin) {
      toast.error('Please enter VIN');
      return;
    }
    if (!formData.mileage) {
      toast.error('Please enter mileage');
      return;
    }
    if (!formData.doors) {
      toast.error('Please select number of doors');
      return;
    }
    if (!formData.driveTerrain) {
      toast.error('Please select drive terrain');
      return;
    }
    if (!formData.tireCondition) {
      toast.error('Please select tire condition');
      return;
    }
    if (!formData.tradingOption) {
      toast.error('Please select trading option');
      return;
    }
    if (!formData.priceNegotiation) {
      toast.error('Please select price negotiation option');
      return;
    }
    if (!formData.description) {
      toast.error('Please enter description');
      return;
    }

    try {
      const result = await dispatch(createCar(formData)).unwrap();
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
        images: [], // Ensure the field matches validation
        exteriorImages: [],
        additionalFeatures: [],
        category: '',
        vehicleAge: '',
        yearOfManufacture: '',
        vin: '',
        mileage: '',
        doors: '',
        driveTerrain: '',
        tireCondition: '',
        tradingOption: '',
        priceNegotiation: '',
        description: ''
      });
      setImages([]);
      setExteriorImages([]);
      setSelectedMainCat('');
      setSelectedCat('');
      // localStorage.removeItem('carFormData'); // Clear local storage after successful submission
    } catch (error) {
      if (error.includes('E11000 duplicate key error')) {
        toast.error('Duplicate registration number. Please use a unique registration number.');
      } else {
        toast.error(error || 'Error creating car');
      }
    }
  };

  const saveForNextEntry = () => {
    localStorage.setItem('carFormData', JSON.stringify(formData));
    toast.success('Details saved for next entry!');
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('carFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      setFormData(parsedFormData);
      setImages(parsedFormData.images || []);
      setExteriorImages(parsedFormData.exteriorImages || []);
      setSelectedMainCat(mainCategories.find(cat => cat._id === parsedFormData.brand) || '');
      setSelectedCat(categories.find(cat => cat._id === parsedFormData.model) || '');
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render


  const removeImage = (index, type) => {
    if (type === 'images') {
      setImages(prevImages => prevImages.filter((_, i) => i !== index));
      setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    } else if (type === 'exteriorImages') {
      setExteriorImages(prevImages => prevImages.filter((_, i) => i !== index));
      setFormData(prev => ({ ...prev, exteriorImages: prev.exteriorImages.filter((_, i) => i !== index) }));
    }
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1950; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <Container>
    
      <Title>Add Car Details</Title>
      <Form>
        <Section active={currentSection === 0} >


          <FieldContainer>
            <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
            <Select id="yearOfManufacture" name="yearOfManufacture" value={formData.yearOfManufacture} onChange={handleChange}>
              <option value="">Select Year</option>
              {getYears().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </FieldContainer>

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
            <Label htmlFor="vin">VIN (Last 4 digits)</Label>
            <Input type="text" id="vin" placeholder="Enter VIN" name="vin" maxLength="4" value={formData.vin} onChange={handleChange} />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="registration">Registration Number</Label>
            <Input type="text" id="registration" placeholder="Enter Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="category">Car Category</Label>
            <Select id="category" name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {carCategories.map(mainCat => (
                <option key={mainCat._id} value={mainCat._id}>
                  {mainCat.Carcategory}
                </option>
              ))}
            </Select>
          </FieldContainer>


          <FieldContainer>
            <Label>Car Transmission</Label>
            <Select
              name="transmission"
              value={formData.transmission || ""}
              onChange={(e) => handleChange(e)}
            >
              <option value="" disabled>
                Select Transmission
              </option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
              <option value="Continuously Variable Transmission (CVT)">CVT</option>
              <option value="Dual-Clutch Transmission (DCT)">DCT</option>
            </Select>
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select id="fuelType" name="fuelType" onChange={(e) => handleChange(e)} value={formData?.fuelType || ""}>
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </Select>
          </FieldContainer>

        </Section>

        <Section active={currentSection === 1}>

      
          <DescriptionGenerator brand={selectedMainCat.name} model={selectedCat.name}/>

      

          <FieldContainer>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter Color"
            />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="capacity">Capacity (Seater)</Label>
            <Select id="capacity" name="capacity" value={formData.capacity} onChange={handleChange}>
              <option value="">Select Capacity</option>
              {seats.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.seatNumber}
                </option>
              ))}
            </Select>
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="mileage">Mileage</Label>
            <Input type="number" id="mileage" placeholder="Enter Mileage" name="mileage" value={formData.mileage} onChange={handleChange} />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="doors">Doors</Label>
            <Select id="doors" name="doors" value={formData.doors} onChange={handleChange}>
              <option value="">Select Number of Doors</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="driveTerrain">Drive Terrain</Label>
            <Select id="driveTerrain" name="driveTerrain" value={formData.driveTerrain} onChange={handleChange}>
              <option value="">Select Drive Terrain</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
              <option value="AWD">AWD</option>
              <option value="4WD">4WD</option>
            </Select>
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="tireCondition">Tire Condition</Label>
            <Select id="tireCondition" name="tireCondition" value={formData.tireCondition} onChange={handleChange}>
              <option value="">Select Tire Condition</option>
              <option value="bad">Bad</option>
              <option value="good">Good</option>
              <option value="new">New</option>
            </Select>
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="tradingOption">Trading Option</Label>
            <Select id="tradingOption" name="tradingOption" value={formData.tradingOption} onChange={handleChange}>
              <option value="">Select Trading Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FieldContainer>

        </Section>

        <Section active={currentSection === 2}>


          <FieldContainer>
            <Label htmlFor="price">Price</Label>
            <Input type="number" id="price" placeholder="Enter Price" name="price" value={formData.price} onChange={handleChange} />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="priceNegotiation">Price Negotiation</Label>
            <Select id="priceNegotiation" name="priceNegotiation" value={formData.priceNegotiation} onChange={handleChange}>
              <option value="">Select Price Negotiation Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="description">Description</Label>
            <Input type="text" id="description" placeholder="Enter Description" name="description" value={formData.description} onChange={handleChange} />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="vehicleAge">Vehicle Age (in years)</Label>
            <Input type="number" id="vehicleAge" placeholder="Enter Vehicle Age" name="vehicleAge" value={formData.vehicleAge} onChange={handleChange} />
          </FieldContainer>

          <FieldContainer>
            <Label>Additional Features</Label>
            <CheckboxGroup>
              {features.map((feature) => (
                <CheckboxItem key={feature._id}>
                  <FeatureLabel>{feature.featureName}</FeatureLabel>
                  <Input
                    type="checkbox"
                    value={feature._id}
                    checked={formData.additionalFeatures.includes(feature._id)}
                    onChange={(e) => handleCheckboxChange(e)}
                  />

                </CheckboxItem>
              ))}
            </CheckboxGroup>

          </FieldContainer>
        </Section>

        <Section active={currentSection === 3}>
          <ImageUploadContainer onDrop={handleDrop} onDragOver={handleDragOver}>
            <UploadButton htmlFor="carImage">
              <FaFileUpload style={{ marginRight: '5px' }} /> Upload or Drag & Drop Car Images (Max 5)
            </UploadButton>
            <HighlightedImageInput type="file" id="carImage" multiple onChange={handleImageChange} accept="image/*" />
            <PreviewContainer>
              {images.map((image, index) => (
                <PreviewImage key={index}>
                  <img src={image} alt={`Preview ${index + 1}`} />
                  <button onClick={() => removeImage(index, 'images')}><FaTrash /></button>
                </PreviewImage>
              ))}
            </PreviewContainer>
          </ImageUploadContainer>

          <ImageUploadContainer>
            <UploadButton htmlFor="exteriorImage">
              <FaFileUpload style={{ marginRight: '5px' }} /> Upload or Drag & Drop Exterior Images (Max 5)
            </UploadButton>
            <HighlightedImageInput type="file" id="exteriorImage" multiple onChange={handleExteriorImageChange} accept="image/*" />
            <PreviewContainer>
              {exteriorImages.map((image, index) => (
                <PreviewImage key={index}>
                  <img src={image} alt={`Preview ${index + 1}`} />
                  <button onClick={() => removeImage(index, 'exteriorImages')}><FaTrash /></button>
                </PreviewImage>
              ))}
            </PreviewContainer>
          </ImageUploadContainer>
        </Section>
        <Footer>
          <FooterButton type="button" onClick={saveForNextEntry}>Save as draft</FooterButton>
          <NavigationButtons>
            {currentSection > 0 && <FooterButton type="button" onClick={handlePrevious} style={{ background: theme.secondary }}>Previous</FooterButton>}
            {currentSection < 3 && <FooterButton type="button" onClick={handleNext} style={{ background: theme.primary }}>Next</FooterButton>}
            {currentSection === 3 && <FooterButton type="submit" onClick={handleSubmit} style={{ background: theme.success }}>Submit</FooterButton>}
          </NavigationButtons>
        </Footer>
      </Form>

    </Container>
  );
}