const log4js = require('log4js');
const logger = log4js.getLogger('[Talk Controller]');

module.exports = ({
  stt,
  // tts,
  translator,
  assistant,
  // nlu,
  // recognition,
}) => {
// process text that came through http request
  const processText = async ({
    errorMessage,
    assistantId,
    sessionId,
    language,
    input,
  }) => {
    try {
      logger.debug('started processText chain', {
        assistantId,
        sessionId,    
        language,
        input,
      });
      let text = input;

    // translator
      if (language !== false) {
        const translated = await translator.parse({
          language,
          text,
        });
        logger.debug('translated', language, text, translated);
        text = translated;
      }

    // assistant
      const message = await assistant.sendMessage({
        assistantId,
        sessionId,
        input: text,
      });
      logger.debug('assistant', message);

      logger.debug('ended processText chain', {
        message,
      });
      return message;
    } catch (error) {
      logger.error(error);
      errorMessage(error);
      throw new Error(error);
    }
  };

// process audio that came through http request
  const processAudio = async ({
    errorMessage,
    userMessage,
    sendMessage,
    assistantId,
    sessionId,
    language,
    input,
  }) => {
    try {
      logger.debug('started processAudio chain', {
        assistantId,
        sessionId,    
        language,
        input,
      });
      let text = null;

    // stt
      text = await stt.convert({
        language,
        audio: input,
      });
      logger.debug('speech to text', text);
      userMessage(text);

    // translator
      if (language !== false) {
        const translated = await translator.parse({
          language,
          text,
        });
        logger.debug('translated', language, text, translated);
        text = translated;
      }

    // assistant
      const message = await assistant.sendMessage({
        assistantId,
        sessionId,
        input: text,
      });
      sendMessage(message);
      logger.debug('assistant', message);

    // tts
      // const speech = await tts.convert(message);
      // logger.debug('\ntts', speech);

      logger.debug('ended processAudio chain', {
        message,
      });
      return message;
    } catch (error) {
      logger.error(error);
      errorMessage(error);
      throw new Error(error);
    }
  };

  return {
    languages: translator.languages,
    processText,
    processAudio,
  }
};
