import json
import os
import re
import sys

def audit():
    if not os.path.exists('journey-data.json'):
        print("ERROR: journey-data.json missing. Run generate_journey_data.py first.")
        sys.exit(1)

    with open('journey-data.json', 'r') as f:
        manifest = json.load(f)

    errors = []

    print(f"Auditing {len(manifest['chapters'])} chapters...")

    for char_info in manifest['chapters']:
        fname = char_info['filename']
        expected_title = char_info['title']
        
        if not os.path.exists(fname):
            errors.append(f"MISSING FILE: {fname}")
            continue
            
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
            
        h1_match = re.search(r'<h1[^>]*>(.*?)<\/h1>', content, re.IGNORECASE | re.DOTALL)
        actual_h1 = re.sub(r'\s+', ' ', h1_match.group(1)).strip() if h1_match else "NO_H1"

        if actual_h1 != expected_title:
            errors.append(f"TITLE MISMATCH {fname}: Expected '{expected_title}', Found '{actual_h1}'")

    # Also audit Journey Page
    with open('journey.html', 'r', encoding='utf-8') as f:
        journey_content = f.read()
    
    for char_info in manifest['chapters']:
        fname = char_info['filename']
        expected_title = char_info['title']
        
        # Check if journey card matches
        pattern = re.compile(
            r'(<a href="' + re.escape(fname) + r'" class="chapter-card">[\s\S]*?<h3 class="chapter-title">)(.*?)(<\/h3>)', 
            re.IGNORECASE | re.DOTALL
        )
        match = pattern.search(journey_content)
        if match:
            card_title = match.group(2).strip()
            # Simple check, might need normalization
            if card_title != expected_title:
                 errors.append(f"JOURNEY CARD MISMATCH {fname}: Expected '{expected_title}', Found '{card_title}'")
        else:
             errors.append(f"JOURNEY CARD MISSING: {fname}")

    if errors:
        print("\nAUDIT FAILED:")
        for e in errors:
            print(f" - {e}")
        sys.exit(1)
    else:
        print("\nSUCCESS: All chapters matched manifest and Journey page.")
        sys.exit(0)

if __name__ == "__main__":
    audit()
