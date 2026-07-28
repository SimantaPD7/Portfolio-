# SPIDYCODEZ — Marvel Comics × Tech HQ Portfolio

A single-page, vanilla HTML/CSS/JS portfolio blending retro Marvel comic-book print aesthetics with futuristic sci-fi terminal tech. No frameworks, no build step. FontAwesome is the only external UI dependency.

## Files

| File | Purpose |
|---|---|
| `index.html` | Semantic layout, SVG assets, modal wrappers |
| `style.css` | Theme tokens, halftone texture, comic cards, responsive layout |
| `script.js` | Canvas web physics, cursor, rendering, S.H.I.E.L.D. mainframe CRUD |
| `firebase.json` | Firebase Hosting config (optional) |
| `.firebaserc` | Firebase project mapping (optional) |
| `profile.jpg` | About-panel portrait — **replace with your own photo** |

## Features

- Interactive canvas: 12-spoke spider web with mouse-proximity pluck vibration, a crawling spider, floating code fragments, and comic action-word bursts on click.
- Custom cursor with grow-on-hover, magnetic logo/buttons, 3D tilt project cards.
- Hanging SVG spider with scroll physics.
- Hero typewriter, animated Power Grid, skill rings, collectible social covers.
- Schematic blueprint modal per project.
- Hidden S.H.I.E.L.D. admin dashboard with full CRUD.

## Admin access

Click `[ SECURE MAINFRAME ACCESS ]` in the footer barcode box.

- Username: `spidycodez`
- Password: `spidy`

> Local mode credentials are client-side only and offer no real security. For a public deploy, either use Firebase Auth or remove the admin panel.

Inside the dashboard: System Diagnostics, Manage Projects, Manage Skills, Edit Bio/Stats, Manage Connect. Press **SAVE ALL CHANGES** to commit.

## Storage: dual layer

Data loads from Firestore when `firebaseConfig` in `script.js` is filled in; otherwise it falls back to `localStorage` automatically. If Firestore is blocked at runtime, it degrades to local without breaking.

To enable Firestore, fill `firebaseConfig` at the top of `script.js` and add before `script.js` in `index.html`:

```html
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
```

Collections used: `projects`, `skills`, `socials`, and `meta/bio`.

## Deploy to GitHub Pages

```bash
cd spidycodezwebsite
git init
git add .
git commit -m "SpidyCodez portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save.**

Your site goes live at `https://<your-username>.github.io/<repo>/`.

For a root-level domain, name the repo `<your-username>.github.io`.

## Customize

Edit the `SEED` object in `script.js` to change the default bio, skills, projects, and socials that ship with the site. Swap `profile.jpg` for your own portrait.
