module.exports = {
  stt: {
    key: process.env.WATSON_STT_KEY,
    url: process.env.WATSON_STT_URL,
    contentType: process.env.WATSON_STT_CONTENT_TYPE,
    languages: JSON.parse(process.env.WATSON_STT_LANGUAGES),
  },
  tts: {
    key: process.env.WATSON_TTS_KEY,
    url: process.env.WATSON_TTS_URL,
    format: process.env.WATSON_TTS_FORMAT,
    voice: process.env.WATSON_TTS_VOICE,
  },
  translator: {
    key: process.env.WATSON_TRANSLATOR_KEY,
    url: process.env.WATSON_TRANSLATOR_URL,
    languages: JSON.parse(process.env.WATSON_TRANSLATOR_LANGUAGES),
  },
  assistant: {
    key: process.env.WATSON_ASSISTANT_KEY,
    url: process.env.WATSON_ASSISTANT_URL,
    name: process.env.WATSON_ASSISTANT_NAME,
    id: process.env.WATSON_ASSISTANT_ID,
    gateway: process.env.WATSON_ASSISTANT_GATEWAY,
  },
  nlu: {
    key: process.env.WATSON_NLU_KEY,
    url: process.env.WATSON_NLU_URL,
  },
  recognition: {
    key: process.env.WATSON_RECOGNITION_KEY,
    url: process.env.WATSON_RECOGNITION_URL,
  }
};
