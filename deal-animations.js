(()=>{
  const dealer=document.getElementById('dealerCards');
  const hands=document.getElementById('playerHands');
  if(!dealer||!hands)return;

  const style=document.createElement('style');
  style.textContent=`
    @keyframes dealFromShoe{0%{opacity:0;transform:translate(110px,-75px) rotate(10deg) scale(.92)}70%{opacity:1;transform:translate(-3px,2px) rotate(-1deg) scale(1.02)}100%{opacity:1;transform:none}}
    @keyframes splitLeft{0%{transform:translateX(34px);opacity:.75}100%{transform:none;opacity:1}}
    @keyframes splitRight{0%{transform:translateX(-34px);opacity:.75}100%{transform:none;opacity:1}}
    .card.deal-live{animation:dealFromShoe .34s cubic-bezier(.2,.8,.2,1) both}
    .hand.split-left-live{animation:splitLeft .28s ease-out both}
    .hand.split-right-live{animation:splitRight .28s ease-out both}
    @media(prefers-reduced-motion:reduce){.card.deal-live,.hand.split-left-live,.hand.split-right-live{animation-duration:.01ms!important;animation-delay:0ms!important}}
  `;
  document.head.appendChild(style);

  let prevDealer=0,prevHands=[],initialized=false;
  const animateCard=(el,delay=0)=>{if(!el)return;el.classList.remove('deal-live');void el.offsetWidth;el.style.animationDelay=delay+'ms';el.classList.add('deal-live')};

  const observe=()=>{
    const dealerCards=[...dealer.querySelectorAll('.card')];
    const handEls=[...hands.querySelectorAll('.hand')];
    const counts=handEls.map(h=>h.querySelectorAll('.card').length);
    const total=counts.reduce((a,b)=>a+b,0);
    const prevTotal=prevHands.reduce((a,b)=>a+b,0);

    if(!initialized&&dealerCards.length===2&&total===2){
      const pc=handEls[0]?.querySelectorAll('.card');
      animateCard(pc?.[0],0);
      animateCard(dealerCards[0],260);
      animateCard(pc?.[1],520);
      animateCard(dealerCards[1],780);
      initialized=true;
    }else if(handEls.length>prevHands.length&&handEls.length>=2){
      const a=handEls[Math.max(0,handEls.length-2)],b=handEls[handEls.length-1];
      a?.classList.add('split-left-live');b?.classList.add('split-right-live');
      animateCard(a?.querySelectorAll('.card')[1],300);
      animateCard(b?.querySelectorAll('.card')[1],620);
    }else if(total>prevTotal&&handEls.length){
      let delta=total-prevTotal;
      for(let i=handEls.length-1;i>=0&&delta>0;i--){
        const cards=handEls[i].querySelectorAll('.card');
        const old=prevHands[i]||0;
        for(let j=old;j<cards.length;j++,delta--)animateCard(cards[j],0);
      }
    }else if(dealerCards.length>prevDealer&&prevDealer>=2){
      for(let i=prevDealer;i<dealerCards.length;i++)animateCard(dealerCards[i],(i-prevDealer)*300);
    }
    prevDealer=dealerCards.length;prevHands=counts;
    if(!dealerCards.length&&!total){initialized=false;prevDealer=0;prevHands=[]}
  };

  const mo=new MutationObserver(()=>requestAnimationFrame(observe));
  mo.observe(dealer,{childList:true,subtree:true});
  mo.observe(hands,{childList:true,subtree:true});
  observe();
})();