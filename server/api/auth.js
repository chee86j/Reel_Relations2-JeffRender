const express = require("express");
const app = express.Router();
const { User } = require("../db");

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
