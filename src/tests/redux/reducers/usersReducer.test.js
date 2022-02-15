/** @format */

import {
	CLEAR_USERS,
	GET_USER,
	GET_USERS,
	REMOVE_USER,
	UPDATE_USER,
} from '../../../redux/constants';

import usersReducer from '../../../redux/reducers/usersReducer';
import { db } from '../../utils/testDb';

const newUser = {
	id: 'testUserId',
	name: 'test name',
	email: 'test@email.com',
	role: 'customer',
};

const { users } = db;
const user = users[1];
const oldUsers = [...users, newUser];
describe('usersReducer', () => {
	it('should return the initial state', () => {
		expect(usersReducer(undefined, {})).toEqual([]);
	});
	it('should handle GET_USER', () => {
		const addAction = {
			type: GET_USER,
			payload: user,
		};
		expect(usersReducer(undefined, addAction)).toEqual([user]);
	});
	it('should handle GET_USERS', () => {
		const addAction = {
			type: GET_USERS,
			payload: users,
		};
		expect(usersReducer(undefined, addAction)).toEqual(users);
	});
	it('should handle UPDATE_USER', () => {
		const updatedUser = newUser;
		updatedUser.price = 0;
		const updatedUsers = [...users, updatedUser];

		const incrementAction = {
			type: UPDATE_USER,
			payload: updatedUser,
		};

		expect(usersReducer(oldUsers, incrementAction)).toEqual(updatedUsers);
	});
	it('should handle CLEAR_USERS', () => {
		const removeAction = {
			type: CLEAR_USERS,
		};
		expect(usersReducer(users, removeAction)).toEqual([]);
	});
	it('should handle REMOVE_USER', () => {
		const removeAction = {
			type: REMOVE_USER,
			payload: { id: newUser.id },
		};
		expect(usersReducer(oldUsers, removeAction)).toEqual(users);
	});
});
