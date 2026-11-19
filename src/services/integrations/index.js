import { whatsappAdapter } from './whatsapp';
import { emailAdapter } from './email';
import { linkedinAdapter } from './linkedin';
import { googleMeetAdapter } from './googleMeet';
import { aiAssistantAdapter } from './aiAssistant';
import { webhooksAdapter } from './webhooks';
import { paymentsAdapter } from './payments';
import { supabaseAdapter } from './supabase';
import { customRestAdapter } from './customRest';

export const integrationAdapters = {
  whatsapp: whatsappAdapter,
  email: emailAdapter,
  linkedin: linkedinAdapter,
  google_meet: googleMeetAdapter,
  ai_assistant: aiAssistantAdapter,
  webhooks: webhooksAdapter,
  payments: paymentsAdapter,
  supabase: supabaseAdapter,
  custom_rest: customRestAdapter,
};

export function getAdapter(id) {
  return integrationAdapters[id] || null;
}

export {
  whatsappAdapter,
  emailAdapter,
  linkedinAdapter,
  googleMeetAdapter,
  aiAssistantAdapter,
  webhooksAdapter,
  paymentsAdapter,
  supabaseAdapter,
  customRestAdapter,
};
