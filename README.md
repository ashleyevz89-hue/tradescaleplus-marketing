# tradescaleplus-marketing

Marketing site for **TradeScale Plus**: your website, interactive. Two lines of code put **the Website Agent** inside a
car dealer's or estate agent's own website (and any other website): a bar in its own search area that drives the stock list
to what a buyer describes, and a panel on every car or listing page with the buyer's tools. It answers from the website's
own stock and pages, sends every lead to the business, and records what buyers wanted for the dashboard. Never call it a
widget, a chatbot or an AI assistant. The earlier voice receptionist, CRM and "AME" pages are retired and redirect to the
homepage (`_redirects`).

## The rebuilt pages (24 Nov 2026, branch `redesign-interactive`)

`index.html` (the walkthrough, in the films' five chapters), `car-dealers.html` and `property-agencies.html` use their own
stylesheet and script, `assets/interactive.css` and `assets/interactive.js`: dark, one accent (the films' teal), Geist. The
older pages keep `assets/site.css` and their own look until they are rebuilt; their menu, phone menu and footer carry the
same links as the rebuilt pages.

- `assets/films/`: `car-dealers-walkthrough.mp4` and its poster; the estate agents' film goes in as
  `estate-agents-walkthrough.mp4` with `estate-agents-poster.jpg` (index.html and property-agencies.html already point at
  them; add each chapter's start as `data-t` on its chapter button when it lands).
- `assets/showcase/`: resized copies of the photos our example businesses show (TradeScale Motors' cars, TradeScale
  Property's Dubai Marina homes), credited in each page's footer.

- **Live at:** https://tradescaleplus.com
- **Host:** Cloudflare Pages (auto-deploy on push to `main`)
- **Stack:** Static HTML/CSS/JS, no build step

## Pages

| Page | File |
|---|---|
| Homepage | `index.html` |
| Car dealers | `car-dealers.html` |
| Estate agents | `property-agencies.html` |
| Any other website | `custom-agents.html` |
| The AI door (the ChatGPT test, 1 November 2026) | `ai-door.html` |
| Priced for your business (the nav says "Get a quote"; no prices are published) | `pricing.html` |
| Book a demo or get a quote | `book-demo.html` |
| Free AI readiness score | `ai-score.html` |
| AI Guard | `ai-guard.html` |
| Can you trust AI? | `trust.html` |
| About, FAQ, Contact | `about.html`, `faq.html`, `contact.html` |
| Car dealer guides | `knows-every-car.html`, `website-navigation.html`, `appointment-booking.html`, `lead-capture.html`, `finance.html`, `ai-finance.html`, `forecourt-cards.html`, `for-superstores.html`, `vs-other-widgets.html` |
| Not found | `404.html` |

`/ai-search` was replaced by `/ai-door` and redirects to it (`_redirects`).

## Shared assets

- `assets/site.css`: the one stylesheet; every colour is a token, dark (the default) and light
- `assets/site.js`: what the five rebuilt pages (home, car dealers, property agencies, any website, the AI door) do on load
- `assets/theme.js`: the light and dark switch (top bar, phone menu and footer of every page); each page's head applies a saved choice
- `assets/mobile-nav.css` + `assets/mobile-nav.js`: the menu button and phone drawer, linked on every page
- `assets/favicon.svg`: brand mark
- `og-card.png`: the social share image (1200 by 630)
- `sitemap.xml`, `robots.txt`, `llms.txt`: SEO and AI-engine discoverability

## Keeping the top bar and footer the same

The top bar, the phone drawer and the footer are copied into every page (there is no build step), so a change to a link
is made in every `.html` file. Pages link each other as `name.html`; the 404 page is served at any depth, so it links
from the root. Every page's top bar has the same six links: Car dealers, Estate agents, How it works (`/#website`), The films
(`/#films`), See it live (`/#demos`, the live examples on the home page) and About. On the older pages they give way to the
menu button up to 1180px wide (`assets/mobile-nav.css` and `assets/mobile-nav.js`); on the rebuilt pages up to 1100px
(`assets/interactive.css` and `assets/interactive.js`). The home page's chapter anchors (`#website`, `#leads`, `#data`,
`#dashboard`, `#setup`, `#films`, `#demos`) are linked from every footer, so keep them when the home page changes.
