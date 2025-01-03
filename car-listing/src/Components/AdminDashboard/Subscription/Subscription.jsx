import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchPricingPlans, 
  addPricingPlan, 
  updatePricingPlan,
  deletePricingPlan 
} from '../../../Redux/Slicer/Admin/PricingSlicer';



const Subscription = () => {
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

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-black">
            {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-black">Plan Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-black"
                  placeholder="Enter plan name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required={!selectedPlan}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-black">Monthly Price (₹)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-black"
                  type="number"
                  placeholder="0.00"
                  value={formData.monthlyprice}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyprice: e.target.value }))}
                  required={!selectedPlan}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-black">Yearly Discount (%)</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-black"
                  type="number"
                  placeholder="Enter yearly discount percentage"
                  value={formData.yearlyDiscountedPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearlyDiscountedPrice: e.target.value }))}
                  min="0"
                  max="100"
                  required={!selectedPlan}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-black">Max Products</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 text-sm text-black"
                  type="number"
                  placeholder="Enter max products"
                  value={formData.maxProducts}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxProducts: e.target.value }))}
                  required={!selectedPlan}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-medium text-black">Features</label>
              <div className="flex gap-3">
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 text-sm text-black"
                  placeholder="Enter feature name"
                  value={newFeature.name}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, name: e.target.value }))}
                />
                <select 
                  className="px-3 py-2 border border-gray-300 text-sm text-black"
                  value={newFeature.status}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, status: e.target.value === 'true' }))}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 border border-orange-500 text-black hover:bg-orange-50 text-sm"
                >
                  Add Feature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="w-4 h-4 text-orange-500 border-gray-300"
                />
                <span className="text-sm text-black">Mark as Popular Plan</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-100 text-black text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white text-sm"
                >
                  {selectedPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan._id}
              className={`relative bg-white shadow ${plan.isPopular ? 'border border-orange-500' : ''}`}
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
      </div>

      {showAlert.show && (
        <div className={`fixed bottom-4 right-4 p-3 shadow text-sm ${
          showAlert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {showAlert.message}
        </div>
      )}
    </div>
  );
};

export default Subscription;