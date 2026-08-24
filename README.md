# Joe’s

Customer app for **Joe’s**, a starter mechanic shop in Hillsboro, Texas. Customers can book a visit, look up general maintenance intervals, join a local loyalty list, and read about the shop.

This is an [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) + TypeScript app. There is no backend, payments, or SMS in v1 — appointments, the loyalty account, and Joe’s weekly hours are stored on the device with AsyncStorage.

## Screens

| Area | What it does |
| --- | --- |
| **Home** | Shop intro and shortcuts to Book, Maintenance, Loyalty, and About. Shows the next booked visit when one exists. |
| **Book** | Collects vehicle year / make / model and a concern note. Customers pick from Joe’s open weekly slots. Confirmation stays on this phone. |
| **Shop hours** | Light owner tools so Joe can turn hourly slots on or off for each weekday. Customers only see those times for the next three weeks. |
| **Maintenance** | Guide flow: Maintenance → Car or Truck → category (fluids, brakes, engine, …) → item (e.g. brake fluid) → typical interval. Labeled as general recommendations. |
| **Loyalty** | Sign up with name, email, and vehicles. Confirmation after save. Account can be updated or removed on this device. |
| **About** | Placeholder bio (clearly marked for Joe to replace), Hillsboro location, weekly hours, and a labeled placeholder phone number. |

No dollar prices or customer reviews are shown.

## Requirements

- Node.js 20+ (Node 22 is fine)
- A phone with [Expo Go](https://expo.dev/go), or a simulator / emulator

The project targets **Expo SDK 54**, which matches the Expo Go builds currently on the App Store and Google Play. A newer Expo SDK would need a development build instead of store Expo Go.

## Run it

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
npx expo start --web      # browser preview
npm run typecheck
```

## Placeholders to replace later

- About page bio is marked `[PLACEHOLDER — replace with Joe’s own words]`.
- Phone is a labeled fake number: `+1 (254) 555-0100`.
- Shop hours start as a sensible Tue–Fri / Saturday-morning week. Joe can edit them in **About → Joe: set available times** or from Home.

## What this version does not do

- No server, so Joe does not get a push, SMS, or email when someone books.
- No payments or estimates.
- The hours editor is not locked behind a password.

## License

Private shop app for Joe’s in Hillsboro, TX.
