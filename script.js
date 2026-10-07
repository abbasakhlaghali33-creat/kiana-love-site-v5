const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const intro=$('#intro'), enter=$('#enter'); enter.addEventListener('click',()=>{intro.style.opacity='0';intro.style.visibility='hidden';setTimeout(()=>intro.remove(),900)});
const start=new Date(2026,0,11,0,0,0);function counter(){let d=new Date()-start;if(d<0)d=0;let sec=Math.floor(d/1000),days=Math.floor(sec/86400);sec%=86400;let h=Math.floor(sec/3600);sec%=3600;let m=Math.floor(sec/60);sec%=60;$('#counter').textContent=`${days} روز · ${String(h).padStart(2,'0')} ساعت · ${String(m).padStart(2,'0')} دقیقه · ${String(sec).padStart(2,'0')} ثانیه`}counter();setInterval(counter,1000);
const audio=$('#audio'),music=$('#musicBtn');music.addEventListener('click',async()=>{try{if(audio.paused){await audio.play();music.classList.add('playing');music.querySelector('span').textContent='آهنگ در حال پخش…'}else{audio.pause();music.classList.remove('playing');music.querySelector('span').textContent='پخش آهنگ ما'}}catch(e){alert('فایل آهنگ را با نام our-song.mp3 کنار index.html قرار بده.') }});audio.addEventListener('ended',()=>{music.classList.remove('playing');music.querySelector('span').textContent='پخش آهنگ ما'});
const traitText=$('#traitText');const traits={hair:'موهات؛ یکی از همان چیزهایی که حتی وقتی چیزی نمی‌گم، باز هم نگاهم را می‌کشند سمت خودت.',eyes:'چشم‌هات؛ از آن نگاه‌هایی که حتی بدون حرف زدن هم کلی حرف دارند.',laugh:'خنده‌ات؛ یکی از صداهایی که هیچ‌وقت برای من تکراری نمی‌شود.',tiny:'کوچولوی من؛ همان اسمی که خودش یک دنیا حس دارد.',stubborn:'لجبازی‌هات؛ گاهی دیوونه‌م می‌کنند، ولی بخشی از همان کیانایی‌اند که دوستش دارم.',kind:'مهربونیت؛ یکی از دلایلی که بین همه آدم‌ها، تو برای من فرق کردی.',sea:'دریا؛ شاید چون یک چیزی از عمق و آرامش تو را دارد.',curly:'اون حالت موهات؛ همان جزئیات کوچکی که شاید خودت ندانی چقدر برای من خاص‌اند.'};$$('[data-trait]').forEach(b=>b.onclick=()=>{$$('[data-trait]').forEach(x=>x.classList.remove('active'));b.classList.add('active');traitText.textContent=traits[b.dataset.trait]});
$$('.gallery figure').forEach(f=>f.onclick=()=>{$('#lightImg').src=f.querySelector('img').src;$('#lightCaption').textContent=f.querySelector('b').textContent+' — '+f.querySelector('span').textContent;$('#lightbox').classList.add('open')});$('#closeLight').onclick=()=>$('#lightbox').classList.remove('open');$('#lightbox').onclick=e=>{if(e.target.id==='lightbox')$('#lightbox').classList.remove('open')};
$('#envelope').onclick=()=>{$('#letterPaper').classList.toggle('open');$('#envelope').style.display='none';$('#letter').scrollIntoView({behavior:'smooth',block:'center'})};
let taps=0;$$('[data-secret]').forEach(b=>b.onclick=()=>{taps++;if(b.dataset.secret==='21'&&taps>=3){openSecret();taps=0}else if(b.dataset.secret==='blossom'&&taps>=5){openSecret();taps=0}else if(b.dataset.secret!=='21'&&b.dataset.secret!=='blossom'){b.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],350)}});
function openSecret(){$('#secretModal').classList.add('open')}$('#secretBtn').onclick=openSecret;$('#closeSecret').onclick=()=>$('#secretModal').classList.remove('open');$('#secretModal').onclick=e=>{if(e.target.id==='secretModal')$('#secretModal').classList.remove('open')};
let seq='';document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;seq+=(e.key||'').toLowerCase();if(seq.length>12)seq=seq.slice(-12);if(seq.includes('21'))openSecret()});
const nav=$('.nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20));const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});$$('.reveal').forEach(x=>obs.observe(x));

/* V5 private room */
const PRIVATE_CODE='21-SEA-BLOSSOM';
const lockScreen=$('#lockScreen'), secretRoom=$('#secretRoom'), secretForm=$('#secretForm'), secretInput=$('#secretInput'), secretError=$('#secretError');
secretForm.addEventListener('submit',e=>{
  e.preventDefault();
  const val=secretInput.value.trim().toUpperCase().replace(/\s+/g,'');
  if(val===PRIVATE_CODE.replace(/\s+/g,'')){
    lockScreen.hidden=true; secretRoom.hidden=false; secretError.textContent=''; initPrivateGames();
  }else{
    secretError.textContent='این ترکیب درست نیست... سرنخ: ۲۱ + دریا + شکوفه';
    secretInput.select();
  }
});
let gamesStarted=false, quizDone=0, flowerDone=false, memoryDone=false;
function initPrivateGames(){
  if(gamesStarted)return; gamesStarted=true;
  initQuiz(); initFlowers(); initMemory();
  updateFinal();
}
/* Game 1: quiz */
const quizData=[
 {q:'کدام عدد برای ما فقط یک عدد معمولی نیست؟',a:['۷','۱۲','۲۱','۴۰'],c:2},
 {q:'کدام نماد بیشتر از همه یادآور دنیای کیاناست؟',a:['🌊 دریا','☀️ خورشید','🌙 ماه','☁️ ابر'],c:0},
 {q:'«شکوفه سفید» برای این سایت یعنی چه؟',a:['یک گل معمولی','اسم رمز بین ما','یک رنگ','اسم یک بازی'],c:1}
];
let qi=0;
function initQuiz(){renderQuiz();}
function renderQuiz(){
  const q=quizData[qi], box=$('#quizAnswers');$('#quizQuestion').textContent=q.q;box.innerHTML='';
  q.a.forEach((ans,i)=>{const b=document.createElement('button');b.type='button';b.textContent=ans;b.addEventListener('click',()=>{
    if(i===q.c){b.classList.add('correct');quizDone++;$('#quizScore').textContent=`${quizDone}/۳`;$('#quizResult').textContent='درست... انگار واقعاً این داستان را می‌شناسی 🤍';}
    else{b.classList.add('wrong');$('#quizResult').textContent='نه 😄 دوباره فکر کن.';return}
    box.querySelectorAll('button').forEach(x=>x.disabled=true);
    if(qi<quizData.length-1){setTimeout(()=>{qi++;renderQuiz()},550)}else{setTimeout(()=>updateFinal(),300)}
  });box.appendChild(b)});
}
/* Game 2: find five blossoms */
let flowerTimer=null, flowerTime=20, foundFlowers=0;
function initFlowers(){
 const board=$('#flowerBoard');board.innerHTML='';
 for(let i=0;i<20;i++){const b=document.createElement('button');b.type='button';b.className='flower-cell';b.textContent='✦';b.setAttribute('aria-label','خانه');b.addEventListener('click',()=>{
   if(!flowerTimer||b.classList.contains('found')||b.dataset.flower!=='1')return;
   b.classList.add('found');foundFlowers++;$('#flowerScore').textContent=`${foundFlowers}/۵`;
   if(foundFlowers>=5){clearInterval(flowerTimer);flowerTimer=null;flowerDone=true;$('#flowerResult').textContent='همه شکوفه‌ها پیدا شدند ✦';updateFinal();}
 });board.appendChild(b)}
}
$('#flowerStart').addEventListener('click',()=>{
 clearInterval(flowerTimer);flowerTime=20;foundFlowers=0;flowerDone=false;$('#flowerScore').textContent='۰/۵';$('#flowerResult').textContent='';
 $$('#flowerBoard .flower-cell').forEach(x=>x.classList.remove('found'));
 const cells=[...$$('#flowerBoard .flower-cell')];cells.sort(()=>Math.random()-.5);cells.slice(0,5).forEach(x=>x.dataset.flower='1');
 flowerTimer=setInterval(()=>{
   flowerTime--;$('#flowerTimer').textContent=`${flowerTime} ثانیه`;
   if(flowerTime<=0){clearInterval(flowerTimer);flowerTimer=null;$('#flowerResult').textContent=`زمان تمام شد؛ ${foundFlowers} شکوفه پیدا شد.`}
 },1000);
});
$('#flowerBoard').addEventListener('click',e=>{
 const b=e.target.closest('.flower-cell');if(!b||!flowerTimer)return;
 if(b.dataset.flower==='1'&&!b.classList.contains('found')){b.dataset.found='1';}
});
/* Game 3: memory pairs */
const memSymbols=['🌊','✦','∞','🤍','🌊','✦','∞','🤍'];
let firstCard=null, secondCard=null, lockMem=false, moves=0, matches=0;
function initMemory(){
 const board=$('#memoryBoard');board.innerHTML='';firstCard=null;secondCard=null;lockMem=false;moves=0;matches=0;memoryDone=false;$('#memoryMoves').textContent='۰ حرکت';$('#memoryResult').textContent='';
 const cards=memSymbols.map((s,i)=>({s,id:i})).sort(()=>Math.random()-.5);
 cards.forEach(card=>{const b=document.createElement('button');b.type='button';b.className='memory-card';b.textContent=card.s;b.dataset.symbol=card.s;b.addEventListener('click',()=>flipMemory(b));board.appendChild(b)});
}
function flipMemory(card){
 if(lockMem||card.classList.contains('open')||card.classList.contains('matched'))return;
 card.classList.add('open');
 if(!firstCard){firstCard=card;return}
 secondCard=card;moves++;$('#memoryMoves').textContent=`${moves} حرکت`;
 lockMem=true;
 if(firstCard.dataset.symbol===secondCard.dataset.symbol){
   firstCard.classList.add('matched');secondCard.classList.add('matched');matches++;firstCard=null;secondCard=null;lockMem=false;
   if(matches===4){memoryDone=true;$('#memoryResult').textContent='همه جفت‌ها پیدا شدند 🤍';updateFinal();}
 }else{
   setTimeout(()=>{firstCard.classList.remove('open');secondCard.classList.remove('open');firstCard=null;secondCard=null;lockMem=false},650);
 }
}
$('#memoryReset').addEventListener('click',initMemory);
function updateFinal(){
 if(quizDone>=3 && flowerDone && memoryDone)$('#finalUnlock').hidden=false;
}
$('#revealPrivate').addEventListener('click',()=>{
 $('#privateMessage').hidden=false;$('#revealPrivate').textContent='پیام باز شد 🤍';$('#revealPrivate').disabled=true;
});
