const log4js = require('log4js');
const logger = log4js.getLogger('[Assistant]');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

module.exports = credentials => {
    logger.debug('assistant credentials', credentials);
    try {
        const assistant = new AssistantV2({
            authenticator: new IamAuthenticator({ apikey: credentials.key }),
            url: credentials.url,
            version: '2019-02-28',
        });
   
        assistant.sendMessage = ({
            assistantId,
            sessionId,
            input,
        }) => {
            return new Promise((resolve, reject) => {
                assistant.message({
                    assistantId,
                    sessionId,
                    input: {
                        'message_type': 'text',
                        'text': input
                    }
                })
                    .then(response => {
                        const result = response.result.output.generic[0].text;
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        };

        return assistant;
    } catch (error) {
        throw new Error(error);
    }
};
