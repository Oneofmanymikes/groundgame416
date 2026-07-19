# Ground Game website

A simple, single-page site for Ground Game (political consulting), with a contact
form that emails inquiries to **michael@groundgame416.ca** via Google Apps Script.

```
groundgame416-site/
├── index.html          ← the website
├── style.css           ← styles
├── script.js           ← contact form logic (paste your Apps Script URL here)
├── CNAME               ← custom domain for GitHub Pages (groundgame416.ca)
├── apps-script/
│   └── Code.gs         ← the email backend (deploy to script.google.com)
└── README.md           ← this file
```

---

## Part 1 — Set up the email backend (Google Apps Script)

You only do this once. It's free and uses your own Gmail to send.

1. Go to **https://script.google.com** and click **New project**.
2. Delete the sample code, then paste in everything from `apps-script/Code.gs`.
3. Click **Save** (disk icon). Name the project "Ground Game Contact" if you like.
4. Click **Deploy ▸ New deployment**.
   - Click the gear ⚙ next to "Select type" → choose **Web app**.
   - **Description:** anything (e.g. "v1").
   - **Execute as:** **Me** (the Google account you're deploying from).
   - **Who has access:** **Anyone**.  ← important, or the form can't reach it.
   - Click **Deploy**.
5. Google will ask you to **authorize** — approve it (it needs permission to send
   email as you). If you see "Google hasn't verified this app," click
   **Advanced → Go to Ground Game Contact (unsafe)** — it's your own script, it's fine.
6. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfycb..../exec`
7. (Optional) Paste that URL into a browser — you should see
   `{"ok":true,"status":"Ground Game contact endpoint is live."}`

**Test tip:** submit the form once after going live and confirm the email lands.
If you ever edit `Code.gs`, you must **Deploy ▸ Manage deployments ▸ ✏️ Edit ▸
Version: New version ▸ Deploy** for changes to take effect (the URL stays the same).

---

## Part 2 — Connect the form

1. Open `script.js`.
2. Replace the placeholder on the `SCRIPT_URL` line with the Web app URL from step 6:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb..../exec";
   ```
3. Save.

---

## Part 3 — Publish on GitHub Pages (groundgame416.ca)

1. Create a **new GitHub repository** (e.g. `groundgame416`). Public.
2. Upload all the files in this folder to the repo root (keep the `apps-script`
   folder — it's harmless on Pages and keeps your backend code version-controlled).
3. In the repo: **Settings → Pages**.
   - **Source:** Deploy from a branch.
   - **Branch:** `main` / `(root)` → **Save**.
4. The `CNAME` file already sets the custom domain to `groundgame416.ca`.
5. Point the domain's DNS at GitHub Pages (at your domain registrar):
   - Four **A records** for the apex `@`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME record** for `www` → `YOUR-USERNAME.github.io`
6. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is ready
   (can take a little while after DNS propagates).

That's it — your site is live at https://groundgame416.ca and the contact form
emails you directly.

---

## Notes & customization

- **Recipient:** change `TO_EMAIL` in `apps-script/Code.gs` (then redeploy).
- **Replies:** the email's "Reply" goes straight to the person who wrote in.
- **Spam:** the form has a hidden honeypot field that silently blocks most bots.
- **Copy/services:** edit the text directly in `index.html` — sections are clearly
  labelled (`Hero`, `Services`, `About`, `Contact`).
- **Colors:** tweak the variables at the top of `style.css` (`--ink`, `--accent`).
- **Why "no-cors":** the form sends the request in a mode that always reaches Apps
  Script and sends the email, but the browser can't read the reply back. So the site
  shows "success" once the request is sent. If you want true success/failure feedback
  from the server, that requires a small CORS proxy or a paid form service — happy to
  set that up later if you want it.
```
