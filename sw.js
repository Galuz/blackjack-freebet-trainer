const CACHE='freebet21-v12';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./deal-animations.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request);
      const url=new URL(event.request.url);
      if((url.pathname.endsWith('/')||url.pathname.endsWith('/index.html'))&&response.headers.get('content-type')?.includes('text/html')){
        let html=await response.text();
        if(!html.includes('deal-animations.js'))html=html.replace('</body>','<script src="./deal-animations.js"></script></body>');
        const patched=new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
        caches.open(CACHE).then(cache=>cache.put(event.request,patched.clone()));
        return patched;
      }
      const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
    }catch(e){return (await caches.match(event.request))||(await caches.match('./index.html'));}
  })());
});