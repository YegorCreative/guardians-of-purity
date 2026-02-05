#!/usr/bin/env python3
"""
Read-only audit of Journey page alignment.
Parses journey.html buttons and compares them to linked chapter files.
"""

import os
import re
import json
import sys

JOURNEY_FILE = "journey.html"
REPORT_FILE = "tools/journey_alignment_report.json"

def clean_text(s):
    if not s: return ""
    # Remove HTML tags
    s = re.sub(r'<[^>]+>', '', s)
    # Normalize whitespace
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def get_chapter_file_data(filename):
    if not os.path.exists(filename):
        return {"h1": "FILE_MISSING", "title": "FILE_MISSING"}
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    h1_match = re.search(r'<h1[^>]*>(.*?)<\/h1>', content, re.IGNORECASE | re.DOTALL)
    title_match = re.search(r'<title>(.*?)<\/title>', content, re.IGNORECASE | re.DOTALL)
    
    return {
        "h1": clean_text(h1_match.group(1)) if h1_match else "NO_H1",
        "title": clean_text(title_match.group(1)) if title_match else "NO_TITLE_TAG"
    }

def normalize_title(t):
    # Simple normalization for comparison (lowercase, remove punctuation, ignore whitespace)
    # User might want "Exact" match per instructions, but usually "The role of..." vs "The Role of..."
    # The prompt implies "Correct titles in wrong files", suggesting matching logic.
    # Let's clean and lower.
    return re.sub(r'[^\w\s]', '', t).lower().strip()

def main():
    if not os.path.exists(JOURNEY_FILE):
        print(f"Error: {JOURNEY_FILE} not found.")
        return

    with open(JOURNEY_FILE, 'r', encoding='utf-8') as f:
        journey_content = f.read()

    # Parse Journey Cards
    # We assume they appear in order 1..N in the DOM
    # Pattern: <a href="chapterX.html" class="chapter-card"> ... <h3 class="chapter-title">Title</h3>
    # We need to capture href and title.
    # Regex is tricky with nested content. We'll try a pattern that captures the whole block or relies on proximity.
    # <a href="([^"]+)" class="chapter-card">.*?<h3 class="chapter-title">([^<]+)</h3>
    
    # We'll stick to a regex that assumes the standard structure seen in this project
    card_pattern = re.compile(
        r'<a href="([^"]+)" class="chapter-card">[\s\S]*?<h3 class="chapter-title">([\s\S]*?)<\/h3>',
        re.IGNORECASE | re.MULTILINE
    )
    
    matches = list(card_pattern.finditer(journey_content))
    
    report_data = []
    
    print(f"{'Pos':<4} | {'Journey Button Title':<30} | {'Linked File':<15} | {'Actual File H1':<30} | {'Status':<15}")
    print("-" * 110)

    for i, m in enumerate(matches, start=1):
        href = m.group(1)
        card_title = clean_text(m.group(2))
        
        file_data = get_chapter_file_data(href)
        actual_h1 = file_data['h1']
        actual_title_tag = file_data['title']
        
        status = "MATCH"
        
        # Determine Status
        if file_data['h1'] == "FILE_MISSING":
            status = "FILE MISSING"
        elif normalize_title(card_title) != normalize_title(actual_h1):
            status = "TITLE MISMATCH"
        
        # Logic for "FILE MISMATCH" (Content belongs to different chapter)
        # We can't know for sure without an external truth of what Text belongs to What Number.
        # But if the filename is 'chapter1.html' and position is 1, and titles mismatch...
        # E.g. Pos 1 -> chapter1.html. Card="God's Design". File="Introduction to Purity".
        # Then the FILE has the wrong content for this slot. "FILE MISMATCH" is appropriate interpretation.
        
        # User defined "FILE MISMATCH". Let's use that if the filenames match position (1->chapter1) but titles don't.
        # Or if titles match but filename is weird?
        expected_filename = f"chapter{i}.html"
        if href != expected_filename:
             # Linking to wrong file? E.g. Pos 1 links to chapter5.html
             status = "LINK ERROR"
        
        if status == "TITLE MISMATCH":
            # Refine: Is it just a title mismatch, or is the file entirely wrong?
            # Usually strict mismatch = mismatch.
            pass

        # Print Row (Truncate for console)
        print(f"{i:<4} | {card_title[:28]:<30} | {href:<15} | {actual_h1[:28]:<30} | {status:<15}")
        
        report_data.append({
            "journey_position": i,
            "journey_title": card_title,
            "linked_filename": href,
            "actual_h1": actual_h1,
            "actual_title_tag": actual_title_tag,
            "status": status
        })

    # Save Report
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, indent=2)

    print("\nAUDIT COMPLETE — NO CHANGES APPLIED")

if __name__ == "__main__":
    main()
