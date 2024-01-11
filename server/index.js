// Load environment variables from Secrets.js
try {
  require("./Secrets");
} catch (ex) {
  console.log(ex);
  console.log("Check README.md to create Secrets.js if running locally");
}

// Check if required environment variables are set
if (!process.env.API_KEY) {
  console.log(`
    You need to set up Secrets.js in this folder\n
    In Secrets.js\n
    process.env.API_KEY = 'YOUR KEY!!';
  `);
  throw new Error("NO API KEY");
}

const app = require("./app");
const { syncAndSeed } = require("./db");

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on Port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
