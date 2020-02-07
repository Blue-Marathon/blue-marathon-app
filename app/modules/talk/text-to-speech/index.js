const log4js = require('log4js');
const logger = log4js.getLogger('[Text to Speech]');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = credentials => {
    logger.debug('text to speech credentials', credentials);
    try {
        const textToSpeech = new TextToSpeechV1({
            authenticator: new IamAuthenticator({ apikey: credentials.key }),
            url: credentials.url,
        });
          
        textToSpeech.convert = text => {
            return new Promise((resolve, reject) => {
                textToSpeech.synthesize({
                    accept: credentials.format,
                    voice: credentials.voice,
                    text,
                })
                    .then(response => {
                        const result = response.result;
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        };

        return textToSpeech;
    } catch (error) {
        throw new Error(error);
    }
};
