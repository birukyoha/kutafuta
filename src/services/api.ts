// File: /src/services/api.ts
// Client API Service for KutafutaTalent React SPA
// Dynamically resolves API endpoints for root, subfolder, and staging cPanel deployments

/**
 * Dynamically resolves the API endpoint URL based on current window location.
 * - On localhost (dev): routes to Node.js at /api/...
 * - On cPanel / Bluehost (production): routes to api.php?route=...
 */
export function getApiEndpoint(endpoint: string): string {
  let normalized = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  // Strip /api prefix if present — we re-add it below
  if (normalized.startsWith('/api/')) {
    normalized = normalized.substring(4);
  } else if (normalized === '/api') {
    normalized = '';
  }

  if (typeof window === 'undefined') {
    return `/api${normalized}`;
  }

  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    // Local dev — use Node.js Express server
    return `/api${normalized}`;
  }

  // cPanel / Bluehost — use PHP API file
  // Detect subfolder deployment (e.g. /website_419033d0/)
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const knownPageRoutes = ['index', 'index.html', 'admin', 'talents', 'jobs', 'dashboard', 'profile'];
  if (segments.length > 0 && knownPageRoutes.includes(segments[segments.length - 1].toLowerCase())) {
    segments.pop();
  }
  const baseDir = segments.length > 0 ? '/' + segments.join('/') : '';

  // Pass route as PATH_INFO so api.php can dispatch it
  // e.g. /website_419033d0/api.php/auth/login
  return `${baseDir}/api.php${normalized}`;
}


/**
 * Generic API Fetch Helper with Safe JSON Parsing & Error Handling
 */
export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = getApiEndpoint(endpoint);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = localStorage.getItem('cinecraft_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const adminToken = sessionStorage.getItem('cinecraft_admin_token');
  if (adminToken) {
    headers['x-admin-key'] = adminToken;
  }

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Server returned invalid response for ${endpoint}`);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'API Request failed');
  }

  return data as T;
}

/**
 * Generate AI Talent Bio or Job Summary via Server-Side PHP Gemini API Proxy
 */
export async function generateGeminiAIContent(prompt: string): Promise<string> {
  try {
    const data = await apiFetch('/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    return data.result || 'AI generated content unavailable.';
  } catch (error: any) {
    console.warn('Gemini API PHP proxy error:', error);
    return 'Unable to contact server-side AI assistant.';
  }
}
