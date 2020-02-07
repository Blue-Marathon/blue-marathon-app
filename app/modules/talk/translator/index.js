const log4js = require('log4js');
const logger = log4js.getLogger('[Language Translator]');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = credentials => {
    logger.debug('language translator credentials', credentials);
    try {
        const translator = new LanguageTranslatorV3({
            authenticator: new IamAuthenticator({ apikey: credentials.key }),
            url: credentials.url,
            version: '2018-05-01',
        });

    // list avaialable translate models
        translator.languages = () => {
            return new Promise((resolve, reject) => {
                translator.listModels()
                    .then(response => {
                        const result = {
                            watson: response.result.models.map(language => {
                                return {
                                    value: language.model_id,
                                    label: language.name,
                                };
                            }),
                            api: credentials.languages,
                        };
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }

    // translate text
        translator.parse = ({
            language,
            text 
        }) => {
            return new Promise((resolve, reject) => {
                const langs = language.split('-');
                translator.translate({
                    // modelId: language,
                    source: langs[0],
                    target: langs[1],
                    text,
                })
                    .then(response => {
                        const result = response.result.translations[0].translation;
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        };

        return translator;
    } catch (error) {
        throw new Error(error);
    }
};
