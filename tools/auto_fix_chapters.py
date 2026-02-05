#!/usr/bin/env python3
"""
Auto-fix chapters for common consistency issues.
- Creates backups.
- Inserts missing Journal inputs in reflection sections.
- Inserts/Moves 15-Minute Break timer to after Point 2.
"""

import os
import re
import shutil
import datetime
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKUP_DIR = ROOT / "backups"
REPORT_FILE = ROOT / "tools" / "auto-fix-report.json"
TOTAL_CHAPTERS = 42

# HTML Fragments
JOURNAL_TEMPLATE = """
        <div class="chapterOne-journal-box">
        <label for="chapter{n}-journal{i}"><strong>Your Journal:</strong> What stood out to you?</label>
        <textarea id="chapter{n}-journal{i}" placeholder="Type your thoughts here..."></textarea>
      </div>"""

TIMER_HTML = """  <!-- 15-Minute Reflection Break -->
  <section class="reflection-timer-module" aria-label="15-minute reflection break">
    <h3>15-Minute Break</h3>
    <p class="timer-encouragement">Take a moment to step away and let what you've reflected on settle in your heart.</p>
    <div class="reflection-timer-display" aria-live="polite" aria-atomic="true">15:00</div>
    <div class="timer-controls">
      <button type="button" class="reflection-timer-btn btn-start">Start Timer</button>
      <button type="button" class="reflection-timer-btn btn-stop" hidden>Stop Timer</button>
      <button type="button" class="reflection-timer-btn btn-restart">Restart Timer</button>
    </div>
    <p class="timer-completion-message" aria-live="polite">Time's up. Come back when you're ready.</p>
    <div class="timer-waves" aria-hidden="true">
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="timerWaveSketchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="50%" stop-color="#a855f7" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>
    </defs>
    <path class="wave-path" d="M -10,35 C 30,85 70,85 110,35" stroke="url(#timerWaveSketchGrad)" />
    <path class="wave-path" d="M -10,45 C 35,95 65,95 110,45" stroke="url(#timerWaveSketchGrad)" />
    <path class="wave-path" d="M -10,25 C 25,80 75,80 110,25" stroke="url(#timerWaveSketchGrad)" />
    <path class="wave-path" d="M -10,55 C 40,105 60,105 110,55" stroke="url(#timerWaveSketchGrad)" />
    <path class="wave-path" d="M -10,40 C 30,90 70,90 110,40" stroke="url(#timerWaveSketchGrad)" />
  </svg>
</div>
</section>
"""

def create_backup():
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = BACKUP_DIR / f"auto-fix-{ts}"
    backup_path.mkdir(parents=True, exist_ok=True)
    print(f"Backing up chapters to {backup_path}...")
    for n in range(1, TOTAL_CHAPTERS + 1):
        fname = f"chapter{n}.html"
        src = ROOT / fname
        if src.exists():
            shutil.copy2(src, backup_path / fname)
    return backup_path

def fix_journal(content, chapter_num):
    # Find all "Questions to Reflect On" blocks
    # Logic: Find the block, check if "Your Journal" is nearby.
    # The structure is usually:
    # <div class="chapterOne-reflection-area">
    #   <div class="chapterOne-reflect-box">
    #     <h3>Questions to Reflect On</h3>
    #     ...
    #   </div>
    #   <div class="chapterOne-journal-box">...</div> (This is optional/missing)
    # </div>
    
    # We look for `class="chapterOne-reflect-box"` containing `Questions to Reflect On`
    # Then we check if the CLOSING div for that box is followed by `class="chapterOne-journal-box"`
    
    changes = []
    
    # Simple approach: Find the closing `</div>` of the reflect box, and check what's after.
    # But regex parsing HTML is fragile.
    # Let's try to match the container pattern:
    # (<div class="chapterOne-reflect-box">.*?Questions to Reflect On.*?<\/div>)
    # captured group 1 ends at the closing div of reflect box (hopefully, assuming no nested divs or using careful consumption)
    # Actually, reflect box usually just contains H3 and UL.
    
    # Safer: Look for the specific header, find the closing `</div>` of its parent `reflect-box`.
    # Then insert journal if not present.
    
    # Regex for the reflect box:
    # <div class="chapterOne-reflect-box">\s*<h3>Questions to Reflect On</h3>.*?<\/div>
    # Note: DOTALL is crucial.
    
    pattern_reflect = re.compile(
        r'(<div class="chapterOne-reflect-box">\s*<h3>Questions to Reflect On</h3>[\s\S]*?<\/div>)', 
        re.IGNORECASE
    )
    
    def replacer(match):
        block = match.group(1)
        # Look ahead in the *original content* to see if journal exists after this match
        # context: this replacer doesn't see "outside".
        # So we perform the check on the whole string essentially.
        # But `sub` is local.
        # So we return `block + JOURNAL` if needed.
        return block # Logic handled below

    # We iterate all matches manually to check context
    new_content = content
    offset = 0
    matches = list(pattern_reflect.finditer(content))
    
    # We maintain a counter for journals to give unique IDs if possible
    j_count = 1
    
    # We process from LAST to FIRST to avoid offset issues
    for m in reversed(matches):
        start, end = m.span()
        block = m.group(1)
        
        # Check surrounding (next 200 chars) for "Your Journal" or "chapterOne-journal-box"
        post_context = content[end:end+200]
        if "chapterOne-journal-box" in post_context or "Your Journal" in post_context:
            continue
            
        # It's missing!
        # Insert it.
        # Construct journal HTML
        journal_html = JOURNAL_TEMPLATE.format(n=chapter_num, i=j_count)
        # Note: IDs might collide if we aren't careful, but better than missing.
        
        new_content = new_content[:end] + "\n" + journal_html + new_content[end:]
        changes.append("Inserted missing Journal Input")
        j_count += 1
        
    return new_content, changes

def fix_timer(content):
    changes = []
    
    # 1. Check if Timer exists
    timer_match = re.search(r'<section[^>]*class=[\"\']reflection-timer-module[\"\'][\s\S]*?<\/section>', content, re.IGNORECASE)
    
    # 2. Check for Point 2 and Point 3 sections
    # They are usually `<section class="chapterOne-teaching-section" id="section2">`
    # and `<section class="chapterOne-teaching-section" id="section3">`
    
    sec2_match = re.search(r'<section[^>]*id=[\"\']section2[\"\'][^>]*>', content, re.IGNORECASE)
    sec3_match = re.search(r'<section[^>]*id=[\"\']section3[\"\'][^>]*>', content, re.IGNORECASE)
    
    if not sec2_match or not sec3_match:
        # Cannot safely place without points 2 and 3 anchors.
        return content, changes

    # Ideally we want to insert BEFORE section 3.
    target_pos = sec3_match.start()
    
    if timer_match:
        # Exists. Check position.
        # If it is already between sec2 start and sec3 start (implicit check), it's likely okay?
        # Ideally it should be strictly *after* sec2's content closes.
        # But simpler check: Is it *before* sec2 (bad) or way after (bad)?
        # User rule: "If the timer exists but is placed after Point 1, move it to after Point 2."
        # i.e., if timer.start < sec2.start, move it.
        
        t_start, t_end = timer_match.span()
        
        if t_start < sec2_match.start():
            # It's too early (after Point 1 likely). Move it.
            # Extract and remove
            timer_html = content[t_start:t_end]
            temp_content = content[:t_start] + content[t_end:]
            
            # Recalculate target_pos because we removed content
            # Re-find sec3 in temp_content
            s3_m = re.search(r'<section[^>]*id=[\"\']section3[\"\'][^>]*>', temp_content, re.IGNORECASE)
            if s3_m:
                 new_target = s3_m.start()
                 new_content = temp_content[:new_target] + timer_html + "\n\n  " + temp_content[new_target:]
                 return new_content, ["Moved Timer from wrong position to after Point 2"]
            else:
                 return content, ["Desired move failed: could not find Section 3 anchor after removal"]
        else:
            # It is after section 2 start. Assuming it is correctly placed or at least not "after point 1".
            # We leave it alone to be idempotent/safe.
            return content, []
            
    else:
        # Missing. Insert before section 3.
        new_content = content[:target_pos] + TIMER_HTML + "\n\n  " + content[target_pos:]
        return new_content, ["Inserted missing 15-Minute Break"]

    return content, changes

def main():
    backup_path = create_backup()
    report = {}
    
    for n in range(1, TOTAL_CHAPTERS + 1):
        fname = f"chapter{n}.html"
        fpath = ROOT / fname
        if not fpath.exists():
            continue
            
        with open(fpath, 'r', encoding='utf-8') as f:
            original = f.read()
            
        current = original
        file_actions = []
        
        # 1. Journal Fix
        current, j_changes = fix_journal(current, n)
        file_actions.extend(j_changes)
        
        # 2. Timer Fix
        current, t_changes = fix_timer(current)
        file_actions.extend(t_changes)
        
        if file_actions:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(current)
            report[fname] = file_actions
            print(f"Fixed {fname}: {', '.join(file_actions)}")
        else:
            # print(f"No changes for {fname}")
            pass
            
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
        
    print(f"Auto-fix complete. Report saved to {REPORT_FILE}")

if __name__ == "__main__":
    main()
