const log4js = require('log4js');
const logger = log4js.getLogger('[Websocket Handler]');
const socketIo = require("socket.io");

module.exports = (httpServer, config, modules) => {
    const handler = socketIo(httpServer);
     
    handler.on("connection", socket => {
        const assistantId = config.watson.assistant.id;
        let socketId = socket.id;
        let sessionId = false;

    // upon socket connect, emit socket id
        socket.emit('connected', {
            socketId,
            timestamp: Date.now(),
        });
    
    // create watson assistant session for this socketId
        modules.talk.assistant.createSession({
            assistantId,
        })
            .then(response => {
                sessionId = response.result.session_id;
                logger.debug('created assistant session', {
                    socketId,
                    sessionId,
                });
            })
            .catch(error => {
                logger.error(error);
            });

    // upon socket disconnect
        socket.on("disconnect", () => {
        // destroy watson assistant session for this socketId
            modules.talk.assistant.deleteSession({
                assistantId,
                sessionId,
            })
                .then(() => {
                    logger.debug('destroyed assistant session', {
                        socketId,
                        sessionId,
                    });
                    socketId = false;
                    sessionId = false;
                })
                .catch(error => {
                    logger.error(error);
                });
        });

    // handle text data
        socket.on("textData", async data => {
            socket.emit('process-started', {
                timestamp: Date.now(),
                operation: 'textData',
            }); // triggers robot thinking animation start

            const processed = await modules.talk.controller.processText({
                assistantId,
                sessionId,
                language: data.language,
                input: data.textData,
                errorMessage: error => {
                    socket.emit('error-message', error);
                },
            });
            socket.emit('textData-processed', processed); // returns processText chain result

            socket.emit('process-ended', {
                timestamp: Date.now(),
                operation: 'textData',
                language: data.language,
                input: data.textData,
            }); // triggers robot thinking animation end
        });

    // handle audio data
        socket.on("audioData", async data => {
            socket.emit('process-started', {
               timestamp: Date.now(),
               operation: 'audioData',
            }); // triggers robot thinking animation start

            const processed = await modules.talk.controller.processAudio({
                assistantId,
                sessionId,
                language: data.language,
                input: data.audioData,
                errorMessage: error => {
                    socket.emit('error-message', error);
                },
                userMessage: text => { // this will be called once the chain has the user audio converted to text
                    socket.emit('audioData-processed-user', text);
                },
                sendMessage: text => { // this will be called once the chain has the assistant text message
                    socket.emit('audioData-processed-text', text);
                }
            });
            socket.emit('audioData-processed-audio', processed); // return processAudio chain result

            socket.emit('process-ended', {
                timestamp: Date.now(),
                operation: 'audioData',
                language: data.language,
                input: data.auidoData,
            });  // triggers robot thinking animation end
        });
    });
};
