module.exports = {
  logs: {
    key: process.env.CLOUDANT_LOGS_KEY,
    url: process.env.CLOUDANT_LOGS_URL,
    host: process.env.CLOUDANT_LOGS_HOST,
    port: process.env.CLOUDANT_LOGS_PORT,
    username: process.env.CLOUDANT_LOGS_USERNAME,
    password: process.env.CLOUDANT_LOGS_PASSWORD,
    collection: process.env.CLOUDANT_LOGS_COLLECTION
  },
  talk: {
    key: process.env.CLOUDANT_TALK_KEY,
    url: process.env.CLOUDANT_TALK_URL,
    host: process.env.CLOUDANT_TALK_HOST,
    port: process.env.CLOUDANT_TALK_PORT,
    username: process.env.CLOUDANT_TALK_USERNAME,
    password: process.env.CLOUDANT_TALK_PASSWORD,
    collection: process.env.CLOUDANT_TALK_COLLECTION
  }
};
