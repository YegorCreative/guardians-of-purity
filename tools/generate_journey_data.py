import os
import re
import json
import glob

def extract_metadata(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract H1
    h1_match = re.search(r'<h1[^>]*>(.*?)<\/h1>', content, re.IGNORECASE | re.DOTALL)
    h1 = re.sub(r'\s+', ' ', h1_match.group(1)).strip() if h1_match else "NO_H1"
    
    # Extract Title Tag
    title_match = re.search(r'<title>(.*?)<\/title>', content, re.IGNORECASE)
    title = title_match.group(1).strip() if title_match else "NO_TITLE"

    return {
        "filename": filename,
        "h1": h1,
        "title_tag": title
    }

def main():
    chapters = []
    # Sort numerically by chapter number in filename
    files = sorted(glob.glob('chapter*.html'))
    
    # Filter out non-numbered chapters if any (like template)
    chapter_files = []
    for f in files:
        if re.match(r'chapter\d+\.html', f):
            chapter_files.append(f)
            
    # sort by integer
    chapter_files.sort(key=lambda x: int(re.search(r'\d+', x).group()))

    for f in chapter_files:
        meta = extract_metadata(f)
        num = int(re.search(r'\d+', f).group())
        chapters.append({
            "chapter_number": num,
            "filename": f,
            "title": meta['h1'],
            "meta_title": meta['title_tag']
        })

    output = {
        "metadata": {
            "project": "Guardians of Purity",
            "total_chapters": len(chapters)
        },
        "chapters": chapters
    }

    with open('journey-data.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"Generated journey-data.json with {len(chapters)} chapters.")

if __name__ == "__main__":
    main()
