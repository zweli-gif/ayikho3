
(function(){
  const KEY = 'ayikho_ab_v2';
  const existing = localStorage.getItem(KEY);
  if (existing) return;

  // 2x2 factorial: simple vs detail, video vs no-video
  const simple = Math.random() < 0.5;
  const noVid = Math.random() < 0.5;

  // Group label (A-D) just for reporting
  // A: simple+video, B: simple+noVid, C: detail+video, D: detail+noVid
  let group = 'A';
  if (simple && noVid) group = 'B';
  if (!simple && !noVid) group = 'C';
  if (!simple && noVid) group = 'D';

  const payload = { group, simple, noVid, assignedAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(payload));
})();
