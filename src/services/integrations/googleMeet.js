export const googleMeetAdapter = {
  id: 'google_meet',
  name: 'Google Calendar & Meet',

  async testConnection(credentials = {}) {
    const start = performance.now();
    const { apiKey } = credentials;

    if (apiKey) {
      try {
        const res = await fetch(`https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest?key=${apiKey}`);
        const duration = Math.round(performance.now() - start);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return {
          success: true,
          mode: 'live',
          duration,
          message: 'Connected live to Google Calendar API!',
        };
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `Google API connection failed: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: 'Simulated mode active. Google Meet links are generated with standard room syntax.',
    };
  },

  async send(payload = {}) {
    // Generate Google Meet Link & Calendar .ics event
    const start = performance.now();
    const { title, dateTime, durationMinutes = 45 } = payload;
    const meetingCode = `wm-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const meetLink = `https://meet.google.com/${meetingCode}`;

    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      meetLink,
      message: `Google Meet room generated: ${meetLink}`,
    };
  },

  async sync() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, mode: 'simulated', message: 'Google Calendar agenda synced.' };
  },
};
