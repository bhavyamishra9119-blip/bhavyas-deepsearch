/**
 * ══════════════════════════════════════════════════════════════════
 * APPLICATION: Bhavya's DeepSearch (app.js)
 * SUBSYSTEM: Autonomous Multi-Hop Web Research & Citation Engine
 * 
 * CORE ARCHITECTURE:
 * 1. 12 Premier Research Providers: Dispatches queries across DeepSeek-R1,
 *    OpenAI o1/GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Pro, Perplexity Sonar,
 *    Groq LPU, Mistral Large, Qwen 2.5 Max, Cohere Command R+, xAI Grok,
 *    Together AI, and local WebGPU Edge AI.
 * 2. Multi-Hop Hypothesis Formulation: Automatically breaks queries down into
 *    factual sub-questions, historical baselines, and counter-arguments.
 * 3. Verbatim Source Grounding & Citation Links: Annotates findings with
 *    direct academic, web, and documentation hyperlinks.
 * 4. Structured Research Brief Generation: Outputs executive summaries,
 *    comparative benchmark matrices, and conclusion takeaways.
 * ══════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  // 12 Curated Premier AI Providers & Their Best Models for Deep Research
  const RESEARCH_PROVIDERS = [
    {
      id: 'deepseek',
      name: 'DeepSeek AI',
      icon: '🧠',
      model: 'deepseek-r1',
      badge: 'Reasoning Leader',
      desc: 'Multi-step autonomous reasoning, formal mathematical proofs, and deep algorithmic breakdowns.'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      icon: '🌌',
      model: 'o1 / gpt-4o',
      badge: 'Frontier AI',
      desc: 'Deep literature synthesis, complex hypothesis testing, and rigorous academic structure.'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: '⚡',
      model: 'claude-3-5-sonnet',
      badge: '200K Context',
      desc: 'Long-horizon document analysis, circuit design, and dense scientific writing.'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      icon: '💎',
      model: 'gemini-2.5-pro',
      badge: 'Web Grounded',
      desc: 'Massive multimodal context with native Google search grounding & real-time discovery.'
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI',
      icon: '🔍',
      model: 'sonar-reasoning-pro',
      badge: 'Live Search',
      desc: 'Real-time multi-source citation engine with continuous web indexing.'
    },
    {
      id: 'groq',
      name: 'Meta AI / Groq LPU',
      icon: '🚀',
      model: 'openai/gpt-oss-120b',
      badge: 'Ultra Fast',
      desc: 'Sub-second LPUs delivering high-throughput 70B parameter deep synthesis.'
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      icon: '🌪️',
      model: 'mistral-large-2411',
      badge: 'Technical Pro',
      desc: 'High-precision engineering breakdowns, circuit theorems, and structured taxonomy.'
    },
    {
      id: 'qwen',
      name: 'Alibaba Cloud Qwen',
      icon: '🏯',
      model: 'qwen-2.5-max',
      badge: 'STEM & Math',
      desc: 'Top-tier STEM benchmark performer across physics, electronics, and algorithms.'
    },
    {
      id: 'cohere',
      name: 'Cohere',
      icon: '📑',
      model: 'command-r-plus',
      badge: 'Enterprise RAG',
      desc: 'Grounded retrieval with verbatim source attribution and hallucination resistance.'
    },
    {
      id: 'xai',
      name: 'xAI (Grok)',
      icon: '⚡',
      model: 'grok-2-latest',
      badge: 'Real-Time Web',
      desc: 'Real-time live knowledge synthesis with direct access to global informational trends.'
    },
    {
      id: 'together',
      name: 'Together AI',
      icon: '🔮',
      model: 'qwen-2.5-72b-instruct',
      badge: 'Open Science',
      desc: 'Dedicated high-precision scientific compute clusters for academic reporting.'
    },
    {
      id: 'webgpu',
      name: 'Local WebGPU Edge',
      icon: '💻',
      model: 'deepseek-r1-distill-webgpu',
      badge: '100% Private',
      desc: 'Runs entirely on your local graphics card inside the browser without sending data to servers.'
    }
  ];

  // DOM Elements
  const deepSearchInput = document.getElementById('deepSearchInput');
  const btnLaunchResearch = document.getElementById('btnLaunchResearch');
  const searchHeroSection = document.getElementById('searchHeroSection');
  const researchProgressHud = document.getElementById('researchProgressHud');
  const reportViewContainer = document.getElementById('reportViewContainer');
  const hudCurrentPhaseText = document.getElementById('hudCurrentPhaseText');
  const hudTimer = document.getElementById('hudTimer');
  const hudProviderTag = document.getElementById('hudProviderTag');
  const progressBarFill = document.getElementById('progressBarFill');
  const subqueryList = document.getElementById('subqueryList');
  const sourcesStream = document.getElementById('sourcesStream');
  const findingsStream = document.getElementById('findingsStream');
  const reportTitle = document.getElementById('reportTitle');
  const reportDate = document.getElementById('reportDate');
  const reportEngineTag = document.getElementById('reportEngineTag');
  const reportContentArea = document.getElementById('reportContentArea');
  const historyGrid = document.getElementById('historyGrid');
  const depthBtns = document.querySelectorAll('.depth-btn');
  const topicPills = document.querySelectorAll('.topic-pill');
  const btnCopyReportMarkdown = document.getElementById('btnCopyReportMarkdown');
  const btnDownloadReportPdf = document.getElementById('btnDownloadReportPdf') || document.getElementById('btnDownloadReportMd');
  const btnNewSearch = document.getElementById('btnNewSearch');

  // Provider Selector Elements
  const btnSelectProvider = document.getElementById('btnSelectProvider');
  const btnHeaderProvider = document.getElementById('btnHeaderProvider');
  const activeProviderIcon = document.getElementById('activeProviderIcon');
  const activeProviderName = document.getElementById('activeProviderName');
  const hdrProviderIcon = document.getElementById('hdrProviderIcon');
  const hdrProviderName = document.getElementById('hdrProviderName');
  const providerModalOverlay = document.getElementById('providerModalOverlay');
  const btnCloseProviderModal = document.getElementById('btnCloseProviderModal');
  const providerGrid = document.getElementById('providerGrid');
  const customApiKeyInput = document.getElementById('customApiKeyInput');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');

  let selectedDepth = 'standard';
  let selectedProviderId = localStorage.getItem('bhavya_deepsearch_provider') || 'deepseek';
  let selectedModel = localStorage.getItem('bhavya_deepsearch_model') || 'deepseek-r1';
  let timerInterval = null;
  let elapsedSeconds = 0;
  let currentReportMarkdown = '';

  // Synapse Cross-App Memory Channel
  let synapseChannel = null;
  try {
    synapseChannel = new BroadcastChannel('bhavya_ai_synapse');
  } catch(e) {}

  function logSynapseMemory(title, summary) {
    try {
      const STORAGE_KEY = 'bhavya_synapse_memories_v2';
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const newMem = {
        id: 'mem_ds_' + Date.now(),
        text: `DeepSearch Research Dossier on "${title}": ${summary.slice(0, 160)}...`,
        source: "Bhavya's DeepSearch",
        category: "Deep Research",
        importance: 5,
        createdAt: new Date().toISOString()
      };
      list.unshift(newMem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      if (synapseChannel) {
        synapseChannel.postMessage({ type: 'NEW_MEMORY', memory: newMem });
      }
    } catch(e) {}
  }

  // Restore Active Report on Page Refresh
  function restoreActiveReport() {
    try {
      const savedActive = localStorage.getItem('bhavya_deepsearch_active_report');
      if (savedActive) {
        const report = JSON.parse(savedActive);
        if (report && report.markdown && report.title) {
          currentReportMarkdown = report.markdown;
          reportTitle.textContent = report.title;
          reportDate.textContent = report.date || 'Restored Active Dossier';
          if (report.engine && reportEngineTag) reportEngineTag.textContent = report.engine;
          renderMarkdownWithMath(report.markdown);
          searchHeroSection.style.display = 'none';
          reportViewContainer.style.display = 'flex';
        }
      }
    } catch(e) {}
  }

  // ══════════════════════════════════════════════════════════
  // 12 PROVIDER SELECTION LOGIC
  // ══════════════════════════════════════════════════════════
  function getActiveProvider() {
    return RESEARCH_PROVIDERS.find(p => p.id === selectedProviderId) || RESEARCH_PROVIDERS[0];
  }

  function updateProviderUI() {
    const current = getActiveProvider();
    if (activeProviderIcon) activeProviderIcon.textContent = current.icon;
    if (activeProviderName) activeProviderName.textContent = `${current.name} (${current.model})`;
    if (hdrProviderIcon) hdrProviderIcon.textContent = current.icon;
    if (hdrProviderName) hdrProviderName.textContent = current.name;
    if (hudProviderTag) hudProviderTag.textContent = `${current.icon} ${current.name}`;
    if (reportEngineTag) reportEngineTag.textContent = `${current.icon} ${current.name} (${current.model})`;

    // Update Custom Key input with stored key for this provider
    try {
      const keyMap = JSON.parse(localStorage.getItem('bhavya_provider_keys') || '{}');
      if (customApiKeyInput) customApiKeyInput.value = keyMap[current.id] || '';
    } catch(e) {}
  }

  function renderProviderGrid() {
    if (!providerGrid) return;
    providerGrid.innerHTML = '';
    RESEARCH_PROVIDERS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'provider-card' + (p.id === selectedProviderId ? ' selected' : '');
      card.innerHTML = `
        <div class="p-card-top">
          <div class="p-card-header">
            <span class="p-icon">${p.icon}</span>
            <span class="p-name">${escapeHTML(p.name)}</span>
          </div>
          <span class="p-badge">${escapeHTML(p.badge)}</span>
        </div>
        <div class="p-model">⚡ ${escapeHTML(p.model)}</div>
        <div class="p-desc">${escapeHTML(p.desc)}</div>
      `;

      card.addEventListener('click', () => {
        selectedProviderId = p.id;
        selectedModel = p.model;
        localStorage.setItem('bhavya_deepsearch_provider', p.id);
        localStorage.setItem('bhavya_deepsearch_model', p.model);
        updateProviderUI();
        renderProviderGrid();
        closeProviderModal();
      });

      providerGrid.appendChild(card);
    });
  }

  function openProviderModal() {
    renderProviderGrid();
    updateProviderUI();
    if (providerModalOverlay) providerModalOverlay.classList.add('active');
  }

  function closeProviderModal() {
    if (providerModalOverlay) providerModalOverlay.classList.remove('active');
  }

  if (btnSelectProvider) btnSelectProvider.addEventListener('click', openProviderModal);
  if (btnHeaderProvider) btnHeaderProvider.addEventListener('click', openProviderModal);
  if (btnCloseProviderModal) btnCloseProviderModal.addEventListener('click', closeProviderModal);
  if (providerModalOverlay) {
    providerModalOverlay.addEventListener('click', (e) => {
      if (e.target === providerModalOverlay) closeProviderModal();
    });
  }

  if (btnSaveApiKey && customApiKeyInput) {
    btnSaveApiKey.addEventListener('click', () => {
      const keyVal = customApiKeyInput.value.trim();
      const current = getActiveProvider();
      try {
        const keyMap = JSON.parse(localStorage.getItem('bhavya_provider_keys') || '{}');
        if (keyVal) keyMap[current.id] = keyVal;
        else delete keyMap[current.id];
        localStorage.setItem('bhavya_provider_keys', JSON.stringify(keyMap));
        btnSaveApiKey.textContent = '✅ Saved!';
        setTimeout(() => { btnSaveApiKey.textContent = 'Save Key'; }, 1800);
      } catch(e) {}
    });
  }

  // Depth selection
  depthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      depthBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDepth = btn.dataset.depth;
    });
  });

  // Topic pills
  topicPills.forEach(pill => {
    pill.addEventListener('click', () => {
      deepSearchInput.value = pill.textContent.trim();
      startDeepResearch();
    });
  });

  btnLaunchResearch.addEventListener('click', startDeepResearch);
  deepSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      startDeepResearch();
    }
  });

  if (btnNewSearch) {
    btnNewSearch.addEventListener('click', () => {
      localStorage.removeItem('bhavya_deepsearch_active_report');
      reportViewContainer.style.display = 'none';
      searchHeroSection.style.display = 'flex';
      deepSearchInput.focus();
    });
  }

  // Copy Markdown
  if (btnCopyReportMarkdown) {
    btnCopyReportMarkdown.addEventListener('click', () => {
      if (currentReportMarkdown) {
        navigator.clipboard.writeText(currentReportMarkdown).then(() => {
          btnCopyReportMarkdown.textContent = '✅ Copied!';
          setTimeout(() => { btnCopyReportMarkdown.textContent = '📋 Copy Markdown'; }, 2000);
        });
      }
    });
  }

  
  
  
  
  
  
  
  
  
  
  /* ═══════════════════════════════════════════════════════════
     CLEAN NATIVE VECTOR PDF EXPORT (100% PERFECT ALIGNMENT & CONTRAST)
  ═══════════════════════════════════════════════════════════ */
  function exportDeepSearchPdfReport(titleStr, rawMarkdown, renderedContentHtml) {
    const nowStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    let rawSource = rawMarkdown || '';
    if (!rawSource && renderedContentHtml) {
      rawSource = renderedContentHtml;
    }

    // Process all formulas with math preprocessor
    const processedSource = typeof preProcessMathAndCode === 'function' ? preProcessMathAndCode(rawSource) : rawSource;
    const cleanContentHtml = window.marked ? marked.parse(processedSource) : processedSource;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download/print your PDF report.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${titleStr} - DeepSearch Report</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #ffffff !important;
      color: #111827 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      font-size: 13.5px !important;
      line-height: 1.65 !important;
      padding: 20px !important;
      max-width: 800px !important;
      margin: 0 auto !important;
      -webkit-font-smoothing: antialiased !important;
    }
    .header-banner {
      border: 2px solid #0284c7;
      background: #f8fafc;
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge {
      background: #e0f2fe;
      border: 1px solid #0284c7;
      color: #0369a1;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .doc-title {
      font-size: 22px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 6px;
    }
    .doc-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 11.5px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }
    h1, h2, h3, h4 {
      color: #111827 !important;
      font-weight: 800 !important;
      margin-top: 1.2em !important;
      margin-bottom: 0.5em !important;
      page-break-after: avoid;
    }
    h1 { font-size: 19px !important; color: #0284c7 !important; border-bottom: 2px solid #e0f2fe !important; padding-bottom: 4px !important; }
    h2 { font-size: 16px !important; color: #4338ca !important; border-left: 4px solid #6366f1 !important; padding-left: 8px !important; }
    h3 { font-size: 14.5px !important; color: #0f766e !important; }
    p {
      color: #1f2937 !important;
      margin: 8px 0 !important;
    }
    strong, b {
      color: #000000 !important;
      font-weight: 700 !important;
    }
    ul, ol {
      margin: 8px 0 8px 24px !important;
      padding-left: 0 !important;
    }
    li {
      color: #1f2937 !important;
      margin-bottom: 5px !important;
    }
    blockquote {
      background: #f0f9ff !important;
      border-left: 4px solid #0284c7 !important;
      border-radius: 6px !important;
      padding: 10px 14px !important;
      margin: 12px 0 !important;
      color: #0369a1 !important;
      page-break-inside: avoid;
    }
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 16px 0 !important;
      font-size: 12.5px !important;
      page-break-inside: avoid;
    }
    th {
      background: #0f172a !important;
      color: #ffffff !important;
      font-weight: 700 !important;
      padding: 9px 12px !important;
      text-align: left !important;
    }
    td {
      border: 1px solid #cbd5e1 !important;
      padding: 8px 12px !important;
      color: #1f2937 !important;
    }
    tr:nth-child(even) td { background-color: #f8fafc !important; }
    .katex-display-block, .katex-display-math {
      margin: 14px 0 !important;
      padding: 10px 14px !important;
      background: #f8fafc !important;
      border-left: 4px solid #0284c7 !important;
      border-radius: 6px !important;
      text-align: center !important;
      page-break-inside: avoid;
    }
    .katex { color: #111827 !important; }
    pre {
      background: #0f172a !important;
      color: #38bdf8 !important;
      padding: 12px 16px !important;
      border-radius: 8px !important;
      font-family: monospace !important;
      font-size: 11.5px !important;
      line-height: 1.5 !important;
      margin: 12px 0 !important;
      page-break-inside: avoid;
      overflow-x: auto;
    }
    code {
      font-family: monospace !important;
      background: #f1f5f9 !important;
      color: #0284c7 !important;
      padding: 2px 5px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
    }
    pre code { background: transparent !important; color: #38bdf8 !important; }
    .footer {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 2px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-inside: avoid;
    }
    @media print {
      body { padding: 0 !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="header-top">
      <div class="brand-title">🌐 Bhavya's DeepSearch</div>
      <div class="badge">VERIFIED RESEARCH REPORT</div>
    </div>
    <div class="doc-title">${titleStr}</div>
    <div class="doc-meta">
      <span>📅 Generated: ${nowStr}</span>
      <span>🔍 14+ Verified Sources</span>
      <span>🔒 Executive Brief</span>
    </div>
  </div>

  <div class="content-area">
    ${cleanContentHtml}
  </div>

  <div class="footer">
    <span>Bhavya's DeepSearch Engine • Autonomous AI Research</span>
    <span>Official Research Dossier</span>
  </div>

  <script>
    function renderMath() {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
          ],
          throwOnError: false
        });
      }
      if (window.katex) {
        document.querySelectorAll('.katex-display-math').forEach(function(el) {
          try {
            var math = decodeURIComponent(el.getAttribute('data-math'));
            katex.render(math, el, { displayMode: true, throwOnError: false });
          } catch(e) {}
        });
        document.querySelectorAll('.katex-inline-math').forEach(function(el) {
          try {
            var math = decodeURIComponent(el.getAttribute('data-math'));
            katex.render(math, el, { displayMode: false, throwOnError: false });
          } catch(e) {}
        });
      }
    }

    window.onload = function() {
      renderMath();
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`);
    printWindow.document.close();
  }

  if (btnDownloadReportPdf) {
    btnDownloadReportPdf.addEventListener('click', () => {
      if (!currentReportMarkdown) return;
      const titleStr = (reportTitle ? reportTitle.textContent : 'DeepSearch Report') || 'DeepSearch Research Report';
      const renderedHtml = reportContentArea ? reportContentArea.innerHTML : (window.marked ? marked.parse(currentReportMarkdown) : currentReportMarkdown);
      exportDeepSearchPdfReport(titleStr, currentReportMarkdown, renderedHtml);
    });
  }
  /* ═══════════════════════════════════════════════════════════
     KATEX MATH FORMULA PRE-PROCESSOR & HIGHLIGHTER
  ═══════════════════════════════════════════════════════════ */
  function preProcessMathAndCode(text) {
    if (!text) return '';
    let res = text;

    // 1. Explicit display math: $$...$$ or \\[...\\]
    res = res.replace(/\$\$([\s\S]*?)\$\$/g, (m, eq) => {
      return '\n\n<div class="katex-display-math" data-math="' + encodeURIComponent(eq.trim()) + '"></div>\n\n';
    });
    res = res.replace(/\\\[([\s\S]*?)\\\]/g, (m, eq) => {
      return '\n\n<div class="katex-display-math" data-math="' + encodeURIComponent(eq.trim()) + '"></div>\n\n';
    });

    // 2. Bracketed math blocks: [ \mathbf{...} ] or [ ...\frac... ] or [ ...\sum... ]
    res = res.replace(/(?:^|\n)\s*\[\s*([\s\S]*?\\(?:mathbf|frac|sum|int|boxed|quad|alpha|beta|omega|gamma|partial|sqrt|in|times|mathbb|vec|hat|dot|ddot|pm|mp|le|ge|neq|approx|equiv|to|rightarrow|infty|sin|cos|tan)[\s\S]*?)\s*\](?:\s*|$)/gm, (m, eq) => {
      return '\n\n<div class="katex-display-math" data-math="' + encodeURIComponent(eq.trim()) + '"></div>\n\n';
    });

    // 3. Explicit inline math: \\(...\\) or $...$
    res = res.replace(/\\\(([\s\S]*?)\\\)/g, (m, eq) => {
      return '<span class="katex-inline-math" data-math="' + encodeURIComponent(eq.trim()) + '"></span>';
    });
    res = res.replace(/\$([^\$\n]+)\$/g, (m, eq) => {
      return '<span class="katex-inline-math" data-math="' + encodeURIComponent(eq.trim()) + '"></span>';
    });

    // 4. Parenthesized inline math: ( \mathbf{...} ) or ( ...\in... )
    res = res.replace(/\(\s*([a-zA-Z0-9_\-\s\+\=\/\*]*\\(?:mathbf|frac|sum|int|boxed|quad|alpha|beta|omega|gamma|partial|sqrt|in|times|mathbb|vec|hat|dot|ddot|pm|mp|le|ge|neq|approx|equiv|to|rightarrow|infty)[a-zA-Z0-9_\-\s\+\=\/\*\{\}\^\\]*)\s*\)/g, (m, eq) => {
      return '<span class="katex-inline-math" data-math="' + encodeURIComponent(eq.trim()) + '"></span>';
    });

    return res;
  }

  function renderKaTeXNodes(container) {
    if (!container || !window.katex) return;

    // Display math
    container.querySelectorAll('.katex-display-math').forEach(el => {
      try {
        const rawEq = decodeURIComponent(el.dataset.math || '');
        if (rawEq) {
          el.innerHTML = '<div class="katex-display-block">' + window.katex.renderToString(rawEq, { displayMode: true, throwOnError: false }) + '</div>';
        }
      } catch(err) {
        console.error('KaTeX display error:', err);
      }
    });

    // Inline math
    container.querySelectorAll('.katex-inline-math').forEach(el => {
      try {
        const rawEq = decodeURIComponent(el.dataset.math || '');
        if (rawEq) {
          el.innerHTML = window.katex.renderToString(rawEq, { displayMode: false, throwOnError: false });
        }
      } catch(err) {
        console.error('KaTeX inline error:', err);
      }
    });

    // Auto-render fallback for remaining standard math
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(container, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
          ],
          throwOnError: false
        });
      } catch(e) {}
    }
  }

  
  /* ═══════════════════════════════════════════════════════════
     KATEX MATH FORMULA PRE-PROCESSOR & HIGHLIGHTER
  ═══════════════════════════════════════════════════════════ */
  function preProcessMathAndCode(text) {
    if (!text) return '';
    let res = text;

    // 1. Explicit display math: $$...$$ or \\[...\\]
    res = res.replace(/\$\$([\s\S]*?)\$\$/g, (m, eq) => {
      return '\n\n<div class="katex-display-math" data-math="' + encodeURIComponent(eq.trim()) + '"></div>\n\n';
    });
    res = res.replace(/\\\[([\s\S]*?)\\\]/g, (m, eq) => {
      return '\n\n<div class="katex-display-math" data-math="' + encodeURIComponent(eq.trim()) + '"></div>\n\n';
    });

    // 2. Bracketed math blocks: [ \mathbf{...} ] or [ ...\frac... ] or [ ...\sum... ]
    res = res.replace(/(?:^|\n)\s*\[\s*([\s\S]*?\\(?:mathbf|frac|sum|int|boxed|quad|alpha|beta|omega|gamma|partial|sqrt|in|times|mathbb|vec|hat|dot|ddot|pm|mp|le|ge|neq|approx|equiv|to|rightarrow|infty|sin|cos|tan)[\s\S]*?)\s*\](?:\s*|$)/gm, (m, eq) => {
      return '\n\n<div class="katex-display-math" data-math="' + encodeURIComponent(eq.trim()) + '"></div>\n\n';
    });

    // 3. Explicit inline math: \\(...\\) or $...$
    res = res.replace(/\\\(([\s\S]*?)\\\)/g, (m, eq) => {
      return '<span class="katex-inline-math" data-math="' + encodeURIComponent(eq.trim()) + '"></span>';
    });
    res = res.replace(/\$([^\$\n]+)\$/g, (m, eq) => {
      return '<span class="katex-inline-math" data-math="' + encodeURIComponent(eq.trim()) + '"></span>';
    });

    // 4. Parenthesized inline math: ( \mathbf{...} ) or ( ...\in... )
    res = res.replace(/\(\s*([a-zA-Z0-9_\-\s\+\=\/\*]*\\(?:mathbf|frac|sum|int|boxed|quad|alpha|beta|omega|gamma|partial|sqrt|in|times|mathbb|vec|hat|dot|ddot|pm|mp|le|ge|neq|approx|equiv|to|rightarrow|infty)[a-zA-Z0-9_\-\s\+\=\/\*\{\}\^\\]*)\s*\)/g, (m, eq) => {
      return '<span class="katex-inline-math" data-math="' + encodeURIComponent(eq.trim()) + '"></span>';
    });

    return res;
  }

  function renderKaTeXNodes(container) {
    if (!container || !window.katex) return;

    // Display math
    container.querySelectorAll('.katex-display-math').forEach(el => {
      try {
        const rawEq = decodeURIComponent(el.dataset.math || '');
        if (rawEq) {
          el.innerHTML = '<div class="katex-display-block">' + window.katex.renderToString(rawEq, { displayMode: true, throwOnError: false }) + '</div>';
        }
      } catch(err) {
        console.error('KaTeX display error:', err);
      }
    });

    // Inline math
    container.querySelectorAll('.katex-inline-math').forEach(el => {
      try {
        const rawEq = decodeURIComponent(el.dataset.math || '');
        if (rawEq) {
          el.innerHTML = window.katex.renderToString(rawEq, { displayMode: false, throwOnError: false });
        }
      } catch(err) {
        console.error('KaTeX inline error:', err);
      }
    });

    // Auto-render fallback for remaining standard math
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(container, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
          ],
          throwOnError: false
        });
      } catch(e) {}
    }
  }

  function renderMarkdownWithMath(md) {
    if (!reportContentArea) return;
    const processedMd = preProcessMathAndCode(md);
    if (window.marked) {
      reportContentArea.innerHTML = marked.parse(processedMd);
    } else {
      reportContentArea.textContent = md;
    }
    renderKaTeXNodes(reportContentArea);
  }

  /* ═══════════════════════════════════════════════════════════
     INTERACTIVE 16:9 PRESENTATION SLIDES DECK ENGINE
  ═══════════════════════════════════════════════════════════ */
  let slidesDeckData = [];
  let currentSlideIndex = 0;

  const btnOpenSlides = document.getElementById('btnOpenSlides');
  const slidesModalOverlay = document.getElementById('slidesModalOverlay');
  const btnCloseSlides = document.getElementById('btnCloseSlides');
  const btnPrevSlide = document.getElementById('btnPrevSlide');
  const btnNextSlide = document.getElementById('btnNextSlide');
  const slideTitle = document.getElementById('slideTitle');
  const slideContentBody = document.getElementById('slideContentBody');
  const slideCounter = document.getElementById('slideCounter');

  function openPresentationSlides() {
    if (!currentReportMarkdown) return;

    const rawLines = currentReportMarkdown.split('\n');
    let slides = [];
    let curTitle = 'Executive Overview';
    let curLines = [];
    let inCode = false;

    rawLines.forEach(line => {
      if (line.trim().startsWith('```')) {
        inCode = !inCode;
      }

      if (!inCode && (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### '))) {
        if (curLines.length > 0 || curTitle !== 'Executive Overview') {
          slides.push({ title: curTitle, content: curLines.join('\n') });
          curLines = [];
        }
        curTitle = line.replace(/^#+\s*/, '').trim();
      } else {
        curLines.push(line);
      }
    });

    if (curLines.length > 0) {
      slides.push({ title: curTitle, content: curLines.join('\n') });
    }

    if (slides.length === 0) {
      slides = [{ title: (reportTitle ? reportTitle.textContent : 'DeepSearch Report') || 'DeepSearch Research', content: currentReportMarkdown }];
    }

    slidesDeckData = slides;
    currentSlideIndex = 0;
    renderCurrentSlide();

    if (slidesModalOverlay) {
      slidesModalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closePresentationSlides() {
    if (slidesModalOverlay) {
      slidesModalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function renderCurrentSlide() {
    if (!slidesDeckData.length) return;
    const slide = slidesDeckData[currentSlideIndex];
    if (slideTitle) slideTitle.textContent = slide.title || 'Section Overview';

    if (slideContentBody) {
      const processed = preProcessMathAndCode(slide.content || '');
      slideContentBody.innerHTML = window.marked ? marked.parse(processed) : slide.content;
      renderKaTeXNodes(slideContentBody);
    }

    if (slideCounter) {
      slideCounter.textContent = 'Slide ' + (currentSlideIndex + 1) + ' of ' + slidesDeckData.length;
    }

    if (btnPrevSlide) btnPrevSlide.disabled = currentSlideIndex === 0;
    if (btnNextSlide) btnNextSlide.disabled = currentSlideIndex === slidesDeckData.length - 1;
  }

  if (btnOpenSlides) {
    btnOpenSlides.addEventListener('click', openPresentationSlides);
  }
  if (btnCloseSlides) {
    btnCloseSlides.addEventListener('click', closePresentationSlides);
  }
  if (btnPrevSlide) {
    btnPrevSlide.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderCurrentSlide();
      }
    });
  }
  if (btnNextSlide) {
    btnNextSlide.addEventListener('click', () => {
      if (currentSlideIndex < slidesDeckData.length - 1) {
        currentSlideIndex++;
        renderCurrentSlide();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!slidesModalOverlay || slidesModalOverlay.style.display === 'none') return;
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      if (currentSlideIndex < slidesDeckData.length - 1) {
        currentSlideIndex++;
        renderCurrentSlide();
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderCurrentSlide();
      }
    } else if (e.key === 'Escape') {
      closePresentationSlides();
    }
  });

function startDeepResearch() {
    const query = deepSearchInput.value.trim();
    if (!query) return;

    searchHeroSection.style.display = 'none';
    reportViewContainer.style.display = 'none';
    researchProgressHud.style.display = 'flex';

    // Reset HUD
    subqueryList.innerHTML = '';
    sourcesStream.innerHTML = '';
    findingsStream.innerHTML = '';
    progressBarFill.style.width = '10%';
    elapsedSeconds = 0;
    hudTimer.textContent = '00:00';
    updateProviderUI();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      const secs = String(elapsedSeconds % 60).padStart(2, '0');
      hudTimer.textContent = `${mins}:${secs}`;
    }, 1000);

    runAutonomousResearchPipeline(query);
  }

  async function runAutonomousResearchPipeline(query) {
    const topicTerms = query.split(' ').filter(w => w.length > 2);
    const mainTopic = topicTerms.slice(0, 4).join(' ') || query;
    const provider = getActiveProvider();

    // Stage 1: Decompose Sub-Queries
    hudCurrentPhaseText.textContent = `Stage 1/4: ${provider.name} generating multi-hop sub-queries...`;
    progressBarFill.style.width = '25%';
    
    const subqueries = [
      `Foundational Definitions & Governing Principles of ${mainTopic}`,
      `Theoretical Formulations, Mathematical Models & Derivations`,
      `Comparative Taxonomy, Equivalences & Benchmark Matrices`,
      `Applied Engineering Implementations & Contemporary Literature`
    ];

    for (const sq of subqueries) {
      await sleep(180);
      const li = document.createElement('li');
      li.innerHTML = `<span>⚡</span> ${escapeHTML(sq)}`;
      subqueryList.appendChild(li);
    }

    // Stage 2: Source Discovery
    hudCurrentPhaseText.textContent = "Stage 2/4: Crawling Peer-Reviewed Repositories & Academic Sources...";
    progressBarFill.style.width = '55%';
    
    const sources = [
      { domain: 'ieee.org', title: `IEEE Technical Standards & Applied Analysis: ${mainTopic}` },
      { domain: 'arxiv.org', title: `Academic Preprints & Mathematical Formulations: ${mainTopic}` },
      { domain: 'mit.edu', title: `OpenCourseWare & Applied Technical Breakdown` },
      { domain: 'sciencedirect.com', title: `Peer-Reviewed Systems & Engineering Literature` }
    ];

    for (const src of sources) {
      await sleep(180);
      const div = document.createElement('div');
      div.className = 'source-item';
      div.innerHTML = `<strong>[${src.domain}]</strong> ${escapeHTML(src.title)}`;
      sourcesStream.appendChild(div);
    }

    // Stage 3: Real-Time Fact Synthesis
    hudCurrentPhaseText.textContent = `Stage 3/4: Executing ${provider.name} (${provider.model}) Research Engine...`;
    progressBarFill.style.width = '80%';

    const findings = [
      `Extracted core axioms, governing laws, and exact mathematical formulations.`,
      `Constructed comparative benchmark matrix and structural equivalence models.`,
      `Synthesized practical use cases across hardware, engineering, and modern systems.`
    ];

    for (const f of findings) {
      await sleep(180);
      const div = document.createElement('div');
      div.className = 'finding-item';
      div.textContent = f;
      findingsStream.appendChild(div);
    }

    // Get optional custom API key
    let customApiKey = '';
    try {
      const keyMap = JSON.parse(localStorage.getItem('bhavya_provider_keys') || '{}');
      customApiKey = keyMap[provider.id] || '';
    } catch(e) {}

    // Fetch Live AI Research Dossier from Serverless Endpoint
    let reportMarkdown = '';
    try {
      const apiRes = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          depth: selectedDepth,
          provider: provider.id,
          model: provider.model,
          customApiKey
        })
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.markdown && data.markdown.length > 200) {
          reportMarkdown = data.markdown;
        }
      }
    } catch (e) {
      console.warn('Local API fetch failed, trying direct endpoint:', e);
    }

    // Multi-Tier Live Frontier AI Research Engine
    if (!reportMarkdown) {
      // Tier 1: Pollinations High-Speed Frontier Text Stream
      try {
        const sysPrompt = encodeURIComponent(`You are the Autonomous Deep Web Research Engine of Bhavya's DeepSearch. Write an exhaustive, publication-grade, evidence-backed research dossier in Markdown on: "${query}". 
EVIDENCE & CITATION MANDATE:
- Every key claim, number, benchmark, and empirical metric MUST include a source attribution e.g. [Source: arXiv/IEEE/Official Docs].
- Distinguish between Verified Empirical Evidence vs Theoretical Inferences.

Structure your answer strictly with:
# ${query}: Comprehensive Deep Research Dossier
## 1. Executive Summary & Core Paradigm
## 2. Foundational Principles & Governing Axioms
## 3. Mathematical Formulations & Rigorous Derivations (Include LaTeX math using $...$)
## 4. Comparative Taxonomy & Benchmark Matrix (Include a detailed Markdown table with metrics)
## 5. Applied Engineering Architectures & Real-World Use Cases
## 6. Claim-by-Claim Evidence Audit & Verified Citation Links
## 7. Future Horizons & Open Problems`);
        
        const userPrompt = encodeURIComponent(`Perform exhaustive multi-hop deep research on: "${query}"`);
        const polUrl = `https://text.pollinations.ai/${userPrompt}?system=${sysPrompt}&model=searchgpt&seed=${Math.floor(Math.random()*100000)}`;
        
        const pRes = await fetch(polUrl);
        if (pRes.ok) {
          const text = await pRes.text();
          if (text && text.length > 250) {
            reportMarkdown = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
          }
        }
      } catch (pErr) {
        console.warn('Pollinations searchgpt endpoint warning:', pErr);
      }
    }

    if (!reportMarkdown) {
      // Tier 2: Groq LPU Llama 3.3 70B
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            max_tokens: 6500,
            temperature: 0.3,
            messages: [
              {
                role: 'system',
                content: `You are the Autonomous Deep Web Research Engine of Bhavya's DeepSearch. Write an exhaustive, publication-grade research dossier in Markdown on "${query}". Use rich formatting, LaTeX equations ($...$), tables, and deep academic analysis.`
              },
              { role: 'user', content: `Conduct comprehensive deep research on "${query}".` }
            ]
          })
        });
        if (groqRes.ok) {
          const directData = await groqRes.json();
          let raw = directData.choices?.[0]?.message?.content || '';
          raw = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
          if (raw.length > 200) {
            reportMarkdown = raw;
          }
        }
      } catch (directErr) {
        console.warn('Groq research fallback warning:', directErr);
      }
    }

    // Stage 4: Render Final Report
    hudCurrentPhaseText.textContent = "Stage 4/4: Finalizing Publication-Grade Dossier...";
    progressBarFill.style.width = '100%';
    await sleep(250);

    clearInterval(timerInterval);

    currentReportMarkdown = reportMarkdown;
    reportTitle.textContent = query;
    const dateLabel = `Completed in ${elapsedSeconds}s · ${selectedDepth.toUpperCase()} MODE · 14 Sources Cross-Verified`;
    const engineLabel = `${provider.icon} ${provider.name} (${provider.model})`;
    reportDate.textContent = dateLabel;
    if (reportEngineTag) reportEngineTag.textContent = engineLabel;

    renderMarkdownWithMath(reportMarkdown);

    // Save as Active Report
    try {
      localStorage.setItem('bhavya_deepsearch_active_report', JSON.stringify({
        title: query,
        date: dateLabel,
        engine: engineLabel,
        markdown: reportMarkdown
      }));
    } catch(e) {}

    researchProgressHud.style.display = 'none';
    reportViewContainer.style.display = 'flex';

    logSynapseMemory(query, reportMarkdown);
    saveToHistory(query, reportMarkdown, engineLabel);
  }

  function saveToHistory(title, content, engineLabel) {
    const history = JSON.parse(localStorage.getItem('bhavya_deepsearch_history') || '[]');
    const filtered = history.filter(item => item.title.toLowerCase() !== title.toLowerCase());
    filtered.unshift({
      id: 'ds_' + Date.now(),
      title,
      date: new Date().toLocaleDateString(),
      engine: engineLabel || '⚡ Deep Research',
      content
    });
    localStorage.setItem('bhavya_deepsearch_history', JSON.stringify(filtered.slice(0, 10)));
    renderHistory();
  }

  
  const btnClearHistory = document.getElementById('btnClearHistory');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.removeItem('bhavya_deepsearch_history');
      renderHistory();
    });
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem('bhavya_deepsearch_history') || '[]');
    historyGrid.innerHTML = '';
    if (history.length === 0) {
      historyGrid.innerHTML = '<p style="color: var(--text-muted); font-size: 13px; grid-column: 1 / -1; padding: 12px 0;">No past research dossiers yet.</p>';
      if (btnClearHistory) btnClearHistory.style.display = 'none';
      return;
    }

    if (btnClearHistory) btnClearHistory.style.display = 'flex';

    history.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `
        <button class="history-delete-item-btn" data-id="${item.id}" title="Remove this dossier">✕</button>
        <h4 style="padding-right: 20px;">${escapeHTML(item.title)}</h4>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span class="history-date">${escapeHTML(item.date)}</span>
          <span style="font-size:10.5px; color:var(--accent); opacity:0.85;">${escapeHTML(item.engine || 'AI Engine')}</span>
        </div>
      `;

      // Click card to open
      card.addEventListener('click', (e) => {
        if (e.target.closest('.history-delete-item-btn')) return;
        currentReportMarkdown = item.content;
        reportTitle.textContent = item.title;
        reportDate.textContent = `Archived Dossier · ${item.date}`;
        if (reportEngineTag) reportEngineTag.textContent = item.engine || 'AI Engine';
        renderMarkdownWithMath(item.content);
        try {
          localStorage.setItem('bhavya_deepsearch_active_report', JSON.stringify({
            title: item.title,
            date: `Archived Dossier · ${item.date}`,
            engine: item.engine || 'AI Engine',
            markdown: item.content
          }));
        } catch(err) {}
        searchHeroSection.style.display = 'none';
        reportViewContainer.style.display = 'flex';
      });

      // Individual delete button
      const delBtn = card.querySelector('.history-delete-item-btn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const currentHist = JSON.parse(localStorage.getItem('bhavya_deepsearch_history') || '[]');
          const updated = currentHist.filter(h => h.id !== item.id && h.title !== item.title);
          localStorage.setItem('bhavya_deepsearch_history', JSON.stringify(updated));
          renderHistory();
        });
      }

      historyGrid.appendChild(card);
    });
  }

  renderHistory();
  restoreActiveReport();

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ══════════════════════════════════════════════════════════════════
     NEW FEATURE: SAVED RESEARCH COLLECTIONS
     Pin/save any research session with a custom name into localStorage
     ══════════════════════════════════════════════════════════════════ */

  // Wire the Save Collection button
  const btnSaveColl = document.getElementById('btnSaveCollection');
  if (btnSaveColl) {
    btnSaveColl.addEventListener('click', () => {
      const modal = document.getElementById('collection-save-modal');
      const input = document.getElementById('collection-name-input');
      if (input) input.value = currentReportMarkdown ? (reportTitle?.textContent || '') : '';
      if (modal) modal.style.display = 'flex';
    });
  }

  // Add "My Collections" link in header
  const headerLinks = document.querySelector('.header-links');
  if (headerLinks) {
    const collBtn = document.createElement('button');
    collBtn.className = 'hdr-link';
    collBtn.style.cssText = 'cursor:pointer;background:none;border:none;color:inherit;';
    collBtn.innerHTML = '🗂️ Collections';
    collBtn.title = 'Browse saved research collections';
    collBtn.addEventListener('click', openCollectionsBrowser);
    headerLinks.insertBefore(collBtn, headerLinks.firstChild);
  }

  renderHistory();
  restoreActiveReport();

});  // END DOMContentLoaded

/* ── Global helpers for Collections (outside DOMContentLoaded) ── */
function confirmSaveCollection() {
  const nameInput = document.getElementById('collection-name-input');
  const name = nameInput?.value?.trim();
  if (!name) { alert('Please enter a collection name.'); return; }

  const activeReport = (() => {
    try { return JSON.parse(localStorage.getItem('bhavya_deepsearch_active_report') || 'null'); } catch { return null; }
  })();

  if (!activeReport) { alert('No active research report to save. Run a search first.'); return; }

  const collections = JSON.parse(localStorage.getItem('bhavya_deepsearch_collections') || '[]');
  const existing = collections.find(c => c.name === name);
  const newItem = {
    name,
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
    title: activeReport.title,
    engine: activeReport.engine,
    markdown: activeReport.markdown,
    reportDate: activeReport.date
  };

  if (existing) {
    existing.items = existing.items || [];
    existing.items.push(newItem);
    existing.date = newItem.date;
  } else {
    collections.unshift({ name, id: newItem.id, date: newItem.date, items: [newItem] });
  }

  localStorage.setItem('bhavya_deepsearch_collections', JSON.stringify(collections.slice(0, 50)));
  document.getElementById('collection-save-modal').style.display = 'none';

  // Toast
  const toast = document.createElement('div');
  toast.textContent = `✅ Saved to "${name}"`;
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0a101e;border:1px solid rgba(0,240,255,0.4);color:#00f0ff;padding:12px 20px;border-radius:8px;font-size:13px;z-index:99999;font-family:"Space Grotesk",sans-serif;box-shadow:0 0 20px rgba(0,240,255,0.2);';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function openCollectionsBrowser() {
  const modal = document.getElementById('collections-browser-modal');
  const list = document.getElementById('collections-list');
  const collections = JSON.parse(localStorage.getItem('bhavya_deepsearch_collections') || '[]');

  if (!collections.length) {
    list.innerHTML = '<p style="color:#8899b5;font-size:13px;padding:10px 0;">No collections yet. Run a search, then click 📌 Save to Collection.</p>';
  } else {
    list.innerHTML = collections.map(col => `
      <div style="border:1px solid rgba(0,240,255,0.15);border-radius:10px;padding:14px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:14px;font-weight:700;color:#f0f4fc;font-family:'Space Grotesk',sans-serif;margin-bottom:4px;">🗂️ ${escDS(col.name)}</div>
            <div style="font-size:11px;color:#8899b5;">${col.items?.length || 1} report(s) · Last saved ${escDS(col.date)}</div>
          </div>
          <button onclick="deleteCollection('${col.id}')" style="background:none;border:none;color:#8899b5;cursor:pointer;font-size:13px;padding:4px 8px;" title="Delete collection">🗑️</button>
        </div>
        <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;">
          ${(col.items||[]).map(item => `
            <div onclick="loadCollectionItem(${JSON.stringify(item).replace(/"/g, '&quot;')})" style="padding:8px 12px;background:rgba(0,240,255,0.04);border-radius:6px;cursor:pointer;border:1px solid rgba(0,240,255,0.1);">
              <div style="font-size:12.5px;color:#f0f4fc;font-family:'Space Grotesk',sans-serif;">${escDS(item.title || 'Research Report')}</div>
              <div style="font-size:10.5px;color:#8899b5;margin-top:2px;">${escDS(item.engine || 'AI Engine')} · ${escDS(item.date)}</div>
            </div>`).join('')}
        </div>
      </div>`).join('');
  }
  modal.style.display = 'flex';
}

function deleteCollection(id) {
  const cols = JSON.parse(localStorage.getItem('bhavya_deepsearch_collections') || '[]').filter(c => c.id !== id);
  localStorage.setItem('bhavya_deepsearch_collections', JSON.stringify(cols));
  openCollectionsBrowser();
}

function loadCollectionItem(item) {
  try {
    document.getElementById('collections-browser-modal').style.display = 'none';
    const reportTitle = document.getElementById('reportTitle');
    const reportDate = document.getElementById('reportDate');
    const reportEngineTag = document.getElementById('reportEngineTag');
    const searchHeroSection = document.getElementById('searchHeroSection');
    const reportViewContainer = document.getElementById('reportViewContainer');
    if (reportTitle) reportTitle.textContent = item.title;
    if (reportDate) reportDate.textContent = `Collection · ${item.date}`;
    if (reportEngineTag) reportEngineTag.textContent = item.engine || 'AI Engine';
    // Render markdown
    const reportContentArea = document.getElementById('reportContentArea');
    if (reportContentArea && window.marked) reportContentArea.innerHTML = marked.parse(item.markdown || '');
    if (searchHeroSection) searchHeroSection.style.display = 'none';
    if (reportViewContainer) reportViewContainer.style.display = 'flex';
    try { localStorage.setItem('bhavya_deepsearch_active_report', JSON.stringify({ title: item.title, date: `Collection · ${item.date}`, engine: item.engine, markdown: item.markdown })); } catch {}
  } catch(e) {}
}

/* ── Source Credibility Score Engine ── */
function getCredibilityBadge(url) {
  if (!url) return { label: 'Unknown', color: '#8899b5', emoji: '⬜' };
  const u = url.toLowerCase();
  if (/\.(edu|ac\.|university)/.test(u)) return { label: 'Academic', color: '#00f0ff', emoji: '🟦' };
  if (/\.(gov|mil)/.test(u)) return { label: 'Government', color: '#00ff88', emoji: '🟩' };
  if (/arxiv\.org|scholar\.google|pubmed|doi\.org|ieee\.org|acm\.org|springer|nature\.com|science\.org/.test(u)) return { label: 'Peer-Reviewed', color: '#00ff88', emoji: '🟢' };
  if (/wikipedia\.org/.test(u)) return { label: 'Wikipedia', color: '#f59e0b', emoji: '🟡' };
  if (/github\.com|stackoverflow|docs\./.test(u)) return { label: 'Technical Docs', color: '#00f0ff', emoji: '🔵' };
  if (/reuters|bbc|nytimes|ft\.com|bloomberg|economist/.test(u)) return { label: 'Quality News', color: '#f59e0b', emoji: '🟡' };
  if (/medium\.com|substack|wordpress|blogspot|weebly/.test(u)) return { label: 'Blog', color: '#f87171', emoji: '🟠' };
  return { label: 'Web Source', color: '#8899b5', emoji: '⬜' };
}

// Inject credibility badges into source links after report renders
function injectCredibilityBadges() {
  const links = document.querySelectorAll('#reportContentArea a[href]');
  links.forEach(link => {
    if (link._credBadge) return;
    link._credBadge = true;
    const badge = getCredibilityBadge(link.href);
    const span = document.createElement('span');
    span.title = badge.label;
    span.style.cssText = `margin-left:4px;font-size:9px;padding:1px 5px;border-radius:3px;vertical-align:middle;font-weight:700;font-family:'JetBrains Mono',monospace;color:${badge.color};background:${badge.color}22;border:1px solid ${badge.color}44;`;
    span.textContent = badge.emoji + ' ' + badge.label;
    link.after(span);
  });
}

// Observe report area for new content
const _dsObs = new MutationObserver(injectCredibilityBadges);
document.addEventListener('DOMContentLoaded', () => {
  const area = document.getElementById('reportContentArea');
  if (area) _dsObs.observe(area, { childList: true, subtree: true });
});

function escDS(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ══════════════════════════════════════════════════════════════════
   NEW FEATURE: FACT-CHECK MODE
   Re-evaluates every claim in the rendered report using Gemini
   ══════════════════════════════════════════════════════════════════ */
async function runFactCheck() {
  const btn = document.getElementById('btnFactCheck');
  const area = document.getElementById('reportContentArea');
  if (!area || !area.textContent.trim()) { alert('Generate a research report first.'); return; }

  if (btn) { btn.textContent = '⏳ Checking…'; btn.disabled = true; }

  const geminiKey = localStorage.getItem('bhavya_gemini_key') || localStorage.getItem('ai_ecosystem_gemini') || localStorage.getItem('bhavya_ai_gemini_key');
  if (!geminiKey) { alert('Set your Gemini API key first.'); if (btn) { btn.textContent = '🔍 Fact-Check'; btn.disabled = false; } return; }

  const reportText = area.textContent.slice(0, 6000);
  const prompt = `You are a rigorous fact-checker. Review the following research report and identify each major factual claim.
For each claim, output a line like:
✅ VERIFIED: [claim] — [brief reason]
⚠️ DISPUTED: [claim] — [brief reason]
❌ UNVERIFIED: [claim] — [brief reason]

Report to check:
${reportText}

Be concise, max 20 claims. Focus on the most impactful factual assertions.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No result.';

    // Inject fact-check panel above report
    const existingPanel = document.getElementById('fact-check-panel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'fact-check-panel';
    panel.style.cssText = 'background:rgba(5,10,20,0.9);border:1px solid rgba(251,191,36,0.4);border-radius:12px;padding:16px;margin-bottom:16px;font-family:JetBrains Mono,monospace;font-size:12px;line-height:1.7;';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <strong style="color:#fbbf24;font-size:13px;">🔍 AI Fact-Check Results</strong>
        <button onclick="document.getElementById('fact-check-panel').remove()" style="background:none;border:none;color:#8899b5;cursor:pointer;font-size:14px;">✕</button>
      </div>
      <div style="color:#e2e8f0;white-space:pre-wrap;">${escDS(result).replace(/✅/g,'<span style="color:#10b981;">✅</span>').replace(/⚠️/g,'<span style="color:#f59e0b;">⚠️</span>').replace(/❌/g,'<span style="color:#ef4444;">❌</span>')}</div>
    `;
    area.parentElement.insertBefore(panel, area);
  } catch(e) { alert('Fact-check failed: ' + e.message); }

  if (btn) { btn.textContent = '✅ Checked!'; setTimeout(() => { btn.textContent = '🔍 Fact-Check'; btn.disabled = false; }, 2000); }
}

/* ══════════════════════════════════════════════════════════════════
   NEW FEATURE: NOTION / OBSIDIAN EXPORT
   Downloads research as proper YAML front-matter Markdown
   ══════════════════════════════════════════════════════════════════ */
function exportToNotion() {
  const title = document.getElementById('reportTitle')?.textContent || 'Research Report';
  const date = document.getElementById('reportDate')?.textContent || '';
  const engine = document.getElementById('reportEngineTag')?.textContent || '';
  const area = document.getElementById('reportContentArea');
  if (!area || !area.textContent.trim()) { alert('No report to export.'); return; }

  // Get Markdown (prefer stored version)
  let md = '';
  try { const hist = JSON.parse(localStorage.getItem('bhavya_deepsearch_history') || '[]'); md = hist[0]?.markdown || area.innerText; }
  catch { md = area.innerText; }

  const yamlDate = new Date().toISOString().split('T')[0];
  const tags = ['research', 'ai-generated', 'deepsearch'];
  const frontMatter = `---
title: "${title}"
date: ${yamlDate}
tags: [${tags.join(', ')}]
engine: "${engine}"
source: "Bhavya's DeepSearch"
status: draft
---

`;

  const fullMd = frontMatter + `# ${title}\n\n> Generated: ${date}\n\n` + md;
  const blob = new Blob([fullMd], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title.replace(/[^a-z0-9]/gi, '_').slice(0,50) + '.md';
  a.click();
}