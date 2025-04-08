const path = require('path');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

module.exports = {
  apps: [{
    name: "admitquest-api",
    script: "./dist/server.js",
    env: {
      NODE_ENV: "development"
    }
  }]
}