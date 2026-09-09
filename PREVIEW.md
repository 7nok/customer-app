# Design preview (A / B / C)

One GitHub Pages site hosts three static exports of the customer app so the layouts can be compared without redeploying a branch.

Live site: [https://7nok.github.io/customer-app/](https://7nok.github.io/customer-app/)

## How to switch

- **On-page control:** a floating **Design A | B | C** control on the right edge of every screen.
- **Query string:** add `?v=a`, `?v=b`, or `?v=c` to any preview URL.
- **Memory:** the last choice is stored in `localStorage` under `customer-app-variant`. Reloading the site root opens that variant. Default is **A**.

Direct links:

| Design | URL |
| --- | --- |
| A | https://7nok.github.io/customer-app/a/ |
| B | https://7nok.github.io/customer-app/b/ |
| C | https://7nok.github.io/customer-app/c/ |
| Last chosen (or A) | https://7nok.github.io/customer-app/ |

Switching keeps the current in-app path when that route exists on the other design (`/customer-app/a/book` → `/customer-app/b/book`). In-app tabs and stacks stay inside the active variant.

## What gets built

The Pages workflow exports three apps into `dist/a/`, `dist/b/`, and `dist/c/` with `experiments.baseUrl` set to `/customer-app/a`, `/customer-app/b`, and `/customer-app/c`. A thin root page at `/customer-app/` sends the browser to the remembered variant.

Design sources (not deleted or merged away):

| Slot | Source (first existing ref wins) |
| --- | --- |
| A | This working tree (branch `A` after merge) |
| B | `cursor/dock-first-paint-b-5301`, then `cursor/daily-drivin-hero-b-5301`, then `B` |
| C | `cursor/dock-first-paint-c-5301`, then `cursor/daily-drivin-hero-c-5301`, then `C` |

B and C prefer the Daily Drivin rebuilds that include the first-paint dock / iPhone `visualViewport` shell. The older tips of `B` and `C` remain on those branches.

Each variant keeps its own HTML viewport lock and dock host. The switcher is injected after export and does not resize `#root`.

## Local

```bash
npm install
npm run test:preview
npm run preview:switcher
```

Then open `http://localhost:4173/customer-app/`.

`npm run export:web` and `npm run preview:pages` still export only the current tree (one design) for everyday app work.

Override sources if needed:

```bash
PREVIEW_REF_B=origin/B PREVIEW_REF_C=origin/C npm run export:preview
```
