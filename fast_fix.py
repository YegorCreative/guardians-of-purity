import re

with open("prayer.html", "r", encoding="utf-8") as f:
    html = f.read()

html = re.sub(r"    <!-- FOR WEB WEEKLY PRAYER -->.*?</main>", """    <div class="separated_block monthly_prayer_guide_wrapper">
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
    </div>
  </main>""", html, flags=re.DOTALL)

html = re.sub(r"  <script>\n\s*// --- PRAYER JOURNEY LOGIC --- //.*?</script>", '  <script src="js/prayer.js"></script>', html, flags=re.DOTALL)

with open("prayer.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("CSS/page/prayer.css", "r", encoding="utf-8") as f:
    css = f.read()

css = re.sub(r"\.monthly_prayer_guide_wrapper_mobile\s*\{\s*display:\s*none;\s*\}", "", css)
css = re.sub(r"\.monthly_prayer_guide_wrapper_desktop\s*\{\s*display:\s*none;\s*\}", "", css)
css = re.sub(r"\.monthly_prayer_guide_wrapper_mobile\s*\{\s*display:\s*block;\s*\}", "", css)

new_css = """
/* Prayer Unified Layout v2 */
.monthly_prayer_guide_content.unified {
  display: flex !important;
  gap: 20px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .monthly_prayer_guide_content.unified {
    flex-direction: column !important;
  }

  .monthly_prayer_guide_days {
    flex-direction: row !important;
    gap: 10px !important;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px !important;
    margin-right: 0 !important;
  }
}
"""
css += new_css

with open("CSS/page/prayer.css", "w", encoding="utf-8") as f:
    f.write(css)

print("done!")
