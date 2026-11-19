export const INITIAL_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'WhatsApp Intro (India & UAE Agency Pitch)',
    channel: 'WhatsApp',
    category: 'First Outreach',
    subject: '',
    content: `Hi {name}, hope you're having a productive week! I came across {business} and was genuinely impressed by your footprint.

At Westmere, we specialize in high-performance {service} for fast-growing businesses. We recently built a custom portal for a client in your industry that drove a 3.4x boost in conversions.

Would you be open to a quick 10-minute preview of how we'd approach this for {business}? Let me know what day works best for you!`,
  },
  {
    id: 'tpl-2',
    name: 'Cold Email: Custom Software & Digital Transformation',
    channel: 'Email',
    category: 'First Outreach',
    subject: `Idea for {business} — High-ROI {service}`,
    content: `Hi {name},

I was reviewing {business}'s current digital touchpoints and noticed key opportunities to streamline operations and enhance client engagement through modern {service}.

Westmere is an elite engineering agency serving market leaders across India and Dubai. We deliver:
• Custom bespoke architecture with zero bloat
• Enterprise-grade security and sub-second performance
• Full ownership of IP and source code

Are you free for a brief 15-minute call this Thursday or Friday to explore if our engineering stack aligns with {business}'s roadmap?

Best regards,
Westmere Sales Team`,
  },
  {
    id: 'tpl-3',
    name: 'LinkedIn Connection Note (Personalized)',
    channel: 'LinkedIn',
    category: 'First Outreach',
    subject: '',
    content: `Hi {name}, following your work at {business}! We're engineering partner to several high-growth brands in your sector delivering {service}. Would love to connect and exchange notes on modern tech execution.`,
  },
  {
    id: 'tpl-4',
    name: 'Follow-Up 1 (48 Hours Later): The Value Add',
    channel: 'WhatsApp',
    category: 'Follow-up',
    subject: '',
    content: `Hi {name}, just following up on my previous note. I put together a quick 3-slide visual teardown on how modern {service} could reduce operational bottlenecks at {business}.

Would you like me to share the link here on WhatsApp?`,
  },
  {
    id: 'tpl-5',
    name: 'Follow-Up 2: Social Proof & Metrics',
    channel: 'Email',
    category: 'Follow-up',
    subject: `Quick case study for {business}`,
    content: `Hi {name},

Following up on my previous message. Wanted to share a recent case study where we engineered a scalable {service} for a peer in your sector:
• 42% reduction in manual data entry
• Go-live in under 8 weeks
• 99.98% platform uptime

I'd be glad to walk through the exact architecture we used. Does early next week suit your schedule for a quick Google Meet?

Warm regards,
Westmere Solutions`,
  },
  {
    id: 'tpl-6',
    name: 'Follow-Up 3: The Gentle Break-Up',
    channel: 'Email',
    category: 'Follow-up',
    subject: `Permission to close file for {business}?`,
    content: `Hi {name},

I haven't heard back, which usually means either:
1. You've already got {service} sorted internally.
2. The timing isn't right this quarter.
3. You're simply slammed with priorities.

If it's #2 or #3, no worries at all! Just let me know if we should revisit in Q1, or if you'd prefer I close your file for now.

Wish you continued success with {business}!`,
  },
  {
    id: 'tpl-7',
    name: 'Post-Meeting / Demo Recap',
    channel: 'Email',
    category: 'Post-Meeting',
    subject: `Recap: Westmere + {business} Discovery Demo`,
    content: `Hi {name},

Thank you for your valuable time during our demo today! It was fantastic learning more about {business}'s vision for {service}.

Key Takeaways & Requirements Discussed:
• Core objectives and deliverables
• Target launch timeline
• Integration with existing operational systems

We are compiling our tailored technical proposal and commercial milestone breakdown. You will receive the comprehensive document by tomorrow EOD.

Looking forward to building this together!`,
  },
  {
    id: 'tpl-8',
    name: 'Proposal Follow-Up & Commercial Discussion',
    channel: 'WhatsApp',
    category: 'Proposal Follow-up',
    subject: '',
    content: `Hi {name}, wanted to check if you had a chance to review the commercial proposal and scope document we sent for {business}'s {service}?

Happy to jump on a quick 10-minute call to answer any questions from your finance or technical committee and discuss flexible milestone terms. Let me know when you're available!`,
  },
];

export const INITIAL_SEQUENCES = [
  {
    id: 'seq-1',
    name: 'Standard High-Intent Prospect Sequence',
    description: '4-touch multi-channel cadence for inbound and verified high-value leads',
    enabled: true,
    steps: [
      { day: 0, channel: 'WhatsApp', templateId: 'tpl-1', title: 'Day 0: WhatsApp Intro & Quick Teardown' },
      { day: 2, channel: 'Email', templateId: 'tpl-2', title: 'Day 2: Formal Digital Transformation Pitch' },
      { day: 5, channel: 'WhatsApp', templateId: 'tpl-4', title: 'Day 5: Value Teardown Follow-up' },
      { day: 9, channel: 'Email', templateId: 'tpl-6', title: 'Day 9: Polite Break-up / File Close' },
    ],
  },
  {
    id: 'seq-2',
    name: 'GCC / Dubai Executive Outreach Cadence',
    description: 'Tailored for UAE founders, general managers and family offices',
    enabled: true,
    steps: [
      { day: 0, channel: 'LinkedIn', templateId: 'tpl-3', title: 'Day 0: LinkedIn Connection with Peer Context' },
      { day: 2, channel: 'WhatsApp', templateId: 'tpl-1', title: 'Day 2: Concise WhatsApp Executive Overview' },
      { day: 5, channel: 'Email', templateId: 'tpl-5', title: 'Day 5: Regional Case Study & Metric Review' },
      { day: 9, channel: 'WhatsApp', templateId: 'tpl-8', title: 'Day 9: VIP Meeting Invitation' },
    ],
  },
];
