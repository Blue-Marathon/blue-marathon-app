/* eslint-disable no-console */
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";

export default (scope) => {
    const socket = socketIOClient('/');

    socket.on("connected", data => {
    // set socketId on scope state
        scope.setState({ socketId: data.socketId });

    // start conversation message
        scope.addMessage({
          className: 'assistant',
          content: `Welcome "${data.socketId}"!`,
        });
    });

    // process status
    socket.on('process-started', data => {
        console.log('process started', data);
        scope.setState({ processing: true });
    });
    socket.on('process-ended', data => {
        console.log('process ended', data);
        scope.setState({ processing: false });
    });
    socket.on('error-message', error => {
      toast.error(error.message);
      scope.setState({ processing: false });
    });

    // text data
    socket.on('textData-processed', data => {
        scope.addMessage({
          className: 'assistant',
          content: data,
        });
    });

    // audio data
    socket.on('audioData-processed-user', data => {
        scope.addMessage({
          className: 'user',
          content: data,
        });
    });
    socket.on('audioData-processed-text', data => {
        scope.addMessage({
          className: 'assistant',
          content: data,
        });
    });

    return socket;
};
