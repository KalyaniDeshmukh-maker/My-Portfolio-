import { ResuMindAnalyzer } from './components/analyzer.js';

// ─── Theme Management ────────────────────────────────────────────────────────
const THEME_KEY = 'resumind-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ─── Tab Navigation ──────────────────────────────────────────────────────────
function initNavigation() {
  const navBtns = document.querySelectorAll('[data-tab]');
  const panels  = document.querySelectorAll('.tab-panel');

  function switchTab(target) {
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === target));
    panels.forEach(p => p.classList.toggle('active', p.id === `panel-${target}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Default active tab
  switchTab('portfolio');
}

// ─── ResuMind Analyzer Init ──────────────────────────────────────────────────
function initAnalyzer() {
  const container = document.getElementById('analyzer-mount');
  if (container) {
    new ResuMindAnalyzer(container);
  }
}

// ─── Resume iframe ───────────────────────────────────────────────────────────
function initResumeTab() {
  const openFullBtn = document.getElementById('open-resume-fullpage');
  if (openFullBtn) {
    openFullBtn.addEventListener('click', () => {
      window.open('./resume/resume_print.html', '_blank');
    });
  }
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const iframe = document.getElementById('resume-iframe');
      iframe?.contentWindow?.print();
    });
  }
}

// ─── Scroll-reveal Animation ─────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card, .skill-category-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(el);
  });
}

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initAnalyzer();
  initResumeTab();
  initScrollReveal();
});
