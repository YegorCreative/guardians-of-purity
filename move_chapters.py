
import os

resources_path = '/Users/yegorhambaryan/Documents/2026/WebDevelopement26/guardians-of-purity/resources.html'
journey_path = '/Users/yegorhambaryan/Documents/2026/WebDevelopement26/guardians-of-purity/journey.html'

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.readlines()

def write_file(path, lines):
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

resources_lines = read_file(resources_path)
journey_lines = read_file(journey_path)

# Extract content from resources.html
# Lines 216 to 505 (1-based) -> indices 215 to 505 (exclusive in Python slice? No, inclusive end index)
# Python list is 0-indexed.
# Line 216 is index 215.
# Line 505 is index 504.
# So we want slice [215:505]
start_line = 216
end_line = 505
start_index = start_line - 1
end_index = end_line # Slice end is exclusive, so 505 means up to index 504

content_to_move = resources_lines[start_index:end_index]

# Verify we got the right content start and end
print(f"Start content: {content_to_move[0].strip()}")
print(f"End content: {content_to_move[-1].strip()}")

if "<!-- 45 Tools for Freedom -->" not in content_to_move[0]:
    # It might be the div wrapper
     print("Warning: Start line doesn't match expected comment. Checking coverage.")
     
# Prepare resources.html replacement
replacement_content = [
    '      <div class="separated_block">\n',
    '        <div class="separated_block_corner" style="padding: 2rem; text-align: center; background: var(--bg-secondary);">\n',
    '          <p style="font-size: 1.2rem; margin-bottom: 0;">Looking for chapters? <a href="journey.html" style="color: var(--accent-color); font-weight: bold; text-decoration: underline;">Visit the Journey page.</a></p>\n',
    '        </div>\n',
    '      </div>\n'
]

new_resources_lines = resources_lines[:start_index] + replacement_content + resources_lines[end_index:]

# Prepare journey.html insertion
# Find insertion point: after the hero section div.
# Hero section ends with </div> and </section> around line 137.
# We want to insert AFTER the hero section's closing div.
insertion_index = -1
for i, line in enumerate(journey_lines):
    if '<section class="journey-hero separated_block_corner">' in line:
        # Found hero start. Now find the matching closing tag for the surrounding div?
        # The hero is inside <div class="separated_block">
        # Let's find the closing </div> of that block.
        pass
    
    # We know from view_file that line 137 is the closing </div> of the hero block.
    # line 136 is </section>
    # line 135 is </div> (journey-actions)
    # line 137 is </div> (separated_block)
    # So we insert after line 137.
    if i == 137: # index 137 is line 138. Wait.
        pass

# Let's just hardcode it or find the specific string sequence
# line 122: <div class="separated_block">
# line 123: <section class="journey-hero separated_block_corner">
# ...
# line 136: </section>
# line 137: </div>
# We want to insert after line 137.

# Let's find the index of `</section>` followed by `</div>` inside main
found_hero_end = False
insert_pos = 0
for i in range(len(journey_lines)):
    if 'class="journey-hero' in journey_lines[i]:
        found_hero_end = True
    if found_hero_end and '</section>' in journey_lines[i]:
        # The next line should be the div
        if '</div>' in journey_lines[i+1]:
             insert_pos = i + 2
             break

if insert_pos == 0:
    print("Error: Could not find insertion point in journey.html")
    exit(1)

new_journey_lines = journey_lines[:insert_pos] + ['\n'] + content_to_move + ['\n'] + journey_lines[insert_pos:]

# Write files
print("Writing resources.html...")
write_file(resources_path, new_resources_lines)

print("Writing journey.html...")
write_file(journey_path, new_journey_lines)

print("Done.")

# Verify extraction
print("Extracted content excerpt:")
print("".join(content_to_move[:5]))
print("...")
print("".join(content_to_move[-5:]))
