
/* Ayikho A/B App v2
   - Simple mode uses rewritten ESL content (no auto-shortening)
   - Detail mode uses expanded explanations
   - Video vs No-video is controlled by AB assignment
   - All modules are unlocked
*/
(function(){
  const AB_KEY = 'ayikho_ab_v2';

  function getAB(){
    try { return JSON.parse(localStorage.getItem(AB_KEY)||'{}'); } catch(e){ return {}; }
  }

  function setActiveNav(id){
    document.querySelectorAll('.navItem').forEach(el=>el.classList.remove('active'));
    const el = document.querySelector(`[data-nav="${id}"]`);
    if (el) el.classList.add('active');
  }

  function el(html){
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  const state = {
    profile: JSON.parse(localStorage.getItem('ayikho_profile_v2') || '{}'),
  };

  function saveProfile(){
    localStorage.setItem('ayikho_profile_v2', JSON.stringify(state.profile||{}));
  }

  function renderTopbar(){
    const ab = getAB();
    const name = (state.profile && state.profile.name) ? state.profile.name : "Mntase";
    document.getElementById('topbarName').textContent = name;
    document.getElementById('topbarAB').textContent = `AB: ${ab.group || '?'}`;
    document.getElementById('topbarMode').textContent = ab.simple ? 'Simple' : 'Detail';
    document.getElementById('topbarVid').textContent = ab.noVid ? 'No video' : 'Video';
  }

  function route(){
    const hash = location.hash || '#/start';
    const [_, first, second] = hash.split('/');
    if (first === 'start') return renderStart();
    if (first === 'home') return renderHome();
    if (first === 'module') return renderModule(second);
    if (first === 'data') return renderData();
    return renderHome();
  }

  function renderStart(){
    setActiveNav('start');
    const ab = getAB();
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(el(`
      <div class="container">
        <h1>Ayikho (A/B Test)</h1>
        <section class="card">
          <h2>Welcome</h2>
          <p class="muted">You are in a test version. We are comparing:</p>
          <ul>
            <li><strong>Simple vs Detail</strong></li>
            <li><strong>Video vs No video</strong></li>
          </ul>
          <p class="tip"><strong>WhatsApp reminders are coming soon.</strong></p>
        </section>

        <section class="card">
          <h2>Your name</h2>
          <p class="muted">This helps us personalise the experience.</p>
          <input id="nameInput" class="input" placeholder="e.g., Zandile" />
          <div class="row" style="margin-top:12px">
            <button class="btn" id="startBtn">Start learning</button>
            <button class="btn secondary" id="resetABBtn" title="For testing only">Reset A/B (device)</button>
          </div>
          <p class="small muted" style="margin-top:10px">Assigned group: <strong>${ab.group || '?'}</strong></p>
        </section>
      </div>
    `));

    // styles for input
    if (!document.getElementById('inputStyle')){
      const s = document.createElement('style');
      s.id = 'inputStyle';
      s.textContent = `.input{width:100%;padding:12px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:#0a0e13;color:var(--text);outline:none}`;
      document.head.appendChild(s);
    }

    document.getElementById('startBtn').onclick = () => {
      const name = document.getElementById('nameInput').value.trim();
      if (name) {
        state.profile = { ...state.profile, name };
        saveProfile();
      }
      renderTopbar();
      window.ayikhoTrack && window.ayikhoTrack('onboardingComplete', { nameProvided: !!name });
      location.hash = '#/home';
    };

    document.getElementById('resetABBtn').onclick = () => {
      localStorage.removeItem('ayikho_ab_v2');
      // re-run assignment by reloading ab.js
      location.reload();
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

    const cards = modules.map(m => `
      <section class="card moduleCard" onclick="location.hash='#/module/${m.id}'">
        <div class="row" style="justify-content:space-between;align-items:center">
          <div>
            <div class="badge">Module ${m.id}</div>
            <h2 style="margin-top:10px">${m.title}</h2>
            <p class="muted">⏱ ${m.mins} min</p>
          </div>
          <div class="badge">Open →</div>
        </div>
      </section>
    `).join('');

    app.appendChild(el(`
      <div class="container">
        <h1>Financial Accounting N4 · 10 Modules</h1>
        <p class="muted">All modules are unlocked in this test build.</p>
        ${cards}
      </div>
    `));

    renderTopbar();
    window.ayikhoTrack && window.ayikhoTrack('screen', { screen: 'home' });
  }

  function getContentForModule(mid){
    const ab = getAB();
    const id = String(mid);
    const simple = window.AYIKHO_SIMPLE_CONTENT && window.AYIKHO_SIMPLE_CONTENT[id];
    const detail = window.AYIKHO_DETAIL_CONTENT && window.AYIKHO_DETAIL_CONTENT[id];
    return ab.simple ? simple : detail;
  }

  function renderModule(midRaw){
    setActiveNav('home');
    const mid = parseInt(midRaw || '1', 10);
    const ab = getAB();
    const app = document.getElementById('app');
    app.innerHTML = '';

    const content = getContentForModule(mid) || '<div class="container"><p>Missing content.</p></div>';

    const videoHtml = ab.noVid ? '' : `
      <section class="card">
        <h2>Video</h2>
        <div class="videoBox">
          <p><strong>Video is enabled for this user.</strong></p>
          <p class="muted">Drop your MP4 in <code>/videos/</code> and set the URL in <code>js/video-map.js</code>.</p>
          <div class="row" style="margin-top:10px">
            <button class="btn secondary" onclick="window.open('scripts/M${String(mid).padStart(2,'0')}.md','_blank')">Open script</button>
          </div>
        </div>
      </section>
    `;

    app.appendChild(el(`
      <div class="container">
        <div class="row" style="justify-content:space-between;align-items:center">
          <button class="btn secondary" onclick="location.hash='#/home'">← Modules</button>
          <div class="row">
            <span class="badge">${ab.simple ? 'Simple' : 'Detail'}</span>
            <span class="badge">${ab.noVid ? 'No video' : 'Video'}</span>
          </div>
        </div>

        ${videoHtml}

        <div id="moduleContent">${content}</div>

        <section class="card">
          <h2>Next</h2>
          <div class="row">
            <button class="btn" onclick="location.hash='#/module/${Math.min(10, mid+1)}'">Next module →</button>
            <button class="btn secondary" onclick="location.hash='#/home'">Back to modules</button>
          </div>
          <p class="small muted" style="margin-top:10px">A/B group is fixed per device for clean testing.</p>
        </section>
      </div>
    `));

    renderTopbar();
    window.ayikhoTrack && window.ayikhoTrack('moduleOpen', { moduleId: mid });
  }

  function renderData(){
    setActiveNav('data');
    const app = document.getElementById('app');
    const events = JSON.parse(localStorage.getItem('ayikho_events_v2') || '[]');
    const ab = getAB();
    app.innerHTML = '';
    app.appendChild(el(`
      <div class="container">
        <h1>Device data (debug)</h1>
        <section class="card">
          <h2>A/B assignment</h2>
          <pre class="code">${JSON.stringify(ab, null, 2)}</pre>
        </section>
        <section class="card">
          <h2>Events (${events.length})</h2>
          <p class="muted">Stored locally in this prototype build.</p>
          <pre class="code" style="max-height:340px">${JSON.stringify(events.slice(-50), null, 2)}</pre>
          <div class="row" style="margin-top:12px">
            <button class="btn danger" onclick="localStorage.removeItem('ayikho_events_v2');location.reload()">Clear events</button>
          </div>
        </section>
      </div>
    `));
    renderTopbar();
  }

  // bootstrap
  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', () => {
    // load profile
    try { state.profile = JSON.parse(localStorage.getItem('ayikho_profile_v2')||'{}'); } catch(e){}
    renderTopbar();
    route();
  });
})();
