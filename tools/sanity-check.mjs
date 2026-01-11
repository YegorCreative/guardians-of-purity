#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);

function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function walkDir(dirAbs, out) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      await walkDir(path.join(dirAbs, entry.name), out);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      out.push(path.join(dirAbs, entry.name));
    }
  }
}

function extractIds(html) {
  const ids = new Set();
  const idAttr = /\bid\s*=\s*("([^"]+)"|'([^']+)')/gi;
  let match;
  while ((match = idAttr.exec(html))) {
    ids.add(match[2] ?? match[3] ?? '');
  }
  return ids;
}

function extractTextareas(html) {
  const textareas = [];
  const textareaOpenTag = /<textarea\b[^>]*>/gi;
  let match;
  while ((match = textareaOpenTag.exec(html))) {
    textareas.push(match[0]);
  }
  return textareas;
}

function getAttr(tag, attrName) {
  const re = new RegExp(`\\b${escapeRegExp(attrName)}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
  const m = tag.match(re);
  return m ? (m[2] ?? m[3] ?? '') : null;
}

function extractLinks(html) {
  const links = [];
  const attrRe = /\b(?:href|src)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = attrRe.exec(html))) {
    const url = (match[2] ?? match[3] ?? '').trim();
    if (url) links.push(url);
  }
  return links;
}

function isExternalUrl(url) {
  const lower = url.toLowerCase();
  return (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('data:') ||
    lower.startsWith('javascript:')
  );
}

function normalizeLocalPath(raw) {
  const withoutQuery = raw.split('?')[0];
  const withoutHash = withoutQuery.split('#')[0];
  const decoded = (() => {
    try {
      return decodeURIComponent(withoutHash);
    } catch {
      return withoutHash;
    }
  })();

  if (decoded.startsWith('/')) return decoded.slice(1);
  return decoded;
}

async function existsFile(absPath) {
  try {
    const st = await fs.stat(absPath);
    return st.isFile();
  } catch {
    return false;
  }
}

function checkRequiredScripts(html) {
  const issues = [];
  const bodyCloseIndex = html.toLowerCase().lastIndexOf('</body>');
  const searchArea = bodyCloseIndex >= 0 ? html.slice(0, bodyCloseIndex) : html;

  const hasStorage = /<script\b[^>]*\bsrc\s*=\s*("|')js\/storage\.js\1[^>]*><\/script>/i.test(searchArea);
  const hasScript = /<script\b[^>]*\bsrc\s*=\s*("|')js\/script\.js\1[^>]*><\/script>/i.test(searchArea);

  if (!hasStorage) issues.push('Missing required script include before </body>: js/storage.js');
  if (!hasScript) issues.push('Missing required script include before </body>: js/script.js');

  return issues;
}

function isChapterPage(fileAbs) {
  const base = path.basename(fileAbs);
  return /^chapter\d+\.html$/i.test(base);
}

function expectedChapterPrefix(fileAbs) {
  const base = path.basename(fileAbs, '.html');
  return `${base.toLowerCase()}-`;
}

async function checkHtmlFile(fileAbs) {
  const rel = toPosixPath(path.relative(REPO_ROOT, fileAbs));
  const html = await fs.readFile(fileAbs, 'utf8');

  const issues = [];

  // (a) scripts
  issues.push(...checkRequiredScripts(html));

  const idsInFile = extractIds(html);

  // (b) chapter rules
  if (isChapterPage(fileAbs)) {
    const hasExport = /\bonclick\s*=\s*("|')exportReflection\(\)\1/i.test(html);
    if (!hasExport) issues.push('Chapter page missing export button calling exportReflection()');

    const textareas = extractTextareas(html);
    const seenIds = new Set();
    const prefix = expectedChapterPrefix(fileAbs);

    for (const tag of textareas) {
      const id = getAttr(tag, 'id');
      if (!id) {
        issues.push('Textarea missing id attribute');
        continue;
      }

      if (seenIds.has(id)) {
        issues.push(`Duplicate textarea id: ${id}`);
      }
      seenIds.add(id);

      if (!id.toLowerCase().startsWith(prefix)) {
        issues.push(`Textarea id does not start with required prefix "${prefix}": ${id}`);
      }
    }
  }

  // (c) href/src validation
  const links = extractLinks(html);
  for (const rawUrl of links) {
    if (isExternalUrl(rawUrl)) continue;

    // pure hash links must point to an id in the same file
    if (rawUrl.startsWith('#')) {
      const targetId = rawUrl.slice(1);
      if (targetId && !idsInFile.has(targetId)) {
        issues.push(`Broken hash link: ${rawUrl} (no matching id in this file)`);
      }
      continue;
    }

    const [pathPartRaw, hashPart] = rawUrl.split('#');
    const localPath = normalizeLocalPath(pathPartRaw);

    if (!localPath) {
      // edge case: href="#id" handled above; anything else empty is ignored
      continue;
    }

    const targetAbs = path.resolve(path.dirname(fileAbs), localPath);
    const ok = await existsFile(targetAbs);
    if (!ok) {
      const display = hashPart ? `${pathPartRaw}#${hashPart}` : pathPartRaw;
      issues.push(`Broken local link: ${display} (target file not found)`);
    }
  }

  return { rel, issues };
}

async function main() {
  const htmlFiles = [];
  await walkDir(REPO_ROOT, htmlFiles);
  htmlFiles.sort();

  const results = [];
  for (const fileAbs of htmlFiles) {
    results.push(await checkHtmlFile(fileAbs));
  }

  const failed = results.filter((r) => r.issues.length > 0);
  const passedCount = results.length - failed.length;

  console.log('=== Guardians of Purity — Sanity Check ===');
  console.log(`HTML files scanned: ${results.length}`);
  console.log(`PASS: ${passedCount}`);
  console.log(`FAIL: ${failed.length}`);

  if (failed.length === 0) {
    console.log('\nAll checks passed.');
    process.exitCode = 0;
    return;
  }

  console.log('\nFailures (grouped by file):');
  for (const r of failed) {
    console.log(`\n- ${r.rel}`);
    for (const issue of r.issues) {
      console.log(`  - ${issue}`);
    }
  }

  process.exitCode = 1;
}

main().catch((err) => {
  console.error('Sanity check crashed:', err);
  process.exitCode = 2;
});
