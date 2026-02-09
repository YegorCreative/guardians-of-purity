import json
import re

file_path = 'data/weeklyPrayer.json'
closing_line = "We pray all of this in the Name of the Son, the Father, and the Holy Spirit."

with open(file_path, 'r') as f:
    data = json.load(f)

# Data is a list containing one object with weeks
weeks_data = data[0]

for week_key in weeks_data:
    week_prayers = weeks_data[week_key]
    for day in week_prayers:
        prayer_text = day['prayer']
        
        # Remove trailing "Amen." or "Amen" with optional whitespace
        # Regex: \s*Amen\.?\s*$
        prayer_text = re.sub(r'\s*Amen\.?\s*$', '', prayer_text, flags=re.IGNORECASE)
        
        # Ensure the remaining text ends with a punctuation (likely does, but good to check)
        # Actually, usually "In Jesus' Name, I pray." was before Amen.
        # Let's just append the new line. 
        # Ideally add a space if missing.
        if not prayer_text.endswith(' '):
            prayer_text += ' '
            
        prayer_text += closing_line
        
        day['prayer'] = prayer_text

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Successfully updated prayer texts.")
