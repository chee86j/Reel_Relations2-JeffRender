const axios = require("axios");

const AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USER_INFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

const getGoogleOAuthConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const error = new Error("Google sign-in is not configured");
    error.status = 503;
    throw error;
  }

  return { clientId, clientSecret };
};

const createAuthorizationUrl = ({ redirectUri, state }) => {
  const { clientId } = getGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    state,
    prompt: "select_account",
  });

  return `${AUTHORIZATION_URL}?${params.toString()}`;
};

const exchangeCodeForProfile = async ({ code, redirectUri }) => {
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const tokenParams = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const tokenResponse = await axios.post(TOKEN_URL, tokenParams.toString(), {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

  if (!tokenResponse.data.access_token) {
    const error = new Error("Google did not return an access token");
    error.status = 401;
    throw error;
  }

  const profileResponse = await axios.get(USER_INFO_URL, {
    headers: {
      authorization: `Bearer ${tokenResponse.data.access_token}`,
    },
  });
  const { sub, email, email_verified: emailVerified, name, picture } =
    profileResponse.data;

  if (!sub || !email || !emailVerified) {
    const error = new Error(
      "Google did not return a verified email address for this account"
    );
    error.status = 401;
    throw error;
  }

  return {
    providerId: sub,
    email,
    displayName: name || email.split("@")[0],
    avatarUrl: picture || null,
  };
};

module.exports = {
  createAuthorizationUrl,
  exchangeCodeForProfile,
  getGoogleOAuthConfig,
};
