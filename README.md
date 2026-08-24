# Customer shop app

Customer-facing mechanic shop app and website: book a visit, look up general maintenance intervals, join a local loyalty list, and read about the shop.

This is one [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) + TypeScript product. The same screens run in **Expo Go** on iPhone and Android, and as a **static website** for GitHub Pages. There is no backend, payments, or SMS in v1 — appointments, the loyalty account, and weekly hours are stored on the device (or in the browser) with AsyncStorage.

Shop name, location, and contact copy that customers see live in the running app, not in this README.

## Screens

| Area | What it does |
| --- | --- |
| **Home** | Shop intro and shortcuts to Book, Maintenance, Loyalty, and About. Shows the next booked visit when one exists. |
| **Book** | Collects vehicle year / make / model and a concern note. Customers pick from the shop’s open weekly slots. Confirmation stays on this device. |
| **Shop hours** | Light owner tools to turn hourly slots on or off for each weekday. Customers only see those times for the next two weeks. |
| **Maintenance** | Guide flow: Maintenance → Car or Truck → category (fluids, brakes, engine, …) → item (e.g. brake fluid) → typical interval. Labeled as general recommendations. |
| **Loyalty** | Sign up with name, email, and vehicles. Confirmation after save. Account can be updated or removed on this device. |
| **About** | Shop story (placeholder copy in the app, clearly marked), location, weekly hours, and a labeled placeholder phone number. |

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

## GitHub Pages

Live site: [https://7nok.github.io/customer-app/](https://7nok.github.io/customer-app/).

The site is a static Expo export (`npx expo export --platform web`), not the README. `experiments.baseUrl` in `app.json` is `/customer-app` so assets resolve on project Pages. Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

- Every pull request **exports** the website (and typechecks) so the build stays green.
- Pushes to `main` (or a manual **Actions → GitHub Pages → Run workflow**) **deploy** the `dist` folder with the official `github-pages` action.

### Pages source

Repo **Settings → Pages** must use **GitHub Actions** (not “Deploy from a branch”). A branch source publishes a Jekyll build of the README instead of the Expo export.

1. Confirm **Source** is **GitHub Actions**.
2. Push to `main` or run the **GitHub Pages** workflow.
3. The first successful Actions deploy publishes the Expo site at the URL above.

A `.nojekyll` file is written into `dist/` so GitHub does not ignore Expo’s `_expo` folders.

## Placeholders in the running app

- The About bio is marked as placeholder copy so it can be replaced later.
- The shop phone in the app is a labeled placeholder, not a real line.
- Shop hours start as a sensible weekday / Saturday-morning week and can be edited from About or Home.

## What this version does not do

- No server, so the shop does not get a push, SMS, or email when someone books.
- No payments or estimates.
- The hours editor is not locked behind a password.
- Website data lives in that browser’s storage, separate from Expo Go on a phone.
