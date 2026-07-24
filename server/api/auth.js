const express = require("express");
const app = express.Router();
const crypto = require("crypto");
const { User } = require("../db");
const { createAuthorizationUrl } = require("../auth/googleOAuth");

const GOOGLE_STATE_COOKIE = "google_oauth_state";
const GOOGLE_CALLBACK_PATH = "/api/auth/oauth/google";
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000;

const getCookie = (req, name) => {
  const cookies = (req.headers.cookie || "").split(";");

  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");
    if (separator === -1) continue;

    const cookieName = cookie.slice(0, separator).trim();
    if (cookieName === name) {
      return decodeURIComponent(cookie.slice(separator + 1).trim());
    }
  }

  return null;
};

const getGoogleRedirectUri = (req) =>
  process.env.GOOGLE_REDIRECT_URI ||
  `${req.protocol}://${req.get("host")}${GOOGLE_CALLBACK_PATH}`;

const statesMatch = (expected, received) => {
  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

const sendAuthenticationSuccess = (res, token) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8"><title>Signing in…</title></head>
      <body>
        <script>
          window.localStorage.setItem("token", ${JSON.stringify(token)});
          window.location.replace("/");
        </script>
      </body>
    </html>
  `);
};

module.exports = app;

app.post("/", async (req, res, next) => {
  try {
    res.send(await User.authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});
app.get("/github/callback", async (req, res, next) => {
  try {
    const { code, state } = req.query;
    
    // Validate required parameters
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Get token and create/update user
    const token = await User.authenticateGithub(code);
    
    // Return success response with token
    res.send(`
      <html>
        <body>
          <script>
            try {
              window.localStorage.setItem('token', '${token}');
              window.location = '/';
            } catch (err) {
              console.error('Failed to store token:', err);
              window.location = '/login?error=auth_failed';
            }
          </script>
        </body>
      </html>
    `);
  } catch (ex) {
    console.error('GitHub OAuth error:', ex);
    res.redirect('/login?error=' + encodeURIComponent(ex.message || 'Authentication failed'));
  }
});

app.get("/oauth/google/start", (req, res, next) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    const redirectUri = getGoogleRedirectUri(req);

    res.cookie(GOOGLE_STATE_COOKIE, state, {
      httpOnly: true,
      maxAge: OAUTH_STATE_MAX_AGE_MS,
      path: GOOGLE_CALLBACK_PATH,
      sameSite: "lax",
      secure: req.secure,
    });
    res.redirect(createAuthorizationUrl({ redirectUri, state }));
  } catch (error) {
    next(error);
  }
});

app.get("/oauth/google", async (req, res) => {
  const { code, error: oauthError, state } = req.query;
  const expectedState = getCookie(req, GOOGLE_STATE_COOKIE);

  res.clearCookie(GOOGLE_STATE_COOKIE, {
    httpOnly: true,
    path: GOOGLE_CALLBACK_PATH,
    sameSite: "lax",
    secure: req.secure,
  });

  try {
    if (oauthError) {
      const error = new Error("Google sign-in was cancelled");
      error.status = 401;
      throw error;
    }
    if (!code) {
      const error = new Error("Google authorization code is required");
      error.status = 400;
      throw error;
    }
    if (!statesMatch(expectedState, state)) {
      const error = new Error("Google sign-in state validation failed");
      error.status = 401;
      throw error;
    }

    const token = await User.authenticateGoogle({
      code,
      redirectUri: getGoogleRedirectUri(req),
    });
    sendAuthenticationSuccess(res, token);
  } catch (error) {
    console.error("Google OAuth error:", error.message);
    res.redirect(
      `/login?error=${encodeURIComponent(
        error.message || "Google authentication failed"
      )}`
    );
  }
});

app.get("/", async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

// special route for updating avatar
app.put("/", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    await user.update({ avatar: req.body.avatar });
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});
