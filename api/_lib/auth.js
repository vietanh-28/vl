import crypto from 'node:crypto';

export function requireAdmin(req, res) {
  const expected = String(process.env.ADMIN_SECRET || '');
  const actual = String(req.headers['x-admin-key'] || '');
  if (!expected || !actual) {
    res.status(401).json({ok:false, error:'unauthorized'});
    return false;
  }
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) {
    res.status(401).json({ok:false, error:'unauthorized'});
    return false;
  }
  return true;
}
