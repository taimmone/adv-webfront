/** @format */

// ORDER ACTION CREATORS

import axios from 'axios';
import {
  NEW_NOTIFICATION,
  GET_ORDERS,
  ADD_ORDER,
  GET_ORDER,
  EMPTY_CART,
} from '../constants';
import { emptyCart } from './cartActions';
import { createNotification } from './notificationsActions';

const orderMsg = {
  newOrder: 'New order made.',
};
/**
 * @description Action creator for getting a single order. Dispatches action with type GET_ORDER and payload of the fetched order if succesfull.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {string} orderId -  The id of the order to get
 * @return {Function} - Thunk -> action
 */
export const getOrder = orderId => dispatch =>
  axios
    .get(`/api/orders/${orderId}`)
    .then(({ data }) => dispatch({ type: GET_ORDER, payload: data }))
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });

/**
 * @description Action creator for getting all orders. Dispatches action with type GET_ORDERS and payload of the fetched orders if succesfull.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @return {Function} - Thunk -> action
 */
export const getOrders = () => dispatch =>
  axios
    .get('/api/orders')
    .then(({ data }) => {
      dispatch({ type: GET_ORDERS, payload: data });
    })
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });

/**
 * @description Action creator for adding a new order. Dispatches actions:
 * - ADD_ORDER-type with payload that has the new order
 * - EMPTY_CART-type with no payload
 * - NEW_NOTIFICATION with orderMsg.newOrder in the payload
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 *
 * @param {object} newOrder -  The new order to post
 * @return {Function} - Thunk -> action
 */
export const addOrder = newOrder => dispatch =>
  axios
    .post('/api/orders', { items: newOrder })
    .then(({ data }) => {
      dispatch(emptyCart());
      dispatch({ type: ADD_ORDER, payload: data });
      dispatch(
        createNotification({ message: orderMsg.newOrder, isSuccess: true })
      );
    })
    .catch(error => {
      if (error.response) {
        const message = error.response.data.error;
        dispatch(createNotification({ message, isSuccess: false }));
      }
    });
