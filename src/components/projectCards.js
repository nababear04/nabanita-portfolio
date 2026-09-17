import { resumeData } from '../data/resumeData.js';
import { soundEngine } from './soundEngine.js';

export function renderProjects(containerElement) {
  if (!containerElement) return;

  const projects = resumeData.projects;

  containerElement.innerHTML = `
    <!-- Project 1: Cakeshop Platform with AI -->
    <div class="project-card 3d-card" data-tilt>
      <div class="project-card-header">
        <div class="project-top-meta">
          <span class="project-badge cakeshop-badge">🍰 Full-Stack Cloud + AI</span>
          <span class="project-status">Completed</span>
        </div>
        <h3 class="project-title">${projects[0].title}</h3>
        <p class="project-subtitle">${projects[0].subtitle}</p>
      </div>

      <div class="project-card-body">
        <p class="project-desc">${projects[0].description}</p>
        
        <div class="project-highlights">
          <h4 class="highlights-heading">Key Architecture Highlights:</h4>
          <ul>
            ${projects[0].highlights.map(h => `<li><span class="bullet-star">✨</span> ${h}</li>`).join('')}
          </ul>
        </div>

        <!-- Interactive AI Assistant Preview Widget -->
        <div class="interactive-preview-box">
          <div class="box-header">
            <span class="ai-sparkle-icon">🤖</span>
            <span class="box-title">Try Cakeshop AI Assistant Query:</span>
          </div>
          <div class="ai-sample-pills">
            <button class="ai-pill-btn active" data-reply="I recommend the 'Spring Day Rose Berry Cake'! Layered with organic strawberry ganache, soft pink fondant, and edible gold leaf. Pairs perfectly with celebratory moments!">🎂 Recommend a pink themed cake</button>
            <button class="ai-pill-btn" data-reply="Our delivery system uses MongoDB Atlas geolocation indexing to guarantee doorstep delivery within 45 minutes of oven dispatch.">🚚 Track delivery timeline</button>
            <button class="ai-pill-btn" data-reply="Yes! The platform supports fully customized gluten-free, vegan almond sponge layers with natural raspberry coloring.">🌱 Dietary customizations</button>
          </div>
          <div class="ai-reply-bubble" id="cakeshop-ai-reply">
            "I recommend the 'Spring Day Rose Berry Cake'! Layered with organic strawberry ganache, soft pink fondant, and edible gold leaf. Pairs perfectly with celebratory moments!"
          </div>
        </div>

        <div class="project-tech-tags">
          ${projects[0].tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="project-card-footer">
        <a href="${projects[0].repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-soft">
          <span>View on GitHub</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <a href="https://github.com/nababear04" target="_blank" rel="noopener noreferrer" class="btn btn-secondary-glass">
          <span>Architecture Docs</span>
        </a>
      </div>
    </div>

    <!-- Project 2: Smart Waste IoT with AI Predictions -->
    <div class="project-card 3d-card" data-tilt>
      <div class="project-card-header">
        <div class="project-top-meta">
          <span class="project-badge iot-badge">📡 IoT Sensor Network + ML</span>
          <span class="project-status in-progress">Ongoing Innovation</span>
        </div>
        <h3 class="project-title">${projects[1].title}</h3>
        <p class="project-subtitle">${projects[1].subtitle}</p>
      </div>

      <div class="project-card-body">
        <p class="project-desc">${projects[1].description}</p>

        <div class="project-highlights">
          <h4 class="highlights-heading">Key Engineering Highlights:</h4>
          <ul>
            ${projects[1].highlights.map(h => `<li><span class="bullet-star">✨</span> ${h}</li>`).join('')}
          </ul>
        </div>

        <!-- Interactive IoT Ultrasonic & ML Simulation -->
        <div class="interactive-preview-box iot-simulation-box">
          <div class="box-header">
            <span class="ai-sparkle-icon">📊</span>
            <span class="box-title">Live IoT Sensor & ML Prediction Simulator:</span>
          </div>

          <div class="iot-slider-control">
            <label for="bin-fill-slider">Simulate Ultrasonic Fill Level: <strong id="slider-fill-val">68%</strong></label>
            <input type="range" id="bin-fill-slider" min="10" max="98" value="68" class="pink-range-slider">
          </div>

          <div class="iot-telemetry-grid">
            <div class="telemetry-card">
              <span class="tel-label">Distance to Sensor</span>
              <span class="tel-val" id="tel-distance">12.8 cm</span>
            </div>
            <div class="telemetry-card">
              <span class="tel-label">ML Predicted Overflow</span>
              <span class="tel-val" id="tel-time">In ~4.2 Hours</span>
            </div>
            <div class="telemetry-card">
              <span class="tel-label">Fleet Dispatch Status</span>
              <span class="tel-val status-badge-warn" id="tel-dispatch">Route Queued</span>
            </div>
          </div>
          
          <div class="bin-graphic-wrapper">
            <div class="bin-container-graphic">
              <div class="bin-fill-level" id="bin-fill-graphic" style="height: 68%;"></div>
              <div class="bin-sensor-beam"></div>
            </div>
            <div class="bin-status-readout" id="bin-status-readout">
              Status: <strong>Normal Monitoring</strong> • Telemetry syncing to MongoDB
            </div>
          </div>
        </div>

        <div class="project-tech-tags">
          ${projects[1].tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="project-card-footer">
        <a href="${projects[1].repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-soft">
          <span>View on GitHub</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <a href="https://github.com/nababear04" target="_blank" rel="noopener noreferrer" class="btn btn-secondary-glass">
          <span>IoT Schematics</span>
        </a>
      </div>
    </div>
  `;

  // Attach interactive listeners for Cakeshop AI pills
  const aiPills = containerElement.querySelectorAll('.ai-pill-btn');
  const aiReplyEl = document.getElementById('cakeshop-ai-reply');
  aiPills.forEach(pill => {
    pill.addEventListener('click', () => {
      aiPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      soundEngine.playChime(587.33, 0.2);

      const reply = pill.getAttribute('data-reply');
      aiReplyEl.style.opacity = '0';
      setTimeout(() => {
        aiReplyEl.textContent = `"${reply}"`;
        aiReplyEl.style.opacity = '1';
      }, 150);
    });
  });

  // Attach interactive listeners for IoT Slider
  const slider = document.getElementById('bin-fill-slider');
  const sliderVal = document.getElementById('slider-fill-val');
  const telDistance = document.getElementById('tel-distance');
  const telTime = document.getElementById('tel-time');
  const telDispatch = document.getElementById('tel-dispatch');
  const binFillGraphic = document.getElementById('bin-fill-graphic');
  const binStatusReadout = document.getElementById('bin-status-readout');

  if (slider) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      sliderVal.textContent = `${val}%`;
      binFillGraphic.style.height = `${val}%`;

      // Sensor distance formula: 40cm bin height, fill % translates to depth
      const dist = ((100 - val) * 0.4).toFixed(1);
      telDistance.textContent = `${dist} cm`;

      if (val >= 85) {
        telTime.textContent = 'Critical (< 45m)';
        telDispatch.textContent = '🚨 Truck Dispatched';
        telDispatch.className = 'tel-val status-badge-critical';
        binFillGraphic.style.background = 'linear-gradient(to top, #f43f5e, #fda4af)';
        binStatusReadout.innerHTML = 'Status: <strong style="color:#e11d48">CRITICAL CAPACITY REACHED</strong> • Municipal Alert Fired';
      } else if (val >= 65) {
        telTime.textContent = 'In ~3.5 Hours';
        telDispatch.textContent = 'Route Queued';
        telDispatch.className = 'tel-val status-badge-warn';
        binFillGraphic.style.background = 'linear-gradient(to top, #ec4899, #fbcfe8)';
        binStatusReadout.innerHTML = 'Status: <strong>Moderate Fill</strong> • Routine collection schedule updated';
      } else {
        telTime.textContent = '> 8 Hours';
        telDispatch.textContent = 'Idle / Standby';
        telDispatch.className = 'tel-val status-badge-ok';
        binFillGraphic.style.background = 'linear-gradient(to top, #d946ef, #f5d0fe)';
        binStatusReadout.innerHTML = 'Status: <strong>Normal Monitoring</strong> • Telemetry syncing to MongoDB';
      }
    });
  }

  // 3D Tilt effect on hover
  const tiltCards = containerElement.querySelectorAll('.3d-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}
