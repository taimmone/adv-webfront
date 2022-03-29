/** @format */

// NOTIFICATION ACTION CREATORS

import { NEW_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants';

/**
 * @description Action creator that sends a NEW_NOTIFICATION action to the frontends notification-state along with the payload that includes message.
 * @param {object} newNotification - The notification details
 * @param {string} newNotification.message - The notification message
 * @param {string} newNotification.isSuccess - Tells whether or not it is a succesfull (green) or unsuccessfull (red) message
 * @return {object} action
 */
export const createNotification = (
  newNotification = { message: '', isSuccess: false }
) => ({ payload: newNotification, type: NEW_NOTIFICATION });

/**
 * @description Action creator that sends a REMOVE_NOTIFICATION-type action
 * @return {object} action
 */
export const removeNotification = () => ({ type: REMOVE_NOTIFICATION });
