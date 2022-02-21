/** @format */

/** @format */

import '@testing-library/jest-dom';

//Own utils for testing
import {
	clicking,
	config,
	dispatch,
	display,
	displayMultiple,
	displayNot,
	setupWithMock,
} from '../utils/tools';

//Component(s) to test:
import Products from '../../components/Products';

// Actions to dispatch
import { getProducts } from '../../redux/actionCreators/productsActions';

//App-store:
import state from '../utils/testStoreState';

const { guest, admin, products } = state;
/* 
	If their role is admin, there should be a button  which lets them add a new product 
	- When that button is clicked, ProductAdder should open. (add-product-component should exist)
	- When Cancel or submit is clicked, ProductAdder should close. (add-product-component should not exist)
	Gets all products from the server whenever the component is rendered. 
*/
const setupConfigGuest = config({
	component: <Products />,
	preloadedState: { auth: guest },
});
const setupConfigAdmin = config({
	component: <Products />,
	preloadedState: { auth: admin },
});
const setupConfigGuestWithProducts = config({
	component: <Products />,
	preloadedState: { auth: guest, products },
});
describe('Products-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Case 1: user is authenticated (auth) as guest', () => {
			display(['products-component', 'products-container'], setupConfigGuest);
			displayNot(['product-adder-component'], setupConfigGuest);
		});
		describe('Case 2: user is authenticated (auth) as admin', () => {
			display(
				['products-component', 'products-container', 'open-adder-button'],
				setupConfigAdmin
			);
		});
		describe('Case 3: If there are products, then all of them are listed', () => {
			displayMultiple(
				['product-component'],
				products.length,
				setupConfigGuestWithProducts
			);
		});
	});
	describe('Displaying correct data in elements', () => {});
	describe('Updating values correctly', () => {
		clicking('open-adder-button', setupConfigAdmin).displays([
			'product-adder-component',
		]);
		clicking('open-adder-button', setupConfigAdmin, 2).displaysNot([
			'product-adder-component',
		]);
	});
	describe('Dispatching correct actions', () => {
		test('Case 1: products in state -> no actions dispatched', () => {
			const { store } = setupWithMock(setupConfigGuestWithProducts);
			expect(store.dispatch).toHaveBeenCalledTimes(0);
		});
		dispatch({
			action: getProducts,
			usesThunk: true,
		}).when({
			caseNum: 2,
			situation: 'If no products received',
			config: setupConfigGuest,
		});
	});
	describe('Other events', () => {});
});
