// require("dotenv").config();
const conn = require("./conn");
const { JSON, STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const axios = require("axios");

// Helper function to convert URL to base64
async function urlToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 5000
    });
    
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to convert avatar URL to base64: ${error.message}`);
    return null;
  }
}

const User = conn.define("user", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  login: {
    type: STRING,
    unique: true,
  },
  username: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    unique: {
      args: true,
      msg: "Username Already Exists",
    },
  },
  email: {
    type: STRING,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
    unique: {
      args: true,
      msg: "Email Already In Use.",
    },
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isAdmin: {
    type: BOOLEAN,
    defaultValue: false,
  },
  place: {
    type: JSON,
    defaultValue: {},
  },
  avatar: {
    type: TEXT,
  },
});

User.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 5);
  }
});

User.findByToken = async function (token) {
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await this.findByPk(id);
    if (user) {
      return user;
    }
    throw new Error("user not found");
  } catch (ex) {
    const error = new Error("bad credentials");
    error.status = 401;
    throw error;
  }
};

User.prototype.generateToken = function () {
  const token = jwt.sign({ id: this.id }, JWT_SECRET);
  return token;
};

User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({
    where: {
      username,
    },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    return jwt.sign({ id: user.id }, JWT_SECRET);
  }
  const error = new Error("Bad Credentials");
  error.status = 401;
  throw error;
};

User.authenticateGithub = async function (code) {
  let response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      code,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      client_id: process.env.GITHUB_CLIENT_ID,
    },
    {
      headers: {
        accept: "application/json",
      },
    }
  );
  const { access_token, error } = response.data;
  if (error) {
    const _error = Error(error);
    _error.status = 401;
    throw _error;
  }

  // Fetch user profile from GitHub
  response = await axios.get("https://api.github.com/user", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });

  const { login, avatar_url, email, name } = response.data;

  // Convert GitHub avatar_url to base64
  const avatarBase64 = await urlToBase64(avatar_url);

  // If email is private, fetch emails separately
  let userEmail = email;
  if (!userEmail) {
    const emailsResponse = await axios.get("https://api.github.com/user/emails", {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });
    userEmail = emailsResponse.data.find(e => e.primary)?.email || `${login}@github.com`;
  }

  let user = await User.findOne({
    where: { 
      login 
    },
  });

  if (!user) {
    // Create new user with GitHub info
    user = await User.create({
      login,
      username: name || login,
      password: `gh_${Math.random().toString(36).slice(2)}`,
      email: userEmail,
      avatar: avatarBase64 || avatar_url,
    });
  } else {
    // Update existing user's GitHub info
    await user.update({
      username: name || login,
      email: userEmail,
      avatar: avatarBase64 || avatar_url,
    });
  }

  return user.generateToken();
};

module.exports = User;
