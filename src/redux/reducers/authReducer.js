/** @format */

import { INIT_AUTH, REMOVE_AUTH } from '../constants';
/**
 * Implement authReducer that handles following cases:
 * 1) INIT_AUTH: returns the actions payload
 * 2) REMOVE_AUTH: replaces current auth details with guest-role.
 * @param {object} state old state of auth.
 * @param {object} action the action that calls the reducer.
 * @returns {object} new state for auth
 */
const authReducer = (state = {}, action) => {
  switch (action.type) {
    case INIT_AUTH:
      return action.payload;
    case REMOVE_AUTH:
      return { role: 'guest' };

    default:
      return state;
  }
};

export default authReducer;
