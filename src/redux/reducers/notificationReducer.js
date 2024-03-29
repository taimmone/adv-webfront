/** @format */

import { NEW_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants';

/**
 * Implement notificationReducer that handles following cases:
 * 1) NEW_NOTIFICATION: adds the new notification to the state.
 * 2) REMOVE_NOTIFICATION: removes the notification.
 * @param {object} state old state of notification.
 * @param {object} action the action that calls the reducer.
 * @returns {object} new state for notification
 */
const notificationReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_NOTIFICATION:
      return action.payload;
    case REMOVE_NOTIFICATION:
      return {};

    default:
      return state;
  }
};

export default notificationReducer;
