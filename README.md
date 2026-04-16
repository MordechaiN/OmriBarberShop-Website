# עומרי צור מגן — Master Barber

אתר תדמית יוקרתי, בעברית, לספר עומרי צור מגן.

## Structure

```
.
├── index.html              # Main page (Hebrew, RTL)
├── style.css               # All styles (mobile-first)
├── script.js               # Vanilla JS (menu, lightbox, PWA)
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline support)
├── assets/
│   ├── logo.png            # Original full logo (black bg) - OG share image
│   ├── logo-full.png       # Transparent - Hero
│   ├── mark-otm.png        # Transparent OTM monogram - Header + watermark
│   ├── wordmark.png        # Transparent wordmark - Footer
│   ├── icon.png            # Original reference
│   ├── favicon.png         # Browser tab icon
│   ├── apple-touch-icon.png # iOS home-screen icon (PWA)
│   └── omri-portrait.png   # Photo of Omri (About section)
└── README.md
```

No build step, no dependencies. Pure HTML/CSS/JS.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

**Note**: PWA/service worker requires `http://` (not `file://`).

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/omri-tzur-magen.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: `main` / `root` → Save**.
Live at `https://YOUR_USERNAME.github.io/omri-tzur-magen/` within ~1 minute.

## Features

- **Hebrew-first**, RTL layout
- **Responsive mobile-first** (breakpoints: 960 / 640 / 380 px)
- **Lightbox gallery** (keyboard + swipe navigation)
- **PWA** — installable to home screen, works offline
- **SEO** — Open Graph, meta description, semantic HTML
- **Favicon + apple-touch-icon** included

## Things to update before going public

1. **Phone**: search `050-000-0000` and `tel:+972000000000` in `index.html`
2. **WhatsApp**: search `wa.me/972000000000` - replace with real international number (no `+`, no `-`)
3. **Social media**: footer has 3 icons with `href="#"` - replace with real links
4. **Location**: currently "בקרוב" - update when set
5. **Prices**: review 6 service cards in services section
6. **Hours**: currently Sun-Thu 09-20, Fri 08-14, Sat closed

## Deferred features (kept as `TODO` in code)

- **Background video in Hero**. Royalty-free sources and search terms in the comment near `.hero-bg`
- **Google Maps embed** in Contact section
- **Schema.org LocalBusiness JSON-LD** for rich Google search results
- **Booking system** (Booksy is Israeli standard, ~150₪/month; Setmore is free tier)

## Customization

### Colors (edit `style.css` `:root`)
- `--ink` - main dark
- `--cream` - main light background
- `--gold` / `--gold-soft` / `--gold-bright` - accent palette

### Replacing gallery placeholders with real photos
Each gallery item:
```html
<figure class="g-item g-1" data-caption="תספורת פייד קלאסית">
  <div class="g-placeholder">...</div>
</figure>
```

Replace the inner `<div class="g-placeholder">` with:
```html
<img src="assets/gallery-1.jpg" alt="תספורת פייד קלאסית" loading="lazy">
```

Lightbox will automatically handle the images.

## Browser support

Modern evergreen browsers (Chrome, Safari, Firefox, Edge).

## License

Private — all rights reserved to Omri Tzur Magen.
