// TODO: determine if this is correct and safe
require('dotenv').config('../../');

module.exports = {
  nav: {
    host: process.env.NAV_HOST,
    endpoint: process.env.NAV_ENDPOINT,
  },
  proxy: {
    agent: process.env.PROXY_AGENT,
  },
  corsOrigin: process.env.CORS_ORIGIN,
  authUrl: process.env.NODE_AUTH_URL,
  share: {
    drive: process.env.SHARE_DRIVE,
    routeFolder: process.env.SHARE_ROUTE_FOLDER,
    domain: process.env.SHARE_DOMAIN,
    username: process.env.SHARE_USERNAME,
    password: process.env.SHARE_PASSWORD,
  },
};
