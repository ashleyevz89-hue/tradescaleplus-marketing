# tradescaleplus-marketing

Marketing site for **TradeScale Plus**: your website, interactive. Two lines of code put **the Website Agent** inside a
car dealer's or estate agent's own website (and any other website): a bar in its own search area that drives the stock list
to what a buyer describes, and a panel on every car or listing page with the buyer's tools. It answers from the website's
own stock and pages, sends every lead to the business, and records what buyers wanted for the dashboard. Never call it a
widget, a chatbot or an AI assistant. The earlier voice receptionist, CRM and "AME" pages are retired and redirect to the
homepage (`_redirects`).

## One look, every page (24 Nov 2026, branch `redesign-unified`)

All 23 pages share one stylesheet and one script, `assets/site.css` and `assets/site.js`: midnight navy with depth (two
soft lights and the mark's honeycomb behind every page), our blue `#3b9eff` as the only accent, Geist and Geist Mono,
one top bar, one footer, one set of parts (hero, bands, cards, questions, the last call). There is no light theme.

- `assets/films/`: the two walkthrough films and their posters (each chapter's start is `data-t` on its chapter button).
- `assets/loops/`: short silent cuts of the films (5 to 10 seconds, no sound), each with a `.jpg` poster. A
  `<video data-loop>` plays only while it is on screen and stays on its poster with reduced motion. The car film's teal
  is turned to our blue in these cuts; the estate agents' cuts keep that example agency's gold.
- `assets/showcase/`: resized copies of the photos our example businesses show (TradeScale Motors' cars, TradeScale
  Property's Dubai Marina homes), credited in the footer of each page that shows them.
- The six feature pages (`website-navigation`, `knows-every-car`, `finance`, `ai-finance`, `appointment-booking`,
  `lead-capture`) each cover one feature as it works inside the page today; `vs-other-widgets` is the interactive
  website against a chat bubble in the corner. `forecourt-cards` says the cards are by arrangement (the app's QR cards
  are archived). `ai-guard` is a product opening to its first businesses.
- The way to try the product is the real thing: "Try it live" opens our two example businesses in a new tab. No page
  has a pretend agent.

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

- `assets/site.css`: the one stylesheet; every colour is a token
- `assets/site.js`: what every page does on load (menu, reveals, chapter bar, the story, tabs, films, loops, count-ups)
- `assets/living-hero.css` and `assets/living-hero.js`: the home page's living hero only (the product playing itself in
  the opening section, then the hand-over to the live agent place `#ask`). The page writes the finished still; the
  script plays it on a loop when motion is allowed. Its classes are all `lh-` or `x-`, so none meets the shared sheet.
- `assets/favicon.svg`: brand mark
- `og-card.png`: the social share image (1200 by 630)
- `sitemap.xml`, `robots.txt`, `llms.txt`: SEO and AI-engine discoverability

## Keeping the top bar and footer the same

The top bar, the phone drawer and the footer are copied into every page (there is no build step), so a change to a link
is made in every `.html` file. Pages link each other as `name.html`; the 404 page is served at any depth, so it links
from the root. Every page's top bar has the same six links: Car dealers, Estate agents, How it works (`#website` on the
home page), The films (`#films`), See it live (`#demos`) and About; they give way to the menu button up to 1100px wide.
The footer lists every page. Pages that belong together (what it does, AI and your website, who it is for, company)
carry a bar under their hero, in the chapter bar's place, that names the family and marks the page you are on. The home
page's chapter anchors (`#website`, `#leads`, `#data`, `#dashboard`, `#setup`, `#films`, `#demos`) are linked from every
footer, so keep them when the home page changes.
