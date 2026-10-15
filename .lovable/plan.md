# Put Muslim al Muslim on GitHub as a new synced repository

## What happens

The repository is created by GitHub's own authorization screen, so that click has to come from you. Once you make it, everything after is automatic and I verify it.

## Step 1 — You connect GitHub (about 2 minutes, no credits needed)

1. Open the project in the Lovable editor
2. Click **Plus (+)** in the chat input at the bottom-left
3. Choose **GitHub → Connect project**
4. Authorize the Lovable GitHub App when GitHub asks
5. Pick the account or organization the repository should live under
6. Click **Create Repository**

On a phone: Chat mode → the **`...`** button at the bottom-right → **GitHub**.

## Step 2 — I confirm the upload landed

Once you say it's done, I check from the project side that the repository link is live and that your app's files were pushed, then tell you the repository address and what's in it.

## Step 3 — Optional tidying (only if you want it)

- **Project description file** — the repository currently carries Lovable's stock welcome text. I can replace it with a short page describing the app, its features, and the credit line "From Hafiz Imran Badar | Made by Muhammad Hassan Rehan Badar".
- **Hidden settings file** — your project ships a small config file containing only the backend's public address and publishable key (the same values already inside the app anyone can open). Private server keys are not in it and cannot be pushed. Leaving it in the repository keeps the app working for anyone who clones it; taking it out means every clone has to be configured by hand. Tell me which you prefer — by default I leave it as it is.

## What will not be on GitHub

- **Your database data** — user accounts, phone numbers, profiles, prayer settings and AI chat history stay in Lovable Cloud. Export separately from More → Database if you need a copy.
- **Private server keys** — the service key and database password are not available to this app at all, so there is nothing of that kind to leak into the repository.

## After it is connected

Sync runs both ways on its own. Edits made here reach GitHub without you pushing, and commits you make from your own machine reach Lovable without you pulling. You can also switch branches from the editor, review changes through pull requests, and download the codebase as a ZIP from the Code Editor.
