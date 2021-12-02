// import 'react-app-polyfill/ie9'; // For IE 9-11 support
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Cookies from 'js-cookie';
import React from 'react';
import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { load, save } from 'redux-localstorage-simple';
import thunk from 'redux-thunk';
import App from './App';
import './index.css';
import './polyfill';
import rootReducer from './rootReducer';
import * as serviceWorker from './serviceWorker';
const cookie = Cookies.get('jwt');



const middleware = [thunk];

if (!cookie) {
  localStorage.removeItem('redux_localstorage_simple');
}

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  dsn: dsn,
  integrations: [new Integrations.BrowserTracing()],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options
});


const store = createStore(
  rootReducer,
  load({
    ignoreStates: ['form', 'sales', 'users', 'customers', 'Orders']
  }),
  composeWithDevTools(applyMiddleware(...middleware, loadingBarMiddleware(), save({
    ignoreStates: ['form', 'sales', 'users', 'customers', 'Orders']
  })), sentryReduxEnhancer)
);



ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();