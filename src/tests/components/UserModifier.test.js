/** @format */
// Needed modules:
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';

//Own utils for testing
import {
	change,
	changeNot,
	config,
	display,
	elements,
	setupWithMock,
} from '../utils/tools';

//Component(s) to test:
import UserModifier from '../../components/UserModifier';

//Dispatched Actions
import { updateUser } from '../../redux/actionCreators/usersActions';

//App-store:
import state from '../utils/testStoreState';
const { users } = state;
const user = users[0];

/**
 * FUNCTIONALITY TO ADD:
 * - IF userId === auth.id, then ABORT
 */
const setupConfig = config({
	component: <Route path=':userId' element={<UserModifier />} />,
	preloadedState: { users: [user] },
	needsRoutes: true,
	startingPath: `/${user.id}`,
});
describe('UserModifier-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		display(
			[
				'user-modifier-component',
				'name-heading',
				'role-select',
				'update-button',
			],
			setupConfig
		);
	});
	describe('Displaying correct roles within parent elements', () => {
		elements(['name-heading'], setupConfig).shouldHaveCorrectRoleWithin(
			'user-modifier-component'
		);
	});
	describe('Displaying correct data in elements (when role has not changed)', () => {
		elements(['name-heading'], setupConfig).shouldHaveTextContent({
			'name-heading': user.name,
		});
		elements(['role-select'], setupConfig).shouldHaveValue({
			'role-select': user.role,
		});
		elements(['update-button'], setupConfig).shouldHaveAttribute(
			'disabled',
			true
		);
	});
	describe('Updating values correctly', () => {
		// You should be only able to change to admin or customer
		changeNot(setupConfig).selects(['role-select']).toValues(['wrongrole']);
		change(setupConfig).select('role-select').toValues(['admin', 'customer']);
	});
	describe('Dispatching correct actions', () => {
		describe('Clicking the update-button', () => {
			test('Case 1: Role not changed -> no actions dispatched (button is disabled)', () => {
				const { store } = setupWithMock(setupConfig);
				userEvent.click(screen.getByTestId('update-button'));
				expect(store.dispatch).toHaveBeenCalledTimes(0);
			});

			test('Case 2: Role changed -> updateUser()', () => {
				const updatedUser = { ...user, role: 'Customer' };
				const { store } = setupWithMock(setupConfig);
				fireEvent.change(screen.getByTestId('role-select'), {
					target: { value: 'Customer' },
				});
				expect(screen.getByTestId('role-select')).toHaveValue(updateUser.role);
				userEvent.click(screen.getByTestId('update-button'));
				expect(store.dispatch).toHaveBeenCalledTimes(1);
				expect(store.dispatch.mock.calls[0][0].toString()).toBe(
					updateUser(updatedUser).toString()
				);
			});
		});
	});
	describe('Other events', () => {
		test('Should navigate to users-page ("/users") once user has been modified', () => {
			const { mockedUsedNavigate } = setupWithMock(setupConfig);
			fireEvent.change(screen.getByTestId('role-select'), {
				target: { value: 'Customer' },
			});
			userEvent.click(screen.getByTestId('update-button'));
			expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
			expect(mockedUsedNavigate).toHaveBeenCalledWith('/users');
		});
	});
});
