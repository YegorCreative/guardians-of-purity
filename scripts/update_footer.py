"""
Global footer update script — Guardians of Purity
Replaces all <footer>...</footer> blocks site-wide with the new
3-column nav structure (Explore / Support / Legal).
"""

import re
import glob
import os

# ── New canonical footer HTML ─────────────────────────────────────────────────
NEW_FOOTER = """\
      <footer
        class="footer separated_block_corner"
        id="footer"
        role="contentinfo"
      >
        <nav class="footer-nav" aria-label="Footer navigation">
          <div class="footer-nav__col">
            <p class="footer-nav__heading">Explore</p>
            <ul class="footer-nav__list">
              <li><a href="journey.html" class="footer-link">Journey</a></li>
              <li><a href="prayer.html" class="footer-link">Prayer</a></li>
              <li><a href="resources.html" class="footer-link">Resources</a></li>
              <li><a href="about.html" class="footer-link">About</a></li>
            </ul>
          </div>
          <div class="footer-nav__col">
            <p class="footer-nav__heading">Support</p>
            <ul class="footer-nav__list">
              <li><a href="faq.html" class="footer-link">FAQ</a></li>
              <li><a href="contacts.html" class="footer-link">Contact</a></li>
              <li><a href="contacts.html" class="footer-link">Support</a></li>
            </ul>
          </div>
          <div class="footer-nav__col">
            <p class="footer-nav__heading">Legal</p>
            <ul class="footer-nav__list">
              <li><a href="privacy-policy.html" class="footer-link">Privacy Policy</a></li>
              <li><a href="terms.html" class="footer-link footer-link--dim">Terms of Service</a></li>
            </ul>
          </div>
        </nav>
        <div class="footer-social">
          <a href="https://facebook.com" class="social-link">Facebook</a>
          <a href="https://instagram.com" class="social-link">Instagram</a>
          <a href="https://youtube.com" class="social-link">YouTube</a>
        </div>
        <p class="footer-contact">Email: support@guardiansofpurity.com</p>
        <p class="footer-copyright">© 2026 Guardians of Purity</p>
      </footer>"""

# Matches any <footer ...> ... </footer> block (handles multi-line opening tags)
FOOTER_RE = re.compile(
    r'[ \t]*<footer\b[^>]*(?:>|(?:\n[^>]*)*>).*?</footer>',
    re.DOTALL
)

# ── File discovery ─────────────────────────────────────────────────────────────
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_files = sorted(glob.glob(os.path.join(root, "*.html")))

updated, skipped, no_footer = [], [], []

for filepath in html_files:
    filename = os.path.basename(filepath)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "<footer" not in content:
        no_footer.append(filename)
        continue

    new_content, n = FOOTER_RE.subn(f"\n{NEW_FOOTER}", content)

    if n == 0:
        skipped.append(filename)
    elif n > 1:
        # More than one match would be abnormal — skip to be safe
        skipped.append(f"{filename} (WARN: {n} matches, skipped)")
    else:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated.append(filename)

# ── Report ─────────────────────────────────────────────────────────────────────
print(f"\n✅  Updated : {len(updated)} files")
for f in updated:
    print(f"     ✓ {f}")

if skipped:
    print(f"\n⚠️   Skipped : {len(skipped)} files (regex didn't match)")
    for f in skipped:
        print(f"     - {f}")

if no_footer:
    print(f"\nℹ️   No footer: {len(no_footer)} files")
    for f in no_footer:
        print(f"     · {f}")
