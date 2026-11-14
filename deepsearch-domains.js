/**
 * Bhavya's DeepSearch - Multi-Domain Scoping & Context Ingestion Bridge
 * Adds targeted research scopes (All Web, Academic ArXiv, Financial 10-K, Dev API Docs)
 * and auto-launches searches received via URL Hash (#q=...&domain=...)
 */

(function () {
  const SCOPES = [
    { id: 'web', name: 'All Web', icon: '🌐', prefix: '' },
    { id: 'academic', name: 'Academic ArXiv', icon: '🎓', prefix: 'Focus strictly on peer-reviewed papers, ArXiv preprints, academic methodology, and theoretical proofs: ' },
    { id: 'financial', name: 'Financial 10-K', icon: '📈', prefix: 'Focus strictly on SEC filings, 10-K/10-Q reports, quarterly earnings, EBITDA margins, and fiscal performance: ' },
    { id: 'dev', name: 'Dev API Docs', icon: '💻', prefix: 'Focus strictly on official developer documentation, GitHub repos, API schemas, and production code examples: ' }
  ];

  let selectedScope = 'web';

  function initDomainScoper() {
    const searchControlsLeft = document.querySelector('.search-controls .controls-left');
    if (!searchControlsLeft) return;

    if (document.getElementById('domainScoperWrap')) return;

    const domainWrap = document.createElement('div');
    domainWrap.id = 'domainScoperWrap';
    domainWrap.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap;';
    domainWrap.innerHTML = `
      <span style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Domain Scope:</span>
      <div id="domainScopeButtons" style="display:inline-flex;gap:4px;">
        ${SCOPES.map(s => `
          <button type="button" class="domain-scope-btn ${s.id === selectedScope ? 'active' : ''}" data-scope="${s.id}"
            style="padding:3px 8px;font-size:11px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;
            background:${s.id === selectedScope ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'};
            border:1px solid ${s.id === selectedScope ? '#3b82f6' : 'rgba(255,255,255,0.1)'};
            color:${s.id === selectedScope ? '#60a5fa' : '#cbd5e1'};transition:all 0.2s;">
            <span>${s.icon}</span> ${s.name}
          </button>
        `).join('')}
      </div>
    `;

    searchControlsLeft.appendChild(domainWrap);

    const buttons = domainWrap.querySelectorAll('.domain-scope-btn');
    buttons.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        buttons.forEach(b => {
          b.style.background = 'rgba(255,255,255,0.05)';
          b.style.borderColor = 'rgba(255,255,255,0.1)';
          b.style.color = '#cbd5e1';
          b.classList.remove('active');
        });
        btn.style.background = 'rgba(59,130,246,0.3)';
        btn.style.borderColor = '#3b82f6';
        btn.style.color = '#60a5fa';
        btn.classList.add('active');
        selectedScope = btn.dataset.scope;
      };
    });

    const btnLaunch = document.getElementById('btnLaunchResearch');
    const inputArea = document.getElementById('deepSearchInput');

    if (btnLaunch && inputArea) {
      btnLaunch.addEventListener('click', () => {
        const activeObj = SCOPES.find(s => s.id === selectedScope);
        if (activeObj && activeObj.prefix && inputArea.value && !inputArea.value.startsWith(activeObj.prefix)) {
          inputArea.value = '[Domain: ' + activeObj.name + '] ' + activeObj.prefix + inputArea.value;
        }
      }, true);
    }

    handleUrlHash();
  }

  function handleUrlHash() {
    if (!window.location.hash || window.location.hash.length < 3) return;
    try {
      const hashStr = window.location.hash.substring(1);
      const params = new URLSearchParams(hashStr);
      const query = params.get('q');
      const domain = params.get('domain');

      if (domain && SCOPES.some(s => s.id === domain)) {
        selectedScope = domain;
        const btn = document.querySelector('.domain-scope-btn[data-scope="' + domain + '"]');
        if (btn) btn.click();
      }

      if (query) {
        const inputArea = document.getElementById('deepSearchInput');
        if (inputArea) {
          inputArea.value = decodeURIComponent(query);
          setTimeout(() => {
            const btnLaunch = document.getElementById('btnLaunchResearch');
            if (btnLaunch) {
              btnLaunch.click();
              window.history.replaceState(null, '', window.location.pathname);
            }
          }, 600);
        }
      }
    } catch (err) {
      console.warn('Hash ingestion error:', err);
    }
  }

  window.addEventListener('DOMContentLoaded', initDomainScoper);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initDomainScoper();
  }
})();
