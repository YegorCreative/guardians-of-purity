(function(){
  const safeGet = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch {}
  };
  const safeRemove = (key) => {
    try { localStorage.removeItem(key); } catch {}
  };

  const bindTextareas = (selector) => {
    document.querySelectorAll(selector).forEach((ta) => {
      const key = ta.id || ta.name;
      if (!key) return;
      const saved = safeGet(key);
      if (saved !== null) ta.value = saved;
      ta.addEventListener('input', () => safeSet(key, ta.value));
    });
  };

  window.AppStorage = {
    get: safeGet,
    set: safeSet,
    remove: safeRemove,
    bindTextareas,
  };
})();
