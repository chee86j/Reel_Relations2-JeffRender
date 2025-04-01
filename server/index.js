// Load environment variables from .env
require('dotenv').config();

// Check if required environment variables are set
const requiredEnvVars = ['API_KEY', 'JWT_SECRET', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`
    Missing required environment variables:
    ${missingEnvVars.join(', ')}
    
    Please ensure all required variables are set in your .env file.
    Check README.md for setup instructions.
  `);
  throw new Error('Missing required environment variables');
}

const app = require("./app");
const { syncAndSeed } = require("./db");

const init = async () => {
  try {
    // Uncomment the line below ONLY for initial database setup or when you need to reset the database
    // await syncAndSeed();
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on Port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
