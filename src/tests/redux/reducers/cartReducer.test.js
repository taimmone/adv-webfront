/** @format */

import {
	ADD_CART_ITEM,
	EMPTY_CART,
	REMOVE_CART_ITEM,
	UPDATE_CART_ITEM_AMOUNT,
} from '../../../redux/constants';
import cartReducer from '../../../redux/reducers/cartReducer';
import state from '../../utils/testStoreState';
const { cart } = state;
const newCartItem = {
	product: {
		description: 'In this book, you will learn Full Stack React from experts',
		id: 'bs78bb20624711ec8af9c75ed436567c',
		name: ' FullStack React',
		image: 'https://miro.medium.com/max/377/0*BOy-EA_tf45TrdUW.jpg',
		price: 120,
	},
	quantity: 100,
};
const oldCart = [...cart, newCartItem];
const newCart = cart;

describe('authReducer', () => {
	it('should return the initial state', () => {
		expect(cartReducer(undefined, {})).toEqual([]);
	});
	it('should handle ADD_CART_ITEM', () => {
		const addAction = {
			type: ADD_CART_ITEM,
			payload: newCartItem,
		};
		expect(cartReducer(undefined, addAction)).toEqual([newCartItem]);
	});
	it('should handle REMOVE_CART_ITEM', () => {
		const removeAction = {
			type: REMOVE_CART_ITEM,
			payload: { id: newCartItem.product.id },
		};
		expect(cartReducer(oldCart, removeAction)).toEqual(newCart);
	});
	it('should handle UPDATE_CART_ITEM_AMOUNT (when incrementing it by 1)', () => {
		const incrementAction = {
			type: UPDATE_CART_ITEM_AMOUNT,
			payload: { productId: newCartItem.product.id, amount: 1 },
		};
		newCartItem.quantity++;
		const updatedCart = [...cart, newCartItem];
		expect(cartReducer(oldCart, incrementAction)).toEqual(updatedCart);
	});
	it('should handle UPDATE_CART_ITEM_AMOUNT (when decrementing it by 1)', () => {
		const decrementAction = {
			type: UPDATE_CART_ITEM_AMOUNT,
			payload: { productId: newCartItem.product.id, amount: -1 },
		};
		newCartItem.quantity--;
		const updatedCart = [...cart, newCartItem];
		expect(cartReducer(oldCart, decrementAction)).toEqual(updatedCart);
	});
	it('should handle EMPTY_CART', () => {
		const emptyAction = {
			type: EMPTY_CART,
		};
		expect(cartReducer(cart, emptyAction)).toEqual([]);
	});
});
