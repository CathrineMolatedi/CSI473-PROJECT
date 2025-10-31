import { useState, useEffect } from 'react';
import { paymentService } from '../lib/payment-service';
import { Payment, PaymentStatus } from '../lib/types';

export default function PaymentComponent() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const plans = paymentService.getSubscriptionPlans();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    if (userId) {
      setPaymentHistory(paymentService.getPaymentHistory(userId));
    }
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) {
      setMessage({ type: 'error', text: 'Please select a subscription plan' });
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setProcessing(true);
    setMessage(null);

    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    const result = await paymentService.processPayment(userId, plan.price, {
      method: paymentMethod,
      planId: selectedPlan
    });

    setProcessing(false);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Payment successful! Reference: ${result.reference}. Your subscription has been extended.` 
      });
      setPaymentHistory(paymentService.getPaymentHistory(userId));
    } else {
      setMessage({ type: 'error', text: result.error || 'Payment failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Your existing JSX remains the same */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                BWP {plan.price}
                <span className="text-sm font-normal text-gray-500">/{plan.duration}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                }}
                className={`w-full py-2 rounded-lg font-semibold ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Rest of your JSX remains the same */}
      </div>
    </div>
  );
}