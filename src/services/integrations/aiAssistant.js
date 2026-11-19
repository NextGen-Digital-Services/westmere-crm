/**
 * AI Sales Assistant Adapter (OpenAI / Gemini / Anthropic)
 */

export const aiAssistantAdapter = {
  id: 'ai_assistant',
  name: 'AI Sales Assistant',

  async testConnection(credentials = {}) {
    const start = performance.now();
    const { provider, apiKey, model } = credentials;

    if (apiKey) {
      try {
        if (provider?.includes('OpenAI')) {
          const res = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          const duration = Math.round(performance.now() - start);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return {
            success: true,
            mode: 'live',
            duration,
            message: `Connected live to OpenAI (${model || 'gpt-4o'})!`,
          };
        } else if (provider?.includes('Gemini')) {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          const duration = Math.round(performance.now() - start);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return {
            success: true,
            mode: 'live',
            duration,
            message: 'Connected live to Google Gemini API!',
          };
        }
      } catch (err) {
        return {
          success: false,
          mode: 'live',
          duration: Math.round(performance.now() - start),
          message: `AI Provider error: ${err.message}`,
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      message: 'Simulated AI Assistant active. Delivers contextual agency sales intelligence.',
    };
  },

  async generateSalesPitch(lead, credentials = {}) {
    const { apiKey, provider, model } = credentials;
    const start = performance.now();

    // If real OpenAI key
    if (apiKey && provider?.includes('OpenAI')) {
      try {
        const prompt = `Write a high-converting 3-sentence sales outreach message for digital agency Westmere selling ${(lead.services || []).join(', ')} to ${lead.name}, ${lead.contactPersonRole} at ${lead.businessName} based in ${lead.city}, ${lead.country}. Tone: elite, concise, zero fluff.`;
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 250,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          return {
            mode: 'live',
            text: data.choices?.[0]?.message?.content?.trim(),
            duration: Math.round(performance.now() - start),
          };
        }
      } catch (e) {
        console.warn('Real AI call failed, falling back to simulated engine', e);
      }
    }

    // High quality intelligent simulated response
    await new Promise((resolve) => setTimeout(resolve, 800));
    const marketAngle = lead.market === 'UAE' 
      ? 'rapid GCC scale and bilingual digital-first customer journeys' 
      : 'high-scale architecture and modern operational automation';

    const serviceAngle = lead.services?.[0] || 'digital engineering';
    
    return {
      mode: 'simulated',
      duration: Math.round(performance.now() - start),
      text: `Hi ${lead.name}, admiring ${lead.businessName}'s momentum in ${lead.city}. We build bespoke ${serviceAngle} systems focused strictly on ${marketAngle}. Given your operational scope, we can streamline your lead-to-delivery flow by 35% without recurring software bloat. Would you be open to an 8-minute architecture teardown this week?`,
    };
  },

  async generateObjectionHandling(lead, objection) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const isPrice = (objection || '').toLowerCase().includes('price') || (objection || '').toLowerCase().includes('budget') || (objection || '').toLowerCase().includes('discount');
    
    if (isPrice) {
      return {
        strategy: 'Value-Anchored Milestone Phasing',
        response: `Acknowledge the budget focus, but decouple the core MVP from nice-to-have features: "We completely understand cash-flow stewardship for ${lead.businessName}. Rather than compromising on security or architecture that incurs costly technical debt later, let's keep Phase 1 strictly focused on the revenue-generating core (${lead.services?.[0] || 'Core Module'}) at a reduced initial commitment, deferring secondary workflows to Milestone 2."`,
        recommendedNextStep: 'Offer 25% signing advance with 5 milestone tranches rather than discounting base fees.',
      };
    }

    return {
      strategy: 'Proof of Delivery & Hypercare Assurance',
      response: `"Our engineering team guarantees direct SLA commitments and 90 days complimentary hypercare post-launch. Unlike off-the-shelf SaaS or commodity shops, ${lead.businessName} receives 100% intellectual property ownership and source code."`,
      recommendedNextStep: 'Share our client case study and invite their tech lead to an architectural review call.',
    };
  },

  async suggestNextAction(lead) {
    if (lead.stage === 'lead_generated') {
      return {
        action: 'Dispatch WhatsApp Voice Note or 3-Slide Teardown',
        reason: 'Lead has not been contacted yet. WhatsApp conversion rate is 4.8x higher than cold email in India/UAE.',
        suggestedChannel: 'WhatsApp',
      };
    }
    if (lead.stage === 'contacted') {
      return {
        action: 'Execute Follow-Up 1: Value Proof',
        reason: `${lead.responseStatus || 'Awaiting reply'}. Send social proof case study with concrete revenue metrics.`,
        suggestedChannel: 'Email',
      };
    }
    if (lead.stage === 'qualified') {
      return {
        action: 'Book 30-Minute Architecture Discovery Call',
        reason: 'Budget and decision maker verified. Needs live product demo to anchor high-ticket commercial scope.',
        suggestedChannel: 'Google Meet',
      };
    }
    if (lead.stage === 'meeting') {
      return {
        action: 'Dispatch Commercial Scope & Proposal v1.0',
        reason: 'Discovery meeting concluded. Proposals sent within 24 hours of demo close at a 3x higher win rate.',
        suggestedChannel: 'Email',
      };
    }
    if (lead.stage === 'proposal_sent') {
      return {
        action: 'Schedule Commercial & Milestone Clarification Call',
        reason: 'Proposal is in prospect evaluation. Offer 10-minute check-in to walk their finance committee through terms.',
        suggestedChannel: 'Call',
      };
    }
    if (lead.stage === 'negotiation') {
      return {
        action: 'Send Final Revised Work Order & Bank Wire Details',
        reason: 'Commercial terms agreed. Push for signing advance (25-30%) to lock dedicated sprint squad.',
        suggestedChannel: 'WhatsApp',
      };
    }
    return {
      action: 'Conduct Kickoff Workshop & Set Up Staging Repository',
      reason: 'Deal won! Advance verified. Onboard client team to project timeline.',
      suggestedChannel: 'Google Meet',
    };
  },

  async sync() {
    return { success: true, mode: 'simulated', message: 'AI lead scoring heuristics updated.' };
  },
};
