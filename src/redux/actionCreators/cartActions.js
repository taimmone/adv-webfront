/** @format */

// CART ACTION CREATORS
import {
  ADD_CART_ITEM,
  EMPTY_CART,
  INIT_CART,
  NEW_NOTIFICATION,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM_AMOUNT,
} from '../constants';
import { createNotification } from './notificationsActions';

const cartMsg = {
  add: 'New cart item added.',
  update: 'Cart item amount updated.',
};
/**
 * @description Action creator that initiates the cart after page is refreshed.  Sends an INIT_CART-type action along with pre-existing cart-items stored locally as payload to the frontends redux-stores product-state.
 * @return {object} action
 */
export const initCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  return { type: INIT_CART, payload: cart };
};

/**
 * @description Action creator that adds a new cart item to local storage.  Dispatches an ADD_CART_ITEM-type action along with product as payload to the frontends redux-stores product-state, as well as a NEW_NOTIFICATION action to the frontends notification-state with a succesful message using cartMsg.add
 * @param {string} product - The product item to add
 * @return {Function} thunk
 */
export const addCartItem = product => (dispatch, getState) => {
  let { cart } = getState();
  if (!cart) cart = JSON.parse(localStorage.getItem('cart'));
  // const cartItem = { product, quantity: 1 };
  localStorage.setItem('cart', JSON.stringify([...cart, product]));
  dispatch({ type: ADD_CART_ITEM, payload: product });
  dispatch(createNotification({ message: cartMsg.add, isSuccess: true }));
};

/**
 * @description Action creator that removes a cart item from local storage.  Sends a REMOVE_CART_ITEM-type action along with product as payload to the frontends redux-stores product-state.
 * @param {string} product - The product item to remove from cart
 * @return {object} Action
 */
export const removeCartItem = product => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  localStorage.setItem(
    'cart',
    JSON.stringify(cart.filter(item => item.product.id !== product.id))
  );
  return { type: REMOVE_CART_ITEM, payload: product };
};

/**
 * @description Thunk action creator that increments a cart items quantity in local store.  Dispatches a UPDATE_CART_ITEM_AMOUNT-type action along with the update details { productId, amount: 1 } as payload to the frontends redux-stores product-state. Also sends NEW_NOTIFICATION-type action with payload of a message informing the items amount is updated (use cartMsg.update).
 * @param {string} productId - The cart item id to increment
 * @return {Function} thunk
 */
export const incrementCartItem = productId => (dispatch, getState) => {
  dispatch({
    type: UPDATE_CART_ITEM_AMOUNT,
    payload: { productId, amount: 1 },
  });
  dispatch(createNotification({ message: cartMsg.update, isSuccess: true }));
  const { cart } = getState();
  localStorage.setItem('cart', JSON.stringify(cart));
};

/**
 * @description Thunk action creator that decrements (reduces) a cart items quantity in local store.  Dispatches a UPDATE_CART_ITEM_AMOUNT-type action along with the update details  { productId, amount: -1 } as payload to the frontends redux-stores product-state. Also sends NEW_NOTIFICATION-type action with payload of a message informing the items amount is updated (use cartMsg.update)
 *
 * @param {string} productId - The cart item id to decrement
 * @return {Function} thunk
 */
export const decrementCartItem = productId => (dispatch, getState) => {
  dispatch({
    type: UPDATE_CART_ITEM_AMOUNT,
    payload: { productId, amount: -1 },
  });
  dispatch(createNotification({ message: cartMsg.update, isSuccess: true }));
  const { cart } = getState();
  localStorage.setItem('cart', JSON.stringify(cart));
};

/**
 * @description An action creator which removes the entire cart-item from local store. Returns an action with EMPTY_CART-type to remove cart all items.
 * @returns {object} the action
 */
export const emptyCart = () => {
  localStorage.removeItem('cart');
  return { type: EMPTY_CART };
};
