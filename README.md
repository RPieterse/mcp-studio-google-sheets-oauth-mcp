# Google Sheets (OAuth) MCP — for MCP Studio

OAuth-based Google Sheets MCP. Files are owned by **you** (the
authenticated user), not a service account, so they land in your personal
Drive and ownership/sharing works the normal way.

Companion to [`mcp-studio-google-sheets-mcp`](https://github.com/RPieterse/mcp-studio-google-sheets-mcp)
which uses a service account. The OAuth flavour avoids the
"service-accounts-in-personal-projects can't create files" landmine.

## Setup

You need a Google OAuth Client ID before installing.

1. https://console.cloud.google.com → APIs & Services → **Credentials**.
2. **Create Credentials → OAuth client ID**.
3. **Application type: Desktop app**. (Web app works too if you prefer.)
4. Give it a name (e.g. "MCP Studio Sheets"). Click **Create**.
5. Copy the **Client ID** Google shows you. (No client secret needed —
   Studio uses PKCE.)
6. On the **OAuth consent screen** tab, add your Google email to **Test
   users** if the consent screen is in Testing mode.
7. Make sure **Google Sheets API** and **Google Drive API** are enabled
   (APIs & Services → Library → Enable).

## Install in MCP Studio

```
/install https://github.com/RPieterse/mcp-studio-google-sheets-oauth-mcp
```

Two extra steps because the bundled manifest can't know your Client ID:

1. **Edit the manifest's `client_id`** to your actual OAuth Client ID.
   Open `~/.mcp-widget/mcps/com.rohanpieterse.gsheets_oauth/widget.manifest.json`
   in a text editor and replace `PASTE_YOUR_OAUTH_CLIENT_ID_HERE` with
   the Client ID from setup step 5. Save.
2. Back in Studio: Settings → MCP Servers → Google Sheets (OAuth) →
   expand → click **Authorize in browser**. Approve the consent screen.
   Studio captures the tokens.

After that:

- `/osheet_create Demo` creates a sheet owned by you, in your My Drive.
- `/osheet_read` reads from the most recently created one.

## Why the duplicated trigger names

The service-account MCP uses `/sheet_create`, `/sheet_read`. This OAuth
flavour uses `/osheet_create`, `/osheet_read` so you can have BOTH MCPs
installed at the same time without trigger collisions.

## Caveats

- Studio currently keeps OAuth tokens in memory only (no keychain
  persistence yet — tracked in the main repo's `docs/ROADMAP.md`). You'll
  re-authorize on every Studio launch.
- Google access tokens expire after ~1 hour. The MCP's OAuth2Client
  auto-refreshes IF Google handed us a `refresh_token` on first consent.
  If it didn't (this happens when you've authorized this client before),
  reauthorize with `prompt=consent` once to force a new refresh token.
