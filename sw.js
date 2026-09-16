const CACHE='freebet21-v15';
const ANIMATION_SRC='./deal-animations.js?v=15';
const ASSETS=['./manifest.webmanifest','./icon.svg',ANIMATION_SRC];

function withAnimationLoader(html){
  if(html.includes('deal-animations.js')) return html;
  return html.replace('</body>',`<script src="${ANIMATION_SRC}"></script></body>`);
}

function htmlResponse(html,source){
  const headers=new Headers();
  source.headers.forEach((value,key)=>{
    const k=key.toLowerCase();
    if(k!=='content-length'&&k!=='content-encoding') headers.set(key,value);
  });
  headers.set('content-type','text/html; charset=utf-8');
  return new Response(html,{status:source.status,statusText:source.statusText,headers});
}

async function fetchPatchedIndex(request='./index.html'){
  const response=await fetch(request,{cache:'no-store'});
  const html=withAnimationLoader(await response.text());
  const patched=htmlResponse(html,response);
  const cache=await caches.open(CACHE);
  await cache.put('./index.html',patched.clone());
  await cache.put('./',patched.clone());
  return patched;
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS);
    try{await fetchPatchedIndex('./index.html')}catch{}
    self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const isNavigation=event.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');

  if(isNavigation){
    event.respondWith((async()=>{
      try{return await fetchPatchedIndex(event.request)}
      catch{return (await caches.match('./index.html'))||(await caches.match('./'))}
    })());
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request,{cache:url.pathname.endsWith('/deal-animations.js')?'no-store':'default'});
      const cache=await caches.open(CACHE);
      cache.put(event.request,response.clone());
      return response;
    }catch{
      return await caches.match(event.request);
    }
  })());
});