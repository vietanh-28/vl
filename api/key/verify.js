import {json, parseBody, setCors} from '../_lib/http.js';
import {findByKey, sb} from '../_lib/supabase.js';
import {normalizeKey, ownerInfo} from '../_lib/license.js';

export default async function handler(req,res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res,405,{ok:false,error:'method_not_allowed'});
  try {
    const body = parseBody(req);
    const key = normalizeKey(body.key);
    const machineId = String(body.machine_id || '').slice(0,128);
    if (!key) return json(res,400,{ok:false,code:'missing_key',message:'Vui lòng nhập Key.',...ownerInfo()});

    const row = await findByKey(key);
    if (!row) return json(res,200,{ok:false,code:'invalid',message:'Key không hợp lệ.',...ownerInfo()});
    if (row.status !== 'active') return json(res,200,{ok:false,code:'blocked',message:'Key đã bị vô hiệu hóa.',...ownerInfo()});

    const now = new Date();
    const expires = new Date(row.expires_at);
    if (!Number.isFinite(expires.getTime()) || expires <= now) {
      return json(res,200,{ok:false,code:'expired',message:'Key đã hết hạn. Vui lòng liên hệ lại với chủ tool để gia hạn.',expires_at:row.expires_at,...ownerInfo()});
    }

    const daysLeft = Math.max(0, Math.ceil((expires-now)/86400000));
    const patch = {
      last_seen_at: now.toISOString(),
      last_machine_id: machineId || row.last_machine_id || null,
      use_count: Number(row.use_count || 0) + 1
    };
    await sb(`licenses?id=eq.${encodeURIComponent(row.id)}`, {
      method:'PATCH', headers:{Prefer:'return=minimal'}, body:JSON.stringify(patch)
    });

    return json(res,200,{
      ok:true,
      code:'active',
      key:row.license_key,
      expires_at:row.expires_at,
      days_left:daysLeft,
      note:row.note || '',
      message:`Key hợp lệ • còn ${daysLeft} ngày`,
      ...ownerInfo()
    });
  } catch (e) {
    console.error(e);
    return json(res,500,{ok:false,code:'server_error',message:'Máy chủ Key đang lỗi. Vui lòng thử lại sau.',...ownerInfo()});
  }
}
