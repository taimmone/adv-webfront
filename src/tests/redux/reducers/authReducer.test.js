/** @format */
import { ADD_AUTH, INIT_AUTH, REMOVE_AUTH } from '../../../redux/constants';
import authReducer from '../../../redux/reducers/authReducer';
import { db } from '../../utils/testDb';

const user = db.users[0];

describe('authReducer', () => {
	it('should return the initial state', () => {
		expect(authReducer(undefined, {})).toEqual({});
	});
	it('should handle INIT_AUTH', () => {
		const initAction = {
			type: INIT_AUTH,
			payload: { role: 'guest' },
		};
		expect(authReducer(undefined, initAction)).toEqual({
			role: 'guest',
		});
	});
	it('should handle REMOVE_AUTH', () => {
		const removeAction = {
			type: REMOVE_AUTH,
			payload: user,
		};
		expect(authReducer({ ...user, init: true }, removeAction)).toEqual({
			role: 'guest',
		});
	});
});
