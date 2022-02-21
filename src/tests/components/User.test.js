/** @format */
// Needed modules:
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';

//Own utils for testing
import {
	config,
	display,
	dispatch,
	displayNot,
	elements,
	clicking,
} from '../utils/tools';

//Component(s) to test:
import User from '../../components/User';

//Dispatched Actions:
import { removeUser } from '../../redux/actionCreators/usersActions';

//App-store:
import state from '../utils/testStoreState';

const { users, admin } = state;

/* 
  This is the boiler plate that has been used to create all the tests. 
*/
const user = users[0];

const setupConfigThroughProp = config({
	component: <Route path='/' element={<User providedUser={user} />} />,
	preloadedState: { users, auth: admin },
	startingPath: `/`,
	needsRoutes: true,
});

const setupConfigThroughPath = config({
	component: <Route path='/:userId' element={<User />} />,
	preloadedState: { users, auth: admin },
	startingPath: `/${user.id}`,
	needsRoutes: true,
});

const setupMirrorConfigThroughPath = config({
	component: <Route path='/:userId' element={<User />} />,
	preloadedState: { users, auth: admin },
	startingPath: `/${admin.id}`,
	needsRoutes: true,
});

afterEach(() => {
	cleanup();
});
describe('User-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('user is given through the components props', () => {
			display(
				[
					'user-component',
					'name-heading',
					'email-element',
					'role-element',
					`modify-button-${user.id}`,
					`delete-button-${user.id}`,
					'inspect-link',
				],
				setupConfigThroughProp
			);
		});
		describe('userId is given through pathname, auth.id !== user.id', () => {
			display(
				[
					'user-component',
					'name-heading',
					'email-element',
					'role-element',
					`modify-button-${user.id}`,
					`delete-button-${user.id}`,
				],
				setupConfigThroughPath
			);
			displayNot(['inspect-link'], setupConfigThroughPath);
		});
		describe('userId is given through pathname, auth.id === user.id', () => {
			display(
				['user-component', 'name-heading', 'email-element', 'role-element'],
				setupMirrorConfigThroughPath
			);
			displayNot(
				[
					`modify-button-${admin.id}`,
					`delete-button-${admin.id}`,
					'inspect-link',
				],
				setupMirrorConfigThroughPath
			);
		});
	});
	describe('Displaying correct roles within parent elements', () => {
		elements(
			['name-heading', 'inspect-link'],
			setupConfigThroughProp
		).shouldHaveCorrectRoleWithin('user-component');
	});
	describe('Displaying correct data in elements', () => {
		const textFields = {
			'name-heading': user.name,
			'email-element': user.email,
			'role-element': user.role,
		};
		describe('userId is given through pathname', () => {
			elements(
				['name-heading', 'email-element', 'role-element'],
				setupConfigThroughPath
			).shouldHaveTextContent(textFields);
		});
		describe('userId is given through props', () => {
			elements(
				['name-heading', 'email-element', 'role-element'],
				setupConfigThroughProp
			).shouldHaveTextContent(textFields);
		});
	});
	describe('Updating values correctly', () => {
		describe('userId is given through prop', () => {
			clicking(`modify-button-${user.id}`, setupConfigThroughProp).navigatesTo(
				`${user.id}/modify`
			);
			clicking('inspect-link', setupConfigThroughProp).changesLocationTo(
				`/${user.id}`
			);
		});
		describe('userId is given through path,', () => {
			clicking(`modify-button-${user.id}`, setupConfigThroughPath).navigatesTo(
				`modify`
			);
		});
	});
	describe('Dispatching correct actions', () => {
		dispatch({
			action: removeUser,
			value: user.id,
			usesThunk: true,
		}).when({
			caseNum: 1,
			situation: 'Wants to delete user',
			config: setupConfigThroughPath,
			userClickTarget: `delete-button-${user.id}`,
		});
	});
	describe('Other events', () => {});
});
