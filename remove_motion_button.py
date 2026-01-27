
import os
import re

project_dir = '/Users/yegorhambaryan/Documents/2026/WebDevelopement26/guardians-of-purity'

# Regex to find the button.
# <button class="motion-toggle" id="motionToggle" aria-pressed="false" aria-label="Toggle reduced motion">
#   Reduce motion
# </button>
# It spans multiple lines. We need to be careful.
# We'll look for the specific ID and class.

# Pattern tries to match the opening button tag with id="motionToggle", content, and closing tag.
# We use dotall to match newlines.
button_pattern = re.compile(r'\s*<button[^>]*id="motionToggle"[^>]*>.*?</button>', re.IGNORECASE | re.DOTALL)

html_files = [f for f in os.listdir(project_dir) if f.endswith('.html')]

updated_files = []

for filename in html_files:
    file_path = os.path.join(project_dir, filename)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = button_pattern.sub('', content)
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated_files.append(filename)
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print(f"Removed motion toggle from {len(updated_files)} files.")
for f in updated_files:
    print(f"- {f}")
