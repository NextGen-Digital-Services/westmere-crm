export const customRestAdapter = {
  id: 'custom_rest',
  name: 'Custom REST API Connector',

  async testConnection(credentials = {}) {
    const start = performance.now();
    const { baseUrl, authType, authSecret, customHeaders } = credentials;

    if (baseUrl) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (customHeaders) {
          try {
            Object.assign(headers, JSON.parse(customHeaders));
          } catch (e) {
            // invalid JSON header
          }
        }
        if (authType === 'Bearer Token' && authSecret) {
          headers['Authorization'] = `Bearer ${authSecret}`;
        } else if (authType === 'X-Api-Key Header' && authSecret) {
          headers['X-Api-Key'] = authSecret;
        }

        const res = await fetch(baseUrl, { method: 'GET', headers });
        const duration = Math.round(performance.now() - start);
        return {
          success: res.ok,
          mode: 'live',
          duration,
          message: res.ok ? `Endpoint reachable! HTTP ${res.status}` : `Target responded with HTTP ${res.status}`,
        };
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `REST API ping failed: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: 'Simulated REST tester active. Enter base URL and credentials to ping live webhook.',
    };
  },

  async send(payload = {}, credentials = {}) {
    const start = performance.now();
    const { endpoint = '', method = 'POST', body = {} } = payload;
    const { baseUrl, authType, authSecret } = credentials;

    if (baseUrl) {
      try {
        const url = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
        const headers = { 'Content-Type': 'application/json' };
        if (authType === 'Bearer Token' && authSecret) headers['Authorization'] = `Bearer ${authSecret}`;

        const res = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(body),
        });
        const duration = Math.round(performance.now() - start);
        const data = await res.json().catch(() => ({}));
        return {
          success: res.ok,
          mode: 'live',
          duration,
          data,
          message: `Custom REST call completed with status ${res.status}`,
        };
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `REST request error: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: `Simulated REST request executed for ${payload.action || 'payload'}.`,
    };
  },

  async sync() {
    return { success: true, mode: 'simulated', message: 'Custom REST sync check complete.' };
  },
};
