
import os

project_dir = '/Users/yegorhambaryan/Documents/2026/WebDevelopement26/guardians-of-purity'
target_string = '<a href="resources.html" class="nav-link">Journey</a>'
replacement_string = '<a href="journey.html" class="nav-link">Journey</a>'

html_files = [f for f in os.listdir(project_dir) if f.endswith('.html')]

updated_files = []
errors = []

for filename in html_files:
    file_path = os.path.join(project_dir, filename)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if target_string in content:
            new_content = content.replace(target_string, replacement_string)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated_files.append(filename)
        else:
            # Check if it's journey.html or if the link is different
            if filename == 'journey.html':
                # journey.html should have the active class, so it's expected not to match the target_string exactly if looking for the non-active one
                pass
            else:
                # Might be already updated or has different formatting?
                # Let's log it just in case, but probably fine.
                pass

    except Exception as e:
        errors.append(f"{filename}: {str(e)}")

print(f"Updated {len(updated_files)} files.")
if updated_files:
    print("Files updated:")
    for f in updated_files:
        print(f" - {f}")

if errors:
    print("\nErrors:")
    for e in errors:
        print(f" - {e}")
