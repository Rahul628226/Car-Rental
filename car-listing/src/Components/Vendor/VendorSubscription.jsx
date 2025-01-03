import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPricingPlans } from '../../Redux/Slicer/Admin/PricingSlicer';
import { createVendorSubscription, fetchVendorSubscription, updateVendorSubscription } from '../../Redux/Slicer/Vendor/VendorReg/vendorSubscription';

const VendorSubscription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planId } = useParams();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const { plans, loading: plansLoading, error } = useSelector((state) => state.pricingPlans);
  const { subscription } = useSelector((state) => state.vendorSubscription);

  const selectedPlan = plans.find((plan) => plan._id === planId);

  useEffect(() => {
    dispatch(fetchPricingPlans());
    dispatch(fetchVendorSubscription());
  }, [dispatch]);

  if (plansLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12">Error: {error}</div>;
  }

  if (!selectedPlan) {
    return <div className="text-center py-12">Plan not found</div>;
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const subscriptionData = {
        PricingPlanId: selectedPlan._id,
        plantype: selectedPlan.name,
        amount: selectedPlan.monthlyprice,
        payment_status: 'pending',
        start_date: new Date(),
        duration: 'monthly',
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        SubScriptionstatus: 'active',
      };

      if (subscription?.SubScriptionstatus === 'active' || subscription?._id) {
        await dispatch(
          updateVendorSubscription({
            subscriptionId: subscription._id,
            updatedData: subscriptionData,
          })
        ).unwrap();
      } else {
        await dispatch(createVendorSubscription(subscriptionData)).unwrap();
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {subscription?.SubScriptionstatus === 'active'
                ? `Upgrade to ${selectedPlan.name}`
                : `Subscribe to ${selectedPlan.name}`}
            </h2>
            <p className="text-gray-600">
              {selectedPlan.description || 'Get started with our premium features'}
            </p>
          </div>

          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handlePaymentMethodChange('card')}
              >
                <label className="ml-3 font-medium text-gray-700">
                  Credit/Debit Card
                </label>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handlePaymentMethodChange('upi')}
              >
                <label className="ml-3 font-medium text-gray-700">UPI Payment</label>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span>₹{selectedPlan.monthlyprice}</span>
            </div>
          </div>

          <div className="px-6 py-8">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSubscription;
