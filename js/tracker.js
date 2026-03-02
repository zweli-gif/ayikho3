
(function(){
  const KEY = 'ayikho_events_v2';
  function getAB(){
    try { return JSON.parse(localStorage.getItem('ayikho_ab_v2')||'{}'); } catch(e){ return {}; }
  }
  function push(evt){
    const ab = getAB();
    const enriched = {
      ...evt,
      abGroup: ab.group || null,
      abSimple: !!ab.simple,
      abNoVid: !!ab.noVid,
      ts: Date.now()
    };
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(enriched);
    if (arr.length > 1000) arr.splice(0, arr.length-1000);
    localStorage.setItem(KEY, JSON.stringify(arr));
  }
  window.ayikhoTrack = function(type, data){
    push({ type, ...data });
  };
})();
