/** @format */

/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-unnecessary-act */
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

//Own utils for testing
import {
	clicking,
	config,
	dispatch,
	display,
	displayMultiple,
	displayNot,
	elements,
	setupWithMock,
} from '../utils/tools';

//Component(s) to test:
import Cart from '../../components/Cart';

//Dispatch actions:
import { addOrder } from '../../redux/actionCreators/ordersActions';
import { createNotification } from '../../redux/actionCreators/notificationsActions';

//App-store:
import state from '../utils/testStoreState';
import {
	decrementCartItem,
	incrementCartItem,
	removeCartItem,
} from '../../redux/actionCreators/cartActions';
const { cart, customer, guest } = state;
/* 
	When cart-component is finished, it:
	- Should list all products in the cart
	- Should have a working order-button 
	Each product in the cart:
	- Should have a working plus-button
		- If clicked, adds to the quantity of the item
	- Should have a working minus-button
		- If clicked, reduces the quantity of the item
*/
const fullCartCustomer = config({
	component: <Cart />,
	preloadedState: { cart, auth: customer },
});
const product = cart[0].product;

const cartItem = { product, quantity: 1 };

const cart1Left = config({
	component: <Cart />,
	preloadedState: { cart: [cartItem] },
});
const fullCart = config({
	component: <Cart />,
	preloadedState: { cart, auth: guest },
});
const emptyCart = config({
	component: <Cart />,
	preloadedState: { auth: guest },
});

afterAll(() => {
	localStorage.removeItem('cart');
});

describe('Cart-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Case 1: Cart is empty', () => {
			displayNot(['order-button', 'cart-item-container'], emptyCart);
			display(['cart-component', 'empty-cart'], emptyCart);
		});
		describe('Case 2: Cart is not empty', () => {
			displayNot(['empty-cart'], fullCart);
			display(
				['cart-component', 'cart-item-container', 'order-button'],
				fullCart
			);
			displayMultiple(['cart-item-component'], cart.length, fullCart);
		});
	});
	describe('Dispatching correct actions', () => {
		describe('Attempting to order: click order-button', () => {
			describe('Case 0: Not logged in:', () => {
				clicking('order-button', fullCart).changesLocationTo('/login');
				dispatch({
					action: createNotification,
					usesThunk: true,
				}).when({
					config: fullCart,
					situation: 'Attempts to order',
					userClickTarget: 'order-button',
				});
			});
			describe('Case 1: logged in (as customer):', () => {
				test('Dispatches the correct addOrder-action', () => {
					const { store, utils } = setupWithMock(fullCartCustomer);
					act(() => {
						userEvent.click(utils.getByTestId('order-button'));
					});
					expect(store.dispatch).toHaveBeenCalledTimes(1);
					//Expect it to call addOrder-action:
					expect(store.dispatch.mock.calls[0][0].toString()).toBe(
						addOrder().toString()
					);
				});
			});
		});
	});
	describe('Other events', () => {});
});

describe('Cart-item-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		display(
			[
				'item-name',
				'item-price',
				'item-amount',
				`plus-btn-${cartItem.product.id}`,
				`minus-btn-${cartItem.product.id}`,
			],
			cart1Left
		);
	});
	describe('Displaying correct data in elements', () => {
		elements(
			['item-name', 'item-price', 'item-amount'],
			cart1Left
		).shouldHaveTextContent({
			'item-price': cartItem.product.price,
			'item-name': cartItem.product.name,
			'item-amount': cartItem.quantity,
		});
	});
	describe('Updating values correctly', () => {});
	describe('Dispatching correct actions', () => {
		beforeEach(() => {
			localStorage.setItem('cart', JSON.stringify(cart));
		});
		describe('When the quantity is > 1', () => {
			dispatch({
				action: incrementCartItem,
				usesThunk: true,
				value: product.id,
			}).when({
				caseNum: 1,
				situation: 'Updating cart item quantity by 1',
				config: cart1Left,
				userClickTarget: `plus-btn-${product.id}`,
			});
			dispatch({
				action: decrementCartItem,
				usesThunk: true,
				value: product.id,
			}).when({
				caseNum: 2,
				situation: 'Updating cart item quantity by -1',
				config: fullCart,
				userClickTarget: `minus-btn-${product.id}`,
			});
		});
		describe('When the quantity is = 1', () => {
			beforeEach(() => {
				localStorage.setItem('cart', JSON.stringify(cart));
			});
			dispatch({
				action: removeCartItem,
				usesThunk: false,
				value: cartItem.product,
			}).when({
				caseNum: 3,
				situation: 'Updating cart item quantity by -1',
				config: cart1Left,
				userClickTarget: `minus-btn-${product.id}`,
			});
		});
	});
	describe('Other events', () => {});
});
