const log4js = require('log4js');
const logger = log4js.getLogger('[Natural Language Understanding]');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = credentials => {
    logger.debug('nlu credentials', credentials);
    try {
        const nlu = new NaturalLanguageUnderstandingV1({
            authenticator: new IamAuthenticator({ apikey: credentials.key }),
            url: credentials.url,
            version: '2018-04-05',
        });
        return nlu;
    } catch (error) {
        throw new Error(error);
    }
};
