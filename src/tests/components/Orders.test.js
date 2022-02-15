/** @format */

/** @format */

import '@testing-library/jest-dom';

//Own utils for testing
import {
	config,
	dispatch,
	display,
	displayMultiple,
	displayNot,
	setupWithMock,
} from '../utils/tools';

//Component(s) to test:
import Orders from '../../components/Orders';

// Dispatched actions
import { getOrders } from '../../redux/actionCreators/ordersActions';
//App-store:
import state from '../utils/testStoreState';
const { admin, orders, customer } = state;
/* 
	If their role is admin, there should be a button  which lets them add a new order 
	- When that button is clicked, OrderAdder should open. (add-order-component should exist)
	- When Cancel or submit is clicked, OrderAdder should close. (add-order-component should not exist)
	Gets all orders from the server whenever the component is rendered. 
*/

const customerWithNoOrders = {
	id: Math.floor(Math.random() * 10000000),
	name: 'Carl Marx',
	email: 'carl.marx@mail.com',
	role: 'customer',
	init: true,
};

const customerWithOrders = customer;

const setupConfigCustomer = config({
	component: <Orders />,
	preloadedState: { auth: customerWithOrders, orders },
});
const setupConfigCustomerNoOrders = config({
	component: <Orders />,
	preloadedState: { auth: customerWithNoOrders },
});
const setupConfigAdmin = config({
	component: <Orders />,
	preloadedState: { auth: admin, orders },
});
describe('Orders-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Case 1: Customer, has orders', () => {
			display(['orders-component', 'orders-container'], setupConfigCustomer);
			displayNot(['no-order-component'], setupConfigCustomer);
		});
		describe('Case 2: Customer, does not have orders', () => {
			display(['no-order-component'], setupConfigCustomerNoOrders);
			displayNot(
				['orders-component', 'orders-container'],
				setupConfigCustomerNoOrders
			);
		});
		describe('Case 3: If there are orders, then all of them are listed', () => {
			displayMultiple(['order-component'], orders.length, setupConfigAdmin);
		});
	});
	describe('Displaying correct data in elements', () => {});
	describe('Dispatching correct actions', () => {
		test('Case 1: orders in state -> no actions dispatched', () => {
			const { store } = setupWithMock(setupConfigCustomer);
			expect(store.dispatch).toHaveBeenCalledTimes(0);
		});
		dispatch({
			action: getOrders,
			usesThunk: true,
		}).when({
			caseNum: 2,
			situation: 'If no orders in state',
			config: setupConfigCustomerNoOrders,
		});
	});
	describe('Other events', () => {});
});
