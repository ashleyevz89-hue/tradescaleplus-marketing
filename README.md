# tradescaleplus-marketing

Marketing site for **TradeScale Plus**: AI agents for websites. Three products: the **Car Agent** (car dealers), the
**Property Agent** (property agencies, Dubai and UK) and the **Custom Website Agent** (any other website). An agent
answers visitors from the website's own data, takes them to the right page, compares, saves, books or takes the enquiry,
and opens the site to ChatGPT and Claude. It is added with two lines of code. The earlier voice receptionist, CRM and
"AME" pages are retired and redirect to the homepage (`_redirects`).

- **Live at:** https://tradescaleplus.com
- **Host:** Cloudflare Pages (auto-deploy on push to `main`)
- **Stack:** Static HTML/CSS/JS, no build step

## Pages

| Page | File |
|---|---|
| Homepage | `index.html` |
| Car dealers (Car Agent) | `car-dealers.html` |
| Property agencies (Property Agent) | `property-agencies.html` |
| Any website (Custom Website Agent) | `custom-agents.html` |
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
from the root.
