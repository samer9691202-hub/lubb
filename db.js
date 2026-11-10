const DB_NAME='midad_local_v1', DB_VERSION=1;
const stores=['tasks','notes','events','meta'];
let dbPromise;
export function db(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const d=req.result;for(const s of stores)if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return dbPromise;}
export async function all(store){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store).objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error);});}
export async function put(store,value){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store,'readwrite').objectStore(store).put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error);});}
export async function remove(store,id){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
export async function clearAll(){const d=await db();return Promise.all(stores.map(s=>new Promise((res,rej)=>{const r=d.transaction(s,'readwrite').objectStore(s).clear();r.onsuccess=res;r.onerror=()=>rej(r.error);})));}
export async function exportAll(){const out={app:'MIDAD',schema:1,exportedAt:new Date().toISOString(),data:{}};for(const s of stores)out.data[s]=await all(s);return out;}
export async function importAll(payload){if(!payload||payload.app!=='MIDAD'||!payload.data)throw new Error('ملف النسخة الاحتياطية غير صالح');for(const s of stores){if(!Array.isArray(payload.data[s]))continue;for(const item of payload.data[s])await put(s,item);}}
