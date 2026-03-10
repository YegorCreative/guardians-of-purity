(function(){
  const JOURNAL_HELPER_TEXT = 'Saved automatically on this device.';
  const JOURNAL_SAVED_TEXT = 'Saved just now.';

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

  const setJournalStatus = (textarea, message) => {
    const journalBox = textarea.closest('.chapterOne-journal-box');
    if (!journalBox) return;

    const status = journalBox.querySelector('.chapterOne-journal-status');
    if (!status) return;
    status.textContent = message;
  };

  const enhanceJournalField = (textarea) => {
    const journalBox = textarea.closest('.chapterOne-journal-box');
    if (!journalBox) return;

    const label = journalBox.querySelector('label');
    if (label && !journalBox.querySelector('.chapterOne-journal-helper')) {
      const helper = document.createElement('p');
      helper.className = 'chapterOne-journal-helper';
      helper.textContent = JOURNAL_HELPER_TEXT;
      label.insertAdjacentElement('afterend', helper);
    }

    if (!journalBox.querySelector('.chapterOne-journal-status')) {
      const status = document.createElement('p');
      status.className = 'chapterOne-journal-status';
      status.setAttribute('aria-live', 'polite');
      status.textContent = JOURNAL_HELPER_TEXT;
      textarea.insertAdjacentElement('afterend', status);
    }
  };

  const enhanceChapterJournalUi = () => {
    document.querySelectorAll('.chapterOne-journal-box textarea').forEach((textarea) => {
      enhanceJournalField(textarea);

      const key = textarea.id || textarea.name;
      if (!key) return;

      const saved = safeGet(key);
      if (saved !== null && saved.trim()) {
        setJournalStatus(textarea, 'Previously saved on this device.');
      }
    });

    document.querySelectorAll('.chapterOne-export-button, button[onclick*="exportReflection"]').forEach((button) => {
      button.textContent = 'Export Saved Reflections';
      button.setAttribute('title', 'Export saved reflections');
      button.setAttribute('aria-label', 'Export saved reflections');
    });
  };

  const bindTextareas = (selector) => {
    document.querySelectorAll(selector).forEach((ta) => {
      const key = ta.id || ta.name;
      if (!key) return;
      enhanceJournalField(ta);
      const saved = safeGet(key);
      if (saved !== null) ta.value = saved;
      ta.addEventListener('input', () => {
        safeSet(key, ta.value);
        setJournalStatus(ta, JOURNAL_SAVED_TEXT);
      });
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

  const autoBind = () => {
    bindTextareas('textarea');
    enhanceChapterJournalUi();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoBind);
  } else {
    autoBind();
  }
})();
