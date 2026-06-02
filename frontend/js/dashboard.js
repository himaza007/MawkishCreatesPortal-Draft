/* dashboard.js — Mawkish Creates Portal */

let currentUser = null;
let currentTaskFilter = 'all';
let currentTaskView = 'kanban';
let currentResourceFilter = 'all';
let calendarDate = new Date(2026, 5, 1); // June 2026
let selectedCalDate = null;

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const stored = sessionStorage.getItem('mc_user');
  if (!stored) { window.location.href = '../index.html'; return; }

  currentUser = JSON.parse(stored);
  initUser();
  initNav();
  renderHome();
  renderTasks();
  renderPipeline();
  renderCalendar();
  renderAnnouncements();
  renderResources();

  document.getElementById('signOutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('mc_user');
    window.location.href = '../index.html';
  });
});

function initUser() {
  document.getElementById('sidebarAvatar').textContent = currentUser.avatar;
  document.getElementById('sidebarName').textContent = currentUser.name;
  document.getElementById('sidebarRole').textContent = currentUser.role;

  // Try to load real avatar
  const member = MC_DATA.team.find(t => t.avatar === currentUser.avatar);
  if (member) {
    const img = new Image();
    img.onload = () => {
      const el = document.getElementById('sidebarAvatar');
      el.innerHTML = `<img src="${member.img}" class="demo-img"/>`;
    };
    img.src = member.img;
  }
}

function initNav() {
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });

  // Update task badge
  const pending = MC_DATA.tasks.filter(t => t.status !== 'done').length;
  document.getElementById('taskBadge').textContent = pending;
}

function navigate(page) {
  // Nav highlight
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  // Show page
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  // Update topbar title
  const titles = { home:'Dashboard', tasks:'Tasks', pipeline:'Pipelines', calendar:'Calendar', announcements:'Announcements', resources:'Resources' };
  document.getElementById('topbarTitle').textContent = titles[page] || page;
}

// ══════════════════════════════════════════
// HOME
// ══════════════════════════════════════════
function renderHome() {
  renderNextEventBanner();
  renderStats();
  renderHomeTaskList();
  renderHomeEventList();
  renderHomeAnnList();
  renderHomeDatesList();
}

function renderNextEventBanner() {
  const today = new Date();
  const upcoming = MC_DATA.events
    .filter(e => new Date(e.date) >= today)
    .sort((a,b) => new Date(a.date)-new Date(b.date))[0];

  const el = document.getElementById('nextEventBanner');
  if (!upcoming) { el.style.display = 'none'; return; }

  const d = daysUntil(upcoming.date);
  el.innerHTML = `
    <div class="dates-banner-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    </div>
    <div class="dates-banner-content">
      <div class="dates-banner-label">Next Up</div>
      <div class="dates-banner-title">${upcoming.title}</div>
      <div class="dates-banner-sub">${formatDate(upcoming.date)} ${upcoming.time ? '— ' + upcoming.time : ''} ${upcoming.location ? '· ' + upcoming.location : ''}</div>
    </div>
    <div style="flex-shrink:0;background:rgba(255,255,255,0.12);padding:8px 16px;border-radius:var(--radius-sm);text-align:center">
      <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:600;line-height:1">${d <= 0 ? 'Today' : d}</div>
      ${d > 0 ? '<div style="font-size:0.7rem;color:rgba(255,255,255,0.7);letter-spacing:0.05em">days away</div>' : ''}
    </div>
  `;
}

function renderStats() {
  const total     = MC_DATA.tasks.length;
  const done      = MC_DATA.tasks.filter(t=>t.status==='done').length;
  const inProg    = MC_DATA.tasks.filter(t=>t.status==='in-progress').length;
  const activeProj= MC_DATA.pipelines.filter(p=>p.stage!=='completed').length;

  document.getElementById('statsGrid').innerHTML = `
    ${statCard('Total Tasks',    total,   'purple', taskIcon())}
    ${statCard('In Progress',    inProg,  'cyan',   progressIcon())}
    ${statCard('Completed',      done,    'gold',   checkIcon())}
    ${statCard('Active Projects',activeProj,'rose', projectIcon())}
  `;
}

function statCard(label, value, color, icon) {
  return `
  <div class="stat-card stat-card--${color}">
    <div class="stat-icon stat-icon--${color}">${icon}</div>
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;
}

function taskIcon()     { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`; }
function progressIcon() { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`; }
function checkIcon()    { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`; }
function projectIcon()  { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`; }

function renderHomeTaskList() {
  const tasks = MC_DATA.tasks.filter(t=>t.status!=='done').slice(0,5);
  const el = document.getElementById('homeTaskList');
  el.innerHTML = tasks.map(t => `
    <div class="task-list-item">
      <span class="priority-dot priority-dot--${t.priority}"></span>
      <span class="task-list-title">${t.title}</span>
      <span class="badge badge--grey" style="font-size:0.7rem">${t.client}</span>
      <span class="task-card-date ${isOverdue(t.dueDate)?'overdue':''}" style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap">${formatDateShort(t.dueDate)}</span>
    </div>
  `).join('');
}

function renderHomeEventList() {
  const today = new Date();
  const end   = new Date(); end.setDate(end.getDate() + 7);
  const events = MC_DATA.events
    .filter(e => { const d=new Date(e.date); return d>=today && d<=end; })
    .sort((a,b)=>new Date(a.date)-new Date(b.date))
    .slice(0,5);

  const el = document.getElementById('homeEventList');
  if (!events.length) { el.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted)">No events this week.</p>'; return; }
  el.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px">${events.map(e=>`
    <div class="event-item">
      <div class="event-color-bar" style="background:${e.color}"></div>
      <div class="event-info">
        <div class="event-title">${e.title}</div>
        <div class="event-time">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${formatDateShort(e.date)} ${e.time ? '· '+e.time : ''}
        </div>
      </div>
    </div>
  `).join('')}</div>`;
}

function renderHomeAnnList() {
  const anns = [...MC_DATA.announcements].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,2);
  const el = document.getElementById('homeAnnList');
  el.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px">${anns.map(a=>`
    <div style="padding-bottom:12px;border-bottom:1px solid var(--grey-100)">
      ${a.pinned ? '<span class="badge badge--gold" style="margin-bottom:6px">📌 Pinned</span>' : ''}
      <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px">${a.title}</div>
      <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.5">${a.body.substring(0,100)}…</div>
      <div style="font-size:0.72rem;color:var(--text-muted);margin-top:6px">${formatDate(a.date)}</div>
    </div>
  `).join('')}</div>`;
}

function renderHomeDatesList() {
  const today = new Date();
  const dates = MC_DATA.importantDates
    .filter(d=>new Date(d.date)>=today)
    .sort((a,b)=>new Date(a.date)-new Date(b.date));

  const colorMap = { deadline:'rose', client:'purple', internal:'cyan' };
  const el = document.getElementById('homeDatesList');
  el.innerHTML = `<div class="activity-feed">${dates.map(d=>`
    <div class="activity-item">
      <div class="activity-avatar" style="background:var(--purple-100);color:var(--purple-700)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </div>
      <div class="activity-text"><strong>${d.label}</strong></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
        <span class="badge badge--${colorMap[d.type]||'grey'}">${d.type}</span>
        <span class="activity-time">${formatDateShort(d.date)}</span>
      </div>
    </div>
  `).join('')}</div>`;
}

// ══════════════════════════════════════════
// TASKS
// ══════════════════════════════════════════
function renderTasks() {
  renderKanban();
  renderListView();

  // Filters
  document.getElementById('taskFilterBar').addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    document.querySelectorAll('#taskFilterBar .filter-chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    currentTaskFilter = chip.dataset.filter;
    renderKanban();
    renderListView();
  });
}

function getFilteredTasks() {
  if (currentTaskFilter==='all') return MC_DATA.tasks;
  return MC_DATA.tasks.filter(t=>t.status===currentTaskFilter);
}

function renderKanban() {
  const statuses = [
    { key:'todo',        label:'To Do',      color:'var(--gold)' },
    { key:'in-progress', label:'In Progress', color:'var(--purple-500)' },
    { key:'done',        label:'Done',        color:'var(--cyan)' },
  ];
  const tasks = getFilteredTasks();
  document.getElementById('kanbanBoard').innerHTML = statuses.map(s=>{
    const cols = tasks.filter(t=>t.status===s.key);
    return `
    <div class="kanban-col">
      <div class="kanban-col-header">
        <span class="kanban-col-title" style="color:${s.color}">${s.label}</span>
        <span class="kanban-count">${cols.length}</span>
      </div>
      <div class="task-cards">
        ${cols.map(t=>taskCardHTML(t)).join('') || '<div style="padding:12px;font-size:0.82rem;color:var(--text-muted);text-align:center">No tasks</div>'}
      </div>
    </div>`;
  }).join('');
}

function taskCardHTML(t) {
  const assigneeHTML = t.assignees.map(av=>{
    const m = getTeamMember(av);
    return `<div class="mini-avatar" title="${m?m.name:av}">${av}</div>`;
  }).join('');
  return `
  <div class="task-card" onclick="toggleTask('${t.id}')">
    <div class="task-card-top">
      <div class="task-card-title">${t.title}</div>
      <span class="priority-dot priority-dot--${t.priority}" title="${t.priority} priority"></span>
    </div>
    <div class="task-card-meta">
      <span class="badge badge--purple" style="font-size:0.68rem">${t.client}</span>
      <span class="task-card-date ${isOverdue(t.dueDate)&&t.status!='done'?'overdue':''}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${formatDateShort(t.dueDate)}
      </span>
      <div class="task-assignee" style="margin-left:auto">${assigneeHTML}</div>
    </div>
  </div>`;
}

function renderListView() {
  const tasks = getFilteredTasks();
  document.getElementById('taskListContainer').innerHTML = `
    <div class="task-list">
      ${tasks.map(t=>`
        <div class="task-list-item" onclick="toggleTask('${t.id}')">
          <div class="task-checkbox ${t.status==='done'?'checked':''}">
            ${t.status==='done'?'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
          </div>
          <span class="priority-dot priority-dot--${t.priority}"></span>
          <span class="task-list-title ${t.status==='done'?'done':''}">${t.title}</span>
          <span class="badge badge--grey">${t.client}</span>
          <span class="badge badge--${t.status==='done'?'green':t.status==='in-progress'?'purple':'grey'}">${t.status}</span>
          <span class="task-card-date ${isOverdue(t.dueDate)&&t.status!='done'?'overdue':''}" style="font-size:0.75rem">${formatDateShort(t.dueDate)}</span>
        </div>
      `).join('')}
    </div>`;
}

function toggleTask(id) {
  const t = MC_DATA.tasks.find(t=>t.id===id);
  if (!t) return;
  const cycle = { 'todo':'in-progress', 'in-progress':'done', 'done':'todo' };
  t.status = cycle[t.status];
  renderKanban();
  renderListView();
  renderHome();
  document.getElementById('taskBadge').textContent = MC_DATA.tasks.filter(t=>t.status!=='done').length;
  toast(`Task moved to "${t.status}"`, 'success');
}

function setTaskView(view) {
  currentTaskView = view;
  document.getElementById('kanbanView').style.display = view==='kanban' ? 'block' : 'none';
  document.getElementById('listView').style.display   = view==='list'   ? 'block' : 'none';
  document.getElementById('btnKanban').className = 'btn ' + (view==='kanban'?'btn--secondary':'btn--ghost');
  document.getElementById('btnList').className   = 'btn ' + (view==='list'  ?'btn--secondary':'btn--ghost');
}

function openAddTask() { openModal('addTaskModal'); }

function addTask() {
  const title = document.getElementById('newTaskTitle').value.trim();
  if (!title) { toast('Please enter a task title', 'error'); return; }
  MC_DATA.tasks.push({
    id: 't'+Date.now(),
    title,
    status:   document.getElementById('newTaskStatus').value,
    priority: document.getElementById('newTaskPriority').value,
    dueDate:  document.getElementById('newTaskDate').value || new Date().toISOString().split('T')[0],
    client:   document.getElementById('newTaskClient').value || 'Internal',
    assignees:[currentUser.avatar],
    tags: []
  });
  closeModal('addTaskModal');
  renderTasks();
  renderHome();
  document.getElementById('newTaskTitle').value = '';
  document.getElementById('newTaskClient').value = '';
  toast('Task added', 'success');
}

// ══════════════════════════════════════════
// PIPELINE
// ══════════════════════════════════════════
function renderPipeline() {
  // Stats
  const active    = MC_DATA.pipelines.filter(p=>p.stage!=='completed').length;
  const completed = MC_DATA.pipelines.filter(p=>p.stage==='completed').length;
  const totalVal  = MC_DATA.pipelines.filter(p=>p.stage!=='completed').reduce((s,p)=>s+p.value,0);
  const proposals = MC_DATA.pipelines.filter(p=>p.stage==='proposal').length;

  document.getElementById('pipelineStats').innerHTML = `
    ${statCard('Active Projects', active,    'purple', projectIcon())}
    ${statCard('Proposals Out',   proposals, 'gold',   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`)}
    ${statCard('Completed',       completed, 'cyan',   checkIcon())}
    ${statCard('Pipeline Value',  'LKR '+Math.round(totalVal/1000)+'K','rose', `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`)}
  `;

  // Board
  const board = document.getElementById('pipelineBoard');
  board.innerHTML = MC_DATA.pipelineStages.map(stage=>{
    const cards = MC_DATA.pipelines.filter(p=>p.stage===stage.key);
    return `
    <div class="pipeline-stage">
      <div class="pipeline-stage-header">
        <span class="pipeline-stage-name" style="color:${stage.color}">
          <span style="width:8px;height:8px;border-radius:50%;background:${stage.color};display:inline-block"></span>
          ${stage.label}
        </span>
        <span class="kanban-count">${cards.length}</span>
      </div>
      <div class="pipeline-stage-bar" style="background:${stage.color};opacity:0.4"></div>
      <div class="pipeline-cards">
        ${cards.map(p=>`
          <div class="pipeline-card">
            <div class="pipeline-card-name">${p.name}</div>
            <div class="pipeline-card-client">${p.client}</div>
            <div class="pipeline-card-footer">
              <span class="pipeline-value">${formatCurrency(p.value)}</span>
              <div class="mini-avatar" title="${p.pm}">${p.pm}</div>
            </div>
          </div>
        `).join('') || '<div style="padding:10px;font-size:0.78rem;color:var(--text-muted);text-align:center">—</div>'}
      </div>
    </div>`;
  }).join('');
}

function openAddPipeline() { openModal('addPipelineModal'); }

function addPipeline() {
  const name = document.getElementById('newPipeName').value.trim();
  if (!name) { toast('Please enter a project name','error'); return; }
  MC_DATA.pipelines.push({
    id: 'p'+Date.now(),
    name,
    client:    document.getElementById('newPipeClient').value.trim() || 'TBC',
    stage:     document.getElementById('newPipeStage').value,
    value:     parseInt(document.getElementById('newPipeValue').value)||0,
    startDate: document.getElementById('newPipeDate').value,
    pm:        currentUser.avatar
  });
  closeModal('addPipelineModal');
  renderPipeline();
  toast('Project added to pipeline','success');
}

// ══════════════════════════════════════════
// CALENDAR
// ══════════════════════════════════════════
function renderCalendar() {
  renderCalGrid();
  renderEventsList();
  document.getElementById('calPrev').onclick = () => { calendarDate.setMonth(calendarDate.getMonth()-1); renderCalendar(); };
  document.getElementById('calNext').onclick = () => { calendarDate.setMonth(calendarDate.getMonth()+1); renderCalendar(); };
}

function renderCalGrid() {
  const year  = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById('calMonthTitle').textContent = calendarDate.toLocaleDateString('en-GB',{month:'long',year:'numeric'});

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date();

  // Get event dates for dots
  const eventDates = {};
  MC_DATA.events.forEach(e=>{
    const d = new Date(e.date);
    if (d.getFullYear()===year && d.getMonth()===month) {
      const day = d.getDate();
      if (!eventDates[day]) eventDates[day]=[];
      eventDates[day].push(e.color);
    }
  });

  let html = '';
  // Leading empty
  for (let i=0;i<firstDay;i++) html += `<div class="cal-date other-month"><span class="cal-date-num"></span></div>`;
  // Days
  for (let d=1;d<=daysInMonth;d++) {
    const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
    const isSelected = selectedCalDate && selectedCalDate.getFullYear()===year && selectedCalDate.getMonth()===month && selectedCalDate.getDate()===d;
    const dots = eventDates[d]||[];
    html += `
      <div class="cal-date ${isToday?'today':''} ${isSelected?'selected':''}" onclick="selectCalDate(${year},${month},${d})">
        <span class="cal-date-num">${d}</span>
        <div class="cal-dots">${dots.slice(0,3).map(c=>`<div class="cal-dot" style="background:${c}"></div>`).join('')}</div>
      </div>`;
  }
  document.getElementById('calDates').innerHTML = html;
}

function selectCalDate(y,m,d) {
  selectedCalDate = new Date(y,m,d);
  renderCalGrid();
  renderEventsList(selectedCalDate);
}

function renderEventsList(filterDate) {
  const el = document.getElementById('eventsListContainer');
  const titleEl = document.getElementById('eventsListTitle');

  let events;
  if (filterDate) {
    const ds = filterDate.toISOString().split('T')[0];
    events = MC_DATA.events.filter(e=>e.date===ds);
    titleEl.textContent = formatDateShort(ds);
  } else {
    const today = new Date().toISOString().split('T')[0];
    events = MC_DATA.events.filter(e=>e.date>=today).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,6);
    titleEl.textContent = 'All Upcoming Events';
  }

  if (!events.length) {
    el.innerHTML = '<p style="font-size:0.82rem;color:var(--text-muted)">No events.</p>';
    return;
  }
  el.innerHTML = events.map(e=>`
    <div class="event-item">
      <div class="event-color-bar" style="background:${e.color}"></div>
      <div class="event-info">
        <div class="event-title">${e.title}</div>
        <div class="event-time">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${formatDate(e.date)} ${e.time?'· '+e.time:''}
        </div>
        ${e.location?`<div class="event-time" style="margin-top:2px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ${e.location}</div>`:''}
      </div>
    </div>
  `).join('');
}

function openAddEvent() { openModal('addEventModal'); }

function addEvent() {
  const title = document.getElementById('newEventTitle').value.trim();
  if (!title) { toast('Please enter an event title','error'); return; }
  const typeColors = { client:'#7b2ff7', internal:'#420f8a', deadline:'#e879b0', shoot:'#c9a84c' };
  const type = document.getElementById('newEventType').value;
  MC_DATA.events.push({
    id: 'e'+Date.now(),
    title,
    date:     document.getElementById('newEventDate').value,
    time:     document.getElementById('newEventTime').value,
    color:    typeColors[type]||'#7b2ff7',
    type,
    location: document.getElementById('newEventLocation').value
  });
  closeModal('addEventModal');
  renderCalendar();
  renderHome();
  toast('Event added','success');
}

// ══════════════════════════════════════════
// ANNOUNCEMENTS
// ══════════════════════════════════════════
function renderAnnouncements() {
  const sorted = [...MC_DATA.announcements].sort((a,b)=>{
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date)-new Date(a.date);
  });

  const catColors = { general:'purple', client:'cyan', admin:'gold', operations:'rose' };

  document.getElementById('announcementList').innerHTML = sorted.map(a=>`
    <div class="announcement-card ${a.pinned?'pinned':''}">
      <div class="announcement-header">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span class="badge badge--${catColors[a.category]||'grey'}">${a.category}</span>
            ${a.pinned ? '<span class="badge badge--gold">📌 Pinned</span>' : ''}
          </div>
          <div class="announcement-title">${a.title}</div>
        </div>
      </div>
      <div class="announcement-body">${a.body}</div>
      <div class="announcement-footer">
        <div class="announcement-author">
          <div style="width:24px;height:24px;border-radius:50%;background:var(--purple-200);color:var(--purple-700);display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700">${a.authorAvatar}</div>
          <span><strong>${a.author}</strong> · ${a.role}</span>
        </div>
        <span style="margin-left:auto">${formatDate(a.date)}</span>
      </div>
    </div>
  `).join('');
}

function openAddAnnouncement() { openModal('addAnnModal'); }

function addAnnouncement() {
  const title = document.getElementById('newAnnTitle').value.trim();
  const body  = document.getElementById('newAnnBody').value.trim();
  if (!title||!body) { toast('Title and body are required','error'); return; }
  MC_DATA.announcements.unshift({
    id:          'a'+Date.now(),
    title,
    body,
    author:      currentUser.name,
    authorAvatar:currentUser.avatar,
    role:        currentUser.role,
    date:        new Date().toISOString().split('T')[0],
    pinned:      document.getElementById('newAnnPinned').checked,
    category:    document.getElementById('newAnnCategory').value
  });
  closeModal('addAnnModal');
  renderAnnouncements();
  renderHome();
  document.getElementById('newAnnTitle').value='';
  document.getElementById('newAnnBody').value='';
  toast('Announcement posted','success');
}

// ══════════════════════════════════════════
// RESOURCES
// ══════════════════════════════════════════
function renderResources() {
  const catColors = { brand:'purple', templates:'cyan', sop:'gold' };
  const resources = currentResourceFilter==='all'
    ? MC_DATA.resources
    : MC_DATA.resources.filter(r=>r.category===currentResourceFilter);

  document.getElementById('resourceGrid').innerHTML = resources.map(r=>`
    <div class="resource-card" onclick="toast('${r.name} — link coming soon','info')">
      <div class="resource-icon" style="background:var(--purple-100)">${r.icon}</div>
      <div>
        <div class="resource-name">${r.name}</div>
        <div class="resource-desc">${r.desc}</div>
      </div>
      <div class="resource-meta">
        <span class="badge badge--${catColors[r.category]||'grey'}">${r.category}</span>
        <span style="margin-left:auto">Updated ${formatDateShort(r.updated)}</span>
      </div>
    </div>
  `).join('');

  // Resource filters
  document.getElementById('resourceFilterBar').addEventListener('click', e=>{
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    document.querySelectorAll('#resourceFilterBar .filter-chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    currentResourceFilter = chip.dataset.rfilter;
    renderResources();
  });
}

// ══════════════════════════════════════════
// MODAL HELPERS
// ══════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
// Click backdrop to close
document.querySelectorAll('.modal-backdrop').forEach(m=>{
  m.addEventListener('click', e=>{
    if (e.target===m) m.classList.remove('open');
  });
});

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
function toast(message, type='info') {
  const icons = { success:'✓', error:'✕', info:'i' };
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `<span style="font-weight:600">${icons[type]||'i'}</span> ${message}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(()=>el.remove(), 3000);
}

// ══════════════════════════════════════════
// SEARCH
// ══════════════════════════════════════════
document.getElementById('globalSearch').addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  if (!q) return;
  const task = MC_DATA.tasks.find(t=>t.title.toLowerCase().includes(q));
  if (task) { navigate('tasks'); return; }
  const ann = MC_DATA.announcements.find(a=>a.title.toLowerCase().includes(q)||a.body.toLowerCase().includes(q));
  if (ann) { navigate('announcements'); }
});
