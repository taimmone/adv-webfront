/** @format */

import { ADD_ORDER, CLEAR_ORDERS, GET_ORDER, GET_ORDERS } from '../constants';

/**
 * Implement ordersReducer that handles following cases:
 * 1) GET_ORDER: adds the order to an empty state.
 * 2) GET_ORDERS: Adds the orders to the empty state
 * 3) CLEAR_ORDERS: Removes the orders from the state
 * 4) ADD_ORDER: Adds the order to the state by placing it as the last entry.
 * @param {Array} state old state of orders.
 * @param {Object} action the action that calls the reducer.
 * @returns {Array} new state for orders
 */
const ordersReducer = (state = [], action) => {};

export default ordersReducer;
