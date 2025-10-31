// components/PaymentComponent.tsx
import { useState, useEffect } from 'react';
import { paymentService } from '../lib/payment-service';
import { Payment } from '../lib/types';

export default function PaymentComponent() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const plans = paymentService.getSubscriptionPlans();

  useEffect(() => {
    // Load payment history
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
      // Reload payment history
      setPaymentHistory(paymentService.getPaymentHistory(userId));
    } else {
      setMessage({ type: 'error', text: result.error || 'Payment failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Plans */}
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

        {/* Payment Method */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-3 px-4 border-2 rounded-lg text-center ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              💳 Credit/Debit Card
            </button>
            <button
              onClick={() => setPaymentMethod('mobile')}
              className={`flex-1 py-3 px-4 border-2 rounded-lg text-center ${
                paymentMethod === 'mobile'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              📱 Mobile Money
            </button>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'mobile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Network
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select network</option>
                  <option value="mascom">Mascom</option>
                  <option value="orange">Orange</option>
                  <option value="btc">BTC Mobile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+267 71 234 567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Process Payment */}
          {selectedPlan && (
            <div className="mt-6">
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing Payment...' : `Pay BWP ${plans.find(p => p.id === selectedPlan)?.price}`}
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
        {paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      BWP {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.subscriptionPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.isSuccessful
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.isSuccessful ? 'Success' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No payment history found.
          </div>
        )}
      </div>
    </div>
  );
}