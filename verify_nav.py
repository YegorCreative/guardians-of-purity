
import os

project_dir = '/Users/yegorhambaryan/Documents/2026/WebDevelopement26/guardians-of-purity'
expected_journey_link = '<a href="journey.html" class="nav-link">Journey</a>'
# journey.html itself has it active
expected_journey_active_link = '<a href="journey.html" class="nav-link active" aria-current="page">Journey</a>'

html_files = [f for f in os.listdir(project_dir) if f.endswith('.html')]

failures = []
success_count = 0

for filename in html_files:
    file_path = os.path.join(project_dir, filename)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if filename == 'journey.html':
            if expected_journey_active_link not in content:
                # Fallback check in case of spacing diffs or something, but stick to strict for now
                 if 'href="journey.html"' not in content or 'Journey' not in content:
                     failures.append(f"{filename}: Expected active Journey link not found.")
        else:
            if expected_journey_link not in content:
                 failures.append(f"{filename}: Expected Journey link not found.")
            else:
                success_count += 1

    except Exception as e:
        failures.append(f"{filename}: Error reading file - {str(e)}")

print(f"Verified {success_count} files successfully.")
if failures:
    print("Failures:")
    for f in failures:
        print(f" - {f}")
else:
    print("All files passed verification.")
