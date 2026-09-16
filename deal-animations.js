(()=>{
  const dealer=document.getElementById('dealerCards');
  const hands=document.getElementById('playerHands');
  const play=document.getElementById('play');
  const next=document.getElementById('next');
  const reset=document.getElementById('reset');
  if(!dealer||!hands)return;

  const style=document.createElement('style');
  style.textContent=`
    @keyframes dealFromShoe{
      0%{opacity:0;transform:translate(105px,-72px) rotate(9deg) scale(.92)}
      72%{opacity:1;transform:translate(-3px,2px) rotate(-1deg) scale(1.02)}
      100%{opacity:1;transform:none}
    }
    @keyframes splitLeft{0%{transform:translateX(28px);opacity:.78}100%{transform:none;opacity:1}}
    @keyframes splitRight{0%{transform:translateX(-28px);opacity:.78}100%{transform:none;opacity:1}}
    .card.deal-live{animation:dealFromShoe .18s cubic-bezier(.2,.8,.2,1) both}
    .hand.split-left-live{animation:splitLeft .18s ease-out both}
    .hand.split-right-live{animation:splitRight .18s ease-out both}
    @media(prefers-reduced-motion:reduce){
      .card.deal-live,.hand.split-left-live,.hand.split-right-live{animation-duration:.08s!important}
    }
  `;
  document.head.appendChild(style);

  let prevDealer=0;
  let prevHands=[];
  let roundPending=true;
  let initialBatchActive=false;

  const resetRoundTracking=()=>{
    prevDealer=0;
    prevHands=[];
    roundPending=true;
    initialBatchActive=false;
  };

  // Capture runs before the app's existing onclick handlers, so every new hand
  // starts from a clean animation state even when the DOM still contains the
  // previous hand.
  play?.addEventListener('click',resetRoundTracking,true);
  next?.addEventListener('click',resetRoundTracking,true);
  reset?.addEventListener('click',resetRoundTracking,true);

  const animateCard=(el,delay=0)=>{
    if(!el)return;
    el.style.animationDelay=delay+'ms';
    el.classList.add('deal-live');
  };

  const animateInitialDeal=(dealerCards,handEls)=>{
    const pc=handEls[0]?.querySelectorAll('.card');
    if(!pc||pc.length<2||dealerCards.length<2)return false;

    // Entire sequence completes before the app's own 500 ms follow-up render,
    // so that render can no longer cancel a delayed fourth card.
    animateCard(pc[0],0);
    animateCard(dealerCards[0],90);
    animateCard(pc[1],180);
    animateCard(dealerCards[1],270);
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

    // New round: initial render inserts all four cards together. Tag them in the
    // MutationObserver microtask, before the browser paints them, so there is no
    // one-frame flash where they appear instantly first.
    if(roundPending&&dealerCards.length===2&&total===2){
      if(animateInitialDeal(dealerCards,handEls)){
        roundPending=false;
        initialBatchActive=true;
      }
    }else if(handEls.length>prevHands.length&&handEls.length>=2){
      const a=handEls[Math.max(0,handEls.length-2)];
      const b=handEls[handEls.length-1];
      a?.classList.add('split-left-live');
      b?.classList.add('split-right-live');
      animateCard(a?.querySelectorAll('.card')[1],45);
      animateCard(b?.querySelectorAll('.card')[1],135);
    }else if(total>prevTotal&&handEls.length){
      let delta=total-prevTotal;
      for(let i=handEls.length-1;i>=0&&delta>0;i--){
        const cards=handEls[i].querySelectorAll('.card');
        const old=prevHands[i]||0;
        for(let j=old;j<cards.length;j++,delta--)animateCard(cards[j],0);
      }
    }else if(dealerCards.length>prevDealer&&prevDealer>=2){
      for(let i=prevDealer;i<dealerCards.length;i++)animateCard(dealerCards[i],(i-prevDealer)*90);
    }

    prevDealer=dealerCards.length;
    prevHands=counts;

    // The app rerenders the same 2+2 DOM around 500 ms after the initial deal.
    // Do not restart animation there; by then the sequence is already complete.
    if(initialBatchActive&&dealerCards.length===2&&total===2){
      setTimeout(()=>{initialBatchActive=false},0);
    }
  };

  // MutationObserver callbacks run before paint. Calling observe directly is
  // intentional; requestAnimationFrame caused the cards to flash fully visible
  // for one frame before the animation class was applied.
  const mo=new MutationObserver(observe);
  mo.observe(dealer,{childList:true,subtree:true});
  mo.observe(hands,{childList:true,subtree:true});
  observe();
})();