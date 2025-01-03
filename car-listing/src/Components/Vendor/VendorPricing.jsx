import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPricingPlans } from '../../Redux/Slicer/Admin/PricingSlicer';
import { fetchVendorSubscription } from '../../Redux/Slicer/Vendor/VendorReg/vendorSubscription';

export const VendorPricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch pricing plans from Redux store
  const { plans = [], loading, error } = useSelector((state) => state.pricingPlans);
  const { subscription } = useSelector((state) => state.vendorSubscription);

  useEffect(() => {
    const init = async () => {
      await dispatch(fetchPricingPlans());
      await dispatch(fetchVendorSubscription());
      
      // Check subscription status and redirect if active
      if (subscription?.SubScriptionstatus === 'active') {
        navigate('/dashboard');
        return;
      }
    };
    
    init();
  }, [dispatch, navigate, subscription]);

  const handleToggle = (planType) => {
    setIsAnnual(planType === 'annual');
  };

  const handleGetStarted = (planId) => {
    navigate(`/subscription-plan/${planId}`);
  };

  const totalYearlyPrice = plans.reduce((sum, plan) => sum + plan.yearlyDiscountedPrice, 0);
  const averageYearlyPrice = plans.length ? (totalYearlyPrice / plans.length).toFixed(2) : 0;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="py-12 ">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Plans and Pricing</h2>
        <p className="text-1xl mb-12">
          Receive unlimited credits when you pay yearly, and save on your plan.
        </p>

        {/* Plan Toggle Buttons */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-lg ${
              !isAnnual
                ? 'bg-black text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
            onClick={() => handleToggle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-lg ${
              isAnnual
                ? 'bg-black text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
            onClick={() => handleToggle('annual')}
          >
            Annual{' '}
            <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">
              Save {averageYearlyPrice} %
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            return (
              <div
                key={plan._id}
                className={`p-6 rounded-lg shadow-lg ${
                  plan.isPopular ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {plan.name}{' '}
                  {plan.isPopular && (
                    <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                </h3>
                <p className="text-4xl font-bold mb-2">
                  {isAnnual ? `$${plan.yearlyprice}` : `$${plan.monthlyprice}`}
                </p>
                <p className="mb-6">
                  {isAnnual
                    ? 'Per user/month, billed annually'
                    : 'Per user/month, billed monthly'}
                </p>
                <ul className="text-left mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature._id} className="flex items-center">
                      <span
                        className={`w-4 h-4 ${
                          feature.status ? 'bg-green-500' : 'bg-red-500'
                        } rounded-full mr-2`}
                      ></span>
                      {feature.name}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleGetStarted(plan._id)}
                  className={`w-full px-4 py-2 ${
                    plan.isPopular ? 'bg-white text-black' : 'bg-black text-white'
                  } rounded-lg`}
                >
                  Get started with {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
