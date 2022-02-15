/** @format */
// Needed modules:
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';

//Own utils for testing
import {
	config,
	display,
	clicking,
	displayNot,
	displayMultiple,
	elements,
} from '../utils/tools';

//Component(s) to test:
import Order from '../../components/Order';

//App-store:
import state from '../utils/testStoreState';
const { customerOrders, customer } = state;

const customersOrder = customerOrders[0];

const setupConfigProp = config({
	component: (
		<Route path='/' element={<Order providedOrder={customersOrder} />} />
	),
	preloadedState: { orders: customerOrders, auth: customer },
	startingPath: `/`,
	needsRoutes: true,
});

const setupConfigPath = config({
	component: <Route path='/:orderId' element={<Order />} />,
	preloadedState: { orders: customerOrders, auth: customer },
	startingPath: `/${customersOrder.id}`,
	needsRoutes: true,
});

afterEach(() => {
	cleanup();
});
describe('Order-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Path did not have orderId', () => {
			display(
				[
					'order-component',
					'orderId-heading',
					'customerId-heading',
					'inspect-link',
				],
				setupConfigProp
			);
		});
		describe('Path did have orderId', () => {
			display(
				['order-component', 'orderId-heading', 'customerId-heading'],
				setupConfigPath
			);
			displayNot(['inspect-link'], setupConfigPath);
		});
		elements(
			['orderId-heading', 'inspect-link', 'order-list', 'customerId-heading'],
			setupConfigProp
		).shouldHaveCorrectRoleWithin('order-component');
		elements(
			['order-listitem', 'name-heading'],
			setupConfigProp
		).shouldHaveCorrectRoleWithin('order-list');
		describe('There are a correct number of order items', () => {
			displayMultiple(
				[
					`order-listitem`,
					'name-heading',
					`price-element`,
					`description-element`,
					`quantity-element`,
				],
				customersOrder.items.length,
				setupConfigProp
			);
		});
	});
});
describe('Other events', () => {
	describe(`Viewing all orders ("/orders"):`, () => {
		clicking(`inspect-link`, setupConfigProp).changesLocationTo(
			`/${customersOrder.id}`
		);
	});
});
