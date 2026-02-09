import json
import re

file_path = 'data/weeklyPrayer.json'
closing_line = "We pray all of this in the Name of the Son, the Father, and the Holy Spirit."

with open(file_path, 'r') as f:
    data = json.load(f)

weeks_data = data[0]

for week_key in weeks_data:
    week_prayers = weeks_data[week_key]
    for day in week_prayers:
        prayer_text = day['prayer'].strip()
        
        # 1. Remove "Amen." variations
        prayer_text = re.sub(r'\s*Amen\.?$', '', prayer_text, flags=re.IGNORECASE)
        
        # 2. Remove the closing line if it appears once OR multiple times at the end
        # We'll validly strip it recursively or via specific regex
        while prayer_text.strip().endswith(closing_line):
             prayer_text = prayer_text.strip()[: -len(closing_line)].strip()

        # 3. Append it once properly
        prayer_text = f"{prayer_text} {closing_line}"
        
        day['prayer'] = prayer_text

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Successfully fixed and standardized prayer texts.")
