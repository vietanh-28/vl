import {json, parseBody, setCors} from '../_lib/http.js';
import {requireAdmin} from '../_lib/auth.js';
import {sb} from '../_lib/supabase.js';
import {makeKey, normalizeKey, addDays} from '../_lib/license.js';

export default async function handler(req,res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!requireAdmin(req,res)) return;
  if (req.method !== 'POST') return json(res,405,{ok:false,error:'method_not_allowed'});
  try {
    const body=parseBody(req);
    const days=Math.max(1,Math.min(3650,Number(body.days || 30)));
    const licenseKey=normalizeKey(body.key) || makeKey();
    const note=String(body.note || '').slice(0,500);
    const expiresAt=addDays(new Date(),days).toISOString();
    const rows=await sb('licenses',{
      method:'POST',headers:{Prefer:'return=representation'},
      body:JSON.stringify({license_key:licenseKey,status:'active',expires_at:expiresAt,note})
    });
    return json(res,200,{ok:true,item:rows?.[0] || null});
  } catch(e) { return json(res,400,{ok:false,error:e.message}); }
}
