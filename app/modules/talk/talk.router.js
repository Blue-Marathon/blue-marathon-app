const { Router } = require('express');
const responses = require('../../helpers/http')(require('./talk.response.json'));

module.exports = (controller) => {
  const router = Router();

// list languages
  router.get('/languages', async (req, res) => {
    try {
      const result = await controller.languages();
      return responses.talk(res, 'success', { data: result });
    } catch (error) {
      return responses.talk(res, 'error', error);
    }
  });

// process text data
  const processText = async (req, res) => {
    try {
      const content = req.body.text || req.params.content;
      const result = await controller.processText(content);
      return responses.talk(res, 'success', { data: result });
    } catch (error) {
      return responses.talk(res, 'error', error);
    }
  };
  router.post('/text', processText); // POST, req.body.text
  router.get('/text/:content', processText); // GET, req.params.content

// process audio data
  const processAudio = async (req, res) => {
    try {
      const result = await controller.processAudio();
      return responses.talk(res, 'success', { data: result });
    } catch (error) {
      return responses.talk(res, 'error', error);
    }
  }
  router.post('/audio', processAudio);
  
  return router;
};
