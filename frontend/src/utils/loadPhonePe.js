// PhonePe Payment Integration Utility

// Function to initiate PhonePe payment
export const initiatePhonePePayment = async (orderData) => {
  try {
    // PhonePe uses redirect-based payment flow
    // The backend will return a payment URL that we redirect to
    
    console.log('Initiating PhonePe payment...');
    return {
      success: true,
      method: 'redirect', // PhonePe uses redirect method
      orderData: orderData
    };

  } catch (error) {
    console.error('PhonePe payment error:', error);
    throw error;
  }
};

// Function to check if payment is supported (PhonePe is web-based)
export const isPhonePeSupported = () => {
  // PhonePe works on all browsers as it's redirect-based
  return true;
};

// Function to format amount for PhonePe (they use paise)
export const formatAmountForPhonePe = (amount) => {
  return Math.round(amount * 100); // Convert to paise
};

// Function to handle payment success callback
export const handlePhonePeSuccess = (transactionId, callback) => {
  if (callback && typeof callback === 'function') {
    callback({
      success: true,
      transactionId: transactionId,
      paymentMethod: 'PhonePe'
    });
  }
};

// Function to handle payment failure
export const handlePhonePeFailure = (error, callback) => {
  if (callback && typeof callback === 'function') {
    callback({
      success: false,
      error: error || 'Payment failed',
      paymentMethod: 'PhonePe'
    });
  }
};

// Main export for backward compatibility
export default {
  initiatePhonePePayment,
  isPhonePeSupported,
  formatAmountForPhonePe,
  handlePhonePeSuccess,
  handlePhonePeFailure
};
