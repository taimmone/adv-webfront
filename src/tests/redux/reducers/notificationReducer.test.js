/** @format */

import {
	NEW_NOTIFICATION,
	REMOVE_NOTIFICATION,
} from '../../../redux/constants';

import notificationReducer from '../../../redux/reducers/notificationReducer';

describe('notificationReducer', () => {
	it('should return the initial state', () => {
		expect(notificationReducer(undefined, {})).toEqual({});
	});
	it('should handle NEW_NOTIFICATION', () => {
		const addAction = {
			type: NEW_NOTIFICATION,
			payload: {
				message: 'Test message',
				isSuccess: false,
			},
		};
		expect(notificationReducer(undefined, addAction)).toEqual({
			message: 'Test message',
			isSuccess: false,
		});
	});
	it('should handle REMOVE_NOTIFICATION', () => {
		const removeAction = {
			type: REMOVE_NOTIFICATION,
		};
		expect(
			notificationReducer(
				{
					message: 'Test message',
					isSuccess: false,
				},
				removeAction
			)
		).toEqual({});
	});
});
