import {json, parseBody, setCors} from '../_lib/http.js';
import {requireAdmin} from '../_lib/auth.js';
import {findByKey, sb} from '../_lib/supabase.js';
import {normalizeKey} from '../_lib/license.js';

export default async function handler(req,res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!requireAdmin(req,res)) return;
  if (req.method !== 'POST') return json(res,405,{ok:false,error:'method_not_allowed'});
  try {
    const body=parseBody(req);
    const key=normalizeKey(body.key);
    const row=await findByKey(key);
    if (!row) return json(res,404,{ok:false,error:'key_not_found'});
    const status=body.status === 'active' ? 'active' : 'blocked';
    const rows=await sb(`licenses?id=eq.${encodeURIComponent(row.id)}`,{
      method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status})
    });
    return json(res,200,{ok:true,item:rows?.[0] || null});
  } catch(e) { return json(res,400,{ok:false,error:e.message}); }
}
