/* LUBB v64.0.0 — cache version aligned with the application release. */
const CACHE='lubb-v64.0.0';
const BASE=self.registration.scope;
const CORE=['./','./index.html','./manifest.webmanifest','./favicon.ico','./apple-touch-icon.png','./fav-16.png','./fav-32.png','./fav-48.png','./lubb-logo-256.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png'].map(x=>new URL(x,BASE).href);

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.all(CORE.map(async url=>{
    try{const response=await fetch(url,{cache:'reload'});if(response.ok)await cache.put(url,response)}catch(error){/* Keep installation resilient when one optional asset is unavailable. */}
  }));
  await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('lubb-')&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));

self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});

self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  const isBrand=/favicon|lubb-logo|fav-(16|32|48)|icon-(192|512|maskable)|apple-touch-icon|manifest\.webmanifest/.test(url.pathname);
  if(isBrand){
    event.respondWith((async()=>{
      try{const fresh=await fetch(request,{cache:'no-cache'});if(fresh.ok){const cache=await caches.open(CACHE);await cache.put(request,fresh.clone())}return fresh}
      catch(_){return await caches.match(request)||new Response('',{status:504})}
    })());return;
  }
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{const response=await fetch(request,{cache:'no-store'});if(response.ok){const cache=await caches.open(CACHE);await cache.put(new URL('./index.html',BASE).href,response.clone())}return response}
      catch(_){return await caches.match(request)||await caches.match(new URL('./index.html',BASE).href)||new Response('التطبيق غير متاح حالياً دون اتصال',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})}
    })());return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE),cached=await cache.match(request);if(cached)return cached;
    try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response}
    catch(_){return new Response('غير متاح دون اتصال',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})}
  })());
});
