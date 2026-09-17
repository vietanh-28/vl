import crypto from 'node:crypto';

export function normalizeKey(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g,'');
}

export function makeKey() {
  const raw = crypto.randomBytes(9).toString('hex').toUpperCase();
  return `DUCK-${raw.slice(0,6)}-${raw.slice(6,12)}-${raw.slice(12,18)}`;
}

export function addDays(baseDate, days) {
  const d = new Date(baseDate);
  d.setUTCDate(d.getUTCDate() + Number(days));
  return d;
}

export function ownerInfo() {
  return {
    contact: process.env.OWNER_CONTACT || 'Liên hệ chủ tool Duck Farm Studio để gia hạn Key.',
    contact_url: process.env.OWNER_CONTACT_URL || ''
  };
}
