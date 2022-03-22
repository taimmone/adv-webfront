/** @format */

/** @format */

// Imported modules
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Own utils in use
import {
	clicking,
	config,
	dispatch,
	display,
	displayNot,
} from '../utils/tools';
// Component to test
import Navbar from '../../components/Navbar';

// State to use
import state from '../utils/testStoreState';

// Actions to dispatch
import { logOut } from '../../redux/actionCreators/authActions';

const { admin, customer, guest } = state;
afterEach(cleanup);
const setupConfigGuest = config({
	component: <Navbar />,
	preloadedState: { auth: guest },
});
const setupConfigAdmin = config({
	component: <Navbar />,
	preloadedState: { auth: admin },
});
const setupConfigCustomer = config({
	component: <Navbar />,
	preloadedState: { auth: customer },
});
describe('Navbar-component', () => {
	describe('Displaying correct elements', () => {
		describe('User is guest', () => {
			display(
				[
					'navbar-component',
					'home-link',
					'products-link',
					'cart-link',
					'login-link',
					'register-link',
				],
				setupConfigGuest
			);
			displayNot(
				['users-link', 'orders-link', 'logout-link'],
				setupConfigGuest
			);
		});
		describe('User is customer', () => {
			display(
				[
					'navbar-component',
					'home-link',
					'products-link',
					'cart-link',
					'orders-link',
					'logout-link',
				],
				setupConfigCustomer
			);
			displayNot(['users-link', 'login-link'], setupConfigCustomer);
		});
		describe('User is admin', () => {
			display(
				[
					'navbar-component',
					'home-link',
					'products-link',
					'users-link',
					'orders-link',
					'logout-link',
				],
				setupConfigAdmin
			);
			displayNot(['cart-link', 'login-link'], setupConfigAdmin);
		});
	});
	describe('Displaying correct roles within parent elements', () => {});
	describe('Updating values correctly', () => {
		clicking('home-link', setupConfigGuest).navigatesTo('/');
		clicking('products-link', setupConfigGuest).navigatesTo('/products');
		clicking('cart-link', setupConfigGuest).navigatesTo('/cart');
		clicking('login-link', setupConfigGuest).navigatesTo('/login');
		clicking('register-link', setupConfigGuest).navigatesTo('/register');
		clicking('orders-link', setupConfigCustomer).navigatesTo('/orders');
		clicking('users-link', setupConfigAdmin).navigatesTo('/users');
	});
	describe('Dispatching correct actions', () => {
		describe('Successfull logout', () => {
			dispatch({ action: logOut, usesThunk: true }).when({
				caseNum: 1,
				config: setupConfigCustomer,
				userClickTarget: 'logout-link',
			});
		});
	});
	describe('Other events', () => {});
});
