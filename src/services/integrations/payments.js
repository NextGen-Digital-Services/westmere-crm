export const paymentsAdapter = {
  id: 'payments',
  name: 'Payment Gateway (Razorpay & Stripe)',

  async testConnection(credentials = {}) {
    const start = performance.now();
    const { provider = 'Razorpay', keyId, keySecret } = credentials;

    if (keyId && keySecret) {
      try {
        if (provider.includes('Razorpay')) {
          const auth = btoa(`${keyId}:${keySecret}`);
          const res = await fetch('https://api.razorpay.com/v1/payments?count=1', {
            headers: { Authorization: `Basic ${auth}` },
          });
          const duration = Math.round(performance.now() - start);
          if (!res.ok) throw new Error(`HTTP ${res.status}: Invalid Razorpay keys`);
          return {
            success: true,
            mode: 'live',
            duration,
            message: 'Connected live to Razorpay API!',
          };
        }
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `Payment connection error: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: `Simulated payment engine active (${provider}). Generates mock instant checkout links.`,
    };
  },

  async send(payload = {}, credentials = {}) {
    const start = performance.now();
    const { amount, currency = 'INR', description = 'Project Advance Payment', leadName } = payload;
    const paymentId = `plink_${Math.random().toString(36).substring(2, 10)}`;
    const checkoutUrl = `https://rzp.io/i/${paymentId}`;

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      paymentLink: checkoutUrl,
      paymentId,
      message: `Advance payment link generated for ${leadName}: ${checkoutUrl}`,
    };
  },

  async sync() {
    return { success: true, mode: 'simulated', message: 'Payment settlements and invoice reconciliation refreshed.' };
  },
};
