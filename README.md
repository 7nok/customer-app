# Customer shop app

Customer-facing mobile mechanic app and website: request a visit, look up general maintenance intervals, join a local rewards list, and read about the shop.

This is one [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) + TypeScript product. The same screens run in **Expo Go** on iPhone and Android, and as a **static website** for GitHub Pages. There is no backend, payments, or SMS in v1 — appointments, the loyalty account, and weekly hours are stored on the device (or in the browser) with AsyncStorage.

Shop name, location, and contact copy that customers see live in the running app, not in this README.

## Screens

| Area | What it does |
| --- | --- |
| **Home** | Hero intro and shortcuts to Book, Maintenance, Rewards, and About. Shows the next requested visit when one exists. |
| **Book** | Collects vehicle year / make / model and a concern note. Customers pick from posted weekly windows (about two months out). Status is pending confirmation. Saved on this device. |
| **Appointment windows** | Light owner tools to turn hourly slots on or off for each weekday. These are appointment windows, not a fixed store-hours grid. |
| **Maintenance** | Guide flow: Maintenance → Car or Truck → category (fluids, brakes, engine, …) → item (e.g. brake fluid) → typical interval. Labeled as general recommendations. |
| **Rewards** | Sign up with name, email, and vehicles for discounts/rewards (details TBD). Account can be updated or removed on this device. |
| **About** | Shop story, service area (no street address), appointment windows, text-first contact, and pay notes. |

No dollar prices or customer reviews are shown.

## Requirements

- Node.js 20+ (Node 22 is fine)
- For the native app: a phone with [Expo Go](https://expo.dev/go), or a simulator / emulator

The project targets **Expo SDK 54**, which matches the Expo Go builds currently on the App Store and Google Play. A newer Expo SDK would need a development build instead of store Expo Go.

## Run the phone app

```bash
npm install
npx expo start
```

Then:

1. Install **Expo Go** on an iPhone or Android phone.
2. Scan the QR code from the terminal (Camera on iOS; Expo Go on Android).
3. Same Wi-Fi as the computer helps. If the QR code fails, use the tunnel option: `npx expo start --tunnel`.

Other scripts:

```bash
npx expo start --ios      # iOS Simulator (macOS)
npx expo start --android  # Android emulator
npm run typecheck
```

## Website (local)

The web app is the same Expo Router project. Layouts are mobile-first and stay readable from a ~320px phone width up through tablet and desktop (the site uses a centered shop column on wide windows).

```bash
npm install
npx expo start --web
```

Production static export (what GitHub Pages serves):

```bash
npm run export:web
npm run preview:pages
```

`preview:pages` builds `dist/` and serves it under the configured Pages base path (see `experiments.baseUrl` in `app.json`) at `http://localhost:4173` plus that path.

To build the same three-design site Pages deploys, use `npm run preview:switcher` (see [PREVIEW.md](PREVIEW.md)).

## GitHub Pages

Live site: [https://7nok.github.io/customer-app/](https://7nok.github.io/customer-app/).

The site is a static Expo export (`npx expo export --platform web`), not the README. `experiments.baseUrl` in `app.json` is `/customer-app` so a single-design export resolves on project Pages.

The **live** Pages deploy exports **three** designs (`A`, `B`, `C`) into `/customer-app/a/`, `/b/`, and `/c/`, with a persistent on-page switcher and `?v=a|b|c`. Details: [PREVIEW.md](PREVIEW.md). Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

- Every pull request **exports** all three variants (and typechecks) so the preview build stays green.
- Pushes to branch `A` (or a manual **Actions → GitHub Pages → Run workflow**) **deploy** the assembled `dist` folder. Design sources stay on `A` / `B` / `C` (and their Daily Drivin rebuild branches). `main` is left unchanged.

### Pages source

Repo **Settings → Pages** must use **GitHub Actions** (not “Deploy from a branch”). A branch source publishes a Jekyll build of the README instead of the Expo export.

1. Confirm **Source** is **GitHub Actions**.
2. Push to `A` or run the **GitHub Pages** workflow from that branch.
3. The first successful Actions deploy publishes the Expo site at the URL above.

A `.nojekyll` file is written into `dist/` so GitHub does not ignore Expo’s `_expo` folders.

## Placeholders in the running app

- Home uses a royalty-friendly stock car photo until shop photography is ready. Swap `assets/images/hero-car.jpg` via the single path in `constants/media.ts`.
- Hero credit (Unsplash License): Why Kei — [unsplash.com/photos/8e2gal_GIE8](https://unsplash.com/photos/8e2gal_GIE8).
- Email and Instagram are marked as coming soon. No street address is published.
- Appointment windows start as an irregular starter week and can be edited in-app.

## What this version does not do

- No server, so the shop does not get a push, SMS, or email when someone books.
- No payments or estimates.
- The appointment-window editor is not locked behind a password.
- Website data lives in that browser’s storage, separate from Expo Go on a phone.
