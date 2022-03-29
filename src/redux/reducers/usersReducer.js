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
 * @param {object} action the action that calls the reducer.
 * @returns {Array} new state for products
 */
const usersReducer = (state = [], action) => {
  switch (action.type) {
    case GET_USER:
      return [action.payload];
    case GET_USERS:
      return action.payload;
    case CLEAR_USERS:
      return [];
    case UPDATE_USER: {
      const updatedUsers = state.filter(user => user.id !== action.payload.id);
      updatedUsers.push(action.payload);
      return updatedUsers;
    }
    case REMOVE_USER:
      return state.filter(user => user.id !== action.payload.id);

    default:
      return state;
  }
};

export default usersReducer;
