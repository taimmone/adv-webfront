/** @format */

import axios from 'axios';
import {
  CLEAR_ORDERS,
  CLEAR_USERS,
  INIT_AUTH,
  NEW_NOTIFICATION,
  REMOVE_AUTH,
} from '../constants';
import { createNotification } from './notificationsActions';

// Use this regex for email validation
const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Invalid Auth Messages:
export const invalidAuth = {
  name: 'Name too short',
  email: 'Invalid email',
  password: 'Password too short',
  passwordMismatch: 'Password missmatch',
};

// Valid auth messages.
export const validAuth = {
  welcome: function (name) {
    return `Welcome to my store, ${name}!`;
  },
  welcomeBack: 'Welcome back!',
};

//AUTH (THUNK) ACTION CREATORS
/**
 *
 * @description Asynchronous thunk that uses backends /api/check-status path to check whether or not there is the correct browser-cookie and whether or not that browser-cookie is valid. If it's succesful, Dispatches
 * 1) INIT_AUTH with user as payload.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 *
 * @returns {Function} 
 */
export const initAuth = () => dispatch =>
  axios
    .get('/api/check-status')
    .then(({ data }) => dispatch({ payload: data.user, type: INIT_AUTH }))
    .catch(error => {
      if (error.response) {
        const { data } = error.response;
        dispatch(createNotification({ message: data.error, isSuccess: false }));
      } else {
        dispatch(
          createNotification({ message: error.message, isSuccess: false })
        );
      }
    });
/**
 * @description Asynchronous thunk that handles validation for logInCreds (check Login and Registration validation from assignment instructions). Expects for a successful login-response from server, before dispatches
 * 1) INIT_AUTH with user as payload
 * 2) succesfull notification with validAuth.welcomeBack as message.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull notification.
 * @param {Object} logInCreds - The credentials used to login, contains username and password
 * @returns {Function} 
 */
export const logIn = logInCreds => async dispatch => {
  const { email, password } = logInCreds;

  if (!validEmailRegex.test(email)) {
    dispatch(
      createNotification({ message: invalidAuth.email, isSuccess: false })
    );
  } else if (password.length < 10)
    dispatch(
      createNotification({ message: invalidAuth.password, isSuccess: false })
    );
  else
    return axios
      .post('/api/login', logInCreds)
      .then(({ data }) => {
        dispatch({ payload: data.user, type: INIT_AUTH });
        dispatch(
          createNotification({
            message: validAuth.welcomeBack,
            isSuccess: true,
          })
        );
      })
      .catch(error => {
        if (error.response) {
          const { data } = error.response;
          dispatch(
            createNotification({ message: data.error, isSuccess: false })
          );
        } else {
          dispatch(
            createNotification({ message: error.message, isSuccess: false })
          );
        }
      });
};
/**
 * @description Asynchronous thunk that awaits for a successful logout-response from server, before dispatches
 * the actions with types of
 * 1) REMOVE_AUTH,
 * 2) CLEAR_ORDERS and
 * 3) CLEAR_USERS as well as
 * 4) NEW_NOTIFICATION with succesfull message from the backend as payload to the reducers.
 * @returns {Function}
 */
export const logOut = () => dispatch =>
  axios.get('/api/logout').then(({ data }) => {
    dispatch({ type: REMOVE_AUTH });
    dispatch({ type: CLEAR_ORDERS });
    dispatch({ type: CLEAR_USERS });
    dispatch(createNotification({ message: data.message, isSuccess: true }));
  });

/**
 * @description Asynchronous thunk that handles registeration events. Handles validation for registerCreds (check Login and Registration validation from assignment instructions). If the response is ok, Dispatches
 * 1) an INIT_AUTH-type action to reducers with the received user as payload.
 * 2) a successful NEW_NOTIFICATION-type action to reducers with validAuth.welcome(name) as message.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull notification. If the error itself is an object, then it should pass whatever is inside the object.
 * @param registerCreds - The data of the user
 * @returns {Function}
 */
export const register = registerCreds => async dispatch => {
  const { name, email, password, passwordConfirmation } = registerCreds;

  if (name?.length < 4)
    return dispatch(
      createNotification({ message: invalidAuth.name, isSuccess: false })
    );
  if (!validEmailRegex.test(email))
    return dispatch(
      createNotification({ message: invalidAuth.email, isSuccess: false })
    );
  if (password?.length < 10)
    return dispatch(
      createNotification({ message: invalidAuth.password, isSuccess: false })
    );
  if (password !== passwordConfirmation)
    return dispatch(
      createNotification({
        message: invalidAuth.passwordMismatch,
        isSuccess: false,
      })
    );

  return axios
    .post('/api/register', registerCreds)
    .then(({ data }) => {
      dispatch({ payload: data.user, type: INIT_AUTH });
      dispatch(
        createNotification({
          message: validAuth.welcome(name),
          isSuccess: true,
        })
      );
    })
    .catch(error => {
      if (error.response) {
        const { data } = error.response;
        // Todo: Currently uses "data.error.email" because of a test
        dispatch(
          createNotification({ message: data.error.email, isSuccess: false })
        );
      } else {
        dispatch(
          createNotification({ message: error.message, isSuccess: false })
        );
      }
    });
};
