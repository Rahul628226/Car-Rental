import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchPricingPlans,
    addPricingPlan,
    updatePricingPlan,
    deletePricingPlan
} from '../../../Redux/Slicer/Admin/PricingSlicer';

import styled from 'styled-components';

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


export default function PricingDetails() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { plans, loading, error } = useSelector((state) => state.pricingPlans);

    const initialFormState = {
        name: '',
        monthlyprice: '',
        yearlyDiscountedPrice: '',
        features: [],
        isPopular: false,
        maxProducts: ''
    };

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showAlert, setShowAlert] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState(initialFormState);
    const [newFeature, setNewFeature] = useState({ name: '', status: true });

    useEffect(() => {
        dispatch(fetchPricingPlans());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
            if (value !== '') {
                if (key === 'features') {
                    acc[key] = value;
                } else if (['monthlyprice', 'yearlyDiscountedPrice', 'maxProducts'].includes(key)) {
                    acc[key] = Number(value);
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {});

        try {
            if (selectedPlan) {
                await dispatch(updatePricingPlan({ id: selectedPlan._id, updatedData: updatedFields })).unwrap();
                setShowAlert({ show: true, message: 'Plan updated successfully!', type: 'success' });
            } else {
                await dispatch(addPricingPlan(updatedFields)).unwrap();
                setShowAlert({ show: true, message: 'Plan added successfully!', type: 'success' });
            }
            resetForm();
        } catch (err) {
            setShowAlert({ show: true, message: err.message || 'An error occurred', type: 'error' });
        }
    };

    const resetForm = () => {
        setSelectedPlan(null);
        setFormData(initialFormState);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await dispatch(deletePricingPlan(id)).unwrap();
                setShowAlert({ show: true, message: 'Plan deleted successfully!', type: 'success' });
            } catch (err) {
                setShowAlert({ show: true, message: err.message || 'An error occurred', type: 'error' });
            }
        }
    };

    const addFeature = () => {
        if (newFeature.name.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, { ...newFeature }]
            }));
            setNewFeature({ name: '', status: true });
        }
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <><Container>
            <Title> {selectedPlan ? 'Edit Plan' : 'Create New Plan'}</Title>
            <Form>
                {/* <FieldContainer>
<Label htmlFor="brand">Plan Name</Label>
<Select id="brand">
<option value="">Select Brand</option>
<option value="Toyota">Toyota</option>
<option value="BMW">BMW</option>
<option value="Tesla">Tesla</option>
</Select>
</FieldContainer> */}

                <FieldContainer>
                    <Label htmlFor="model">Plan Name</Label>
                    <Input type="text" id="model" placeholder="Enter Plan Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required={!selectedPlan} />
                </FieldContainer>

                <FieldContainer>
                    <Label htmlFor="model">Monthly Price</Label>
                    <Input type="number"
                        placeholder="0.00"
                        value={formData.monthlyprice}
                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyprice: e.target.value }))}
                        required={!selectedPlan} />
                </FieldContainer>



                <FieldContainer>
                    <Label htmlFor="model">Yearly Discount (%)</Label>
                    <Input type="number"
                        placeholder="Enter yearly discount percentage"
                        value={formData.yearlyDiscountedPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, yearlyDiscountedPrice: e.target.value }))}
                        min="0"
                        max="100"
                        required={!selectedPlan} />
                </FieldContainer>


                <FieldContainer>
                    <Label htmlFor="model">Max Products</Label>
                    <Input type="number"
                        placeholder="Enter max products"
                        value={formData.maxProducts}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxProducts: e.target.value }))}
                        required={!selectedPlan} />
                </FieldContainer>


                <FieldContainer>
                    <Label htmlFor="model">Features</Label>

                    <div className="flex gap-3">
                        <Input type="text"
                            placeholder="Enter feature name"
                            value={newFeature.name}
                            onChange={(e) => setNewFeature(prev => ({ ...prev, name: e.target.value }))} />


                        <Select
                            className="px-3 py-2 border border-gray-300 text-sm text-black"
                            value={newFeature.status}
                            onChange={(e) => setNewFeature(prev => ({ ...prev, status: e.target.value === 'true' }))}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </Select>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="px-4 py-2 border border-orange-500 text-black hover:bg-orange-50 text-sm"
                        >
                            Add
                        </button>
                    </div>

                </FieldContainer>



                <FieldContainer>

                    {formData.features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 ${feature.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-sm text-black">{feature.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-500 p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </FieldContainer>





                <FieldContainer>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Label>Mark as Popular Plan</Label>
                        <input
                            type="checkbox"
                            checked={formData.isPopular}
                            onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                            className="w-4 h-4 text-orange-500 mb-1 border-gray-300" />


                    </label>
                </FieldContainer>




                <div className="flex gap-3">
                    <button
                        type="button"

                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-100 text-black text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white text-sm"
                    >
                        {selectedPlan ? 'Update Plan' : 'Create Plan'}
                    </button>
                </div>

            </Form>

            {showAlert.show && (
                <div className={`fixed bottom-4 right-4 p-3 shadow text-sm ${showAlert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                    {showAlert.message}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        className={`relative bg-white shadow-lg rounded-lg ${plan.isPopular ? 'border border-orange-500' : ''}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-500 text-white">
                                    Popular Choice
                                </span>
                            </div>
                        )}

                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-3 text-black">{plan.name}</h2>
                            <div className="flex items-baseline mb-4">
                                <span className="text-2xl font-bold text-black">₹{plan.monthlyprice}</span>
                                <span className="text-gray-500 ml-1 text-sm">/month</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-black mb-2">Plan Features</h3>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 ${feature.status ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                <span className="text-sm text-black">{feature.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-black">Max Products: {plan.maxProducts}</span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedPlan(plan);
                                                    setFormData({
                                                        ...plan,
                                                        features: plan.features
                                                    });
                                                }}
                                                className="p-1 text-orange-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan._id)}
                                                className="p-1 text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </Container></>
    );
}