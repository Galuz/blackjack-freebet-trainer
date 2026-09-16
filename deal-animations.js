(()=>{
  const dealer=document.getElementById('dealerCards');
  const hands=document.getElementById('playerHands');
  const play=document.getElementById('play');
  const next=document.getElementById('next');
  const split=document.getElementById('split');
  const reset=document.getElementById('reset');
  const sound=document.getElementById('sound');
  if(!dealer||!hands)return;

  const style=document.createElement('style');
  style.textContent=`
    @keyframes dealFromShoe{
      0%{opacity:0;transform:translate(118px,-82px) rotate(10deg) scale(.9)}
      68%{opacity:1;transform:translate(-4px,3px) rotate(-1.5deg) scale(1.025)}
      100%{opacity:1;transform:none}
    }
    @keyframes splitLeft{0%{transform:translateX(32px);opacity:.76}100%{transform:none;opacity:1}}
    @keyframes splitRight{0%{transform:translateX(-32px);opacity:.76}100%{transform:none;opacity:1}}
    .card.deal-live{animation:dealFromShoe .24s cubic-bezier(.18,.72,.2,1) both}
    .card.deal-live.initial-deal{animation-duration:.32s}
    .card.deal-live.split-card{animation-duration:.28s}
    .hand.split-left-live{animation:splitLeft .26s ease-out both}
    .hand.split-right-live{animation:splitRight .26s ease-out both}
    @media(prefers-reduced-motion:reduce){
      .card.deal-live,.card.deal-live.initial-deal,.card.deal-live.split-card,.hand.split-left-live,.hand.split-right-live{animation-duration:.08s!important;animation-delay:0ms!important}
    }
  `;
  document.head.appendChild(style);

  // Separate, lightweight Web Audio effect for the physical card-slide sound.
  // It is unlocked from the same user gesture that starts a deal, which keeps
  // it reliable in iOS/PWA mode without changing the app's existing beeps.
  let dealAudio=null;
  let noiseBuffer=null;
  const soundEnabled=()=>!sound||!sound.textContent.includes('🔇');
  const ensureDealAudio=()=>{
    if(!soundEnabled())return null;
    try{
      if(!dealAudio){
        const Ctx=window.AudioContext||window.webkitAudioContext;
        if(!Ctx)return null;
        dealAudio=new Ctx();
        const len=Math.max(1,Math.floor(dealAudio.sampleRate*.085));
        noiseBuffer=dealAudio.createBuffer(1,len,dealAudio.sampleRate);
        const data=noiseBuffer.getChannelData(0);
        for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len*.35);
      }
      if(dealAudio.state==='suspended')dealAudio.resume();
      return dealAudio;
    }catch{return null}
  };
  const cardSlideSound=(delay=0,level=1)=>{
    if(!soundEnabled())return;
    const a=ensureDealAudio();
    if(!a||!noiseBuffer)return;
    try{
      const when=a.currentTime+Math.max(0,delay)/1000;
      const src=a.createBufferSource();
      const band=a.createBiquadFilter();
      const gain=a.createGain();
      src.buffer=noiseBuffer;
      band.type='bandpass';
      band.frequency.setValueAtTime(1850,when);
      band.Q.setValueAtTime(.7,when);
      gain.gain.setValueAtTime(.0001,when);
      gain.gain.exponentialRampToValueAtTime(.038*level,when+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,when+.082);
      src.connect(band).connect(gain).connect(a.destination);
      src.start(when);
      src.stop(when+.09);
    }catch{}
  };

  // The app's core waits 500 ms after the initial render and 300 ms after a
  // split. Stretch only those one-shot waits when a deal/split was just
  // requested so the decision timer starts after the visual action finishes.
  const nativeSetTimeout=window.setTimeout.bind(window);
  let initialWaitArmedUntil=0;
  let splitWaitArmedUntil=0;
  window.setTimeout=(fn,delay,...args)=>{
    const d=Number(delay);
    const now=performance.now();
    if(d===500&&now<initialWaitArmedUntil){
      initialWaitArmedUntil=0;
      return nativeSetTimeout(fn,1150,...args);
    }
    if(d===300&&now<splitWaitArmedUntil){
      splitWaitArmedUntil=0;
      return nativeSetTimeout(fn,720,...args);
    }
    return nativeSetTimeout(fn,delay,...args);
  };

  let prevDealer=0;
  let prevHands=[];
  let roundPending=true;

  const resetRoundTracking=()=>{
    prevDealer=0;
    prevHands=[];
    roundPending=true;
  };

  const armInitialDeal=()=>{
    ensureDealAudio();
    resetRoundTracking();
    initialWaitArmedUntil=performance.now()+10000;
  };

  // Capture runs before the app's existing onclick handlers.
  play?.addEventListener('click',armInitialDeal,true);
  next?.addEventListener('click',armInitialDeal,true);
  split?.addEventListener('click',()=>{
    ensureDealAudio();
    splitWaitArmedUntil=performance.now()+2500;
  },true);
  reset?.addEventListener('click',resetRoundTracking,true);

  const animateCard=(el,delay=0,kind='normal')=>{
    if(!el)return;
    el.style.animationDelay=delay+'ms';
    if(kind==='initial'){
      el.classList.add('initial-deal');
      cardSlideSound(delay,.95);
    }
    if(kind==='split'){
      el.classList.add('split-card');
      cardSlideSound(delay,.9);
    }
    el.classList.add('deal-live');
  };

  const animateInitialDeal=(dealerCards,handEls)=>{
    const pc=handEls[0]?.querySelectorAll('.card');
    if(!pc||pc.length<2||dealerCards.length<2)return false;

    // Roughly one second total, with a clear casino-like card cadence.
    animateCard(pc[0],0,'initial');
    animateCard(dealerCards[0],240,'initial');
    animateCard(pc[1],480,'initial');
    animateCard(dealerCards[1],720,'initial');
    return true;
  };

  const observe=()=>{
    const dealerCards=[...dealer.querySelectorAll('.card')];
    const handEls=[...hands.querySelectorAll('.hand')];
    const counts=handEls.map(h=>h.querySelectorAll('.card').length);
    const total=counts.reduce((a,b)=>a+b,0);
    const prevTotal=prevHands.reduce((a,b)=>a+b,0);

    if(!dealerCards.length&&!total){
      resetRoundTracking();
      return;
    }

    if(roundPending&&dealerCards.length===2&&total===2){
      if(animateInitialDeal(dealerCards,handEls))roundPending=false;
    }else if(handEls.length>prevHands.length&&handEls.length>=2){
      const a=handEls[Math.max(0,handEls.length-2)];
      const b=handEls[handEls.length-1];
      a?.classList.add('split-left-live');
      b?.classList.add('split-right-live');
      animateCard(a?.querySelectorAll('.card')[1],100,'split');
      animateCard(b?.querySelectorAll('.card')[1],380,'split');
    }else if(total>prevTotal&&handEls.length){
      let delta=total-prevTotal;
      for(let i=handEls.length-1;i>=0&&delta>0;i--){
        const cards=handEls[i].querySelectorAll('.card');
        const old=prevHands[i]||0;
        for(let j=old;j<cards.length;j++,delta--)animateCard(cards[j],0);
      }
    }else if(dealerCards.length>prevDealer&&prevDealer>=2){
      for(let i=prevDealer;i<dealerCards.length;i++)animateCard(dealerCards[i],(i-prevDealer)*110);
    }

    prevDealer=dealerCards.length;
    prevHands=counts;
  };

  // MutationObserver callbacks run before paint, preventing cards from flashing
  // fully visible before their animation is attached.
  const mo=new MutationObserver(observe);
  mo.observe(dealer,{childList:true,subtree:true});
  mo.observe(hands,{childList:true,subtree:true});
  observe();
})();