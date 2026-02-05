#!/usr/bin/env python3
"""
Audit chapters for common consistency issues.
Outputs: tools/audit-report.json
"""

from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOTAL = 42

H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
TAG_STRIP_RE = re.compile(r"<[^>]+>")
QUESTION_BLOCK_RE = re.compile(r"Questions to Reflect On", re.IGNORECASE)
JOURNAL_INPUT_RE = re.compile(r"Your Journal", re.IGNORECASE)
TIMER_RE = re.compile(r"15-Minute Break", re.IGNORECASE)

def clean(s: str) -> str:
    s = TAG_STRIP_RE.sub("", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def extract_h1(html: str) -> str:
    m = H1_RE.search(html)
    return clean(m.group(1)) if m else ""

def main() -> int:
    report = {"chapters": []}

    for n in range(1, TOTAL + 1):
        fp = ROOT / f"chapter{n}.html"
        html = fp.read_text(encoding="utf-8", errors="ignore")
        title = extract_h1(html)

        has_questions = bool(QUESTION_BLOCK_RE.search(html))
        has_journal = bool(JOURNAL_INPUT_RE.search(html))
        has_timer = bool(TIMER_RE.search(html))

        issues = []
        if not title:
            issues.append("Missing H1 title")
        if has_questions and not has_journal:
            issues.append("Has Questions to Reflect On but missing Your Journal input")
        if not has_timer:
            issues.append("Missing 15-Minute Break module")

        report["chapters"].append({
            "number": n,
            "file": fp.name,
            "title": title,
            "checks": {
                "has_questions": has_questions,
                "has_journal": has_journal,
                "has_timer": has_timer,
            },
            "issues": issues
        })

    out = ROOT / "tools" / "audit-report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    # Exit non-zero if issues exist (optional). For now, keep it informational:
    total_issues = sum(len(c["issues"]) for c in report["chapters"])
    print(f"Audit complete. Issues found: {total_issues}. Report: {out}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
