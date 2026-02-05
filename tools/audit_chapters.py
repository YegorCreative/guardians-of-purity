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
TIMER_RE = re.compile(r"<section[^>]*class=[\"']reflection-timer-module[\"']", re.IGNORECASE)
POINT_1_RE = re.compile(r"<h2[^>]*>\s*1\..*?<\/h2>", re.IGNORECASE)
POINT_2_RE = re.compile(r"<h2[^>]*>\s*2\..*?<\/h2>", re.IGNORECASE)

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
        
        timer_match = TIMER_RE.search(html)
        has_timer = bool(timer_match)
        
        timer_wrong_position = False
        if has_timer:
            # Check position relative to Point 1 and Point 2
            p1_match = POINT_1_RE.search(html)
            p2_match = POINT_2_RE.search(html)
            
            # If valid structure (has points 1 and 2), check generic position
            if p1_match and p2_match:
                timer_pos = timer_match.start()
                p1_pos = p1_match.start()
                p2_pos = p2_match.start()
                
                # Ideally after Point 2. If it is between Point 1 and Point 2, that's "wrong position" (typically)
                # Strict interpretation: User said "if the timer exists but is placed after Point 1, move it to after Point 2."
                # This checks if it IS correctly after Point 2: timer_pos > p2_pos
                # So if timer_pos < p2_pos (and > p1_pos), it's "wrong".
                if timer_pos > p1_pos and timer_pos < p2_pos:
                    timer_wrong_position = True

        issues = []
        if not title:
            issues.append("Missing H1 title")
        if has_questions and not has_journal:
            issues.append("Has Questions to Reflect On but missing Your Journal input")
        if not has_timer:
            issues.append("Missing 15-Minute Break module")
        if timer_wrong_position:
            issues.append("Timer is in the wrong position (likely after Point 1, should be after Point 2)")

        report["chapters"].append({
            "number": n,
            "file": fp.name,
            "title": title,
            "checks": {
                "has_questions": has_questions,
                "has_journal": has_journal,
                "has_timer": has_timer,
                "timer_wrong_position": timer_wrong_position,
                "missing_journal_with_questions": (has_questions and not has_journal),
                "missing_timer": not has_timer
            },
            "issues": issues
        })

    out = ROOT / "tools" / "audit-report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    total_issues = sum(len(c["issues"]) for c in report["chapters"])
    print(f"Audit complete. Issues found: {total_issues}. Report: {out}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
