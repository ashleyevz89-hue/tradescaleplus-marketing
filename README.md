# tradescaleplus-marketing

Marketing site for **TradeScale Plus**: the AI website sales admin for UK used-car dealers. It knows the dealer's live
stock, finds buyers the right car, answers questions about each car, gives finance illustrations at the dealer's own
APR, books viewings and test drives, and passes the leads to the dealer. One product; the earlier voice receptionist,
CRM and "AME" pages are retired and redirect to the homepage (`_redirects`).

- **Live at:** https://tradescaleplus.com
- **Host:** Cloudflare Pages (auto-deploy on push to `main`)
- **Stack:** Static HTML/CSS/JS, no build step

## Pages

| Page | File |
|---|---|
| Homepage | `index.html` |
| Pricing | `pricing.html` |
| Book a demo | `book-demo.html` |
| Knows every car | `knows-every-car.html` |
| Finance | `finance.html` |
| Appointment booking | `appointment-booking.html` |
| Lead capture | `lead-capture.html` |
| Website navigation | `website-navigation.html` |
| Forecourt cards | `forecourt-cards.html` |
| For superstores | `for-superstores.html` |
| Compared with other widgets | `vs-other-widgets.html` |
| About | `about.html` |
| FAQ | `faq.html` |
| Contact | `contact.html` |

## Shared assets

- `assets/site.css`: the one stylesheet; every colour is a token, dark (the default) and light
- `assets/theme.js`: the light and dark switch (nav and footer of every page); each page's head applies a saved choice
- `assets/favicon.svg`: brand mark
- `assets/mobile-nav.css` + `assets/mobile-nav.js`: hamburger and drawer
- `sitemap.xml`, `robots.txt`, `llms.txt`: SEO and AI-engine discoverability
