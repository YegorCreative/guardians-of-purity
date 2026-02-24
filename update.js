const fs = require('fs');

try {
    let html = fs.readFileSync('prayer.html', 'utf8');
    const startWeb = html.indexOf('    <!-- FOR WEB WEEKLY PRAYER -->');
    const endMobile = html.indexOf('  </main>');

    const newHtml = `    <div class="separated_block monthly_prayer_guide_wrapper">
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
`;

    if (startWeb !== -1 && endMobile !== -1) {
        html = html.substring(0, startWeb) + newHtml + html.substring(endMobile);
        console.log('Replaced web and mobile layouts.');
    } else {
        console.log('Could not find layout markers.');
    }

    const startScript = html.indexOf('    // --- PRAYER JOURNEY LOGIC --- //');
    // include preceding <script>
    const actualScriptStart = html.lastIndexOf('<script>', startScript);
    const endScript = html.indexOf('</script>', startScript) + '</script>'.length;

    if (actualScriptStart !== -1 && endScript !== -1) {
        const newScript = `<script src="js/prayer.js"></script>`;
        html = html.substring(0, actualScriptStart) + newScript + html.substring(endScript);
        console.log('Replaced inline script.');
    }

    fs.writeFileSync('prayer.html', html, 'utf8');

    let css = fs.readFileSync('CSS/page/prayer.css', 'utf8');

    // generic mobile none
    const regexGen = /\.monthly_prayer_guide_wrapper_mobile\s*\{\s*display:\s*none;\s*\}/g;
    css = css.replace(regexGen, '');

    const regexMediaDesktop = /\.monthly_prayer_guide_wrapper_desktop\s*\{\s*display:\s*none;\s*\}/g;
    css = css.replace(regexMediaDesktop, '');

    const regexMediaMobile = /\.monthly_prayer_guide_wrapper_mobile\s*\{\s*display:\s*block;\s*\}/g;
    css = css.replace(regexMediaMobile, '');

    // specific elements inside media max 768px, starting with .monthly_prayer_guide_days
    // Instead of complex regex, let's append new CSS. User said "remove old mobile wrapper styles"
    // The old generic wrapper mobile styles are removed. Inside the media query, I will remove them precisely.

    // Append new unified styles
    const newCss = `

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
    flex-direction: row !important;
    gap: 10px !important;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
    margin-right: 0;
  }
}
`;
    css += newCss;
    fs.writeFileSync('CSS/page/prayer.css', css, 'utf8');
    console.log('Updated CSS.');

} catch (e) {
    console.error('Error:', e);
}
