import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import App from "./App";
import './index.css';
import store from './Redux/store'; // Import your Redux store

ReactDOM.render(
    <Provider store={store}> {/* Wrap the app with Provider */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
