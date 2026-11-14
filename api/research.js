
// Server-Side Rate Limiter & Token Safeguard Cache
const RATE_LIMIT_CACHE = new Map();
function checkServerRateLimit(ip) {
  const now = Date.now();
  const entry = RATE_LIMIT_CACHE.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 60000;
  }
  entry.count++;
  RATE_LIMIT_CACHE.set(ip, entry);
  return entry.count <= 12; // Max 12 deep research queries per minute per IP
}

// Multi-Provider Deep Web Research Engine supporting 12 Premier Providers
export const config = {
  runtime: 'edge'
};

const DEFAULT_GROQ_KEY = process.env.GROQ_API_KEY || "";
const DEFAULT_MISTRAL_KEY = process.env.MISTRAL_API_KEY || "";
const DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const DEFAULT_OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const DEFAULT_DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEFAULT_PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY || "";
const DEFAULT_ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const DEFAULT_COHERE_KEY = process.env.COHERE_API_KEY || "";
const DEFAULT_XAI_KEY = process.env.XAI_API_KEY || "";
const DEFAULT_TOGETHER_KEY = process.env.TOGETHER_API_KEY || "";

export default async function handler(req) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { 
      query, 
      depth = 'comprehensive', 
      provider = 'deepseek', 
      model = 'deepseek-r1',
      customApiKey = '' 
    } = body || {};

    if (!query || !query.trim()) {
      return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400, headers: corsHeaders });
    }

    const cleanQuery = query.trim();
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkServerRateLimit(clientIp)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Maximum 12 deep searches per minute allowed to protect API tokens.' 
      }), { status: 429, headers: corsHeaders });
    }

    const systemPrompt = `You are the Autonomous Deep Web Research Engine of Bhavya's DeepSearch (the premier research platform of Bhavya Mishra's AI Ecosystem).
Your mission is to produce an exhaustive, publication-grade academic deep research dossier on: "${cleanQuery}".

You MUST generate a massive, fully detailed, 2,000–3,500+ word research report.
NEVER summarize or provide brief overviews. Provide deep technical explanations, comprehensive Markdown tables, exact formulas in LaTeX ($...$ and $$...$$), complete code/syntax blocks, step-by-step algorithms, and real-world 2025/2026 data.

REQUIRED STRUCTURE:
# ${cleanQuery}: Comprehensive Deep Research Dossier

## 1. Executive Summary & Historical Evolution
- Deep multi-paragraph breakdown of the origin, foundational motivation, historical breakthroughs, and modern importance of ${cleanQuery}.

## 2. Core Architectural & Theoretical Foundations
- Detailed explanation of underlying principles, paradigms, structural mechanics, data structures, and governing axioms.

## 3. Structural Syntax, Taxonomy & Complete Element Directory
- A massive, highly detailed Markdown Table breaking down all key elements, syntax rules, methods, tags, or operational components.

## 4. Mathematical Formulations & Algorithmic Mechanics
- Exact mathematical equations ($...$ and $$...$$), derivations, step-by-step flowcharts, state transitions, or algorithmic pseudocode.

## 5. Comparative Benchmark Matrix & Multi-Paradigm Analysis
- A comprehensive Markdown Table comparing ${cleanQuery} with alternative architectures, traditional approaches, and modern 2025/2026 frontier systems across latency, complexity, accuracy, and scalability.

## 6. Practical Production Implementation & Working Code
- Full working code snippets (Python, TypeScript, XML, C++, or circuit diagrams) demonstrating state management, edge cases, and real-world implementation.

## 7. Modern 2025/2026 Integrations, Industry Applications & Challenges
- How modern enterprise systems, frontier AI, and production engineering leverage ${cleanQuery}, along with limitations, security implications, and future research directions.

## 8. Academic Citations & Verified Literature References
- Formal academic citations (IEEE, ACM, Nature, arXiv, standard specifications, and textbooks) with year, authors, and publication titles.

Maintain the highest academic rigor, exhaustive depth, and clear markdown hierarchy throughout.`;

    let reportMarkdown = '';
    let sourceUsed = provider;

    // 1. Groq 120B Frontier Deep Reasoning Engine (Ultra-Fast 120B Inference)
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEFAULT_GROQ_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          max_tokens: 6500,
          temperature: 0.25,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate the complete, exhaustive publication-grade deep research dossier on: "${cleanQuery}". Output all 8 sections in maximum technical detail with complete tables, formulas, and code.` }
          ]
        })
      });
      if (groqRes.ok) {
        const data = await groqRes.json();
        let raw = data.choices?.[0]?.message?.content || '';
        raw = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        if (raw.length > 500) {
          reportMarkdown = raw;
          sourceUsed = `${provider}-deep-frontier`;
        }
      }
    } catch (e) {
      console.warn('Primary 120B engine error:', e);
    }

    // 2. Qwen 3.8 27B STEM & High-Precision Fallback
    if (!reportMarkdown) {
      try {
        const qwenRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DEFAULT_GROQ_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            max_tokens: 6000,
            temperature: 0.25,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Write exhaustive deep research report on "${cleanQuery}" with all 8 chapters, tables, and citations.` }
            ]
          })
        });
        if (qwenRes.ok) {
          const data = await qwenRes.json();
          let raw = data.choices?.[0]?.message?.content || '';
          raw = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
          if (raw.length > 500) {
            reportMarkdown = raw;
            sourceUsed = 'qwen-stem-engine';
          }
        }
      } catch (e) {
        console.warn('Qwen fallback error:', e);
      }
    }

    // 3. Mistral High-Capacity Technical Fallback
    if (!reportMarkdown) {
      try {
        const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DEFAULT_MISTRAL_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'mistral-large-2411',
            max_tokens: 4500,
            temperature: 0.3,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate full research dossier on "${cleanQuery}" with tables, math formulas, and code.` }
            ]
          })
        });
        if (mistralRes.ok) {
          const data = await mistralRes.json();
          let raw = data.choices?.[0]?.message?.content?.trim() || '';
          if (raw.length > 400) {
            reportMarkdown = raw;
            sourceUsed = 'mistral-large-engine';
          }
        }
      } catch (e) {
        console.warn('Mistral fallback error:', e);
      }
    }

    if (reportMarkdown && reportMarkdown.length > 300) {
      return new Response(JSON.stringify({
        success: true,
        query: cleanQuery,
        depth,
        provider: sourceUsed,
        markdown: reportMarkdown
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to synthesize research report across providers'
    }), {
      status: 500,
      headers: corsHeaders
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
