/** @format */

import { INIT_AUTH, REMOVE_AUTH } from '../constants';
/**
 * Implement authReducer that handles following cases:
 * 1) INIT_AUTH: returns the actions payload
 * 2) REMOVE_AUTH: replaces current auth details with guest-role.
 * @param {Object} state old state of auth.
 * @param {Object} action the action that calls the reducer.
 * @returns {Object} new state for auth
 */
const authReducer = (state = {}, action) => {};

export default authReducer;
