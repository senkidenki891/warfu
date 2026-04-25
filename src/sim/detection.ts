export type Contact = {
  confidence: number;
  lastSeenAt: number;
  concealment: number;
};

export function degradeContact(contact: Contact, now: number, perSecond: number): Contact {
  const elapsed = Math.max(now - contact.lastSeenAt, 0);
  const concealmentPenalty = contact.concealment * 0.5;
  const confidence = Math.max(0, contact.confidence - elapsed * perSecond - concealmentPenalty);

  return { ...contact, confidence };
}
