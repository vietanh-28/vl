import {json, setCors} from '../_lib/http.js';
import {requireAdmin} from '../_lib/auth.js';
import {sb} from '../_lib/supabase.js';

export default async function handler(req,res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!requireAdmin(req,res)) return;
  if (req.method !== 'GET') return json(res,405,{ok:false,error:'method_not_allowed'});
  try {
    const rows = await sb('licenses?select=*&order=created_at.desc');
    return json(res,200,{ok:true,items:rows || []});
  } catch (e) { return json(res,500,{ok:false,error:e.message}); }
}
