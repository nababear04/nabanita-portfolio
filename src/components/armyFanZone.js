import confetti from 'canvas-confetti';
import { btsQuotes } from '../data/btsData.js';
import { soundEngine } from './soundEngine.js';

export function initArmyFanZone(containerElement) {
  if (!containerElement) return;

  let cheerCount = 130613; // BTS Debut date Easter egg: June 13, 2013!
  let currentQuoteIdx = 0;
  const lightColors = [
    { name: "Soft Pink Glow", hex: "#f472b6", bg: "rgba(244, 114, 182, 0.45)" },
    { name: "Borahae Purple", hex: "#a855f7", bg: "rgba(168, 85, 247, 0.45)" },
    { name: "Rose Gold Shimmer", hex: "#fb7185", bg: "rgba(251, 113, 133, 0.45)" },
    { name: "Spring Day Mint", hex: "#34d399", bg: "rgba(52, 211, 153, 0.45)" },
    { name: "Butter Sunset", hex: "#fbbf24", bg: "rgba(251, 191, 36, 0.45)" }
  ];
  let colorIdx = 0;

  containerElement.innerHTML = `
    <div class="army-lounge-card">
      <div class="lounge-header">
        <span class="army-badge">💜 BTS ARMY SPECIAL LOUNGE</span>
        <h3 class="lounge-title">Army Bomb Lightstick Stage</h3>
        <p class="lounge-sub">Sync your lightstick with thousands of fans and cheer for Nabanita's portfolio journey!</p>
      </div>

      <div class="lounge-content-grid">
        <div class="lightstick-interactive-col">
          <div class="lightstick-mount" id="lightstick-mount" title="Click to wave lightstick and cheer!">
            <div class="lightstick-glow-aura" id="lightstick-aura" style="background: radial-gradient(circle, ${lightColors[0].bg} 0%, rgba(255,255,255,0) 70%);"></div>
            
            <svg viewBox="0 0 140 240" class="army-bomb-svg" id="army-bomb-svg">
              <!-- Orb sphere -->
              <circle cx="70" cy="70" r="54" fill="rgba(255, 255, 255, 0.2)" stroke="#fbcfe8" stroke-width="3"/>
              <!-- Inner glowing core -->
              <circle id="bomb-inner-bulb" cx="70" cy="70" r="32" fill="${lightColors[0].hex}" opacity="0.9"/>
              <circle cx="62" cy="58" r="8" fill="#ffffff" opacity="0.6"/>
              <!-- Fuse / tip on top -->
              <rect x="66" y="10" width="8" height="10" rx="3" fill="#ec4899"/>
              <circle cx="70" cy="8" r="4" fill="#fda4af"/>
              <!-- Handle ring / collar -->
              <rect x="52" y="124" width="36" height="12" rx="4" fill="#475569"/>
              <rect x="56" y="132" width="28" height="6" rx="2" fill="#94a3b8"/>
              <!-- Handle body -->
              <path d="M 54 136 L 58 220 L 82 220 L 86 136 Z" fill="#1e293b"/>
              <!-- Power button -->
              <circle cx="70" cy="165" r="5" fill="#f472b6"/>
              <line x1="70" y1="162" x2="70" y2="168" stroke="#ffffff" stroke-width="1.5"/>
              <!-- Silver cap base -->
              <rect x="56" y="218" width="28" height="10" rx="3" fill="#cbd5e1"/>
            </svg>
            <div class="click-hint-badge">Tap Army Bomb to Cheer! ✨</div>
          </div>

          <div class="light-mode-controls">
            <span class="mode-label">Light Mode:</span>
            <button class="light-cycle-btn" id="light-cycle-btn">
              <span class="color-dot" id="active-color-dot" style="background:${lightColors[0].hex};"></span>
              <span id="light-mode-name">${lightColors[0].name}</span>
            </button>
          </div>
        </div>

        <div class="cheer-stats-col">
          <div class="cheer-meter-box">
            <span class="cheer-meter-label">Total ARMY Cheers for Nabanita</span>
            <div class="cheer-counter-number" id="cheer-counter">${cheerCount.toLocaleString()}</div>
            <div class="cheer-action-row">
              <button class="btn btn-primary-soft cheer-btn" id="send-cheer-btn">
                <span>Wave Lightstick 💜</span>
              </button>
              <button class="btn btn-secondary-glass" id="next-quote-btn">
                <span>BTS Inspiration 🎶</span>
              </button>
            </div>
          </div>

          <div class="bts-quote-display-card">
            <div class="quote-icon-bubble">“</div>
            <p class="featured-quote-text" id="featured-quote-text">${btsQuotes[0]}</p>
            <span class="quote-sub-label">Words of inspiration & perseverance</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  const mount = document.getElementById('lightstick-mount');
  const bulb = document.getElementById('bomb-inner-bulb');
  const aura = document.getElementById('lightstick-aura');
  const counter = document.getElementById('cheer-counter');
  const cheerBtn = document.getElementById('send-cheer-btn');
  const cycleBtn = document.getElementById('light-cycle-btn');
  const colorDot = document.getElementById('active-color-dot');
  const modeName = document.getElementById('light-mode-name');
  const quoteBtn = document.getElementById('next-quote-btn');
  const quoteText = document.getElementById('featured-quote-text');

  function triggerCheer(e) {
    cheerCount++;
    counter.textContent = cheerCount.toLocaleString();

    // Pulse animation
    mount.classList.add('cheer-pulse');
    setTimeout(() => mount.classList.remove('cheer-pulse'), 300);

    soundEngine.playChime(783.99, 0.25);

    // Mini confetti burst near mouse
    confetti({
      particleCount: 22,
      spread: 45,
      origin: {
        x: (e.clientX || window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY || window.innerHeight / 2) / window.innerHeight
      },
      colors: [lightColors[colorIdx].hex, '#fbcfe8', '#ffffff']
    });
  }

  mount.addEventListener('click', triggerCheer);
  cheerBtn.addEventListener('click', triggerCheer);

  cycleBtn.addEventListener('click', () => {
    colorIdx = (colorIdx + 1) % lightColors.length;
    const current = lightColors[colorIdx];
    bulb.setAttribute('fill', current.hex);
    aura.style.background = `radial-gradient(circle, ${current.bg} 0%, rgba(255,255,255,0) 70%)`;
    colorDot.style.background = current.hex;
    modeName.textContent = current.name;
    soundEngine.playChime(659.25, 0.15);
  });

  quoteBtn.addEventListener('click', () => {
    currentQuoteIdx = (currentQuoteIdx + 1) % btsQuotes.length;
    quoteText.style.opacity = '0';
    soundEngine.playChime(523.25, 0.2);
    setTimeout(() => {
      quoteText.textContent = btsQuotes[currentQuoteIdx];
      quoteText.style.opacity = '1';
    }, 150);
  });
}
