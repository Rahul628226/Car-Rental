import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './Redux/store';
import App from './App.jsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
  <Provider store={store}>
    <ToastContainer/>
    <App />
  </Provider>
  </HelmetProvider>
);


