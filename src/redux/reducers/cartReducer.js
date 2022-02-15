/** @format */

import {
	ADD_CART_ITEM,
	EMPTY_CART,
	INIT_CART,
	REMOVE_CART_ITEM,
	UPDATE_CART_ITEM_AMOUNT,
} from '../constants';

/**
 * Implement cartReducer that handles following cases:
 * 1) INIT_CART: returns the actions payload if there is a payload. Otherwise returns state.
 * 2) ADD_CART_ITEM: Adds a new cart item to the stores state
 * 3) REMOVE_CART_ITEM: removes the product item from the state.
 * 4) UPDATE_CART_ITEM_AMOUNT: Updates the cart item with the amount from payload.
 * 5) EMPTY_CART: returns an empty array.
 * @param {Array} state old state of cart.
 * @param {Object} action the action that calls the reducer.
 * @returns {Array} new state for cart
 */
const cartReducer = (state = [], action) => {};

export default cartReducer;
