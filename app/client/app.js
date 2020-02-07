/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// setup toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 3000,
  draggable: false,
});

// setup font icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRobot, faEnvelope, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
library.add(faRobot, faEnvelope, faMicrophone, faMicrophoneSlash); // add , icons to libray to be used elsewhere

// containers
import './styles/index.scss';
import Talk from './containers/Talk';

ReactDOM.render(
  <Router>
    <div
      className="wrapper"
      role="main"
    >
      <Switch>
        <Route component={Talk} exact path="/" />
      </Switch>
    </div>
  </Router>,
  document.getElementById('application')
);
