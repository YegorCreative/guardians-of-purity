import sys
import traceback

def update_html():
    with open('prayer.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_web = -1
    for i, l in enumerate(lines):
        if '<!-- FOR WEB WEEKLY PRAYER -->' in l:
            start_web = i
            break

    end_mobile = -1
    for i, l in enumerate(lines):
        if '</main>' in l and i > start_web:
            end_mobile = i
            break

    new_html = """    <div class="separated_block monthly_prayer_guide_wrapper">
      <div class="monthly_prayer_guide_wrapper separated_block_corner">
        <div class="monthly_prayer_guide_card unified">
          <div class="monthly_prayer_guide_weeks" role="tablist" aria-label="Prayer Weeks">
            <button class="monthly_prayer_guide_week_item" role="tab" aria-selected="true" tabindex="0">Week 1</button>
            <button class="monthly_prayer_guide_week_item" role="tab" aria-selected="false" tabindex="-1">Week 2</button>
            <button class="monthly_prayer_guide_week_item" role="tab" aria-selected="false" tabindex="-1">Week 3</button>
            <button class="monthly_prayer_guide_week_item" role="tab" aria-selected="false" tabindex="-1">Week 4</button>
          </div>

          <div class="monthly_prayer_guide_content unified">
            <div class="monthly_prayer_guide_days" role="tablist" aria-label="Prayer Days"></div>

            <div class="thirty_one_day_card_wrapper separated_block_corner">
              <div class="thirty_one_day_card_block separated_block_corner">
                <span class="thirty_one_day_card_block_title top_left" id="prayerDay"></span>
                <img class="thirty_one_day_card_block_picture" src="img/heroes17.webp" alt="Selected day image" loading="lazy" />
              </div>
              <h1 class="thirty_one_day_card_title flex-center" id="prayerTitle"></h1>
              <div class="thirty_one_day_card_content flex-center" id="prayerVerse"></div>
              <h1 class="thirty_one_day_card_title with_height flex-center" id="prayerText"></h1>
              <p class="prayer-amen">Amen</p>
            </div>
          </div>
        </div>
      </div>
    </div>\n"""

    if start_web != -1 and end_mobile != -1:
        lines = lines[:start_web] + [new_html] + lines[end_mobile:]
        print('Applied HTML layout replacement.')
    else:
        print(f'Failed finding html markers {start_web} {end_mobile}')

    start_script = -1
    for i, l in enumerate(lines):
        if '// --- PRAYER JOURNEY LOGIC --- //' in l:
            start_script = i - 1
            break

    end_script = -1
    if start_script != -1:
        for i, l in enumerate(lines[start_script:]):
            if '</script>' in l:
                end_script = start_script + i
                break

    if start_script != -1 and end_script != -1:
        new_script = '  <script src="js/prayer.js"></script>\n'
        lines = lines[:start_script] + [new_script] + lines[end_script+1:]
        print('Applied Script replacement.')
    else:
        print(f'Failed finding script markers {start_script} {end_script}')

    with open('prayer.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Saved prayer.html')

def update_css():
    with open('CSS/page/prayer.css', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_mobile_none = -1
    for i, l in enumerate(lines):
        if '.monthly_prayer_guide_wrapper_mobile {' in l and i+1 < len(lines) and 'display: none;' in lines[i+1]:
            start_mobile_none = i
            break

    if start_mobile_none != -1:
        lines = lines[:start_mobile_none] + lines[start_mobile_none+3:]
        print('Removed generic mobile wrapper none style')

    start_media_desktop_none = -1
    for i, l in enumerate(lines):
        if '.monthly_prayer_guide_wrapper_desktop {' in l and i+1 < len(lines) and 'display: none;' in lines[i+1]:
            start_media_desktop_none = i
            break
            
    end_media_card = -1
    if start_media_desktop_none != -1:
        for i, l in enumerate(lines[start_media_desktop_none:]):
            if '.monthly_prayer_guide_card {' in l and i+2 < len(lines[start_media_desktop_none:]) and '}' in lines[start_media_desktop_none+i+2]:
                end_media_card = start_media_desktop_none + i + 2
                break

    if start_media_desktop_none != -1 and end_media_card != -1:
        lines = lines[:start_media_desktop_none] + lines[end_media_card+1:]
        print('Removed media query block styles')
    else:
        print(f'Failed finding CSS media query markers {start_media_desktop_none} {end_media_card}')

    new_css = """
/* Prayer Unified Layout v2 */
.monthly_prayer_guide_content.unified {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .monthly_prayer_guide_content.unified {
    flex-direction: column;
  }

  .monthly_prayer_guide_days {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
"""
    lines.append(new_css)

    with open('CSS/page/prayer.css', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Saved CSS/page/prayer.css')

try:
    update_html()
    update_css()
except Exception as e:
    traceback.print_exc()
