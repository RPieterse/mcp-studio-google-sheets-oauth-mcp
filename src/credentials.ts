/**
 * OAuth-flavoured credentials. Studio's oauth2_pkce auth runs the browser
 * dance and stores `{ access_token, refresh_token, expires_in, scope, ... }`
 * in the keychain under `store_as`. We get those fields back through env at
 * MCP spawn time. The OAuth client_id is needed too so this MCP can refresh
 * the access token when it expires (googleapis OAuth2Client handles that
 * automatically once we hand it the trio + the client_id).
 */

export interface OAuthCredentials {
  client_id: string;
  /** Required for Google's token refresh — Google's Desktop OAuth needs
   *  the client_secret on every token-endpoint call, even with PKCE. */
  client_secret: string;
  access_token: string;
  refresh_token: string;
}

export function parseOAuthEnv(): OAuthCredentials {
  const client_id = (process.env.GOOGLE_OAUTH_CLIENT_ID ?? "").trim();
  const client_secret = (process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "").trim();
  const access_token = (process.env.GOOGLE_OAUTH_ACCESS_TOKEN ?? "").trim();
  const refresh_token = (process.env.GOOGLE_OAUTH_REFRESH_TOKEN ?? "").trim();
  if (!client_id) {
    throw new Error(
      "GOOGLE_OAUTH_CLIENT_ID is empty. Set the OAuth Client ID via Settings -> MCP Servers -> Google Sheets (OAuth) -> client_id field. Studio writes it into the keychain when you save the credentials form.",
    );
  }
  if (!access_token) {
    throw new Error(
      "GOOGLE_OAUTH_ACCESS_TOKEN is empty. Open Settings -> MCP Servers -> Google Sheets (OAuth) and click 'Authorize in browser' to run the OAuth flow.",
    );
  }
  // client_secret can technically be empty if the OAuth provider doesn't
  // require it, but Google DOES — we surface a soft warning, not an
  // error, because some providers happily work without it.
  if (!client_secret) {
    console.error(
      "[google-sheets-oauth-mcp] warning: GOOGLE_OAUTH_CLIENT_SECRET is empty. Google's token refresh will fail when the access token expires. Save the client_secret field in Settings -> MCP Servers -> Google Sheets (OAuth) to enable auto-refresh.",
    );
  }
  // refresh_token can be empty on subsequent auths (Google only returns it
  // on first consent unless `prompt=consent` is forced).
  return { client_id, client_secret, access_token, refresh_token };
}
