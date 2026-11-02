/* LUBB v61.5 — unified logo & icon assets */
const CACHE='lubb-v61.5-unified-icons';
const BASE=self.registration.scope;
const CORE=['./','./index.html','./manifest.webmanifest?v=61.5','./favicon.ico?v=61.5','./icons/fav-16.png?v=61.5','./icons/fav-32.png?v=61.5','./icons/fav-48.png?v=61.5','./icons/lubb-logo-256.png?v=61.5','./icons/icon-192.png?v=61.5','./icons/icon-512.png?v=61.5','./icons/icon-maskable-512.png?v=61.5','./icons/apple-touch-icon.png?v=61.5'].map(x=>new URL(x,BASE).href);
/* كل ملف يُخزَّن على حدة: فشل ملف واحد لا يُفشل تثبيت العامل كاملًا */
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await Promise.all(CORE.map(async u=>{try{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,r)}catch(_){}}));
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys()){if(k.startsWith('lubb-')&&k!==CACHE)await caches.delete(k)}
  await self.clients.claim();
})()));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  const isBrand=/favicon|lubb-logo|fav-(16|32|48)|icon-(192|512|maskable)|apple-touch-icon|manifest\.webmanifest/.test(u.pathname);
  if(isBrand){
    e.respondWith((async()=>{
      try{const fresh=await fetch(r,{cache:'reload'});if(fresh.ok){const c=await caches.open(CACHE);await c.put(r,fresh.clone())}return fresh}
      catch(_){return await caches.match(r)||new Response('',{status:504})}
    })());return;
  }
  if(r.mode==='navigate'){
    e.respondWith((async()=>{
      try{return await fetch(r,{cache:'no-store'})}
      catch(_){return await caches.match(r)||await caches.match(new URL('./index.html',BASE).href)}
    })());return;
  }
  e.respondWith((async()=>{
    const c=await caches.open(CACHE),hit=await c.match(r);if(hit)return hit;
    try{const x=await fetch(r);if(x.ok)await c.put(r,x.clone());return x}
    catch(_){return new Response('غير متاح دون اتصال',{status:503})}
  })());
});
