/*
TODO:
- Loading
- Activities
- Uploading backup files
- removing backups
- displaying suggestions for user
- while login set up language retrieved from API (both front and admin)
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'components/app/app.component';
import store from 'config/store';

import * as serviceWorker from './serviceWorker';

import './index.scss';
import 'config/i18n';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
