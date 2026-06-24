const GYM_CONFIG = {
  name:"REDBULL Gym", location:"123, Fitness Road, Jamnagar, Gujarat",
  timings:"5:00 AM to 10:00 PM, Monday to Sunday", whatsapp:"+91 7016338739",
  plans:[
    {name:"The Starter (Tier 01)",price:"₹999/month",features:"All machines, free weights, 24/7 access"},
    {name:"The Bull (Tier 02)",price:"₹2,499/month",features:"8 PT sessions, diet plan, group classes"},
    {name:"The Beast (Tier 03)",price:"₹4,999/month",features:"Unlimited PT, custom diet, recovery sessions"}
  ],
  trainers:"15+ certified expert trainers", members:"1200+ active members",
  facilities:"8,000 sq ft — cardio, free weights, group classes, boxing ring",
  freeTrial:true
};
const GROQ_API_KEY="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";
const GROQ_MODEL="llama-3.3-70b-versatile";
const SYSTEM_PROMPT=`You are a friendly, enthusiastic AI assistant for ${GYM_CONFIG.name}.
GYM: ${GYM_CONFIG.name} | ${GYM_CONFIG.location} | ${GYM_CONFIG.timings} | WhatsApp ${GYM_CONFIG.whatsapp}
${GYM_CONFIG.trainers} · ${GYM_CONFIG.members} · ${GYM_CONFIG.facilities}
Free trial: ${GYM_CONFIG.freeTrial?"Yes — 1-day free trial.":"No."}
PLANS:
${GYM_CONFIG.plans.map(p=>`• ${p.name} — ${p.price} | ${p.features}`).join('\n')}
RULES: Only answer gym questions. Warm + motivating. 2-4 sentence replies. Always guide to WhatsApp ${GYM_CONFIG.whatsapp}. Never invent info. Reply in same language as user.`;

let chatHistory=[],isOpen=false,isLoading=false;
function toggleChat(){
  isOpen=!isOpen;
  document.getElementById('chat-window').classList.toggle('open',isOpen);
  document.getElementById('chat-toggle').classList.toggle('open',isOpen);
  document.querySelector('.chat-notify').style.display='none';
  if(isOpen&&chatHistory.length===0)setTimeout(()=>addBotMsg("Hey there! 🐂 Welcome to REDBULL Gym!\n\nI'm your AI fitness assistant ⚡\n\nAsk me about plans, prices, timings, free trial, or which program fits your goal!"),300);
}
function quickAsk(t){document.getElementById('chat-input').value=t;document.getElementById('quick-replies').style.display='none';sendMessage();}
function addBotMsg(t){const c=document.getElementById('chat-messages');const d=document.createElement('div');d.className='msg bot';d.innerHTML=`<div class="msg-avatar">🐂</div><div class="msg-bubble">${t.replace(/\n/g,'<br>')}</div>`;c.appendChild(d);c.scrollTop=c.scrollHeight;}
function addUserMsg(t){const c=document.getElementById('chat-messages');const d=document.createElement('div');d.className='msg user';d.innerHTML=`<div class="msg-bubble">${t}</div><div class="msg-avatar" style="background:rgba(255,255,255,0.1)">👤</div>`;c.appendChild(d);c.scrollTop=c.scrollHeight;}
function showTyping(){const c=document.getElementById('chat-messages');const d=document.createElement('div');d.className='msg bot';d.id='typing';d.innerHTML=`<div class="msg-avatar">🐂</div><div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;c.appendChild(d);c.scrollTop=c.scrollHeight;}
function hideTyping(){const t=document.getElementById('typing');if(t)t.remove();}
async function sendMessage(){
  const input=document.getElementById('chat-input'),sendBtn=document.getElementById('chat-send'),text=input.value.trim();
  if(!text||isLoading)return;
  addUserMsg(text);chatHistory.push({role:'user',content:text});input.value='';isLoading=true;sendBtn.disabled=true;showTyping();
  try{
    const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_API_KEY}`},
      body:JSON.stringify({model:GROQ_MODEL,max_tokens:300,temperature:0.7,messages:[{role:'system',content:SYSTEM_PROMPT},...chatHistory.slice(-10)]})
    });
    const data=await res.json();hideTyping();
    if(data.choices&&data.choices[0]){const reply=data.choices[0].message.content;addBotMsg(reply);chatHistory.push({role:'assistant',content:reply});}
    else addBotMsg("Connection issue. WhatsApp us: "+GYM_CONFIG.whatsapp);
  }catch(e){hideTyping();addBotMsg("Oops! Please reach us on WhatsApp: "+GYM_CONFIG.whatsapp+" 💬");}
  isLoading=false;sendBtn.disabled=false;
}
