/** @format */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
	addCartItem,
	decrementCartItem,
	emptyCart,
	incrementCartItem,
	removeCartItem,
} from '../../../redux/actionCreators/cartActions';
import {
	ADD_CART_ITEM,
	EMPTY_CART,
	NEW_NOTIFICATION,
	REMOVE_CART_ITEM,
	UPDATE_CART_ITEM_AMOUNT,
} from '../../../redux/constants';
import state from '../../utils/testStoreState';
const { cart } = state;
const product = cart[0].product;

let store;
beforeEach(() => {
	store = mockStore({});
	localStorage.setItem('cart', JSON.stringify(cart));
});

afterAll(() => {
	localStorage.removeItem('cart');
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Testing thunk action creators', () => {
	describe('addCartItem:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: ADD_CART_ITEM, NEW_NOTIFICATION', async () => {
				const expectedActions = [
					{
						type: ADD_CART_ITEM,
						payload: product,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'New cart item added.', isSuccess: true },
					},
				];

				window.localStorage.__proto__.setItem = jest.fn();

				// assertions as usual:
				store.dispatch(addCartItem(product));
				try {
					expect(localStorage.setItem).toHaveBeenCalled();
				} catch (error) {
					throw new Error(
						'FAILURE: Did you remember to add the cart item in local storage?'
					);
				}
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
	describe('removeCartItem:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: REMOVE_CART_ITEM', async () => {
				const expectedActions = [
					{
						type: REMOVE_CART_ITEM,
						payload: product,
					},
				];
				window.localStorage.__proto__.setItem = jest.fn();

				store.dispatch(removeCartItem(product));
				try {
					expect(localStorage.setItem).toHaveBeenCalled();
				} catch (error) {
					throw new Error(
						'FAILURE: Did you remember to remove the cart item from local storage?'
					);
				}
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
	describe('incrementCartItem:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: UPDATE_CART_ITEM_AMOUNT, NEW_NOTIFICATION', async () => {
				const expectedActions = [
					{
						type: UPDATE_CART_ITEM_AMOUNT,
						payload: { productId: product.id, amount: 1 },
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Cart item amount updated.', isSuccess: true },
					},
				];
				window.localStorage.__proto__.setItem = jest.fn();

				store.dispatch(incrementCartItem(product.id));
				try {
					expect(localStorage.setItem).toHaveBeenCalled();
				} catch (error) {
					throw new Error(
						'FAILURE: Did you remember to update the cart item at local storage?'
					);
				}
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
	describe('decrementCartItem:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: UPDATE_CART_ITEM_AMOUNT, NEW_NOTIFICATION', async () => {
				const expectedActions = [
					{
						type: UPDATE_CART_ITEM_AMOUNT,
						payload: { productId: product.id, amount: -1 },
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Cart item amount updated.', isSuccess: true },
					},
				];
				window.localStorage.__proto__.setItem = jest.fn();

				store.dispatch(decrementCartItem(product.id));
				try {
					expect(localStorage.setItem).toHaveBeenCalled();
				} catch (error) {
					throw new Error(
						'FAILURE: Did you remember to update the cart item at local storage?'
					);
				}
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
	describe('emptyCart:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: EMPTY_CART', async () => {
				const expectedActions = [
					{
						type: EMPTY_CART,
					},
				];
				window.localStorage.__proto__.removeItem = jest.fn();
				store.dispatch(emptyCart());
				try {
					expect(localStorage.setItem).toHaveBeenCalled();
				} catch (error) {
					throw new Error(
						'FAILURE: Did you remember to remove the entire cart from local storage?'
					);
				}
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
});
