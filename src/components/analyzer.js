import { analyzeResume, enhanceBulletPoint, SAMPLE_PRESETS } from '../services/api.js';

export class ResuMindAnalyzer {
  constructor(containerElement) {
    this.container = containerElement;
    this.chartInstance = null;
    this.init();
  }

  init() {
    this.renderLayout();
    this.bindEvents();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="analyzer-wrapper">
        
        <!-- Header Banner -->
        <div class="analyzer-header">
          <div class="analyzer-badge">
            <span class="pulse-dot"></span>
            ResuMind AI Engine v2.4
          </div>
          <h2>AI Resume & Skill Gap Intelligence Platform</h2>
          <p>Analyze candidate resumes against job descriptions with real-time ATS scoring, keyword taxonomy mapping, and AI bullet point enhancement.</p>
          
          <!-- Sample Presets -->
          <div class="presets-bar">
            <span class="presets-label">Quick Test Presets:</span>
            <button type="button" class="preset-btn" data-preset="data-science-intern">
              🎯 Data Science Intern (Matches Kalyani's Profile)
            </button>
            <button type="button" class="preset-btn" data-preset="frontend-engineer">
              💻 Frontend Developer Role
            </button>
            <button type="button" class="preset-btn outline" id="clear-inputs-btn">
              🔄 Clear Inputs
            </button>
          </div>
        </div>

        <!-- Input Grid -->
        <div class="analyzer-grid">
          
          <!-- Resume Input Box -->
          <div class="input-card">
            <div class="card-header">
              <div class="card-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Candidate Resume Text
              </div>
              <span class="word-counter" id="resume-word-count">0 words</span>
            </div>
            
            <div class="drop-zone" id="resume-dropzone">
              <textarea 
                id="resume-input" 
                class="custom-textarea" 
                placeholder="Paste candidate resume text here or drag & drop a .txt/.md file..."
              ></textarea>
            </div>
          </div>

          <!-- Job Description Input Box -->
          <div class="input-card">
            <div class="card-header">
              <div class="card-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Target Job Description
              </div>
              <span class="word-counter" id="job-word-count">0 words</span>
            </div>
            
            <textarea 
              id="job-input" 
              class="custom-textarea" 
              placeholder="Paste target job description and requirements here..."
            ></textarea>
          </div>

        </div>

        <!-- Action Row -->
        <div class="action-row">
          <button id="run-analysis-btn" class="primary-btn pulse-hover">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Run AI Resume & ATS Analysis
          </button>
        </div>

        <!-- Loading State Skeleton -->
        <div id="analysis-loading" class="loading-container hidden">
          <div class="spinner"></div>
          <p>Processing text structures, matching skill taxonomies, and generating analytics...</p>
        </div>

        <!-- Results Section -->
        <div id="analysis-results" class="results-container hidden">
          
          <!-- Top Score Overview -->
          <div class="results-hero-grid">
            
            <!-- Gauge Card -->
            <div class="score-card">
              <h3>ATS Compatibility Score</h3>
              <div class="gauge-wrapper">
                <svg class="gauge-svg" viewBox="0 0 120 120">
                  <circle class="gauge-bg" cx="60" cy="60" r="50"></circle>
                  <circle id="gauge-progress" class="gauge-bar" cx="60" cy="60" r="50"></circle>
                </svg>
                <div class="gauge-text">
                  <span id="score-value" class="score-number">0</span>
                  <span class="score-percent">%</span>
                </div>
              </div>
              <div id="score-badge" class="score-status-badge">Calculating...</div>
            </div>

            <!-- Stats Metrics -->
            <div class="stats-card">
              <h3>Keyword & Role Alignment</h3>
              <div class="metrics-grid">
                <div class="metric-item">
                  <span class="metric-label">Matched Target Skills</span>
                  <span id="metric-matched" class="metric-val text-success">0</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Missing Skills</span>
                  <span id="metric-missing" class="metric-val text-danger">0</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Resume Word Count</span>
                  <span id="metric-words" class="metric-val">0</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Section Integrity</span>
                  <span id="metric-sections" class="metric-val text-primary">100%</span>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div class="recommendations-card">
              <h3>AI Recommendations</h3>
              <div id="recommendations-list" class="recs-list">
                <!-- Injected via JS -->
              </div>
            </div>

          </div>

          <!-- Skills Deep Dive Grid -->
          <div class="skills-deepdive-grid">
            
            <!-- Matched Skills -->
            <div class="skill-tags-card">
              <div class="tag-card-header">
                <span class="status-indicator bg-success"></span>
                <h4>Matched Job Skills (<span id="matched-count">0</span>)</h4>
              </div>
              <div id="matched-tags" class="tag-cloud"></div>
            </div>

            <!-- Missing Skills -->
            <div class="skill-tags-card">
              <div class="tag-card-header">
                <span class="status-indicator bg-danger"></span>
                <h4>Missing Target Keywords (<span id="missing-count">0</span>)</h4>
              </div>
              <div id="missing-tags" class="tag-cloud"></div>
            </div>

            <!-- Additional Resume Skills -->
            <div class="skill-tags-card">
              <div class="tag-card-header">
                <span class="status-indicator bg-accent"></span>
                <h4>Additional Skills in Resume</h4>
              </div>
              <div id="additional-tags" class="tag-cloud"></div>
            </div>

          </div>

          <!-- Visual Chart Section -->
          <div class="chart-card">
            <h3>Domain Competency Breakdown</h3>
            <p class="chart-desc">Compares candidate profile density against target role requirements across core technical disciplines.</p>
            <div class="chart-container">
              <canvas id="competencyChart"></canvas>
            </div>
          </div>

          <!-- AI Bullet Point Enhancer Tool -->
          <div class="enhancer-card">
            <div class="enhancer-header">
              <div>
                <h3>✨ AI Bullet Point Enhancer (STAR Method)</h3>
                <p>Convert plain project descriptions into high-impact, quantifiable resume achievements.</p>
              </div>
            </div>

            <div class="enhancer-body">
              <div class="enhancer-input-row">
                <input 
                  type="text" 
                  id="draft-bullet-input" 
                  class="custom-input" 
                  placeholder="e.g., Made a number guessing game with JS and dark mode"
                />
                <button id="enhance-btn" class="secondary-btn">
                  Enhance with AI
                </button>
              </div>
              
              <div id="enhanced-output-box" class="enhanced-result hidden">
                <div class="enhanced-label">STAR-Formatted Bullet Point:</div>
                <div id="enhanced-text" class="enhanced-content"></div>
                <button id="copy-bullet-btn" class="copy-btn">
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  bindEvents() {
    const resumeInput = this.container.querySelector('#resume-input');
    const jobInput = this.container.querySelector('#job-input');
    const runBtn = this.container.querySelector('#run-analysis-btn');
    const clearBtn = this.container.querySelector('#clear-inputs-btn');
    const enhanceBtn = this.container.querySelector('#enhance-btn');
    const copyBulletBtn = this.container.querySelector('#copy-bullet-btn');

    // Word counters
    const updateWordCounts = () => {
      const resWords = (resumeInput.value.trim().match(/\S+/g) || []).length;
      const jobWords = (jobInput.value.trim().match(/\S+/g) || []).length;
      this.container.querySelector('#resume-word-count').textContent = `${resWords} words`;
      this.container.querySelector('#job-word-count').textContent = `${jobWords} words`;
    };

    resumeInput.addEventListener('input', updateWordCounts);
    jobInput.addEventListener('input', updateWordCounts);

    // Preset selection
    this.container.querySelectorAll('.preset-btn[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const presetId = e.currentTarget.getAttribute('data-preset');
        const preset = SAMPLE_PRESETS.find(p => p.id === presetId);
        if (preset) {
          if (preset.sampleResume) {
            resumeInput.value = preset.sampleResume;
          }
          jobInput.value = preset.jobDescription;
          updateWordCounts();
          this.showToast(`Loaded preset: ${preset.title}`);
          this.executeAnalysis();
        }
      });
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
      resumeInput.value = '';
      jobInput.value = '';
      updateWordCounts();
      this.container.querySelector('#analysis-results').classList.add('hidden');
      this.showToast('Inputs cleared');
    });

    // Run Analysis
    runBtn.addEventListener('click', () => {
      this.executeAnalysis();
    });

    // File Drag & Drop on resume textarea
    const dropzone = this.container.querySelector('#resume-dropzone');
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          resumeInput.value = event.target.result;
          updateWordCounts();
          this.showToast(`Loaded file: ${file.name}`);
        };
        reader.readAsText(file);
      }
    });

    // AI Bullet Point Enhancer
    enhanceBtn.addEventListener('click', () => {
      const draft = this.container.querySelector('#draft-bullet-input').value;
      if (!draft.trim()) {
        this.showToast('Please type a draft bullet point first.');
        return;
      }
      const enhanced = enhanceBulletPoint(draft);
      const outBox = this.container.querySelector('#enhanced-output-box');
      const outText = this.container.querySelector('#enhanced-text');
      outText.textContent = enhanced;
      outBox.classList.remove('hidden');
    });

    // Copy Bullet Point
    copyBulletBtn.addEventListener('click', () => {
      const text = this.container.querySelector('#enhanced-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied bullet point to clipboard!');
      });
    });

    // Load initial sample automatically
    const defaultPreset = SAMPLE_PRESETS[0];
    resumeInput.value = defaultPreset.sampleResume;
    jobInput.value = defaultPreset.jobDescription;
    updateWordCounts();
  }

  async executeAnalysis() {
    const resumeText = this.container.querySelector('#resume-input').value;
    const jobText = this.container.querySelector('#job-input').value;

    if (!resumeText.trim()) {
      this.showToast('Please enter or paste your resume text.', 'warning');
      return;
    }
    if (!jobText.trim()) {
      this.showToast('Please enter a target job description.', 'warning');
      return;
    }

    const loadingElem = this.container.querySelector('#analysis-loading');
    const resultsElem = this.container.querySelector('#analysis-results');

    loadingElem.classList.remove('hidden');
    resultsElem.classList.add('hidden');

    try {
      const result = await analyzeResume(resumeText, jobText);
      this.renderResults(result);
      loadingElem.classList.add('hidden');
      resultsElem.classList.remove('hidden');

      // Scroll to results smoothly
      resultsElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      loadingElem.classList.add('hidden');
      this.showToast(err.message || 'Error running analysis', 'error');
    }
  }

  renderResults(result) {
    // Score gauge animation
    const scoreVal = this.container.querySelector('#score-value');
    const gaugeProg = this.container.querySelector('#gauge-progress');
    const scoreBadge = this.container.querySelector('#score-badge');

    const targetScore = result.overallScore;
    let currentScore = 0;
    
    // Animate score counter
    const duration = 800;
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = targetScore / steps;

    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        currentScore = targetScore;
        clearInterval(timer);
      }
      scoreVal.textContent = Math.round(currentScore);
    }, stepTime);

    // SVG stroke-dashoffset (Circumference = 2 * PI * 50 ≈ 314.15)
    const circumference = 314.15;
    const offset = circumference - (targetScore / 100) * circumference;
    gaugeProg.style.strokeDasharray = `${circumference}`;
    gaugeProg.style.strokeDashoffset = `${offset}`;

    if (targetScore >= 80) {
      gaugeProg.style.stroke = '#10b981';
      scoreBadge.textContent = 'Excellent Match';
      scoreBadge.className = 'score-status-badge badge-success';
    } else if (targetScore >= 60) {
      gaugeProg.style.stroke = '#f59e0b';
      scoreBadge.textContent = 'Moderate Match';
      scoreBadge.className = 'score-status-badge badge-warning';
    } else {
      gaugeProg.style.stroke = '#ef4444';
      scoreBadge.textContent = 'Needs Keyword Optimization';
      scoreBadge.className = 'score-status-badge badge-danger';
    }

    // Metrics
    this.container.querySelector('#metric-matched').textContent = result.stats.matchedCount;
    this.container.querySelector('#metric-missing').textContent = result.stats.missingCount;
    this.container.querySelector('#metric-words').textContent = result.stats.wordCount;
    
    const sectionCount = Object.values(result.sections).filter(Boolean).length;
    this.container.querySelector('#metric-sections').textContent = `${(sectionCount / 4) * 100}%`;

    // Recommendations
    const recsList = this.container.querySelector('#recommendations-list');
    recsList.innerHTML = result.recommendations.map(r => `
      <div class="rec-item rec-${r.type}">
        <strong>${r.title}:</strong> ${r.desc}
      </div>
    `).join('');

    // Tags rendering
    const matchedContainer = this.container.querySelector('#matched-tags');
    this.container.querySelector('#matched-count').textContent = result.matchedSkills.length;
    matchedContainer.innerHTML = result.matchedSkills.length > 0 
      ? result.matchedSkills.map(s => `<span class="tag-pill tag-matched">✓ ${s}</span>`).join('')
      : '<span class="empty-tag-note">No exact target skills detected</span>';

    const missingContainer = this.container.querySelector('#missing-tags');
    this.container.querySelector('#missing-count').textContent = result.missingSkills.length;
    missingContainer.innerHTML = result.missingSkills.length > 0 
      ? result.missingSkills.map(s => `<span class="tag-pill tag-missing">+ ${s}</span>`).join('')
      : '<span class="empty-tag-note text-success">✓ None! All job skills are present in resume</span>';

    const additionalContainer = this.container.querySelector('#additional-tags');
    additionalContainer.innerHTML = result.additionalSkills.length > 0 
      ? result.additionalSkills.map(s => `<span class="tag-pill tag-additional">${s}</span>`).join('')
      : '<span class="empty-tag-note">None</span>';

    // Chart.js render
    this.renderCompetencyChart(result.categoryBreakdown);
  }

  renderCompetencyChart(categoryData) {
    const canvas = this.container.querySelector('#competencyChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = ['Data Science & ML', 'Frontend Engineering', 'Backend & Tools', 'IoT & Hardware', 'Soft Skills'];
    const keys = ['dataScience', 'frontend', 'backendTools', 'iotHardware', 'softSkills'];

    const jobCounts = keys.map(k => categoryData[k]?.required || 0);
    const resumeCounts = keys.map(k => categoryData[k]?.totalResume || 0);

    const ctx = canvas.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Required in Target Job',
            data: jobCounts,
            backgroundColor: 'rgba(239, 68, 68, 0.65)',
            borderColor: '#ef4444',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: 'Present in Candidate Resume',
            data: resumeCounts,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 1.5,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' }
          },
          x: {
            ticks: { color: '#94a3b8' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#f8fafc', font: { family: 'Inter', size: 12 } }
          }
        }
      }
    });
  }

  showToast(message, type = 'info') {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast-notification toast-${type} show`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}
