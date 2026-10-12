# Rajguru Mathiyalagan — Portfolio

Personal portfolio covering data analytics, data science and machine learning work, with a case study for each featured project.

Live site: https://portfolio-eight-kappa-95.vercel.app

## Stack

Vite 5 · React 18 · TypeScript · Tailwind CSS 3 · React Router 6 · Framer Motion (via `LazyMotion`) · lucide-react

## Run locally

```sh
npm install
npm run dev        # http://localhost:8080
npm run build      # production build into dist/
npm run preview    # serve the production build
npm run lint
npx tsc --noEmit -p tsconfig.app.json
```

## Project structure

```
src/
  content/           All site copy and data — edit these to update the site
    site.ts            name, links, resume path, home-page sections
    projects.ts        project summaries, categories (drive the filters)
    profile.ts         capabilities, experience, skills, education, certificates
  components/          Home-page sections, Navigation, Footer, shared Section/Reveal
    charts/BarChart.tsx  single-series HTML bar chart used across the site
    case-study/          shared case-study layout, figures, caveat call-outs
    layout/Layout.tsx    skip link, header/footer, scroll + hash handling
  pages/
    Index.tsx            home page
    work/*.tsx           one case study per project (lazy-loaded routes)
    NotFound.tsx
  lib/usePageMeta.ts   per-route title, description, canonical and Open Graph tags
public/
  Rajguru_Resume.pdf, og-image.png, sitemap.xml, work/<project>/*.webp
```

### Adding a project

1. Add a summary to `src/content/projects.ts` (its `categories` decide which filters show it).
2. Create `src/pages/work/<Name>.tsx` using `CaseStudy`, `CaseSection`, `MethodNotes`, `ImageFigure` and `BarChart`.
3. Register the route in `src/App.tsx` and the URL in `public/sitemap.xml`.

Every figure on the site is copied from a saved notebook output in the project's own repository. Keep it that way: cite the evaluation context (test set, cross-validation, sample) next to each number.

## Contact form

Messages are emailed to your inbox by a Google Apps Script web app using `MailApp.sendEmail`. The script is
[`apps-script/contact-form.gs`](apps-script/contact-form.gs); the website calls it from
`src/components/Contact.tsx`.

### How it works

- The form loads `<web app URL>?name=…&email=…&message=…&callback=…` as a script (**JSONP**). Apps Script
  replies with `callback({"result":"success"})` or `callback({"result":"error","error":"…"})`. A script reply can
  always be read by the page, so confirmation doesn't depend on CORS headers.
- The script validates the name (1–100 characters), email (same pattern as the site) and message (10–2,000
  characters), then sends **"New Portfolio Enquiry — <name>"** to your Gmail with the sender as **Reply-To**.
- It replies `success` only after `MailApp.sendEmail` completes. Invalid input or a failed send (e.g. the daily
  quota) replies `error`. The same sender + message within 10 minutes isn't emailed twice.
- What visitors see:

| Outcome | Message |
| --- | --- |
| Script confirms success | "Message sent successfully." |
| Script reports an error | "Your message wasn't sent", with your email address |
| No reply in 15 s, network error, "Access denied" page, or an unexpected reply | "I couldn't confirm that your message arrived", with your email address |

  The visitor's text is kept whenever the message wasn't confirmed. Development builds log the reason to the
  browser console.

### Set up the Apps Script (one time)

1. Go to <https://script.google.com>, signed in as the Gmail account that should receive messages.
   Open the existing contact-form project (or **New project**).
2. Replace the contents of `Code.gs` with [`apps-script/contact-form.gs`](apps-script/contact-form.gs) and save.
3. *Optional:* to send notifications to a different address, open **Project Settings → Script Properties** and add
   `RECIPIENT_EMAIL` = that address. Without it, mail goes to the account that owns the deployment.
4. Select the function **`authorizeOnce`** and click **Run**. Approve the permission prompt (it asks to send
   email as you). This only reads the daily quota — it doesn't send anything.
5. **Deploy → Manage deployments**, click the pencil on the existing web-app deployment (or **Deploy → New
   deployment → Web app**), and set:
   - **Execute as: Me**
   - **Who has access: Anyone** (not "Anyone with a Google account", not "Only myself")
   - **Version: New version**
   Then click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. If the URL differs from the fallback in `src/components/Contact.tsx`, set it as an environment variable:
   - locally: create `.env.local` (git-ignored) with `VITE_CONTACT_ENDPOINT=https://script.google.com/macros/s/…/exec`
   - on Vercel: **Project → Settings → Environment Variables** → `VITE_CONTACT_ENDPOINT` (Production and Preview),
     then redeploy. It's read at build time and is a public URL, not a secret.
7. Check the deployment from a terminal **without sending email** — an incomplete request is rejected before
   anything is sent:

   ```sh
   curl -sL "<web app URL>?callback=check"
   # expected: check({"result":"error","error":"invalid_name"});
   ```

   An HTML "Access denied" page instead means step 5's access setting isn't "Anyone".
8. Finally, send one real message from the live site and confirm it arrives.

Any change to the script needs **Deploy → Manage deployments → Edit → New version** before it takes effect.

### Limits

- "Message sent successfully" means Gmail accepted the notification for delivery; it can't confirm the email
  reached your inbox (spam filtering, a full mailbox, etc.).
- Consumer Gmail accounts can send about 100 emails a day through Apps Script; beyond that the script replies
  `error` and visitors are told the message wasn't sent.
- JSONP sends the message in the request URL. That's fine for a 2,000-character
  enquiry, but the form isn't meant for sensitive information.

## Deploying to Vercel

- Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist`
- `vercel.json` rewrites every non-file path to `index.html`, so `/work/...` URLs survive a browser refresh, and it caches hashed assets for a year.
- If the production domain changes, update `SITE_URL` in `src/content/site.ts`, the canonical/Open Graph URLs in `index.html`, `public/sitemap.xml` and `public/robots.txt`.
