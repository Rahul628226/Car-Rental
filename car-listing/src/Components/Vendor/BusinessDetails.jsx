import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorInfo } from "../../Redux/Slicer/Vendor/VendorReg/VendorReg";
import { createOrUpdateVendorDetails, fetchVendorDetails } from "../../Redux/Slicer/Vendor/VendorReg/vendorDetailsSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';

const Container = styled.div`
  display: flex;
  gap:20px;
  flex-direction: row;
  min-height: 100vh;
  padding: 30px;
  background: ${({ theme }) => theme.bg2};
  font-family: 'Helvetica Neue', Arial, sans-serif;
  // width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor:pointer;
  width: 100%;
  box-sizing: border-box;
  background-color: #F6F7F9;
  transition: border-color 0.3s, box-shadow 0.3s;
  color: black;
  option {
    padding: 10px;
  }
`;

const Section = styled.div`
  display: block;
  min-width:50%; 
  @media (min-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
`;

const Title = styled.h2`
  text-align: left;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const FieldContainer = styled.div`
display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 250px;

  @media (min-width: 768px) {
    width: 100%;
  }
`;

const FullWidthFieldContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme.bg4};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  // gap: 20px;
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

const Row = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
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
  width: 150px;
  align-self: flex-start;

  &:hover {
    background: ${({ theme }) => theme.active};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px;
  }
`;

const LogoPreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  margin-top: 10px;
`;

const StyledPhoneInput = styled(PhoneInput)`
  .form-control {
    // padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #F6F7F9;
    color: black;
    height:48px;
    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
    }
  }
`;

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#F6F7F9",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    height: "48px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#007BFF", // Example primary color
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "black",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "5px",
    zIndex: 999,
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "white" : "black",
    backgroundColor: state.isSelected ? "#007BFF" : "white",
    "&:hover": {
      backgroundColor: "#007BFF",
      color: "white",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "gray",
  }),
};

const BusinessForm = () => {
  const dispatch = useDispatch();

  const { vendor } = useSelector((state) => state.vendor);
  const { data, loading, error } = useSelector((state) => state.vendorDetails);

  useEffect(() => {
    // Fetch vendor details for logged-in vendor on component mount
    dispatch(fetchVendorDetails());
  }, [dispatch]);

  const [businessInfo, setBusinessInfo] = useState({
    firstname: "",
    lastname: "",
    location: "",
    address: "",
    street: "",
    door: "",
    building: "",
    state: "",
    country: "",
    starttime: "",
    endtime: "",
    phone: "",
    currency: "",
    logo: "",
    businessVerify: "",
  });

  const [logo, setLogo] = useState(null);
  const [businessVerify, setBusinessVerify] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  useEffect(() => {
    const vendorId = localStorage.getItem('id')
    dispatch(fetchVendorInfo(vendorId));
  }, [dispatch]);

  useEffect(() => {
    if (vendor) {
      setBusinessInfo((prevInfo) => ({
        ...prevInfo,
        firstname: vendor?.firstname || "",
        lastname: vendor?.lastname || "",
      }));
    }
  }, [vendor]);

  useEffect(() => {
    if (data) {
      setBusinessInfo((prevInfo) => ({
        ...prevInfo,
        location: data?.location || "",
        address: data?.address || "",
        street: data?.street || "",
        door: data?.door || "",
        building: data?.building || "",
        state: data?.state || "",
        country: data?.country || "",
        starttime: data?.starttime || "",
        endtime: data?.endtime || "",
        currency: data?.currency || "",
        phone: data?.phone || "",
        logo: data?.logo || "",
        businessVerify: data?.businessVerify || "",
      }));
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo({ ...businessInfo, [name]: value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
        setBusinessInfo({ ...businessInfo, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBusinessVerifyUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBusinessVerify(reader.result);
        setBusinessInfo({ ...businessInfo, businessVerify: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchCountries = async (inputValue) => {
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      const data = await response.json();
      const filteredCountries = data.data.filter((country) =>
        country.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filteredCountries.map((country) => ({ label: country.name, value: country.name }));
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (country) => {
    setLoadingStates(true);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country }),
      });
      const data = await response.json();
      setStates(data.data.states.map((state) => ({ label: state.name, value: state.name })));
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };



  // Load options dynamically based on user input
  const loadStateOptions = (inputValue) => {
    return new Promise((resolve) => {
      const filteredStates = states.filter((state) =>
        state.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      resolve(filteredStates);
    });
  };


  const handleCountryChange = (selectedOption) => {
    const selected = selectedOption ? selectedOption.value : "";
    setSelectedCountry(selected);
    setBusinessInfo({ ...businessInfo, country: selected });
    if (selected) {
      fetchStates(selected, "");
    } else {
      setStates([]);
    }
  };

  const handleStateChange = (selectedOption) => {
    const selected = selectedOption ? selectedOption.value : "";
    setBusinessInfo({ ...businessInfo, state: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrUpdateVendorDetails({ updateData: businessInfo }));
  };

  useEffect(() => {
    fetchCountries("");
  }, []);

  return (
    <Container>
     
      <Section>
        <Title>Enter Business Details</Title>
        <Form onSubmit={handleSubmit}>

          <Row><FieldContainer>
            <Label>First Name</Label>
            <Input
              name="firstname"
              value={businessInfo.firstname}
              onChange={handleInputChange}
              placeholder="Enter First Name"
              disabled={!!vendor?.firstname}
            />

          </FieldContainer>
            <FieldContainer>
              <Label>Last Name</Label>
              <Input
                name="lastname"
                value={businessInfo.lastname}
                onChange={handleInputChange}
                placeholder="Enter Last Name"
                disabled={!!vendor?.lastname}
              />
            </FieldContainer></Row>

          <Row>
            <FieldContainer>
              <Label>Phone</Label>
              <StyledPhoneInput
                country={'ae'}
                value={businessInfo.phone}
                onChange={(phone) => setBusinessInfo({ ...businessInfo, phone })}
              />
            </FieldContainer>

            <FieldContainer>
              <Label>Location</Label>
              <Input
                name="location"
                value={businessInfo.location}
                onChange={handleInputChange}
                placeholder="Enter Location"
              />
            </FieldContainer>

          </Row>
          <Row>
            <FieldContainer>
              <Label>Address</Label>
              <Input
                name="address"
                value={businessInfo.address}
                onChange={handleInputChange}
                placeholder="Enter Address"
              />
            </FieldContainer>
            <FieldContainer>
              <Label>Building</Label>
              <Input
                name="building"
                value={businessInfo.building}
                onChange={handleInputChange}
                placeholder="Enter Building"
              />
            </FieldContainer>
          </Row>
          <Row>
            <FieldContainer>
              <Label>Street</Label>
              <Input
                name="street"
                value={businessInfo.street}
                onChange={handleInputChange}
                placeholder="Enter Street"
              />
            </FieldContainer>
            <FieldContainer>
              <Label>Door</Label>
              <Input
                name="door"
                value={businessInfo.door}
                onChange={handleInputChange}
                placeholder="Enter Door"
              />
            </FieldContainer>
          </Row>

          <Row>
            <FieldContainer>
              <Label>Country</Label>
              {loadingCountries ? (
                <p>Loading countries...</p>
              ) : (
                <AsyncSelect
                  cacheOptions
                  loadOptions={fetchCountries}
                  defaultOptions
                  onChange={handleCountryChange}
                  styles={customStyles}
                  value={businessInfo?.country ? { label: businessInfo?.country, value: businessInfo?.country } : null}
                />
              )}
            </FieldContainer>
            <FieldContainer>
              <Label>State</Label>
              {loadingStates ? (
                <p>Loading states...</p>
              ) : (
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadStateOptions} // Dynamically filter states
                  defaultOptions={states} // Show all states initially
                  onChange={handleStateChange}
                  value={businessInfo.state ? { label: businessInfo.state, value: businessInfo.state } : null}
                  placeholder="Search or select a state"
                  styles={customStyles} // Apply the custom styles
                />
              )}
            </FieldContainer>
          </Row>


          <Row>

            <FieldContainer>
              <Label>starttime</Label>
              <Input
                type='time'
                name="starttime"
                value={businessInfo.starttime}
                onChange={handleInputChange}
                placeholder="Enter starttime"
              />
            </FieldContainer>
            <FieldContainer>
              <Label>endtime</Label>
              <Input
                type='time'
                name="endtime"
                value={businessInfo.endtime}
                onChange={handleInputChange}
                placeholder="Enter endtime"
              />
            </FieldContainer>

            <FieldContainer>
              <Label>Currency</Label>
              <Select
                name="currency"
                value={businessInfo.currency}
                onChange={handleInputChange}
              >
                <option value="">Select currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="QAR">QAR - Qatari Riyal</option>
                <option value="BHD">BHD - Bahraini Dinar</option>
                <option value="KWD">KWD - Kuwaiti Dinar</option>
                <option value="OMR">OMR - Omani Rial</option>
                <option value="EGP">EGP - Egyptian Pound</option>
                <option value="TRY">TRY - Turkish Lira</option>
                {/* Add more currencies as needed */}
              </Select>
            </FieldContainer>

          </Row>
          <Row>
            <FieldContainer>
              <Label>Upload Logo</Label>
              <Input type="file" onChange={handleLogoUpload} />
              {businessInfo.logo && <LogoPreview src={businessInfo.logo} alt="Logo Preview" />}
            </FieldContainer>
            <FieldContainer>
              <Label>Upload Business Verification</Label>
              <Input type="file" onChange={handleBusinessVerifyUpload} />
              {businessInfo.businessVerify && <LogoPreview src={businessInfo.businessVerify} alt="Business Verification Preview" />}
            </FieldContainer>
          </Row>

          <Button type="submit">Submit</Button>

        </Form>
      </Section>
      <Section>

      </Section>

    </Container>
  );
};

export default BusinessForm