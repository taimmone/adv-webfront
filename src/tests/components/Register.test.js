/** @format */

import '@testing-library/jest-dom';

//Own utils for testing
import { change, config, dispatch, display, elements } from '../utils/tools';

//Component to test:
import Register from '../../components/Register';

//Dispatched Actions
import { register } from '../../redux/actionCreators/authActions';

const newUser = {
	name: 'new user',
	email: 'new.user@email.com',
	password: 'legitpass1',
	passwordConfirmation: 'legitpass1',
};

const inputsFilledCorrectly = {
	'name-input': newUser.name,
	'email-input': newUser.email,
	'password-input': newUser.password,
	'passwordConfirmation-input': newUser.passwordConfirmation,
};

const setupConfig = config({
	component: <Register />,
});

describe('Register-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		display(
			[
				'name-input',
				'email-input',
				'password-input',
				'passwordConfirmation-input',
			],
			setupConfig
		);
		elements(
			[
				'name-input',
				'email-input',
				'password-input',
				'passwordConfirmation-input',
			],
			setupConfig
		).shouldHaveAttribute('required', true);
		elements(['register-button'], setupConfig).shouldHaveValue({
			'register-button': 'Register',
		});
	});
	describe('Displaying correct data in elements (when changed)', () => {
		change(setupConfig)
			.inputs([
				'name-input',
				'email-input',
				'password-input',
				'passwordConfirmation-input',
			])
			.toValues([
				newUser.name,
				newUser.email,
				newUser.password,
				newUser.passwordConfirmation,
			]);
	});
	describe('Dispatching correct actions', () => {
		describe('Attempt to register', () => {
			dispatch({ action: register, value: newUser, usesThunk: true }).when({
				config: setupConfig,
				FilledInputs: inputsFilledCorrectly,
				userClickTarget: 'register-button',
			});
		});
	});
});
