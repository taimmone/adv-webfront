/** @format */

//Own utils for testing
import {
	config,
	dispatch,
	display,
	displayingCorrectComponents,
} from '../utils/tools';

//App-store:
import state from '../utils/testStoreState';
import { defaultState } from '../utils/testStores';

//Component(s) to test:
import App from '../../App';

//Dispatched Actions
import { initApp } from '../../redux/actionCreators/appActions';
const { guest, customer, admin, orders } = state;
const generalComponentPaths = {
	'home-component': '/',
	'products-component': '/products',
	'not-found-component': '/doesntexist',
};
const guestSpecificComponentPaths = {
	'register-component': '/register',
	'login-component': '/login',
};
const guestCustomerSpecificComponentPaths = {
	'cart-component': '/cart',
};
const customerAdminSpecificComponentPaths = {
	'orders-component': '/orders',
};
const adminSpecificComponentPaths = {
	'users-component': '/users',
};

const setupConfig = config({
	component: <App />,
	// startingPath: '/',
	preloadedState: { ...defaultState, auth: guest },
});
describe('App-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		display(['app-component', 'navbar-component'], setupConfig);
	});
	displayingCorrectComponents({
		mainComponent: <App />,
		displayComponents: {
			...generalComponentPaths,
			...guestSpecificComponentPaths,
			...guestCustomerSpecificComponentPaths,
		},
		displayNotComponents: {
			...customerAdminSpecificComponentPaths,
			...adminSpecificComponentPaths,
		},
		preloadedState: { ...defaultState, auth: guest },
	});
	displayingCorrectComponents({
		mainComponent: <App />,
		displayComponents: {
			...generalComponentPaths,
			...customerAdminSpecificComponentPaths,
			...guestCustomerSpecificComponentPaths,
		},
		displayNotComponents: {
			...guestSpecificComponentPaths,
			...adminSpecificComponentPaths,
		},
		preloadedState: { ...defaultState, auth: customer, orders },
	});
	displayingCorrectComponents({
		mainComponent: <App />,
		displayComponents: {
			...generalComponentPaths,
			...customerAdminSpecificComponentPaths,
			...adminSpecificComponentPaths,
		},
		displayNotComponents: {
			...guestSpecificComponentPaths,
			...guestCustomerSpecificComponentPaths,
		},
		preloadedState: { ...defaultState, auth: admin, orders },
	});

	describe('Displaying correct data in elements', () => {});
	describe('Updating values correctly', () => {});
	describe('Dispatching correct actions', () => {
		dispatch({ action: initApp, usesThunk: true }).when({
			caseNum: 1,
			situation: 'Initializing auth on startup',
			config: setupConfig,
		});
	});
	describe('Other events', () => {});
});
