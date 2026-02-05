import os
import re

total_fixed = 0

for i in range(1, 43):
    filename = f"chapter{i}.html"
    if not os.path.exists(filename):
        continue
        
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Regex to find "CHAPTER \d+ OF 42"
    # match case insensitive
    pattern = re.compile(r'(CHAPTER\s+)(\d+)(\s+OF\s+42)', re.IGNORECASE)
    
    def replace_func(match):
        # Always replace the number with the current file index 'i'
        return f"{match.group(1)}{i}{match.group(3)}"
        
    new_content, count = pattern.subn(replace_func, content)
    
    if count > 0:
        # Check if it actually changed the number
        # (subn counts matches, but we only care if it changed the text)
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed label in {filename}")
            total_fixed += 1

print(f"Total files updated: {total_fixed}")
