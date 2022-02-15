/** @format */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import cartReducer from './reducers/cartReducer';
import notificationReducer from './reducers/notificationReducer';
import usersReducer from './reducers/usersReducer';
import productsReducer from './reducers/productsReducer';
import authReducer from './reducers/authReducer';

// Redux-devtools extension library
import { composeWithDevTools } from 'redux-devtools-extension';
import ordersReducer from './reducers/ordersReducer';

export const reducers = combineReducers({
	cart: cartReducer,
	notification: notificationReducer,
	users: usersReducer,
	products: productsReducer,
	auth: authReducer,
	orders: ordersReducer,
});

export default createStore(
	reducers,
	composeWithDevTools(applyMiddleware(thunk))
);
