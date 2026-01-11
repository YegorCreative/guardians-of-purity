(function(){
  const getPageFileName = () => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const parts = String(path).split('/').filter(Boolean);
    return parts[parts.length - 1] || 'index.html';
  };

  const scopeKey = (key) => `${getPageFileName()}::${key}`;

  const safeGet = (key) => {
    try {
      const scoped = localStorage.getItem(scopeKey(key));
      if (scoped !== null) return scoped;

      const legacy = localStorage.getItem(key);
      if (legacy !== null) {
        try { localStorage.setItem(scopeKey(key), legacy); } catch {}
        return legacy;
      }

      return null;
    } catch {
      return null;
    }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(scopeKey(key), value); } catch {}
  };
  const safeRemove = (key) => {
    try { localStorage.removeItem(scopeKey(key)); } catch {}
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

  const exportReflection = () => {
    const textareas = Array.from(document.querySelectorAll('textarea'));

    const escapeForSelector = (value) => {
      if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
      return String(value).replace(/"/g, '\\"');
    };

    const parts = textareas.map((ta) => {
      const id = ta.id || '';
      const label = id ? document.querySelector(`label[for="${escapeForSelector(id)}"]`) : null;
      const labelText = label ? label.textContent.trim() : (id || ta.name || 'Reflection');
      const value = (ta.value || '').trimEnd();
      return `${labelText}\n${value}`;
    });

    const file = getPageFileName();
    const base = file.replace(/\.[^.]+$/, '');
    const fileName = `${base}-reflection.txt`;
    const content = parts.join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  window.exportReflection = exportReflection;

  const autoBind = () => bindTextareas('textarea');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoBind);
  } else {
    autoBind();
  }
})();
