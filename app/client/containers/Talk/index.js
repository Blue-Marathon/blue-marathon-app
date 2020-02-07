/* eslint-disable no-unused-vars */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { animateScroll } from "react-scroll";
import { ReactMic } from 'react-mic';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
// import Camera from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
import websocket from './websocket';
import services from '../../services';

class Talk extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.onAudioSave = this.onAudioSave.bind(this);
    this.sendAudio = this.sendAudio.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.sendText = this.sendText.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  state = {
    languages: [],
    language: false,
    processing: false,
    recording: false,
    socket: false,
    messages: [],
    textData: '',
    audioData: null,
    lastAudioBlob: null,
  }

// lifecycle
  componentDidMount() {
    this.socket = websocket(this);
    services.getLanguages()
      .then(response => {
        const languages = response.data.data.api;
        this.setState({
          languages,
          language: languages[0],
        });
      });
  }

// scroll messages container to the bottom
  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "messages-wrapper"
    });
  }

// language related
  changeLanguage(language) {
    this.setState({ language });
  }

// message related
  createMessage({
    key,
    className,
    timestamp,
    content,
  }) {
    return (
      <div key={key} className={`message ${className}`}>
        <span className="timestamp">{`${timestamp}`}</span>
        <span className="content">{content}</span>
        <span className="arrow-down"></span>
      </div>
    );
  }
  addMessage({
    className,
    content,
  }) {
    let date = (new Date()).toISOString();
    date = date.split('T');
    const timestamp = date[1].replace(/\.[0-9]+Z/, '', 'gm');
    const messages = [...this.state.messages];
    messages.push({
      key: Date.now(),
      className,
      timestamp,
      content,
    });
    this.setState({
      messages,
    });
    this.scrollToBottom();
  }

// text related
  handleEnter(event) {
    if(event.key === 'Enter'){
      this.sendText();
    }
  }
  handleTextInput(event) {
    this.setState({ textData: event.target.value || '' });
  }
  sendText() {
    const {
      language,
      textData,
    } = this.state;
    if (this.state.processing === false) {
      this.socket.emit('textData', {
        language: language.value,
        textData,
      });
      this.addMessage({
        className: 'user',
        content: textData,
      });
      this.setState({
        textData: '',
      });
    }
  }

// audio related
  startRecording() {
    if (this.state.processing === false) {
      this.setState({ recording: true });
    }
  }
  stopRecording() {
    this.setState({ recording: false });
  }
  onAudioSave(data) {
    data.blob.arrayBuffer()
      .then(audioData => {
        this.setState({
          audioData,
        });
        this.sendAudio();
      });
  }
  sendAudio() {
    const {
      language,
      audioData,
    } = this.state;
    if (this.state.processing === false) {
      this.socket.emit('audioData', {
        language: language.value,
        audioData,
      });
      this.setState({
        audioData: null,
      });
    }
  }

  render() {
    return (
      <div role="main" className="talk">
        <Helmet title="Talk to Me!" />

      {/* robot icon */}
        <span className={`robot ${(this.state.processing === false) ? 'standby' : 'processing'}`}>
          <FontAwesomeIcon icon="robot" />
        </span>

      {/* header */}
        <div className="talk-header">
          <div className="logo">
            <Dropdown
              className="language-select ibm-font"
              disabled={this.state.processing}
              onChange={this.changeLanguage}
              options={this.state.languages}
              value={this.state.language}
            />
            <h1 className="ibm-font">Talk</h1>
          </div>
          <div className="menu">
            <h2 className="ibm-font">{this.state.socketId}</h2>
          </div>
        </div>

      {/* body */}
        <div className="talk-body">

        {/* text messages */}
          <div className="talk-body__messages" id="messages-wrapper">
            {this.state.messages.map(message => {
              return this.createMessage(message);
            })}
          </div>

        {/* input controls */}
          <div className="talk-body__input">

          {/* text */}
            <div className="talk-body__input-text">
              <button type="button" onClick={this.sendText}>
                <FontAwesomeIcon icon="envelope" /> send
              </button>
              <input
                type="text"
                value={this.state.textData}
                onKeyPress={this.handleEnter}
                onChange={this.handleTextInput}
              />
            </div>

          {/* audio */}
            <div className="talk-body__input-audio">
              { // stop recording
                (this.state.recording === true) ? 
                  <button type="button" onClick={this.stopRecording} className="active">
                    <FontAwesomeIcon icon="microphone-slash" /> stop
                  </button>
                : null
              }

              { // start recording
                (this.state.recording === false) ? 
                  <button type="button" onClick={this.startRecording}>
                    <FontAwesomeIcon icon="microphone" /> start
                  </button>
                : null
              }

              <ReactMic
                className={`oscilloscope ${(this.state.recording === false) ? 'inactive' : 'active'}`}
                backgroundColor="#4178BE"
                strokeColor="#fff"
                visualSetting="sinewave"
                audioBitsPerSecond={128000}
                record={this.state.recording}
                onSave={this.onAudioSave}
                onStart={this.onAudioStart}
              />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Talk;
