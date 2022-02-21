/** @format */

/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/prefer-screen-queries */
import '@testing-library/jest-dom';

//Own utils for testing
import { display, change, dispatch, elements } from '../utils/tools';

//Component(s) to test:
import Login from '../../components/Login';

//Dispatched actions
import { logIn } from '../../redux/actionCreators/authActions';

const oldUser = {
	email: 'john.knobs@gmail.com',
	password: 'johnknobs123',
};

const inputsFilledCorrectly = {
	'email-input': oldUser.email,
	'password-input': oldUser.password,
};

describe('Login-component', () => {
	describe('UNIT TEST: Component functionality', () => {
		const config = { component: <Login /> };
		describe('Displaying correct elements', () => {
			display(
				[
					'login-component',
					'login-form',
					'email-input',
					'password-input',
					'login-button',
				],
				config
			);
			elements(['email-input', 'password-input'], config).shouldHaveAttribute(
				'required',
				true
			);
		});
		describe('Changing values of inputs', () => {
			change(config)
				.inputs(['email-input', 'password-input'])
				.toValues(['test@gmail.com', 'password']);
		});

		describe('Dispatching correct actions', () => {
			describe('Attempting to login', () => {
				// dispatch({
				// 	action: createNotification,
				// 	value: MSG_PASS_TOO_SHORT,
				// 	usesThunk: false,
				// }).when({
				// 	caseNum: 1,
				// 	situation: 'Password is too short',
				// 	config: config,
				// 	FilledInputs: {
				// 		...inputsFilledCorrectly,
				// 		'password-input': 'tooshort',
				// 	},
				// 	userClickTarget: 'login-button',
				// });
				// dispatch({
				// 	action: createNotification,
				// 	value: MSG_INVALID_EMAIL,
				// 	usesThunk: false,
				// }).when({
				// 	caseNum: 2,
				// 	situation: 'Email is invalid',
				// 	config: config,
				// 	FilledInputs: {
				// 		...inputsFilledCorrectly,
				// 		'email-input': 'bademail',
				// 	},
				// 	userClickTarget: 'login-button',
				// });
				dispatch({
					action: logIn,
					value: oldUser,
					usesThunk: true,
				}).when({
					config: config,
					FilledInputs: inputsFilledCorrectly,
					userClickTarget: 'login-button',
				});
			});
		});
	});
});
