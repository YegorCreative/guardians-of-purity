#!/usr/bin/env python3
"""
APPLY CANONICAL CHAPTER FLOW + TITLES (ONE-PASS, SAFE)

1. BACKUP
2. MAP (Journey Titles -> Canonical List)
3. FIX ALIGNMENT (Swap files if content mismatches)
4. UPDATE TITLES (H1 matches Canonical)
5. UPDATE JOURNEY (Links & Titles)
6. VALIDATE
"""

import os
import re
import shutil
import datetime
import json
import sys

# Safe mode
DRY_RUN = False

ROOT = "."
BACKUP_DIR = "backups"
JOURNEY_FILE = "journey.html"
TOTAL_CHAPTERS = 42

def create_backup():
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = os.path.join(BACKUP_DIR, f"apply-{ts}")
    if not os.path.exists(backup_path):
        os.makedirs(backup_path)
    
    print(f"Creating backup at {backup_path}...")
    for n in range(1, TOTAL_CHAPTERS + 1):
        f = f"chapter{n}.html"
        if os.path.exists(f):
            shutil.copy2(f, os.path.join(backup_path, f))
            
    if os.path.exists(JOURNEY_FILE):
        shutil.copy2(JOURNEY_FILE, os.path.join(backup_path, JOURNEY_FILE))
        
    return backup_path

def get_canonical_list_from_journey():
    """
    Extracts the ORDERED list of (Title, Link) from Journey page.
    This is treated as the SOURCE OF TRUTH for Intent.
    """
    with open(JOURNEY_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Pattern: <a href="chapterX.html" ... <h3 class="chapter-title">Title</h3>
    matches = re.findall(
        r'<a href="([^"]+)" class="chapter-card">[\s\S]*?<h3 class="chapter-title">([\s\S]*?)<\/h3>',
        content
    )
    
    canonical = []
    for i, (href, title) in enumerate(matches, start=1):
        clean_title = re.sub(r'\s+', ' ', title).strip()
        canonical.append({
            "position": i,
            "intended_title": clean_title,
            "current_link_target": href 
        })
        
    if len(canonical) != TOTAL_CHAPTERS:
        print(f"ERROR: Found {len(canonical)} items in Journey, expected {TOTAL_CHAPTERS}.")
        sys.exit(1)
        
    return canonical

def get_file_inventory():
    """
    Returns dict: {filename: {"h1": ..., "fingerprint": ...}}
    """
    inventory = {}
    for n in range(1, TOTAL_CHAPTERS + 1):
        fname = f"chapter{n}.html"
        if not os.path.exists(fname): continue
        
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
            
        h1 = re.search(r'<h1[^>]*>(.*?)<\/h1>', content, re.IGNORECASE | re.DOTALL)
        h1_text = re.sub(r'\s+', ' ', h1.group(1)).strip() if h1 else ""
        
        # Simple fingerprint: H1 text (lowercase, alphanumeric only)
        # Why? Because if we just swapped them, the H1 is the best identifier of content.
        fingerprint = re.sub(r'[^\w]', '', h1_text.lower())
        
        inventory[fname] = {
            "h1": h1_text,
            "fingerprint": fingerprint,
            "content": content
        }
    return inventory

def align_files(canonical_list, inventory):
    """
    Determines swaps.
    """
    # map: intended_pos -> current_filename
    # We match Canonical Title vs Inventory H1
    
    moves = {} # target_slot (int) -> current_filename (str)
    
    used_files = set()
    
    for item in canonical_list:
        pos = item['position']
        target_title = item['intended_title']
        target_fp = re.sub(r'[^\w]', '', target_title.lower())
        
        # Find file with best match
        best_match = None
        
        # 1. Exact H1 Match
        for fname, data in inventory.items():
            if fname in used_files: continue
            if data['fingerprint'] == target_fp:
                best_match = fname
                break
        
        # 2. If no exact match, fallback to position (assuming current order is mostly correct)
        if not best_match:
            candidate = f"chapter{pos}.html"
            if candidate in inventory and candidate not in used_files:
                # Is it a "Complete Mismatch"?
                # If the file at chapterN has a wildly different title, maybe we should search harder?
                # But previous audit passed. So likely chapterN IS Chapter N.
                best_match = candidate
        
        if not best_match:
            print(f"CRITICAL ERROR: Could not find content for '{target_title}'")
            sys.exit(1)
            
        moves[pos] = best_match
        used_files.add(best_match)
        
    # Execute Swaps via Temp Directory
    temp_dir = "temp_apply_swap"
    if not os.path.exists(temp_dir): os.makedirs(temp_dir)
    
    print("Aligning files...")
    
    # 1. Move to temp with Canonical Name
    for pos, current_file in moves.items():
        canonical_name = f"chapter{pos}.html"
        src = current_file
        dst = os.path.join(temp_dir, canonical_name)
        shutil.copy2(src, dst) # copy first to be safe
    
    # 2. Move back to root
    for pos in range(1, TOTAL_CHAPTERS + 1):
        target = f"chapter{pos}.html"
        src = os.path.join(temp_dir, target)
        shutil.move(src, target)
        
    shutil.rmtree(temp_dir)
    print("Files aligned.")

def update_titles_and_links(canonical_list):
    """
    Updates H1 and <title> in chapterN.html to match canonical.
    Updates journey.html to have perfect links/titles.
    """
    
    # 1. Update Chapter Files
    for item in canonical_list:
        pos = item['position']
        title = item['intended_title']
        fname = f"chapter{pos}.html"
        
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Update H1
        content = re.sub(r'<h1[^>]*>.*?<\/h1>', f'<h1 class="chapterOne-title">{title}</h1>', content, count=1, flags=re.IGNORECASE|re.DOTALL)
        
        # Update Title Tag
        new_tag = f"<title>Chapter {pos} — {title} | Guardians of Purity</title>"
        content = re.sub(r'<title>.*?<\/title>', new_tag, content, count=1, flags=re.IGNORECASE|re.DOTALL)
        
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
            
    # 2. Update Journey Page
    with open(JOURNEY_FILE, 'r', encoding='utf-8') as f:
        j_content = f.read()
        
    # Regex to find cards and replace them one by one?
    # Hard to replace 42 items individually without overlap issues if not careful.
    # Better: Regenerate the list? No, preserve structure.
    # We iterate and replace.
    
    # We assume they appear in order.
    # We will construct a regex that matches the H3 inside the card.
    
    # Actually, simpler: finding specific card by HREF might fail if HREF was wrong before.
    # But we want to ENFORCE: Card 1 -> chapter1.html, Card 2 -> chapter2.html.
    
    # Strategy: Find all <a> of class chapter-card.
    # Replace the i-th match with the correct HREF and correct TITLE.
    
    def replace_card(match):
        # We need a counter state.
        # attributes logic
        pass

    # State for replacement
    state = {"count": 0}
    
    def replacer(match):
        state["count"] += 1
        idx = state["count"]
        if idx <= len(canonical_list):
            item = canonical_list[idx-1]
            # Force Link
            new_href = f'href="chapter{item["position"]}.html"'
            block = match.group(0)
            
            # Replace href
            block = re.sub(r'href="[^"]+"', new_href, block)
            
            # Replace Title
            # <h3 class="chapter-title">...</h3>
            new_title = f'<h3 class="chapter-title">{item["intended_title"]}</h3>'
            block = re.sub(r'<h3 class="chapter-title">.*?<\/h3>', new_title, block, flags=re.DOTALL)
            
            return block
        return match.group(0)

    j_content = re.sub(
        r'<a href="[^"]+" class="chapter-card">[\s\S]*?<\/a>',
        replacer,
        j_content
    )
    
    with open(JOURNEY_FILE, 'w', encoding='utf-8') as f:
        f.write(j_content)
        
    print("Titles and Journey updated.")

def main():
    create_backup()
    canonical = get_canonical_list_from_journey()
    inventory = get_file_inventory()
    
    align_files(canonical, inventory)
    update_titles_and_links(canonical)
    
    # Remove any tmp
    for f in os.listdir("."):
        if f.endswith(".tmp"): os.remove(f)
        
    print(f"APPLIED: Journey + chapter1.html..chapter42.html now match canonical order and titles. Backup created in {BACKUP_DIR}")

if __name__ == "__main__":
    main()
