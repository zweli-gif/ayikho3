/* Ayikho v3 - TVET Student Ecosystem
   - Removed A/B testing, replaced with manual Summary/Detailed toggle
   - R50/month subscription messaging
   - Whiteboard video strategy
*/
(function(){
  const SUBSCRIPTION_PRICE = "R50";

  function setActiveNav(id){
    document.querySelectorAll('.navItem').forEach(el=>el.classList.remove('active'));
    const el = document.querySelector('[data-nav="'+id+'"]');
    if (el) el.classList.add('active');
  }

  function el(html){
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  const state = {
    profile: JSON.parse(localStorage.getItem('ayikho_profile_v2') || '{}'),
    viewMode: localStorage.getItem('ayikho_view_mode') || 'simple',
    currentModuleId: null
  };

  function saveProfile(){
    localStorage.setItem('ayikho_profile_v2', JSON.stringify(state.profile || {}));
  }

  function toggleViewMode() {
    state.viewMode = state.viewMode === 'simple' ? 'detail' : 'simple';
    localStorage.setItem('ayikho_view_mode', state.viewMode);
    window.ayikhoTrack && window.ayikhoTrack('modeToggle', { newMode: state.viewMode });
    if (state.currentModuleId) {
      renderModule(state.currentModuleId);
    } else {
      route();
    }
  }

  function renderTopbar(){
    const name = (state.profile && state.profile.name) ? state.profile.name : "Mntase";
    document.getElementById('topbarName').textContent = name;
    const container = document.getElementById('modeToggleContainer');
    const oldBtn = document.getElementById('modeBtn');
    if (oldBtn) oldBtn.remove();
    const btn = document.createElement('button');
    btn.id = 'modeBtn';
    btn.className = 'toggle-btn' + (state.viewMode === 'detail' ? ' detailed' : '');
    btn.textContent = state.viewMode === 'simple' ? 'Show Detailed' : 'Show Summary';
    btn.onclick = toggleViewMode;
    container.prepend(btn);
  }

  function route(){
    const hash = location.hash || '#/start';
    const parts = hash.split('/');
    const first = parts[1];
    const second = parts[2];
    state.currentModuleId = null;
    if (first === 'start') return renderStart();
    if (first === 'home') return renderHome();
    if (first === 'module') { state.currentModuleId = second; return renderModule(second); }
    if (first === 'data') return renderData();
    return renderHome();
  }

  function renderStart(){
    setActiveNav('start');
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(el(
      '<div class="container">' +
        '<h1>Welcome to Ayikho</h1>' +
        '<section class="card">' +
          '<h2>The 2-Beer Plan</h2>' +
          '<p>Get full access to detailed notes, exam predictions, and whiteboard tutorials for just <span class="sub-tag">' + SUBSCRIPTION_PRICE + ' per month</span>.</p>' +
          '<p class="small muted">That is the cost of two beers to help you pass your N4 Financial Accounting.</p>' +
        '</section>' +
        '<section class="card">' +
          '<h2>Your name</h2>' +
          '<p class="muted">Let us personalise your learning experience.</p>' +
          '<input id="nameInput" style="width:100%;padding:12px;border-radius:12px;background:#0a0e13;color:white;border:1px solid rgba(255,255,255,0.1)" placeholder="e.g., Zandile" />' +
          '<div class="row" style="margin-top:12px">' +
            '<button class="btn" id="startBtn" style="width:100%">Start Learning</button>' +
          '</div>' +
        '</section>' +
        '<section class="card">' +
          '<p class="small muted">WhatsApp reminders - coming soon</p>' +
        '</section>' +
      '</div>'
    ));
    document.getElementById('startBtn').onclick = function() {
      const name = document.getElementById('nameInput').value.trim();
      if (name) {
        state.profile = Object.assign({}, state.profile, { name: name });
        saveProfile();
      }
      renderTopbar();
      location.hash = '#/home';
    };
    renderTopbar();
    window.ayikhoTrack && window.ayikhoTrack('appOpen', { screen: 'start' });
  }

  function renderHome(){
    setActiveNav('home');
    const app = document.getElementById('app');
    app.innerHTML = '';
    const modules = [
      {id:1, title:'Accounting Concepts & Principles', mins:7},
      {id:2, title:'Double Entry & Accounting Equation', mins:8},
      {id:3, title:'Journals & Ledgers', mins:9},
      {id:4, title:'Trial Balance', mins:8},
      {id:5, title:'Cash Receipts & Payments Journals', mins:10},
      {id:6, title:'Debtors & Creditors Journals', mins:10},
      {id:7, title:'Value Added Tax (VAT)', mins:8},
      {id:8, title:'Year-End Adjustments', mins:11},
      {id:9, title:'Financial Statements', mins:12},
      {id:10, title:'Bank Reconciliation', mins:9},
    ];
    const cards = modules.map(function(m) {
      return '<section class="card moduleCard" onclick="location.hash='#/module/' + m.id + ''">' +
        '<div class="row" style="justify-content:space-between;align-items:center">' +
          '<div>' +
            '<div class="badge">Module ' + m.id + '</div>' +
            '<h2 style="margin-top:10px">' + m.title + '</h2>' +
            '<p class="muted">&#9201; ' + m.mins + ' min</p>' +
          '</div>' +
          '<div class="badge" style="color:var(--accent)">Learn &#8594;</div>' +
        '</div>' +
      '</section>';
    }).join('');
    app.appendChild(el(
      '<div class="container">' +
        '<h1>N4 Financial Accounting</h1>' +
        '<p class="muted">Toggle between Summary and Detailed notes at the top.</p>' +
        cards +
      '</div>'
    ));
    renderTopbar();
    window.ayikhoTrack && window.ayikhoTrack('screen', { screen: 'home' });
  }

  function renderModule(midRaw){
    setActiveNav('home');
    const mid = parseInt(midRaw || '1', 10);
    const app = document.getElementById('app');
    app.innerHTML = '';
    const content = state.viewMode === 'simple'
      ? (window.AYIKHO_SIMPLE_CONTENT && window.AYIKHO_SIMPLE_CONTENT[String(mid)])
      : (window.AYIKHO_DETAIL_CONTENT && window.AYIKHO_DETAIL_CONTENT[String(mid)]);
    const padded = mid < 10 ? '0' + mid : String(mid);
    app.appendChild(el(
      '<div class="container">' +
        '<div class="row" style="justify-content:space-between;align-items:center">' +
          '<button class="btn secondary" onclick="location.hash='#/home'">&#8592; Modules</button>' +
          '<span class="badge" style="border-color:var(--accent);color:var(--text)">' +
            'Mode: <strong>' + (state.viewMode === 'simple' ? 'Summary' : 'Detailed') + '</strong>' +
          '</span>' +
        '</div>' +
        '<section class="card">' +
          '<h2>Whiteboard Tutorial</h2>' +
          '<div class="videoBox">' +
            '<p class="small muted">Step-by-step visual drawing of these accounts.</p>' +
            '<button class="btn secondary" onclick="window.open('scripts/M' + padded + '.md','_blank')">View Video Script</button>' +
          '</div>' +
        '</section>' +
        '<div id="moduleContent">' + (content || '<p>Content coming soon.</p>') + '</div>' +
        '<section class="card">' +
          '<div class="row">' +
            '<button class="btn" style="flex:1" onclick="location.hash='#/module/' + Math.min(10, mid+1) + ''">Next Module &#8594;</button>' +
          '</div>' +
        '</section>' +
      '</div>'
    ));
    renderTopbar();
    window.ayikhoTrack && window.ayikhoTrack('moduleOpen', { moduleId: mid, mode: state.viewMode });
  }

  function renderData(){
    setActiveNav('data');
    const app = document.getElementById('app');
    const events = JSON.parse(localStorage.getItem('ayikho_events_v2') || '[]');
    app.innerHTML = '';
    app.appendChild(el(
      '<div class="container">' +
        '<h1>Learning Data</h1>' +
        '<section class="card">' +
          '<h2>Current Mode</h2>' +
          '<p>Viewing: <strong>' + state.viewMode.toUpperCase() + '</strong></p>' +
        '</section>' +
        '<section class="card">' +
          '<h2>Activity Log</h2>' +
          '<pre class="code" style="max-height:300px;font-size:10px">' + JSON.stringify(events.slice(-20), null, 2) + '</pre>' +
        '</section>' +
      '</div>'
    ));
    renderTopbar();
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', function() {
    renderTopbar();
    route();
  });

})();
