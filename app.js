const minuteEl=document.querySelector('#minutes');
const secondEl=document.querySelector('#seconds');
const centiEl=document.querySelector('#centiseconds');
const startButton=document.querySelector('#start-button');
const lapButton=document.querySelector('#lap-button');
const resetButton=document.querySelector('#reset-button');
const lapsList=document.querySelector('#lap-list');
const emptyState=document.querySelector('#laps-empty');
let running=false,startedAt=0,elapsed=0,timer=null,laps=[];
function format(ms){const total=Math.max(0,Math.floor(ms));const minutes=Math.floor(total/60000);const seconds=Math.floor(total/1000)%60;const centiseconds=Math.floor(total/10)%100;return {minutes:String(minutes).padStart(2,'0'),seconds:String(seconds).padStart(2,'0'),centiseconds:String(centiseconds).padStart(2,'0')}}
function currentTime(){return elapsed+(running?performance.now()-startedAt:0)}
function paint(){const t=format(currentTime());minuteEl.textContent=t.minutes;secondEl.textContent=t.seconds;centiEl.textContent=t.centiseconds}
function renderLaps(){lapsList.replaceChildren();emptyState.hidden=laps.length>0;document.querySelector('#lap-count').textContent=`${laps.length} ${laps.length===1?'LAP':'LAPS'}`;const best=laps.length?Math.min(...laps.map(l=>l.split)):Infinity;const slowest=laps.length>1?Math.max(...laps.map(l=>l.split)):-1;[...laps].reverse().forEach(lap=>{const li=document.createElement('li');if(lap.split===best)li.classList.add('fastest');if(lap.split===slowest)li.classList.add('slowest');li.innerHTML=`<span class="lap-number">Lap ${lap.number}${lap.split===best?' · Fastest':''}</span><span class="lap-time">${format(lap.total).minutes}:${format(lap.total).seconds}.${format(lap.total).centiseconds}</span><span class="lap-delta">+${format(lap.split).minutes}:${format(lap.split).seconds}.${format(lap.split).centiseconds}</span>`;lapsList.append(li)})}
function updateButtons(){startButton.querySelector('#start-label').textContent=running?'Pause':elapsed?'Resume':'Start';startButton.querySelector('#start-icon').textContent=running?'Ⅱ':'▶';lapButton.disabled=!running;resetButton.disabled=running||elapsed===0}
startButton.addEventListener('click',()=>{if(running){elapsed+=performance.now()-startedAt;running=false;clearInterval(timer);timer=null;paint()}else{startedAt=performance.now();running=true;timer=setInterval(paint,10)}updateButtons()});
lapButton.addEventListener('click',()=>{if(!running)return;const total=currentTime();const previous=laps.at(-1)?.total||0;laps.push({number:laps.length+1,total,split:total-previous});renderLaps()});
resetButton.addEventListener('click',()=>{running=false;clearInterval(timer);timer=null;elapsed=0;startedAt=0;laps=[];paint();renderLaps();updateButtons()});
paint();renderLaps();updateButtons();
