# NirmanOS Hindi-first website — polished review package

## Revision note, 30 Oct 2026 (Claude)
Fixes to `workflow.html`, `workflow.js`, `workflow-data.js`, `workflow.css` and one line of `index.html`:
the estimate is now shown only as the contractor's private check; nothing is due before the bill; each phone shows only its own chat, and the site count stays on the contractor's side;
the status after acceptance says payment is pending; the 48-bag case says 48; the forged case shows a fake rate in the supplier's name with no message on anyone's phone;
books, notes and checks follow the language switch; the message label is no longer mirrored; the phone tab row no longer covers the first panel; checks show a tick.
**`TEST-REPORT.json` covers the earlier files, not these.** These fixes were checked by hand in Chromium at desktop and 375 px width: 7 of the 8 chapters in English (not 03 Delivery), 3 cases, play through chapter 1, and chapter 1 in Hindi. The original test harness was not re-run.
No contact button yet: the WhatsApp number and email are still to be chosen by the owner.

This is a self-contained, Hindi-first static website for the NirmanOS business-agent ecosystem. The homepage explains the business experience with simple examples; a dedicated workflow page animates an illustrative contractor-to-supplier order; a separate technical page contains the architecture and technical FAQs. It is a presentation and interactive prototype. It is not connected to a live AI model, business agents or WhatsApp, and it does not create accounts, orders, payments or accounting entries.

## Open the website

1. Extract the ZIP into a new folder.
2. Double-click `index.html` to open it in a current browser. The site needs no installation, build step, package download or server.
3. Start in Hindi, or choose English. Explore a business type, the sample job, diary and setup brief. Open `technical.html` for the Agent Studio and technical explanation.
4. Open `workflow.html` to play the two-business cement-order story, choose a chapter, adjust playback speed, or inspect invalid-signature, duplicate-message and count-mismatch examples. WhatsApp dialogue stays in Hindi; explanatory captions can switch to English.

A valid `?lang=en` or `?lang=hi` takes precedence over a saved preference. Otherwise a saved English/Hindi choice is remembered; a fresh visitor starts in Hindi. Cross-page links retain the current language.

If a browser restricts its clipboard API when opening files, download the brief instead. For optional HTTP review, run `python -m http.server 8080 --bind 127.0.0.1` in the extracted folder, then open `http://127.0.0.1:8080`. Stop that local server with Ctrl+C when finished. No publication or hosting deployment was performed for this revision.

## Included features

- A separate technical page with an interactive Agent Studio for brick, machinery and shop-supply scenarios. Each run displays intent extraction, directory matching, an agent-to-agent request and an owner-approval pause. All messages and offer amounts are fictional fixtures; there is no model call, live search or automatic purchase. Replay, reset and scenario changes are supported. Reduced-motion mode shows the result immediately.
- A separate, paused-by-default workflow animation for a contractor and a supplier. It shows a ₹20,650 estimate based on a known ₹350 rate plus 18% GST, the supplier's ₹380 quote and ₹22,420 total, bill and delivery checks, a private site count, contractor approval, a cash-payment claim and supplier confirmation. Animation controls are local; no WhatsApp message is sent.
- Branches explain a forged signature (rejected before ledger write), a repeated signed message (same receipt and no new entry), and a 50-versus-48 count mismatch (surfaced for a contractor decision). The animation shows separate sample ledgers and an illustrative receipt/fingerprint; it does not claim production cryptographic validation or use a central ledger.
- The workflow story makes the decision boundaries explicit: AI helps read and explain; code checks the permitted operation, values and state; people approve and decide; each business controls its own book. A cash payment is shown as a claim until the supplier confirms receipt. No bank confirmation is implied.
- Seven business profiles: brick kiln, contractor, machinery rental, construction products shop, raw material supplier, manpower supplier and snacks shop.
- One visible fictional job on the homepage with requirement, quotation, owner approval, delivery and settlement stages. Its download becomes available only after all five sample actions. Earlier stages can be reviewed without skipping pending actions. Two additional fixtures remain in the source and are checked programmatically; the homepage does not present a scenario selector.
- Evidence dialogs and a downloadable sample JSON record with separate buyer and seller amounts. The records explicitly say that no real order, message or ledger entry was created.
- A Bhatta Munshi diary example with a ₹500 discrepancy. The original rows remain visible; adding the missing expense resolves the difference before sample approval. Reset restores the example.
- A three-step setup brief with business type, priorities, optional business name, town/area and preferred language. Copy or download the resulting text for manual sharing; this is not registration or submission.
- Six customer FAQs on the homepage and nine technical FAQs on the technical page. The latter explain orchestration, context, A2A/API contracts, access checks, ledger authority, uncertainty, discovery consent, model integration and what is currently implemented.
- Hindi/English language selection, responsive navigation, keyboard controls, dialog focus containment and a bilingual privacy page. Visual effects respect reduced motion; the underlying content remains available without entry effects.
- Local logo, favicon and social preview assets. No remote font or asset dependency.

## Data and connection boundaries

Only the language preference is saved under `nirmanos-language` in browser local storage, when storage is available. The privacy page can remove that preference without clearing unrelated browser storage. Brief answers and demonstration progress remain in the open page; refreshing resets them. Downloaded files are saved only when the visitor requests them.

The site does not upload documents, send messages, verify phone numbers or business documents, discover real suppliers, accept registrations, validate bank payments, or write to real books. All transactions, evidence notes and diary entries are built-in fictional examples. The homepage's 50-versus-48 shortage illustration is explanatory copy, not an actual delivery claim or ledger record. The setup brief is prepared locally and is not transmitted to NirmanOS. There is no analytics or application backend in this package. A real WhatsApp contact and pricing remain undecided and are not fabricated here.

Product copy describes the intended ecosystem and its owner-control policy, including use while verification is pending and blocking after rejection. This website demonstrates the concepts; it does not implement or enforce access to real agents. Live JCB, contractor, kiln and supplier systems are outside this package.

## Editing and future configuration

- `index.html` contains page structure and static English/Hindi text attributes. `workflow.html` contains the separate process animation and its chapter controls.
- `style.css` controls the main site's layout; `ai.css` adds the AI presentation and architecture styles.
- `data.js` contains the homepage's business profiles, sample scenarios, six customer FAQs and bilingual fixtures. `technical-data.js` contains the nine technical FAQs and is loaded only by the technical page.
- `app.js` handles language, keyboard behavior, local demonstrations, dialogs and downloads.
- `ai.js` runs the technical page's fixture-based Agent Studio and respects reduced motion. It does not use a model API or share data with the other demonstrations.
- `workflow-data.js` contains the eight fictional order chapters; `workflow.js` runs the local animation, sample ledgers, receiver checks and exception branches; `workflow.css` styles the responsive agent-to-agent message path. These fixtures are not real orders, records, keys or signatures.
- `technical.html`, `technical.css` and `technical.js` provide the separate technical page, language controls and technical FAQ renderer.
- `polish.css` and `polish.js` add visual interaction effects and section-navigation behavior. These enhancements do not grant permissions or change business records.
- `privacy.html`, `privacy.css` and `privacy.js` provide the separate privacy page.
- `logo.svg`, `favicon.svg`, `og-image.svg` and `og-image.png` are local visual assets.

`SITE_CONFIG` in `data.js` contains empty `whatsappNumber`, `email` and `siteUrl` fields. These fields are reserved and inactive. Assigning values does **not** activate WhatsApp, email, contact or registration links. The setup calls to action currently open the local brief builder. No contact number or email address has been invented.

`CNAME` preserves the user's existing, verified GitHub Pages domain: `nirman-os.in`. Keep this file when replacing the files in the existing site repository. It does not change DNS or deploy the website by itself. The archive has `index.html` at its root, ready for upload to the existing publishing directory when the user chooses.

This revision uses versioned local CSS and JavaScript references (`20261030-flow4` for the refreshed pages and `20261030-hi3` for the unchanged privacy page). Keep those references intact when uploading the files together. If the user publishes this package, replace the existing files at the publishing root rather than uploading the ZIP itself or nesting the site in another folder. The seven business profiles, sample-job workflow, diary, brief builder and privacy controls are retained.

Connecting a real number, registration flow, AI provider or agent service requires an explicit implementation and separate testing. Before publishing, confirm the real contact destination, privacy disclosures and existing domain settings, and add any required backend. Keep fictional examples clearly labelled.

## Verification and integrity

`TEST-REPORT.json` records the successful checks against these exact static files, including desktop/mobile English and Hindi layouts, the AI illustration and its cancellation/approval boundaries, reduced motion, technical FAQs, order-workflow branches, keyboard interaction and direct `file://` opening. It also records zero observed page console errors, failed local asset requests and external page requests during the tested journeys. These checks used an isolated disposable Chromium profile and a separate temporary local server; existing browser tabs and live agents were not accessed.

The clipboard test replaced the browser clipboard API with a test stub and verified the exact copied text; it did not overwrite the user's operating-system clipboard. Actual local file downloads were exercised. The checks cover representative behavior, not a complete assistive-technology audit or every browser version.

The report includes single-run local page measurements at a 390px viewport with 4× CPU slowdown, 150ms simulated network latency and constrained throughput. These are synthetic Chromium observations, not physical-phone measurements, Lighthouse scores, production CDN results or performance guarantees. Request/body-size totals describe responses from the temporary uncompressed local server; production compression and caching can differ.

`PACKAGE-MANIFEST.json` lists byte counts and SHA-256 digests for each payload file. It is an integrity inventory, not a digital signature. The separately supplied ZIP checksum can verify the archive bytes. The original `nirmanos-site.zip`, the first refreshed delivery and the AI-site delivery were preserved unchanged; their SHA-256 digests are recorded in the manifest and test report.

The ZIP contains only the website assets, this README, the sanitized test report and the integrity manifest. Source extraction folders, browser profiles, downloads, private paths, runtime logs and QA harness files are excluded.
