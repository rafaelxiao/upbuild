// i18n.js — lightweight multilingual system for UpBuild website
// Usage: add data-i18n="key" to elements, call applyLang() after DOM ready

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'zh-Hans', label: '简中' },
  { code: 'zh-Hant', label: '繁中' },
];

const DEFAULT_LANG = 'en';

function detectLang() {
  const stored = localStorage.getItem('upbuild-lang');
  if (stored && LANGS.some(l => l.code === stored)) return stored;
  const nav = navigator.language || '';
  if (nav.startsWith('zh-Hant') || nav === 'zh-TW' || nav === 'zh-HK') return 'zh-Hant';
  if (nav.startsWith('zh')) return 'zh-Hans';
  return DEFAULT_LANG;
}

function setLang(code) {
  localStorage.setItem('upbuild-lang', code);
  document.documentElement.lang = code === 'zh-Hans' ? 'zh-CN' : code === 'zh-Hant' ? 'zh-TW' : 'en';
  applyLang();
  renderSwitcher();
}

function applyLang() {
  const lang = localStorage.getItem('upbuild-lang') || detectLang();
  const dict = window.I18N || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const entry = dict[key];
    if (!entry) return;
    const value = entry[lang] || entry[DEFAULT_LANG] || '';
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = value;
    } else {
      el.innerHTML = value;
    }
  });
}

function renderSwitcher() {
  const current = localStorage.getItem('upbuild-lang') || detectLang();
  document.querySelectorAll('.lang-switcher').forEach(container => {
    container.innerHTML = '';
    LANGS.forEach(l => {
      const btn = document.createElement('button');
      btn.textContent = l.label;
      btn.className = 'lang-btn' + (l.code === current ? ' lang-btn-active' : '');
      btn.setAttribute('aria-label', l.label);
      btn.addEventListener('click', () => setLang(l.code));
      container.appendChild(btn);
    });
  });
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('upbuild-lang')) {
    localStorage.setItem('upbuild-lang', detectLang());
  }
  applyLang();
  renderSwitcher();
});
