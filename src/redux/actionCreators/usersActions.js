/** @format */

// USERS ACTION CREATORS

import axios from 'axios';
import {
  GET_USER,
  GET_USERS,
  NEW_NOTIFICATION,
  REMOVE_USER,
  UPDATE_USER,
} from '../constants';
import { createNotification } from './notificationsActions';

//Use these for the notifications sent.
const userMsg = {
  gotUser: 'Single user received',
  gotUsers: 'Users received',
  updateUser: 'User updated.',
  delete: user => {
    return `${user.name} deleted successfully`;
  },
};

/**
 * @description Asynchronous action creator that gets a single user from the backend (if possible) and sends that through thunk to the reducers.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 *
 * @param {String} userId - The users id that is to be fetched.
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const getUser = userId => dispatch =>
  axios
    .get(`/api/users/${userId}`)
    .then(({ data }) => dispatch({ type: GET_USER, payload: data }))
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });
/**
 * @description Asynchronous action creator that gets all the users from the backend (if possible) and sends that Array through thunk to the reducers.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 *
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const getUsers = () => dispatch =>
  axios
    .get('/api/users')
    .then(({ data }) => dispatch({ type: GET_USERS, payload: data }))
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });
/**
 * @description Asynchronous action creator that updates the given user (if possible) and sends the user received from the backend through thunk to reducers.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 *
 * @param {object} updatedUser - contains the updated user data
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const updateUser = updatedUser => dispatch =>
  axios
    .put(`/api/users/${updatedUser.id}`, { role: updatedUser.role })
    .then(({ data }) => {
      dispatch({ type: UPDATE_USER, payload: data });
      dispatch(
        createNotification({ message: userMsg.updateUser, isSuccess: true })
      );
    })
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });
/**
 * @description Removes the user (if possible) from the backend, then dispatches an action to remove it from the redux-store, as well as another action to notify the current user that the deletion was succesfull.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 *
 * @param {String} - The users id that is to be fetched
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const removeUser = userId => dispatch =>
  axios
    .delete(`/api/users/${userId}`)
    .then(({ data }) => {
      dispatch({ type: REMOVE_USER, payload: data });
      dispatch(
        createNotification({ message: userMsg.delete(data), isSuccess: true })
      );
    })
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });
