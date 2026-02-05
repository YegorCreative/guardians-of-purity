# Guardians of Purity Chapter Tools

This directory contains scripts to maintain the integrity and consistency of the 42 chapter files.

## Single Self-Heal Command (Run this to fix everything)

```bash
python3 tools/auto_fix_chapters.py && python3 tools/validate_chapters.py && python3 tools/generate_journey_data.py && python3 tools/audit_chapters.py
```

## Tools Overview

### `auto_fix_chapters.py`
**"The Healer"**
- **Action:** Scans all chapters.
- **Fixes:**
  - Inserts missing "Your Journal" inputs in reflection sections.
  - Inserts missing 15-Minute Break timers (after Point 2).
  - Moves misplaced timers (e.g., if found after Point 1) to the correct location (after Point 2).
- **Safety:** Creates a timestamped backup in `backups/` before modifying any files. Idempotent (safe to run multiple times).

### `validate_chapters.py`
**"The Gatekeeper"**
- **Action:** Checks for critical structural integrity.
- **Checks:** File existence (1-42), H1 title presence, Internal "CHAPTER X OF 42" label consistency.
- **Use:** Runs in CI/CD to block broken PRs.

### `audit_chapters.py`
**"The Inspector"**
- **Action:** consistency checks for specific content modules.
- **Checks:** Presence of Timer, Journals matching Questions, etc.
- **Output:** `tools/audit-report.json`

### `generate_journey_data.py`
**"The Scribe"**
- **Action:** Scans valid chapters and generates `journey-data.json`.
- **Use:** Source of truth for frontend applications or external integrations.
