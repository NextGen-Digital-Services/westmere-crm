export const linkedinAdapter = {
  id: 'linkedin',
  name: 'LinkedIn Sales Automation',

  async testConnection(credentials = {}) {
    const start = performance.now();
    const { webhookUrl } = credentials;

    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'ping', test: true, timestamp: new Date().toISOString() }),
        });
        const duration = Math.round(performance.now() - start);
        return {
          success: res.ok,
          mode: 'live',
          duration,
          message: res.ok ? 'LinkedIn Automation Webhook pinged successfully!' : `Webhook responded with HTTP ${res.status}`,
        };
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `Webhook ping failed: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: 'Simulated LinkedIn helper active. Connect webhook for automated phantom sync.',
    };
  },

  async send(payload = {}, credentials = {}) {
    const start = performance.now();
    const { profileUrl, message, leadName } = payload;
    const { webhookUrl } = credentials;

    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send_connection_note', profileUrl, message, leadName }),
        });
        const duration = Math.round(performance.now() - start);
        return {
          success: res.ok,
          mode: 'live',
          duration,
          message: 'LinkedIn automation payload pushed to automation runner!',
        };
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `Failed: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: `LinkedIn note logged for ${leadName}. Ready to paste into LinkedIn message box.`,
    };
  },

  async sync() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, mode: 'simulated', message: 'LinkedIn connections & responses synced.' };
  },
};
