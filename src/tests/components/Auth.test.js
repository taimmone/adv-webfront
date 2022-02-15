/** @format */

//Own utils for testing
import { config, display, displayNot, when } from '../utils/tools';
//Component(s) to test:
import Auth from '../../components/Auth';

//App-store:
import state from '../utils/testStoreState';
import { Route } from 'react-router-dom';
const { admin, guest, visitor, customer } = state;

const component = <Route path='/' element={<Auth authRoles={['admin']} />} />;

const setupConfigRoleValid = config({
	component,
	preloadedState: { auth: admin },
	needsRoutes: true,
	startingPath: '/',
});
const setupConfigRoleInvalid = config({
	component,
	preloadedState: { auth: customer },
	needsRoutes: true,
	startingPath: '/',
});
const setupConfigRoleGuest = config({
	component,
	preloadedState: { auth: guest },
	needsRoutes: true,
	startingPath: '/',
});
const setupConfigRoleUninitialized = config({
	component,
	preloadedState: { auth: visitor },
	needsRoutes: true,
	startingPath: '/',
});

describe('TestBoilerPlate-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Case 1: Someone with a valid role attempts to access', () => {
			display(['auth-success-component'], setupConfigRoleValid);
		});
		describe('Case 2: Someone with an invalid role attempts to access', () => {
			displayNot(['auth-success-component'], setupConfigRoleInvalid);
		});
		describe('Case 3: Someone whose auth has not been initialized', () => {
			displayNot(['auth-success-component'], setupConfigRoleUninitialized);
		});
	});
	describe('Displaying correct data in elements', () => {});
	describe('Updating values correctly', () => {});
	describe('Dispatching correct actions', () => {});
	describe('Other events', () => {
		when({
			config: setupConfigRoleInvalid,
			situation: 'auth.role is invalid',
		}).itShould.navigateTo('/');
		when({
			config: setupConfigRoleGuest,
			situation: 'auth.role is guest',
		}).itShould.navigateTo('/login');
	});
});
