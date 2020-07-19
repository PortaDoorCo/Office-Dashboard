// import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import { save, load } from "redux-localstorage-simple"



const middleware = [thunk];

// const saveToLocalStorage = (state) => {
//     try {
//         const serializedState = JSON.stringify(state)
//         localStorage.setItem('state', serializedState)
//     } catch (e) {
//         console.log(e)
//     }
// }

// const loadFromLocalStorage = (state) => {
//     try {
//         const serializedState = localStorage.getItem('state')
//         if (serializedState === null) return undefined
//         return JSON.parse(serializedState)
//     } catch (e) {
//         console.log(e)
//         return undefined
//     }
// }

// const persistedState = loadFromLocalStorage();

const store = createStore(
    rootReducer,
    load({
        ignoreStates: ['form', 'customers', 'sales', 'users']
    }),
    composeWithDevTools(applyMiddleware(...middleware, save({
        ignoreStates: ['form', 'customers', 'sales', 'users']
    }))));

// store.subscribe(() => saveToLocalStorage(store.getState()))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
