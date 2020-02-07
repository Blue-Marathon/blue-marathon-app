const Cloudant = require('../helpers/cloudant');
const Talk = require('./talk');

module.exports = config => {
    const cloudant = Cloudant(config.cloudant.talk);
    const talk = Talk(config.watson, cloudant);

    return {
        talk,
    };
};
