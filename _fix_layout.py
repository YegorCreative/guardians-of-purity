#!/usr/bin/env python3
"""Fix reflection-area layout in chapters 36-39.
Move journal-box divs that follow a closing reflection-area into the reflection-area,
so the CSS grid can place them side by side."""
import re

FILES = ["chapter36.html", "chapter37.html", "chapter38.html", "chapter39.html"]

# Pattern: closing </div> of reflection-area, optional whitespace, then a journal-box
# We need to move the journal-box inside the reflection-area
pattern = re.compile(
    r'(      <div class="chapterOne-reflection-area">\s*'   # opening reflection-area
    r'<div class="chapterOne-reflect-box">.*?</div>\s*'     # reflect-box content + closing
    r')</div>\s*\n\s*'                                       # closing reflection-area </div>
    r'(<div class="chapterOne-journal-box">.*?</div>)',      # journal-box that follows
    re.DOTALL
)

for fname in FILES:
    with open(fname, "r", encoding="utf-8") as f:
        html = f.read()

    count = 0
    def replacer(m):
        global count
        count += 1
        # Put journal-box inside the reflection-area (before the closing </div>)
        return m.group(1) + "  " + m.group(2) + "\n      </div>"

    new_html = pattern.sub(replacer, html)

    if new_html != html:
        with open(fname, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"{fname}: fixed {count} reflection-area layouts")
        count = 0
    else:
        print(f"{fname}: no changes needed")
        count = 0
