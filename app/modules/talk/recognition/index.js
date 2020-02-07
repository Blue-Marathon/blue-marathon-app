const log4js = require('log4js');
const logger = log4js.getLogger('[Visual Recognition]');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = credentials => {
    logger.debug('recognition credentials', credentials);
    try {
        const recognition = new VisualRecognitionV3({
            authenticator: new IamAuthenticator({ apikey: credentials.key }),
            url: credentials.url,
            version: '2018-03-19',
        });
        return recognition;
    } catch (error) {
        throw new Error(error);
    }
};
