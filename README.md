# Meeting Cost Calculator

A simple, static web page that estimates the real labor cost of a meeting. Search for job titles, set a headcount and duration, and the calculator converts annual salaries into a live dollar figure.

---

## Project structure

```
├── index.html       # Page markup and layout
├── styles.css       # All visual styling
├── app.js           # Calculator logic and JSON loading
└── salaries.json    # Salary data (titles + annual pay)
```

---

## Customizing salary data

All job titles and salaries live in `salaries.json`. Each entry is a JSON object with two fields:

```json
{ "title": "Job Title Here", "salary": 95000.00 }
```

**To add a role:**
```json
{ "title": "Software Engineer", "salary": 110000.00 }
```

**To change pay for an existing role**, find the matching object and update the `salary` value.

**To remove a role**, delete its entire `{ ... }` line (and the trailing comma on the line above if it was the last entry).

The salary field expects an annual figure in USD. The calculator automatically converts it to an hourly rate using a 2,080-hour work year (52 weeks × 40 hours).

---

## Customizing the color scheme

All colors are defined as CSS custom properties at the top of `styles.css`:

```css
:root {
    --primary:       #0032A0;   /* main blue — buttons, card title, result box */
    --primary-dark:  #13155C;   /* dark navy — page background gradient start  */
    --primary-light: #0ECBF0;   /* light blue — input focus ring               */
    --accent-teal:   #3DD1CC;   /* teal — tagline, section labels, valid state  */
    --accent-purple: #4A0C6E;   /* purple — available for custom use            */
    --accent-copper: #BA6F4C;   /* copper — remove (×) button                  */
    --accent-cream:  #DEC197;   /* cream — bold text inside "How it works"      */
    --black:         #0a0a0a;
    --white:         #ffffff;
}
```

Change any hex value to update that color everywhere it's used on the page. For example, to switch from blue to green:

```css
--primary:      #006400;
--primary-dark: #003300;
--primary-light:#00C853;
```

The page background is a gradient between `--primary-dark` and `--primary` (see the `body` rule). The result box at the bottom uses the same two colors. Updating those two variables will retheme the most prominent areas of the page.

---

## Running locally

Because `app.js` fetches `salaries.json` via `fetch()`, the page must be served over HTTP — it won't work if you simply double-click `index.html` in most browsers (CORS/file-protocol restriction).

The easiest options:

```bash
# Python 3
python -m http.server 8000

# Node (npx, no install needed)
npx serve .
```

Then open `http://localhost:8000` in your browser.
