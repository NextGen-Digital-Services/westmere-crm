export const supabaseAdapter = {
  id: 'supabase',
  name: 'Supabase Cloud Database',

  async testConnection(credentials = {}) {
    const start = performance.now();
    const { url, anonKey } = credentials;

    if (url && anonKey) {
      try {
        const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/`, {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
        });
        const duration = Math.round(performance.now() - start);
        return {
          success: res.ok,
          mode: 'live',
          duration,
          message: res.ok ? 'Connected live to Supabase PostgreSQL instance!' : `Failed with status ${res.status}`,
        };
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `Supabase error: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: 'Simulated Supabase cloud backup link active.',
    };
  },

  async send() {
    return { success: true, mode: 'simulated', message: 'Payload synced to remote Postgres schema.' };
  },

  async sync() {
    return { success: true, mode: 'simulated', message: 'Cloud database snapshot mirrored.' };
  },
};
