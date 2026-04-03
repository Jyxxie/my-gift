// Global variables
let currentStage = 'intro';
let balloonsPopped = 0;
let totalBalloons = 5;
let musicPlaying = false;
let envelopeOpened = false;
let confettiInterval;

// Custom Cursor
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.cursor');
  const trail = document.querySelector('.cursor-trail');
  
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  trail.style.left = e.clientX + 'px';
  trail.style.top = e.clientY + 'px';
});

function replayGame() {
  balloonsPopped = 0;
  usedMessages.clear();
  envelopeOpened = false;
  currentStage = 'intro';
  
  stopConfetti();
  
  document.getElementById('password').value = '';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressText').textContent = '0/5';
  document.getElementById('balloons').innerHTML = '';
  
  document.querySelectorAll('#nextBtn, #celebrateBtn, #replayBtn').forEach(btn => {
    btn.classList.add('hidden');
    btn.style.animation = '';
  });
  
  document.querySelectorAll('.flame').forEach(flame => flame.classList.remove('blow-out'));
  
  const letterBox = document.getElementById('letterBox');
  letterBox.classList.add('hidden');
  letterBox.classList.remove('show'); 
  document.getElementById('finalText').innerHTML = '';
  
  document.querySelectorAll('.stage').forEach(stage => {
    stage.classList.remove('active', 'center');
    stage.classList.add('hidden');
  });
  
  document.getElementById('envelope').classList.remove('open', 'opened');
  
  showMessage('🎉 Restarting magical journey for Madam Princess! ✨', 3000);
  
  setTimeout(() => {
    document.getElementById('introScreen').classList.remove('hidden');
    document.getElementById('introScreen').classList.add('active', 'center');
  }, 500);
}

function stopConfetti() {
  document.querySelectorAll('.confetti').forEach(confetti => {
    confetti.remove();
  });
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  const musicText = document.getElementById('musicText');

  if (!music) return;
  
  music.volume = 0.3;

  document.getElementById('replayBtn').classList.add('hidden');

  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  if (btn) {
    btn.addEventListener('click', () => {
      if (musicPlaying) {
        music.pause();
        musicText.textContent = 'Music';
        btn.innerHTML = '<i class="fas fa-music"></i> Music';
        musicPlaying = false;
      } else {
        music.play().catch(err => console.log('Music play error:', err));
        musicText.textContent = 'Pause';
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        musicPlaying = true;
      }
    });
  }
});

// Show temporary message
function showMessage(text, duration = 2000) {
  const messageEl = document.getElementById('tempMessage');
  messageEl.textContent = text;
  messageEl.classList.add('show');
  
  setTimeout(() => {
    messageEl.classList.remove('show');
  }, duration);
}

// Stage transitions
function transitionToStage(stageId) {
  const stages = document.querySelectorAll('.stage');
  stages.forEach(stage => {
    stage.classList.remove('active', 'center');
    stage.classList.add('hidden');
  });
  
  setTimeout(() => {
    const targetStage = document.getElementById(stageId);
    targetStage.classList.remove('hidden');
    targetStage.classList.add('active', 'center');
    currentStage = stageId;
  }, 800);
}

// Intro to Login
function startExperience() {
  document.getElementById('introScreen').classList.add('transitioning');
  setTimeout(() => {
    transitionToStage('loginScreen');
  }, 800);
  
  // Add entrance animation
  setTimeout(() => {
    document.querySelector('.login-card').style.animation = 'none';
  }, 1000);
}

// Global variable to track used messages
let usedMessages = new Set();

// Check Password
function checkPassword() {
  const input = document.getElementById('password');
  const value = input.value.trim().toLowerCase();
  
  if (value === 'danica' || value === 'danica 🎀') {
    input.style.borderColor = '#4ecdc4';
    showMessage('✨ Welcome, Madam Princess! ✨', 1500);
    setTimeout(() => {
      transitionToStage('balloonStage');
      createBalloons();
    }, 1000);
  } else {
    input.style.borderColor = '#ff6b6b';
    input.style.animation = 'shake 0.5s ease-in-out';
    showMessage('❌ Try again, magical name only! ✨');
    setTimeout(() => {
      input.style.animation = '';
    }, 500);
  }
}

// Balloon messages
const msgs = [
  "Happy Birthday Danica!!! 🎉",
  "You're a blessing to everyone around you!",
  "Keep shining!",
  "Wishing you endless joy and love!",
  "May all your dreams come true!"
];

function resetUsedMessages() {
  usedMessages.clear();
}

// Create Balloons
function createBalloons() {
  const balloonWrap = document.getElementById('balloons');
  balloonWrap.innerHTML = '';
  
  // Reset used messages for new game
  resetUsedMessages();
  
  for (let i = 0; i < totalBalloons; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.onclick = () => popBalloon(balloon);
    balloonWrap.appendChild(balloon);
  }
  
  updateProgress();
}

function popBalloon(balloon) {
  if (balloon.classList.contains('popped')) return;
  
  balloon.classList.add('popped');
  balloonsPopped++;
  updateProgress();
  
  showBalloonMessage(balloon);
  
  createPopEffect(balloon);
  
  if (balloonsPopped === totalBalloons) {
    setTimeout(() => {
      document.getElementById('nextBtn').classList.remove('hidden');
      document.getElementById('nextBtn').style.animation = 'bounce 1s infinite';
    }, 500);
  }
}

function getRandomUnusedMessage() {
  const availableMsgs = msgs.filter(msg => !usedMessages.has(msg));
  
  if (availableMsgs.length === 0) {
    usedMessages.clear();
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  
  const randomMsg = availableMsgs[Math.floor(Math.random() * availableMsgs.length)];
  usedMessages.add(randomMsg);
  return randomMsg;
}

function showBalloonMessage(balloon) {
  const rect = balloon.getBoundingClientRect();
  const randomMsg = getRandomUnusedMessage();
  
  const message = document.createElement('div');
  message.className = 'balloon-message';
  message.textContent = randomMsg;
  message.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width/2}px;
    top: ${rect.top - 20}px;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    pointer-events: none;
    z-index: 10001;
    box-shadow: 0 10px 25px rgba(255,107,107,0.5);
    animation: messageFloat 2s ease-out forwards;
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => message.remove(), 2000);
}

function createPopEffect(balloon) {
  const rect = balloon.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width/2}px;
      top: ${rect.top + rect.height/2}px;
      width: 6px;
      height: 6px;
      background: #ff6b6b;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
    `;
    particle.style.animation = `
      particleExplode ${Math.random() * 0.5 + 0.5}s ease-out forwards
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes particleExplode {
    0% { transform: scale(1) translate(0, 0); opacity: 1; }
    100% { transform: scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
  }
`;
document.head.appendChild(style);

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  const percentage = (balloonsPopped / totalBalloons) * 100;
  progressFill.style.width = percentage + '%';
  progressText.textContent = `${balloonsPopped}/${totalBalloons}`;
}

// Go to Cake
function goToCake() {
  transitionToStage('cakeStage');
}

// Blow Candles
function blowCandle() {
  const flames = document.querySelectorAll('.flame');
  flames.forEach((flame, index) => {
    setTimeout(() => {
      flame.classList.add('blow-out');
    }, index * 200);
  });
  
  showMessage('🎂 Make a wish! ✨', 2000);
  
  setTimeout(() => {
    transitionToStage('readConfrmation');
  }, 3000);
}

function goToLetter() {
  transitionToStage('envelopeStage');
}

function nopeAnimation() {
  const noBtn = document.getElementById('no-button');
  const yesBtn = document.getElementById('yes-button');
  
  noBtn.style.animation = 'none';
  yesBtn.style.transform = 'scale(1.2)';
  yesBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff5252)';
  
  setTimeout(() => {
    yesBtn.style.transform = 'scale(1)';
    yesBtn.style.background = '';
    noBtn.style.animation = 'wiggle 0.5s infinite';
  }, 500);
  
  showMessage('😜 Sige naaaa, kahit gusto mo naman na basahin eh 💌', 3000);
}

function openEnvelope() {
  if (envelopeOpened) return;
  
  const envelope = document.getElementById('envelope');
  envelope.classList.add('open');
  envelopeOpened = true;

setTimeout(() => {
  transitionToStage('finalStage');

  setTimeout(() => {
    const letterBox = document.getElementById('letterBox');
    const celebrateBtn = document.getElementById('celebrateBtn');
    const replayBtn = document.getElementById('replayBtn');

    celebrateBtn.classList.add('hidden');
    replayBtn.classList.add('hidden');

    letterBox.classList.remove('hidden');
    letterBox.classList.add('show');

    document.getElementById('finalText').innerHTML = '';
    typeText();
  }, 500);

}, 1000);
}

function typeText() {
  const msg = `Happy Birthday Danica!

I just want to take a moment to greet you and remind you how special this day is—because it's the day you were born, and the day the world became a little brighter with you in it.

I thank God for your life, for your strength, your smile, and all the little things that make you uniquely you. I pray that He continues to guide, protect, and bless you in everything you do. Sana bigyan ka pa Niya ng more happiness, peace of mind, at success sa buhay.

I also thank God for allowing our paths to cross. Sa dami ng pwedeng mangyari sa mundo, nakakatuwa isipin na nagkaroon tayo ng chance na magkakilala at mag-usap. I believe everything happens for a reason, and I'm truly grateful na isa ka sa naging part ng araw-araw ko.

Thank you for being someone who brings good vibes, laughter, and random moments na somehow nagpapasaya ng ordinary days. From our simple chats to our kulitan, you might not even notice it, pero you really can make someone smile.

I made this little website for you—not perfect, but it's something I put time, effort, and thought into just for you. A simple way para mapasaya ka kahit papaano, at ma-feel mo na appreciated ka.

I hope today brings you happiness, good food (lalo na yong cravings mo HAHAHA), and moments that remind you how special you are. You deserve all the good things, hindi lang today, but every day.

Stay as you are—fun to talk to, genuine, at someone na lucky ang mga taong nakapaligid sa'yo.

As you celebrate your birthday, sana tuloy-tuloy pa yung unexpected blessings sa life mo, just like how you see this year as something special. Tuloy mo lang pagiging strong mo, and always take care of yourself, lalo na sa work mo.

Enyour your day, madam princess HAHAHA 

—From someone who truly appreciates you 🤍`;

  const el = document.getElementById("finalText");
  el.innerHTML = '';
  
  let i = 0;

  function typing() {
    if (i < msg.length) {
      el.innerHTML += msg[i] === '\n' ? '<br>' : msg[i];
      i++;
      setTimeout(typing, 30);
      
      el.scrollTop = el.scrollHeight;
    } else {
      setTimeout(() => {
        const celebrateBtn = document.getElementById('celebrateBtn');
        celebrateBtn.classList.remove('hidden');
        celebrateBtn.style.animation = 'bounce 1s infinite';
      }, 500);
    }
  }
  typing();
}

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      createConfetti();
    }, i * 20);
  }
  
  document.body.style.animation = 'shake 0.5s ease-in-out';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
  
  const celebrateBtn = document.getElementById('celebrateBtn');
  const replayBtn = document.getElementById('replayBtn');

  celebrateBtn.classList.add('hidden');

  setTimeout(() => {
    replayBtn.classList.remove('hidden');
    replayBtn.style.animation = 'bounce 1s infinite';
  }, 1500);
}

function createConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.left = Math.random() * 100 + 'vw';
  confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
  confetti.style.animationDelay = Math.random() * 2 + 's';
  document.body.appendChild(confetti);
  
  setTimeout(() => confetti.remove(), 5000);
}

document.getElementById('password').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkPassword();
  }
});

document.addEventListener('contextmenu', e => e.preventDefault());