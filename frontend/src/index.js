import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
// Redux
import { Provider, } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import { loadState, saveState } from './localStorage'
import rootReducer from './redux/reducers'
import { Workbox } from 'workbox-window'
// Custom
import './WebNotifiation';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const presistedState = loadState();
const store = createStore(rootReducer, presistedState, composeEnhancers(applyMiddleware(thunk)))


if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    wb.register()
        .then(registration => {
            console.log(registration);
        })
        .catch(error => {
            console.log(error)
        });
}
store.subscribe(() => {
    localStorage.setItem('version', '0.4');
    saveState({
        user: store.getState().user,
    })
});
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);