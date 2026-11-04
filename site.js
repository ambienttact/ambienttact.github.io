(() => {
  // Keep gallery controls independent of the evidence chart.
  initializeCarousel();
  initializeResults();

  function initializeResults() {
  const models = [
    {name:'AmbientTact', mean:49.08, values:[57.48,46.05,43.11,49.67], ours:true},
    {name:'Qwen3.5-A3B',mean:42.94,values:[54.24,39.29,34.47,43.75]},
    {name:'GPT-5.6-Sol',mean:42.03,values:[60.35,32.03,40.94,34.81]},
    {name:'Gemini-2.5-Pro',mean:38.54,values:[57.67,33.97,37.98,24.53]},
    {name:'VideoChat3',mean:31.80,values:[34.70,29.71,39.53,23.26]},
    {name:'MMDuet2',mean:34.01,values:[56.51,32.28,32.29,14.97]}
  ];
  const domains = ['WEB','EGO','TV','VAD'];
  const domain = document.getElementById('domain-select');
  function updateResults() {
    const selection = domain.value;
    const value = m => selection === 'mean' ? m.mean : m.values[Number(selection)];
    const bars = document.getElementById('result-bars');
    bars.innerHTML = [models[0], ...models.slice(1).sort((a,b)=>value(b)-value(a))].map(m => `<div class="bar ${m.ours ? 'ours' : ''}"><div class="bar-label"><span>${m.name}</span><strong>${value(m).toFixed(2)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${value(m)}%"></div></div></div>`).join('');
    bars.setAttribute('aria-label', `PAUC-F ${selection === 'mean' ? 'four-domain mean' : domains[Number(selection)]}: ${models.map(m => `${m.name} ${value(m).toFixed(2)}`).join('; ')}`);

  }
  domain.addEventListener('change', updateResults);
  updateResults();
  }

  function initializeCarousel() {
  const slides=window.AMBIENT_FIGURES;
  let active=0;
  const dots=document.getElementById('figure-dots');
  dots.innerHTML=slides.map((s,i)=>`<button type="button" data-figure="${i}" aria-label="Figure ${i+1}: ${s.title}" aria-pressed="${i===0}">${i+1}</button>`).join('');
  function showFigure(i){
    active=(i+slides.length)%slides.length;
    const s=slides[active],img=document.getElementById('carousel-image');
    img.src=s.png;img.alt=s.title+': '+s.query+' Illustrative response timelines.';
    document.getElementById('figure-count').textContent=String(active+1).padStart(2,'0')+' / '+slides.length;
    document.getElementById('figure-title').textContent=s.title;
    document.getElementById('figure-full').href=s.png;
    dots.querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===active)));
  }
  dots.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>showFigure(Number(b.dataset.figure))));
  document.getElementById('figure-prev').addEventListener('click',()=>showFigure(active-1));
  document.getElementById('figure-next').addEventListener('click',()=>showFigure(active+1));
  const carousel=document.querySelector('.figure-carousel');
  carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showFigure(active+(e.key==='ArrowRight'?1:-1));}});
  let touchStart=null;
  carousel.addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
  carousel.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))showFigure(active+(dx<0?1:-1));touchStart=null;},{passive:true});
  showFigure(0);
  }
})();

(() => {
  const video = document.getElementById('overview-video');
  const play = document.querySelector('.video-play');
  const error = document.querySelector('.video-error');
  if (!video || !play) return;
  play.hidden = false;
  play.addEventListener('click', async () => {
    error.hidden = true;
    try { await video.play(); } catch { play.hidden = false; error.hidden = false; }
  });
  video.addEventListener('play', () => { play.hidden = true; error.hidden = true; });
  video.addEventListener('ended', () => { play.hidden = false; });
})();
