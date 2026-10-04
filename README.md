# Aurelia Jewels: Jewellery Website Template

A fast, responsive landing site for a jewellery brand. It's plain HTML, CSS and JS, so there's no build step. Open `index.html` in a browser or deploy the folder to any static host (Netlify, Vercel, GitHub Pages).

## Sections
Hero · trust bar · collections · filterable product grid with wishlist · craftsmanship story · testimonials · lead/consultation form · newsletter · footer · floating WhatsApp button.

## Customise for a client
| What | Where |
|---|---|
| Brand name, WhatsApp number, currency | `SETTINGS` at the top of `js/main.js` |
| Products (name, material, price, category, tag) | `PRODUCTS` in `js/main.js` |
| Colours & fonts | CSS variables in `:root` at the top of `css/styles.css` |
| Copy, address, hours, reviews, social links | `index.html` |

Product and collection visuals are inline SVG illustrations, so the site works without any image files. To use real product photos, replace the `<svg class="art">` in `productCard()` (and in the collection cards) with an `<img>` tag.

## Leads
The consultation form validates the input and then opens WhatsApp with the enquiry pre-filled. To collect leads in a sheet or CRM instead, replace the `window.open(...)` call in the form handler with a `fetch()` to Formspree, Google Apps Script or your CRM's webhook. The newsletter form shows a confirmation only, so connect it to Mailchimp or a similar service.
