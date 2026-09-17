import confetti from 'canvas-confetti';
import { resumeData } from './data/resumeData.js';
import { soundEngine } from './components/soundEngine.js';
import { initThreeScene } from './components/threeScene.js';
import { initLoadingScreen } from './components/loadingScreen.js';
import { renderProjects } from './components/projectCards.js';
import { initArmyFanZone } from './components/armyFanZone.js';
import { initCompanionWidget } from './components/companionWidget.js';

function initApp() {
  // 1. Initialize Loading Screen FIRST so it starts animating instantly
  try {
    initLoadingScreen(() => {
      try {
        soundEngine.playChime(523.25, 0.3);
      } catch (e) {}
    });
  } catch (err) {
    console.warn('Loading screen init error:', err);
    // Emergency fallback to remove overlay if init failed
    const overlay = document.getElementById('bts-loading-screen');
    if (overlay) overlay.style.display = 'none';
  }

  // 2. Render Skills Section
  try {
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
      skillsGrid.innerHTML = resumeData.skills.categories.map(cat => `
        <div class="skill-category-card">
          <div class="cat-header">
            <div class="cat-icon-wrap">
              ${getCategoryIcon(cat.id)}
            </div>
            <h3 class="cat-title">${cat.name}</h3>
          </div>

          <div class="cat-skills-list">
            ${cat.skills.map(s => `
              <div class="skill-item-bar">
                <div class="skill-label-row">
                  <span>${s.name}</span>
                  <span class="skill-tag-pill">${s.tag}</span>
                </div>
                <div class="skill-track">
                  <div class="skill-progress" style="width: ${s.level}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Skills render error:', err);
  }

  // 3. Render Projects Section
  try {
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
      renderProjects(projectsContainer);
    }
  } catch (err) {
    console.error('Projects render error:', err);
  }

  // 4. Render Internships & Education
  try {
    const internshipsWrap = document.getElementById('internships-wrap');
    if (internshipsWrap) {
      internshipsWrap.innerHTML = resumeData.internships.map(item => `
        <div class="timeline-item-card">
          <div class="item-top-row">
            <span class="item-period-badge">${item.period}</span>
            <span class="item-grade-badge">${item.duration}</span>
          </div>
          <h4 class="item-title">${item.role}</h4>
          <div class="item-institution">${item.company} • ${item.type}</div>
          <p class="item-desc">${item.focus}. ${item.description}</p>
        </div>
      `).join('');
    }

    const educationWrap = document.getElementById('education-wrap');
    if (educationWrap) {
      educationWrap.innerHTML = resumeData.education.map(item => `
        <div class="timeline-item-card">
          <div class="item-top-row">
            <span class="item-period-badge">${item.period}</span>
            <span class="item-grade-badge">${item.grade}</span>
          </div>
          <h4 class="item-title">${item.degree}</h4>
          <div class="item-institution">${item.institution}</div>
          <p class="item-desc">${item.highlight}</p>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Journey render error:', err);
  }

  // 5. Render BTS Army Fan Zone
  try {
    const armyLoungeContainer = document.getElementById('army-lounge-container');
    if (armyLoungeContainer) {
      initArmyFanZone(armyLoungeContainer);
    }
  } catch (err) {
    console.error('Army Fan Zone error:', err);
  }

  // 6. Initialize BTS Companion Widget
  try {
    initCompanionWidget();
  } catch (err) {
    console.error('Companion widget error:', err);
  }

  // 7. Initialize Three.js 3D Canvas
  try {
    const threeCanvasContainer = document.getElementById('three-canvas-container');
    if (threeCanvasContainer) {
      initThreeScene(threeCanvasContainer);
    }
  } catch (err) {
    console.error('Three.js hero scene error:', err);
  }

  // 8. Background Music Toggle
  try {
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicEq = document.getElementById('music-eq');
    const musicText = document.getElementById('music-btn-text');

    if (musicToggleBtn) {
      musicToggleBtn.addEventListener('click', () => {
        const playing = soundEngine.toggleBgm();
        if (playing) {
          musicEq.classList.add('playing');
          musicText.textContent = 'Pause Lo-Fi';
          soundEngine.playSparkle();
        } else {
          musicEq.classList.remove('playing');
          musicText.textContent = 'BTS Lo-Fi';
        }
      });
    }
  } catch (err) {
    console.error('Music toggle error:', err);
  }

  // 9. Contact Form Submission Handling
  try {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        try { soundEngine.playSparkle(); } catch (e) {}

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ec4899', '#f472b6', '#a855f7', '#fbcfe8', '#ffffff']
          });
        } catch (e) {}

        const name = document.getElementById('form-name').value;
        alert(`💌 Thank you so much, ${name}! Your purple note has been simulated successfully. You can also reach Nabanita directly at rnabanita774@gmail.com! Borahae 💜`);
        contactForm.reset();
      });
    }
  } catch (err) {
    console.error('Contact form error:', err);
  }
}

function getCategoryIcon(id) {
  switch (id) {
    case 'bi':
      return '📊';
    case 'programming':
      return '💻';
    case 'databases':
      return '🗄️';
    case 'tools':
      return '🛠️';
    default:
      return '🌸';
  }
}

// Execute immediately if DOM already parsed or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
