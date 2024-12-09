import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Provider} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserReducer from  './store/userReducer'
import PlansReducer from './store/plansReducer'
import BoxesReducer from './store/boxesReducer'
import FeedbackReducer from './store/feedbackReducer'
import VendasReducer from './store/vendasReducer'

const store = configureStore({
  reducer:{
    users: UserReducer,
    plans: PlansReducer,
    boxes: BoxesReducer,
    feedbacks: FeedbackReducer,
    vendas: VendasReducer
  }
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
