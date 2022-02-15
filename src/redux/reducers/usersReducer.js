/** @format */

import {
	CLEAR_USERS,
	GET_USER,
	GET_USERS,
	REMOVE_USER,
	UPDATE_USER,
} from '../constants';

/**
 * Implement productsReducer that handles following cases:
 * 1) GET_USER: adds the single user to an empty state.
 * 2) GET_USERS: Adds the users to the empty state
 * 3) CLEAR_USERS: Clears all users from the state
 * 4) UPDATE_USER: Updates the user in the state and places it as its last entry.
 * 5) REMOVE_USER: Removes the user from the state.
 * @param {Array} state old state of products.
 * @param {Object} action the action that calls the reducer.
 * @returns {Array} new state for products
 */
const usersReducer = (state = [], action) => {};

export default usersReducer;
