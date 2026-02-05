#!/usr/bin/env python3
"""
Validate chapter files in repo root:
- chapter1.html ... chapter42.html must exist
- each must contain an <h1> title (non-empty)
- optional: check "CHAPTER X OF 42" label if present matches filename
"""

from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOTAL = 42

H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
TAG_STRIP_RE = re.compile(r"<[^>]+>")
CHAPTER_LABEL_RE = re.compile(r"CHAPTER\s+(\d+)\s+OF\s+42", re.IGNORECASE)

def clean_html_text(s: str) -> str:
    s = TAG_STRIP_RE.sub("", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def main() -> int:
    errors: list[str] = []

    for n in range(1, TOTAL + 1):
        fp = ROOT / f"chapter{n}.html"
        if not fp.exists():
            errors.append(f"Missing file: {fp.name}")
            continue

        html = fp.read_text(encoding="utf-8", errors="ignore")
        m = H1_RE.search(html)
        if not m:
            errors.append(f"{fp.name}: missing <h1>...</h1>")
            continue

        title = clean_html_text(m.group(1))
        if not title:
            errors.append(f"{fp.name}: empty <h1> title")

        # If your UI includes "CHAPTER X OF 42", ensure it matches filename
        lm = CHAPTER_LABEL_RE.search(html)
        if lm:
            label_num = int(lm.group(1))
            if label_num != n:
                errors.append(f"{fp.name}: label says CHAPTER {label_num} OF 42 (expected {n})")

    if errors:
        print("CHAPTER VALIDATION FAILED:\n" + "\n".join(f"- {e}" for e in errors))
        return 1

    print("CHAPTER VALIDATION PASSED: files + H1 titles look consistent.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
