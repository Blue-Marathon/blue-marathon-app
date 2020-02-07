const log4js = require('log4js');
const logger = log4js.getLogger('[Speech to Text]');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = credentials => {
    logger.debug('speech to text credentials', credentials);

    const resolveModel = source => {
        let result = false;
        credentials.languages.forEach(lang => {
            if (lang.value === source) result = lang.model;
        });
        return result;
    };

    try {
        const speechToText = new SpeechToTextV1({
            authenticator: new IamAuthenticator({ apikey: credentials.key }),
            url: credentials.url,
        });

        speechToText.convert = ({
            language,
            audio,
         }) => {
            return new Promise((resolve, reject) => {
                const model = resolveModel(language) || undefined;
                logger.debug('resolved model for stt', model);
                speechToText.recognize({
                    audio,
                    contentType: credentials.contentType,
                    model,
                })
                    .then(response => {
                        const result = response.result.results[0].alternatives[0].transcript;
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        };

        return speechToText;
    } catch (error) {
        throw new Error(error);
    }
};
