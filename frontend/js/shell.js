// Mawkish Creates Portal — Shared Shell JS

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', href: '/pages/dashboard.html', section: 'MAIN',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>` },
  { id: 'tasks', label: 'Tasks', href: '/pages/tasks.html', section: 'MAIN',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>` },
  { id: 'calendar', label: 'Calendar', href: '/pages/calendar.html', section: 'MAIN',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  { id: 'announcements', label: 'Announcements', href: '/pages/announcements.html', section: 'TEAM',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 000 6h12a3 3 0 003-3v-1"/><path d="M15 3a3 3 0 110 6"/><path d="M9 3H4a2 2 0 00-2 2v10"/></svg>` },
  { id: 'pipelines', label: 'Pipelines', href: '/pages/pipelines.html', section: 'TEAM',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>` },
  { id: 'resources', label: 'Resources', href: '/pages/resources.html', section: 'TEAM',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>` },
];

let currentUser = null;

async function initShell(activePageId) {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) { window.location.href = '/'; return; }
    const data = await res.json();
    currentUser = data.user;
    renderShell(activePageId);
  } catch { window.location.href = '/'; }
}

function renderShell(activePageId) {
  const sidebar = document.getElementById('sidebar');
  const sections = {};
  PAGES.forEach(p => { if (!sections[p.section]) sections[p.section] = []; sections[p.section].push(p); });

  let navHtml = '';
  Object.keys(sections).forEach(sec => {
    navHtml += `<div class="nav-section-label">${sec}</div>`;
    sections[sec].forEach(p => {
      navHtml += `<a href="${p.href}" class="nav-item ${p.id === activePageId ? 'active' : ''}">${p.icon} <span>${p.label}</span></a>`;
    });
  });

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <div class="sidebar-logo-placeholder">
        <img src="/assets/logo.png" alt="Mawkish Creates" style="height:32px" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div style="display:none;align-items:center;gap:8px">
          <div style="width:28px;height:28px;background:linear-gradient(135deg,#7b2ff7,#bfa0fb);border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;color:#fff;font-size:0.85rem">M</div>
          <span style="font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:#fff">Mawkish <em style="color:#c9a84c;font-style:normal">Creates</em></span>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav">${navHtml}</nav>
    <div class="sidebar-bottom">
      <div class="user-card">
        <div class="user-avatar">${currentUser.avatar || currentUser.name.slice(0,2).toUpperCase()}</div>
        <div class="user-info">
          <div class="user-name">${currentUser.name}</div>
          <div class="user-role">${currentUser.department || currentUser.role}</div>
        </div>
        <button class="logout-btn" onclick="logout()" title="Sign out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  `;
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/';
}

function showToast(msg, type = '') {
  let container = document.getElementById('toastContainer');
  if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; container.className = 'toast-container'; document.body.appendChild(container); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function getUser() { return currentUser; }
