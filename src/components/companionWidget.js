import { btsMembers } from '../data/btsData.js';
import { soundEngine } from './soundEngine.js';

export function initCompanionWidget() {
  const container = document.getElementById('bts-companion-dock');
  if (!container) return;

  let activeMemberIndex = 4; // Default to Jimin or user preference
  let currentQuoteIndex = 0;

  const commentaryBySection = {
    hero: [
      "Welcome to Nabanita's universe! Explore her data science and engineering journey.",
      "Click anywhere on the 3D heart to interact with it!",
      "Turn on the BTS Lo-Fi beats in the header for the best vibe! 🎶"
    ],
    about: [
      "Nabanita is a final-year B.Tech CSE (Data Science) student at Brainware University!",
      "She speaks English, Hindi, and Bengali—multilingual tech power!",
      "Notice the 'Tech Tracklist' styled after our hit albums!"
    ],
    skills: [
      "Look at that Power BI and Python mastery! Outstanding data analytics stack.",
      "MySQL, MongoDB Atlas, React, and Node.js—full-stack ready!",
      "Hover over each skill card for 3D tilt and proficiency glow."
    ],
    projects: [
      "The Cakeshop Platform has an AI assistant powered by OpenAI and MongoDB Atlas!",
      "The Smart Waste IoT system uses machine learning to predict bin fullness—so smart!",
      "Try changing the fill slider in the IoT project simulation!"
    ],
    experience: [
      "Internships at Euphoria GenX and Ardent Computech specializing in GenAI and LLMs!",
      "Real-world cloud development and enterprise training experience."
    ],
    education: [
      "Graduating with a CGPA of 8.69 / 10 from Brainware University!",
      "Secondary school distinction with 95.6%—she has always been top tier!"
    ],
    lounge: [
      "Welcome to the BTS Army Fan Zone! Tap the Lightstick to sync with the crowd!",
      "Borahae! (I Purple You 💜)"
    ],
    contact: [
      "Ready to collaborate? Send Nabanita a message or grab her PDF resume!",
      "Direct email: rnabanita774@gmail.com or connect on LinkedIn."
    ]
  };

  function renderCompanion() {
    const member = btsMembers[activeMemberIndex];
    container.innerHTML = `
      <div class="companion-bubble" id="companion-bubble">
        <div class="bubble-header">
          <span class="bubble-member-name">${member.name} says:</span>
          <button class="bubble-close-btn" id="bubble-close-btn" title="Dismiss speech">&times;</button>
        </div>
        <p class="bubble-text" id="companion-bubble-text">${member.quotes[currentQuoteIndex % member.quotes.length]}</p>
        <div class="bubble-tip">Tap me for more thoughts!</div>
      </div>
      <div class="companion-avatar-btn" id="companion-avatar-btn" style="border-color: ${member.color}">
        <div class="avatar-ring"></div>
        ${member.avatarSvg}
        <span class="companion-badge-emoji">${member.emoji}</span>
      </div>
      <div class="companion-selector-drawer hidden" id="companion-selector-drawer">
        <div class="drawer-title">Choose Your BTS Companion</div>
        <div class="drawer-members-grid">
          ${btsMembers.map((m, idx) => `
            <button class="member-pick-btn ${idx === activeMemberIndex ? 'active' : ''}" data-index="${idx}" title="${m.name} (${m.role})">
              <span class="pick-emoji">${m.emoji}</span>
              <span class="pick-name">${m.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Add event listeners
    const avatarBtn = document.getElementById('companion-avatar-btn');
    const bubble = document.getElementById('companion-bubble');
    const bubbleText = document.getElementById('companion-bubble-text');
    const bubbleClose = document.getElementById('bubble-close-btn');
    const drawer = document.getElementById('companion-selector-drawer');

    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.playChime(523.25, 0.2);
      drawer.classList.toggle('hidden');
    });

    bubble.addEventListener('click', () => {
      currentQuoteIndex++;
      const quotes = member.quotes;
      bubbleText.textContent = quotes[currentQuoteIndex % quotes.length];
      soundEngine.playChime(659.25, 0.2);
    });

    bubbleClose.addEventListener('click', (e) => {
      e.stopPropagation();
      bubble.classList.add('minimized');
    });

    const pickBtns = container.querySelectorAll('.member-pick-btn');
    pickBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeMemberIndex = parseInt(btn.getAttribute('data-index'));
        currentQuoteIndex = 0;
        soundEngine.playLoginChime(activeMemberIndex);
        renderCompanion();
      });
    });
  }

  renderCompanion();

  // Update companion speech based on scroll position
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const secId = entry.target.id;
        const speechList = commentaryBySection[secId];
        if (speechList) {
          const bubbleText = document.getElementById('companion-bubble-text');
          const bubble = document.getElementById('companion-bubble');
          if (bubbleText && bubble) {
            bubble.classList.remove('minimized');
            const randomQuote = speechList[Math.floor(Math.random() * speechList.length)];
            bubbleText.textContent = randomQuote;
          }
        }
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));

  // Dismiss drawer if clicked outside
  document.addEventListener('click', () => {
    const drawer = document.getElementById('companion-selector-drawer');
    if (drawer && !drawer.classList.contains('hidden')) {
      drawer.classList.add('hidden');
    }
  });
}
