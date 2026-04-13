#!/usr/bin/env python3
"""Rewrite chapter35.html with new content."""

path = "chapter35.html"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Title tag
content = content.replace(
    "Chapter 35 \u2014 God\u2019s Patience with You | Guardians of Purity",
    "Chapter 35 \u2014 The Role of Fasting in Breaking Addictions | Guardians of Purity"
)

# 2. Replace hero section
old_hero = content[content.index("<!-- section 1 -->"):content.index("<!-- section 2 parable -->")]
new_hero = """<!-- section 1 -->
  <section class="chapterOne-section" id="main">
    <div class="chapterOne-overlay">
      <div class="chapterOne-content">
        <h1 class="chapterOne-title">The Role of Fasting in Breaking Addictions</h1>
        <div class="chapterOne-verse-container">
          <p class="chapterOne-verse">\u201cIs not this the kind of fasting I have chosen: to loose the chains of injustice and untie the cords of the yoke, to set the oppressed free and break every yoke?\u201d</p>
          <span class="chapterOne-verseRef">\u2014 Isaiah 58:6</span>
        </div>
        <p class="chapterOne-quote">
          What we constantly fill ourselves with can leave us empty. But when we create space, we can finally receive what truly satisfies.
        </p>
      </div>
    </div>
  </section>

  """
content = content.replace(old_hero, new_hero)

# 3. Replace parable section
old_parable = content[content.index("<!-- section 2 parable -->"):content.index("<!-- Introduction -->")]
new_parable = """<!-- section 2 parable -->
  <section class="chapterOne-parable-section">
    <div class="chapterOne-parable-container">
      <h2 class="chapterOne-parable-title">Parable: The Cleared Bowl</h2>
      <!-- VISUAL PROMPT: A small fox sitting beside a simple wooden bowl tipped over in the dirt, a wise crane pouring clear water from above, soft forest light, muted earth tones and greens, minimal composition, slight film grain, contemplative mood about emptying to receive what truly satisfies -->

      <div class="chapterOne-parable-body">
        <div class="chapterOne-parable-image">
          <img src="img/chapterAssets/chapter35.webp" alt="A small fox beside a wooden bowl as a crane pours clear water" loading="lazy" />
        </div>
        <p class="chapterOne-paragraph">
          There was a small fox who kept a wooden bowl near his den.
        </p>
        <p class="chapterOne-paragraph">
          Each day, he filled it with whatever he found\u2014berries, scraps, and things that looked good in the moment. Yet no matter how much he added, he was never satisfied. The bowl was always cluttered, and he always wanted more.
        </p>
        <p class="chapterOne-paragraph">
          One day, a wise crane landed beside him and said, \u201cYour bowl is full, but you are not.\u201d
        </p>
        <p class="chapterOne-paragraph">
          The fox frowned. \u201cThen what should I do?\u201d
        </p>
        <p class="chapterOne-paragraph">
          \u201cEmpty it.\u201d
        </p>
        <p class="chapterOne-paragraph">
          Reluctantly, the fox tipped the bowl over. Everything spilled into the dirt. At first, the emptiness made him restless. He paced, unsure of what to do with himself.
        </p>
        <p class="chapterOne-paragraph">
          But as he waited, the crane returned\u2014this time carrying clear water. She poured it slowly into the empty bowl.
        </p>
        <p class="chapterOne-paragraph">
          The fox drank. It was simple. Clean. Enough. And for the first time, he felt full.
        </p>
      </div>

      <div class="chapterOne-moral-box">
        <strong>Moral:</strong><br />
        What we constantly fill ourselves with can leave us empty. But when we create space, we can finally receive what truly satisfies.
      </div>
    </div>
  </section>

  """
content = content.replace(old_parable, new_parable)

# 4. Replace Introduction
old_intro = content[content.index("<!-- Introduction -->"):content.index("<!-- Section 1 -->")]
new_intro = """<!-- section 3 teaching 1 -->
  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">Introduction: Fasting as a Spiritual Weapon</h2>

      <p class="chapterOne-teaching-text">
        Fasting is a powerful spiritual discipline that strengthens your relationship with God and helps you break free from destructive habits and addictions. It is not merely about abstaining from food or certain activities\u2014it\u2019s about redirecting your focus to God, denying the flesh, and aligning your desires with His will. In this chapter, we\u2019ll explore how fasting can help you overcome pornography, masturbation, and other struggles, while renewing your heart and mind.
      </p>

      <div class="chapterOne-journal-box">
        <label for="journal1"><strong>Your Journal:</strong> What stood out to you?</label>
        <textarea id="journal1" placeholder="Type your thoughts here..."></textarea>
      </div>
    </div>
  </section>


  """
content = content.replace(old_intro, new_intro)

# 5. Replace Section 1
old_s1 = content[content.index("<!-- Section 1 -->"):content.index("<!-- Section 2 -->")]
new_s1 = """<!-- section 3 teaching 2 -->
  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">1. What is Fasting?</h2>
      <p class="chapterOne-teaching-text">
        Fasting is the voluntary abstinence from food, entertainment, or other comforts to draw closer to God and focus on prayer and spiritual growth.
      </p>

      <ul class="chapterOne-bullets">
        <li><strong>Definition:</strong> Fasting is the voluntary abstinence from food, entertainment, or other comforts to draw closer to God and focus on prayer and spiritual growth.</li>
        <li><strong>Purpose of Fasting:</strong> To deny the flesh and strengthen the spirit. To seek God\u2019s guidance, healing, and breakthrough. To humble yourself before God and prioritize His presence over worldly desires.</li>
      </ul>

      <blockquote class="chapterOne-scripture">
        \u201cBut when you fast, put oil on your head and wash your face, so that it will not be obvious to others that you are fasting, but only to your Father, who is unseen; and your Father, who sees what is done in secret, will reward you.\u201d<br />
        <span class="chapterOne-verseRef">\u2014 Matthew 6:17-18</span>
      </blockquote>

      <div class="chapterOne-reflection-area">
        <div class="chapterOne-reflect-box">
          <h3>Questions to Reflect On</h3>
          <ol>
            <li>How do you currently view fasting in your spiritual life?</li>
            <li>What are some areas in your life where you need breakthrough or healing?</li>
            <li>How can fasting help you refocus on God and surrender your struggles to Him?</li>
          </ol>
        </div>
        <div class="chapterOne-journal-box">
          <label for="journal2"><strong>Your Journal:</strong> What stood out to you?</label>
          <textarea id="journal2" placeholder="Type your thoughts here..."></textarea>
        </div>
      </div>
    </div>
  </section>

  """
content = content.replace(old_s1, new_s1)

# 6. Replace Section 2 up to timer
old_s2 = content[content.index("<!-- Section 2 -->"):content.index("<!-- 15-Minute Reflection Break -->")]
new_s2 = """<!-- section 3 teaching 3 -->
  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">2. The Connection Between Fasting and Addiction</h2>
      <p class="chapterOne-teaching-text">
        Addiction thrives when the flesh is in control. Fasting helps you break its power and submit to God\u2019s will.
      </p>

      <ul class="chapterOne-bullets">
        <li><strong>Denying the Flesh:</strong> Addiction thrives when the flesh is in control. Fasting helps you break the power of your physical desires and submit to God\u2019s will.</li>
        <li><strong>Heightened Awareness:</strong> Fasting increases your sensitivity to the Holy Spirit, making you more aware of areas in your life that need healing.</li>
        <li><strong>Breaking Spiritual Strongholds:</strong> Fasting is a tool for spiritual warfare, allowing you to confront and break the chains of addiction through prayer and dependence on God.</li>
      </ul>

      <blockquote class="chapterOne-scripture">
        Jesus fasted for 40 days before confronting Satan\u2019s temptations in the wilderness.<br />
        <span class="chapterOne-verseRef">\u2014 Matthew 4:1-11</span>
      </blockquote>

      <div class="chapterOne-action-box">
        <h3>Do This Now</h3>
        <p>Write down one struggle or addiction you want to surrender to God through fasting. Commit to seeking Him in this area during your next fast.</p>
      </div>

      <div class="chapterOne-journal-box">
        <label for="journal3"><strong>Your Journal:</strong> What stood out to you?</label>
        <textarea id="journal3" placeholder="Type your thoughts here..."></textarea>
      </div>
    </div>
  </section>
  """
content = content.replace(old_s2, new_s2)

# 7. Replace Section 3
old_s3 = content[content.index("<!-- Section 3 -->"):content.index("<!-- Section 4 -->")]
new_s3 = """<!-- section 3 teaching 4 -->
  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">3. Types of Fasting</h2>
      <p class="chapterOne-teaching-text">
        Fasting can take many forms. Choose a type of fast that aligns with your spiritual goals and physical ability.
      </p>

      <ul class="chapterOne-bullets">
        <li><strong>Food Fasts:</strong> Complete Fast: Abstaining from all food and drinking only water. Partial Fast: Skipping certain meals or abstaining from specific foods (e.g., Daniel Fast).</li>
        <li><strong>Entertainment Fasts:</strong> Abstaining from social media, television, gaming, or other forms of entertainment.</li>
        <li><strong>Combination Fasts:</strong> Combining food fasting with other forms of abstinence to eliminate distractions and focus on God.</li>
      </ul>

      <div class="chapterOne-reflection-area">
        <div class="chapterOne-reflect-box">
          <h3>Questions to Reflect On</h3>
          <ol>
            <li>What type of fast can you realistically commit to?</li>
            <li>How can you use the time you would normally spend eating or on entertainment to focus on prayer and Scripture?</li>
            <li>Who can support or pray for you during your fast?</li>
          </ol>
        </div>
        <div class="chapterOne-journal-box">
          <label for="journal4"><strong>Your Journal:</strong> What stood out to you?</label>
          <textarea id="journal4" placeholder="Type your thoughts here..."></textarea>
        </div>
      </div>
    </div>
  </section>

  """
content = content.replace(old_s3, new_s3)

# 8. Replace Section 4
old_s4 = content[content.index("<!-- Section 4 -->"):content.index("<!-- Section 5 -->")]
new_s4 = """<!-- section 3 teaching 5 -->
  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">4. Practical Steps for Effective Fasting</h2>
      <p class="chapterOne-teaching-text">
        Effective fasting requires preparation and intentionality.
      </p>

      <ul class="chapterOne-bullets">
        <li><strong>Prepare Your Heart:</strong> Spend time in prayer and ask God to reveal the purpose of your fast.</li>
        <li><strong>Set Clear Goals:</strong> Identify specific areas where you need healing, breakthrough, or direction.</li>
        <li><strong>Schedule Time for Prayer and Scripture:</strong> Use the time you\u2019re fasting to seek God\u2019s presence and fill your mind with His Word.</li>
        <li><strong>Start Small:</strong> If you\u2019re new to fasting, begin with shorter fasts and gradually increase the duration.</li>
      </ul>

      <div class="chapterOne-action-box">
        <h3>Do This Now</h3>
        <p>Write a prayer asking God to guide you in fasting and reveal His will for your life during the process.</p>
      </div>

      <div class="chapterOne-journal-box">
        <label for="journal5"><strong>Your Journal:</strong> What stood out to you?</label>
        <textarea id="journal5" placeholder="Type your thoughts here..."></textarea>
      </div>
    </div>
  </section>

  """
content = content.replace(old_s4, new_s4)

# 9. Replace Section 5 + old prayer through to export
old_s5_start = content.index("<!-- Section 5 -->")
old_s5_end = content.index("<!-- button for downloading reflection -->")
old_s5 = content[old_s5_start:old_s5_end]
new_s5 = """<!-- section 3 teaching 6 -->
  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">5. Staying Focused During Your Fast</h2>
      <p class="chapterOne-teaching-text">
        Staying focused during a fast requires intentionality and reliance on God\u2019s strength.
      </p>

      <ul class="chapterOne-bullets">
        <li><strong>Avoid Temptation:</strong> Eliminate distractions or environments that might lead you back to old habits.</li>
        <li><strong>Pray Through Cravings:</strong> When you feel tempted or weak, turn to God in prayer instead of giving in to your cravings.</li>
        <li><strong>Lean on Scripture:</strong> Memorize and meditate on verses that remind you of God\u2019s strength and promises.</li>
      </ul>

      <blockquote class="chapterOne-scripture">
        \u201cI can do all this through Him who gives me strength.\u201d<br />
        <span class="chapterOne-verseRef">\u2014 Philippians 4:13</span>
      </blockquote>

      <blockquote class="chapterOne-scripture">
        \u201cResist the devil, and he will flee from you.\u201d<br />
        <span class="chapterOne-verseRef">\u2014 James 4:7</span>
      </blockquote>

      <div class="chapterOne-reflection-area">
        <div class="chapterOne-reflect-box">
          <h3>Questions to Reflect On</h3>
          <ol>
            <li>How can you replace cravings or temptations with prayer during your fast?</li>
            <li>What Scripture verses can you focus on to strengthen your resolve?</li>
            <li>How will you remind yourself of the spiritual purpose behind your fast?</li>
          </ol>
        </div>
        <div class="chapterOne-journal-box">
          <label for="journal6"><strong>Your Journal:</strong> What stood out to you?</label>
          <textarea id="journal6" placeholder="Type your thoughts here..."></textarea>
        </div>
      </div>
    </div>
  </section>

  <section class="chapterOne-teaching-section">
    <div class="chapterOne-teaching-container">
      <h2 class="chapterOne-teaching-title">6. Moving Forward After the Fast</h2>
      <p class="chapterOne-teaching-text">
        The end of a fast is not the end of the journey\u2014it\u2019s a new beginning.
      </p>

      <ul class="chapterOne-bullets">
        <li><strong>Reflect on What You Learned:</strong> Journal your experiences, insights, and breakthroughs during the fast.</li>
        <li><strong>Continue the Journey:</strong> Use the spiritual momentum from your fast to establish long-term habits of prayer, Scripture, and accountability.</li>
        <li><strong>Praise God for His Faithfulness:</strong> Thank God for the work He has done in you and continue to seek His guidance.</li>
      </ul>

      <blockquote class="chapterOne-scripture">
        \u201cYou will seek Me and find Me when you seek Me with all your heart.\u201d<br />
        <span class="chapterOne-verseRef">\u2014 Jeremiah 29:13</span>
      </blockquote>

      <div class="chapterOne-journal-box">
        <label for="journalFinal"><strong>Your Journal:</strong> What stood out to you?</label>
        <textarea id="journalFinal" placeholder="Type your thoughts here..."></textarea>
      </div>
    </div>
  </section>

  <!-- section 5 prayer section -->
  <section class="chapterOne-prayer-section">
    <div class="chapterOne-prayer-container">
      <h2 class="chapterOne-prayer-title">Prayer <i class="fa-solid fa-hands-praying" aria-hidden="true"></i></h2>
      <p class="chapterOne-prayer-text">
        Heavenly Father, Thank You for the gift of fasting and the opportunity it provides to grow closer to You. I ask for Your strength and guidance as I commit to fasting to break the chains of addiction and align my heart with Your will. Help me to focus on Your Word and rely on Your power when I feel weak. Thank You for the breakthroughs You will bring as I surrender my struggles to You. In Jesus\u2019 name, I pray. Amen.
      </p>
    </div>
  </section>

  """
content = content.replace(old_s5, new_s5)

# 10. Fix export section
content = content.replace(
    "You've Completed Chapter 19",
    "You\u2019ve Completed Chapter 35"
)
content = content.replace(
    "You've completed Chapter 19. Faithful conversations plant seeds that God Himself grows. Trust that love,\n        patience, and prayer are never wasted.",
    "Well done. When we create space through fasting, God fills us with what truly satisfies. Keep seeking Him."
)

# 11. Fix summary
old_summary = """<ul class="chapterOne-summary-list">
        <li>Love opens doors shame cannot</li>
        <li>Conversation breaks secrecy</li>
        <li>Truth replaces fear</li>
        <li>Grace fuels healing</li>
        <li>Prayer anchors the family</li>
      </ul>

      <div class="chapterOne-reflection-question">
        <strong>Final Reflection:</strong>
        How can you become a safer, more grace-filled guide for your child?
      </div>

      <div class="chapterOne-journal-box">
        <label for="chapter19-journal7"><strong>Your Summary:</strong> What is your biggest takeaway?</label>
        <textarea id="chapter19-journal7" placeholder="Summarize your chapter reflections..."></textarea>
      </div>"""
new_summary = """<ul class="chapterOne-summary-list">
        <li>Fasting is voluntary abstinence to draw closer to God.</li>
        <li>Fasting breaks the power of the flesh and strengthens the spirit.</li>
        <li>Different types of fasts serve different spiritual goals.</li>
        <li>Preparation and clear goals make fasting effective.</li>
        <li>Scripture and prayer sustain you during the fast.</li>
        <li>The momentum from fasting builds long-term spiritual habits.</li>
      </ul>

      <div class="chapterOne-reflection-question">
        <strong>Final Reflection:</strong> When will you begin your next fast, and what will you surrender to God during it?
      </div>

      <div class="chapterOne-journal-box">
        <label for="journal7"><strong>Your Summary:</strong> What is your biggest takeaway?</label>
        <textarea id="journal7" placeholder="Summarize your chapter reflections..."></textarea>
      </div>"""
content = content.replace(old_summary, new_summary)

# 12. Fix nav links
content = content.replace('href="chapter18.html"', 'href="chapter34.html"')
content = content.replace('href="chapter20.html"', 'href="chapter36.html"')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("chapter35.html rewritten successfully")
