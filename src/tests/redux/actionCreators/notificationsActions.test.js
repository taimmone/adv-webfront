/** @format */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import axios from '../../../services/api';
import {
	NEW_NOTIFICATION,
	REMOVE_NOTIFICATION,
} from '../../../redux/constants';
import { db } from '../../utils/testDb';
import {
	createNotification,
	removeNotification,
} from '../../../redux/actionCreators/notificationsActions';

const product = db.products[0];

const mock = new MockAdapter(axios);

let store;
beforeEach(() => {
	store = mockStore({});
	mock.resetHandlers();
});

const newNotification = { message: 'Test-Notification', isSuccess: false };

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Testing action creators', () => {
	describe('createNotification:', () => {
		describe('Should dispatch action with NEW_NOTIFICATION-type and payload of newNotification', () => {
			it('Case 1: NEW_NOTIFICATION', async () => {
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: newNotification,
					},
				];
				// Here it dispatches the action.
				store.dispatch(createNotification(newNotification));
				// Here it gets the actions from the store
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
	describe('removeNotification:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: REMOVE_NOTIFICATION', async () => {
				const expectedActions = [
					{
						type: REMOVE_NOTIFICATION,
					},
				];
				store.dispatch(removeNotification(product));
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
	});
});
