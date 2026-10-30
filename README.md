# NirmanOS website — local review package

This is a self-contained static website for the NirmanOS business-agent ecosystem, with a featured Bhatta Munshi diary demonstration. It is a presentation and interactive prototype. It is not connected to live business agents or WhatsApp, and it does not create accounts, orders, payments or accounting entries.

## Open the website

1. Extract the ZIP into a new folder.
2. Double-click `index.html` to open it in a current browser. The site needs no installation, build step, package download or server.
3. Use English or Hindi, choose a business type, and explore the sample job, diary and setup brief.

If a browser restricts its clipboard API when opening files, download the brief instead. For optional HTTP review, run `python -m http.server 8080 --bind 127.0.0.1` in the extracted folder, then open `http://127.0.0.1:8080`. Stop that local server with Ctrl+C when finished. No publication or hosting deployment was performed.

## Included features

- Seven business profiles: brick kiln, contractor, machinery rental, construction products shop, raw material supplier, manpower supplier and snacks shop.
- Three fictional business-to-business jobs, each with requirement, quotation, owner approval, delivery and settlement stages. The download becomes available only after all five sample actions. Earlier stages can be reviewed without skipping pending actions.
- Evidence dialogs and a downloadable sample JSON record with separate buyer and seller amounts. The records explicitly say that no real order, message or ledger entry was created.
- A Bhatta Munshi diary example with a ₹500 discrepancy. The original rows remain visible; adding the missing expense resolves the difference before sample approval. Reset restores the example.
- A three-step setup brief with business type, priorities, optional business name, town/area and preferred language. Copy or download the resulting text for manual sharing; this is not registration or submission.
- English/Hindi language selection, searchable FAQs, responsive navigation, keyboard controls, dialog focus containment and a bilingual privacy page.
- Local logo, favicon and social preview assets. No remote font or asset dependency.

## Data and connection boundaries

Only the language preference is saved under `nirmanos-language` in browser local storage, when storage is available. The privacy page can remove that preference without clearing unrelated browser storage. Brief answers and demonstration progress remain in the open page; refreshing resets them. Downloaded files are saved only when the visitor requests them.

The site does not upload documents, send messages, verify phone numbers or business documents, discover real suppliers, accept registrations, validate bank payments, or write to real books. All transactions, evidence notes and diary entries are built-in fictional examples. The setup brief is prepared locally and is not transmitted to NirmanOS. There is no analytics or application backend in this package.

Product copy describes the intended ecosystem and its owner-control policy, including use while verification is pending and blocking after rejection. This website demonstrates the concepts; it does not implement or enforce access to real agents. Live JCB, contractor, kiln and supplier systems are outside this package.

## Editing and future configuration

- `index.html` contains page structure and static English/Hindi text attributes.
- `style.css` controls the main site's layout and visual design.
- `data.js` contains the business profiles, sample scenarios, FAQ copy and other bilingual fixtures.
- `app.js` handles language, keyboard behavior, local demonstrations, dialogs and downloads.
- `privacy.html`, `privacy.css` and `privacy.js` provide the separate privacy page.
- `logo.svg`, `favicon.svg`, `og-image.svg` and `og-image.png` are local visual assets.

`SITE_CONFIG` in `data.js` contains empty `whatsappNumber`, `email` and `siteUrl` fields. These fields are reserved and inactive. Assigning values does **not** activate WhatsApp, email, contact or registration links. The setup calls to action currently open the local brief builder. No contact number, email address or public canonical domain has been invented.

Connecting a real number, registration flow or agent service requires an explicit implementation and separate testing. Before publishing, decide the real contact destination and privacy disclosures, add any required backend, and set production social/canonical URLs for the chosen domain. Keep fictional examples clearly labelled.

## Verification and integrity

`TEST-REPORT.json` records the successful checks against these exact static files, including desktop/mobile English and Hindi layouts, workflow behavior, keyboard interaction and direct `file://` opening. It also records zero observed page console errors, failed local asset requests and external page requests during the tested journeys. These checks used an isolated disposable Chromium profile and a separate temporary local server; existing browser tabs and live agents were not accessed.

The clipboard test replaced the browser clipboard API with a test stub and verified the exact copied text; it did not overwrite the user's operating-system clipboard. Actual local file downloads were exercised. The checks cover representative behavior, not a complete assistive-technology audit or every browser version.

`PACKAGE-MANIFEST.json` lists byte counts and SHA-256 digests for each payload file. It is an integrity inventory, not a digital signature. The separately supplied ZIP checksum can verify the archive bytes. The original `nirmanos-site.zip` was preserved unchanged; its SHA-256 is recorded in the manifest and test report.

The ZIP contains only the website assets, this README, the sanitized test report and the integrity manifest. Source extraction folders, browser profiles, downloads, private paths, runtime logs and QA harness files are excluded.
