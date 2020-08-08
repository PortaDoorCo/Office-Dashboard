import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from '../SideBar';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../../../../../rootReducer";

const middleware = [thunk];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

it('renders without crashing', () => {
    const div = document.createElement('div');
    SideBar.defaultProps = { part: {
        construction: { name: 'Cope And Stick', value: 'Cope' },
        orderType: { name: 'Door Order', value: 'Door' },
        thickness: { name: '4/4', value: 0.75 },
        dimensions: [],
        addPrice: 0
    } };
    ReactDOM.render(
        <Provider store={store}>
            <SideBar />
        </Provider>
        , div);
    ReactDOM.unmountComponentAtNode(div);
});