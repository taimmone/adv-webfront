/** @format */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import authReducer from '../../redux/reducers/authReducer';
import cartReducer from '../../redux/reducers/cartReducer';
import notificationReducer from '../../redux/reducers/notificationReducer';
import ordersReducer from '../../redux/reducers/ordersReducer';
import productsReducer from '../../redux/reducers/productsReducer';
import usersReducer from '../../redux/reducers/usersReducer';

export const defaultState = {
  notification: {},
  auth: {},
  products: [],
  cart: [],
  users: [],
  orders: []
};

export const defaultReducers = combineReducers({
  notification: notificationReducer,
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  users: usersReducer,
  orders: ordersReducer
});

/**
 * Create a testing store with imported reducers, middleware, and initial state.
 * globals: rootReducer, middlewares
 * @param  {object}  initialState - Initial state for the store.
 * @function  storeFactory
 * @returns  {Store} - Redux Store
 */
export const storeCreator = (reducers = defaultReducers, preloadedState = defaultState) => {
  return createStore(reducers, preloadedState, applyMiddleware(thunk));
};

const mockStore = configureStore([]);
export const mockStoreCreator = preloadedState => {
  return mockStore(preloadedState, applyMiddleware(thunk));
};
