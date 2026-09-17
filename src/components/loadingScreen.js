import confetti from 'canvas-confetti';
import { btsMembers } from '../data/btsData.js';
import { soundEngine } from './soundEngine.js';
import { initLoading3DScene } from './loading3DScene.js';

export function initLoadingScreen(onComplete) {
  const loadingOverlay = document.getElementById('bts-loading-screen');
  if (!loadingOverlay) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  let isDone = false;
  let loading3D = null;

  function finishLoading() {
    if (isDone) return;
    isDone = true;

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#ec4899', '#fbcfe8', '#d8b4fe', '#ffffff']
      });
    } catch (e) {}

    try {
      soundEngine.playSparkle();
    } catch (e) {}

    loadingOverlay.classList.add('fade-out');
    
    // Hide and remove after fade
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
      if (loading3D && typeof loading3D.destroy === 'function') {
        loading3D.destroy();
      }
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 450);
  }

  // Expose finishLoading globally so inline buttons work 100% of the time
  window.dismissLoadingScreen = finishLoading;

  // Initialize 3D scene
  try {
    const stage3DContainer = document.getElementById('loading-3d-stage');
    if (stage3DContainer) {
      loading3D = initLoading3DScene(stage3DContainer);
    }
  } catch (err) {
    console.warn('3D loading error:', err);
  }

  // Render members list
  const membersContainer = document.getElementById('loading-members-list');
  if (membersContainer) {
    membersContainer.innerHTML = btsMembers.map((m, idx) => `
      <div class="loading-member-card" id="member-card-${m.id}">
        <div class="member-avatar-wrapper">
          ${m.avatarSvg}
          <span class="member-emoji-badge">${m.emoji}</span>
        </div>
        <div class="member-info">
          <div class="member-name-row">
            <span class="member-stage-name">${m.name}</span>
            <span class="member-real-name">(${m.realName})</span>
            <span class="member-role-tag">${m.role}</span>
          </div>
          <div class="member-status-message" id="msg-${m.id}">
            <span class="status-dot pulsing"></span> Connecting 3D node...
          </div>
        </div>
        <div class="member-status-badge waiting" id="badge-${m.id}">
          CONNECTING...
        </div>
      </div>
    `).join('');
  }

  const progressBar = document.getElementById('loading-progress-fill');
  const progressText = document.getElementById('loading-percentage');
  const statusHeadline = document.getElementById('loading-status-headline');
  const enterBtn = document.getElementById('loading-enter-btn');
  const skipBtn = document.getElementById('loading-skip-btn');

  if (skipBtn) {
    skipBtn.addEventListener('click', finishLoading);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', finishLoading);
  }

  // Member login progression
  let currentIdx = 0;
  const total = btsMembers.length;

  const interval = setInterval(() => {
    if (isDone) {
      clearInterval(interval);
      return;
    }

    if (currentIdx < total) {
      const member = btsMembers[currentIdx];
      const card = document.getElementById(`member-card-${member.id}`);
      const msg = document.getElementById(`msg-${member.id}`);
      const badge = document.getElementById(`badge-${member.id}`);

      if (card && msg && badge) {
        card.classList.add('member-logged-in');
        card.style.borderColor = member.borderGlow;
        card.style.background = `linear-gradient(135deg, rgba(255, 255, 255, 0.95), ${member.softBg})`;

        msg.innerHTML = `<span class="status-dot active"></span> <span class="quote-text">"${member.loginStatus}"</span>`;
        badge.className = 'member-status-badge online';
        badge.innerHTML = 'ONLINE ✓';
      }

      if (loading3D) {
        loading3D.activateOrb(currentIdx);
      }

      try {
        soundEngine.playLoginChime(currentIdx);
      } catch (e) {}

      currentIdx++;
      const percent = Math.min(Math.round((currentIdx / total) * 100), 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = `${percent}%`;
      if (statusHeadline) {
        statusHeadline.textContent = `BTS Member Logging In: ${member.name} Connected [${currentIdx}/${total}]`;
      }
    } else {
      clearInterval(interval);
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = '100%';
      if (statusHeadline) {
        statusHeadline.innerHTML = '✨ ALL 7 BTS MEMBERS AUTHENTICATED • NABANITA.OS READY';
        statusHeadline.classList.add('all-ready');
      }

      if (enterBtn) {
        enterBtn.classList.remove('hidden');
        enterBtn.classList.add('pulse-glow');
      }

      // Auto dismiss after 1.8 seconds once all 7 are connected
      setTimeout(finishLoading, 1800);
    }
  }, 420);

  // Absolute safety timeout: after 5 seconds, guarantee exit
  setTimeout(() => {
    if (!isDone) {
      finishLoading();
    }
  }, 5200);
}
