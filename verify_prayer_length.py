
import json
import sys

try:
    with open('data/weeklyPrayer.json', 'r') as f:
        data = json.load(f)
    
    weeks = ['first_week', 'second_week', 'third_week', 'fourth_week']
    failed = []
    
    for week in weeks:
        days = data[0].get(week, [])
        for i, day in enumerate(days):
            prayer = day.get('prayer', '')
            # Simple word count by splitting by spaces
            word_count = len(prayer.split())
            if word_count < 100:
                print(f"FAIL: {week} Day {i+1} has {word_count} words.")
                failed.append((week, i, prayer))
            else:
                pass
                # print(f"PASS: {week} Day {i+1} has {word_count} words.")

    if failed:
        print(f"\nTotal Failed: {len(failed)}")
        sys.exit(1)
    else:
        print("SUCCESS: All prayers are >= 100 words.")
        sys.exit(0)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
