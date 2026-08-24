# Joe’s

Customer app and website for **Joe’s**, a starter mechanic shop in Hillsboro, Texas. Customers can book a visit, look up general maintenance intervals, join a local loyalty list, and read about the shop.

This is one [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) + TypeScript product. The same screens run in **Expo Go** on iPhone and Android, and as a **static website** for GitHub Pages. There is no backend, payments, or SMS in v1 — appointments, the loyalty account, and Joe’s weekly hours are stored on the device (or in the browser) with AsyncStorage.

## Screens

| Area | What it does |
| --- | --- |
| **Home** | Shop intro and shortcuts to Book, Maintenance, Loyalty, and About. Shows the next booked visit when one exists. |
| **Book** | Collects vehicle year / make / model and a concern note. Customers pick from Joe’s open weekly slots. Confirmation stays on this device. |
| **Shop hours** | Light owner tools so Joe can turn hourly slots on or off for each weekday. Customers only see those times for the next two weeks. |
| **Maintenance** | Guide flow: Maintenance → Car or Truck → category (fluids, brakes, engine, …) → item (e.g. brake fluid) → typical interval. Labeled as general recommendations. |
| **Loyalty** | Sign up with name, email, and vehicles. Confirmation after save. Account can be updated or removed on this device. |
| **About** | Placeholder bio (clearly marked for Joe to replace), Hillsboro location, weekly hours, and a labeled placeholder phone number. |

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

`preview:pages` builds `dist/` and serves it at [http://localhost:4173/joes-app/](http://localhost:4173/joes-app/) — the same `/joes-app` base path Pages will use.

## GitHub Pages

**Live URL (once Pages is on):** [https://7nok.github.io/joes-app/](https://7nok.github.io/joes-app/)

The site is a static Expo export (`npx expo export --platform web`) with `experiments.baseUrl` set to `/joes-app`. GitHub Actions workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

- Every pull request **exports** the website (and typechecks) so the build stays green.
- Pushes to `main` (or a manual **Actions → GitHub Pages → Run workflow**) **deploy** the `dist` folder with the official `github-pages` action.

### Manual toggle Preston needs

This repository is **private**. GitHub Pages on a private repo needs **GitHub Pro** (or make the repo public). After that:

1. Repo **Settings → Pages**.
2. Set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Merge to `main` or run the **GitHub Pages** workflow.
4. The first successful deploy publishes [https://7nok.github.io/joes-app/](https://7nok.github.io/joes-app/).

Until that source is set (and the plan allows Pages), the workflow still proves the web build; the deploy job may fail or stay idle.

A `.nojekyll` file is included so GitHub does not ignore Expo’s `_expo` folders.

## Placeholders to replace later

- About page bio is marked `[PLACEHOLDER — replace with Joe’s own words]`.
- Phone is a labeled fake number: `+1 (254) 555-0100`.
- Shop hours start as a sensible Tue–Fri / Saturday-morning week. Joe can edit them in **About → Joe: set available times** or from Home.

## What this version does not do

- No server, so Joe does not get a push, SMS, or email when someone books.
- No payments or estimates.
- The hours editor is not locked behind a password.
- Website data lives in that browser’s storage, separate from Expo Go on a phone.

## License

Private shop app for Joe’s in Hillsboro, TX.
