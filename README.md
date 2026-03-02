# Ayikho A/B Test App (v2)

This build is a standalone A/B test app to compare:
- **Simple vs Detail** (simple uses rewritten ESL text)
- **Video vs No video**

## Files
- `index.html` — entry point
- `content/simple.js` — rewritten ESL module content
- `content/detail.js` — more detailed module content
- `scripts/` — per-module video scripts (Black presenter)
- `js/ab.js` — A/B assignment (stored in localStorage)
- `js/tracker.js` — local event tracking (for prototype testing)
- `js/app.js` — UI + routing

## Notes
- All modules are unlocked.
- WhatsApp reminders are marked **coming soon** in onboarding screen.

## Deploy
Upload this folder to GitHub Pages (root). Visit your pages URL.
