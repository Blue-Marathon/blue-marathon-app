const getSpeechToText = require('./speech-to-text');
const getTextToSpeech = require('./text-to-speech');
const getLanguageTranslator = require('./translator');
const getAssistant = require('./assistant');
const getNLU = require('./nlu');
const getVisualRecognition = require('./recognition');
const Controller = require('./talk.controller');
const Router = require('./talk.router');

module.exports = (credentials, cloudant) => {
    // instantiate Watson APIs
    const stt = getSpeechToText(credentials.stt, cloudant);
    const tts = getTextToSpeech(credentials.tts, cloudant);
    const translator = getLanguageTranslator(credentials.translator, cloudant);
    const assistant = getAssistant(credentials.assistant, cloudant);
    const nlu = getNLU(credentials.nlu, cloudant);
    const recognition = getVisualRecognition(credentials.recognition, cloudant);

    // exposed all controllers related to tss
    const controller = Controller({
        stt,
        tts,
        translator,
        assistant,
        nlu,
        recognition,
    });

    // router to validate user permissions on tss routes
    const router = Router(controller);

    return {
        controller,
        router,
        stt,
        tts,
        translator,
        assistant,
        nlu,
        recognition,
    };
};
