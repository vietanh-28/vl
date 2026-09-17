function config() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  if (!url || !key) throw new Error('Server chưa cấu hình SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  return {url,key};
}

export async function sb(path, options={}) {
  const {url,key} = config();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const r = await fetch(`${url}/rest/v1/${path}`, {...options, headers});
  const text = await r.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!r.ok) {
    const msg = typeof data === 'object' && data?.message ? data.message : String(data || r.statusText);
    throw new Error(`Database: ${msg}`);
  }
  return data;
}

export async function findByKey(key) {
  const q = encodeURIComponent(key);
  const rows = await sb(`licenses?license_key=eq.${q}&select=*`);
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}
