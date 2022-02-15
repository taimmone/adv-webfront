/** @format */
// Needed modules:
import '@testing-library/jest-dom';

//Own utils for testing
import {
	config,
	display,
	setupWithMock,
	displayMultiple,
	dispatch,
} from '../utils/tools';

//Component(s) to test:
import Users from '../../components/Users';

//Dispatched Actions:
import { getUsers } from '../../redux/actionCreators/usersActions';

//App-store:
import state from '../utils/testStoreState';
const { users } = state;

const setupConfig = config({
	component: <Users />,
	preloadedState: { users },
});
const setupEmptyConfig = config({
	component: <Users />,
});
describe('Users-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		display(['users-component', 'users-container'], setupConfig);
		displayMultiple(['user-component'], users.length, setupConfig);
	});
	describe('Dispatching correct actions', () => {
		test('Case 1: users in state -> no actions dispatched', () => {
			const { store } = setupWithMock(setupConfig);
			expect(store.dispatch).toHaveBeenCalledTimes(0);
		});
		dispatch({
			action: getUsers,
			usesThunk: true,
		}).when({
			caseNum: 2,
			situation: 'no users in state',
			config: setupEmptyConfig,
		});
	});
	describe('Other events', () => {});
});
