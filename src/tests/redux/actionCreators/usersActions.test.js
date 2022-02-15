/** @format */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
	getUser,
	getUsers,
	removeUser,
	updateUser,
} from '../../../redux/actionCreators/usersActions';
import {
	GET_USER,
	GET_USERS,
	NEW_NOTIFICATION,
	REMOVE_USER,
	UPDATE_USER,
} from '../../../redux/constants';
import { db } from '../../utils/testDb';
import { server, rest } from '../../mocks/server';

const user = db.users[0];

let store;
beforeEach(() => {
	store = mockStore({});
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const testErrorMsg = JSON.stringify(Math.floor(Math.random() * 10000000));

describe('Testing thunk action creators', () => {
	describe('getUser:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: user-object is returned', async () => {
				server.use(
					rest.get(`/api/users/${user.id}`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(user));
					})
				);
				// mock.onGet(`/api/users/${user.id}`).reply(200, user);
				const expectedActions = [
					{
						type: GET_USER,
						payload: user,
					},
				];
				return store.dispatch(getUser(user.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.get(`/api/users/${user.id}`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(getUser(user.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('getUsers:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: users-array is returned', async () => {
				server.use(
					rest.get(`/api/users`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(db.users));
					})
				);
				const expectedActions = [
					{
						type: GET_USERS,
						payload: db.users,
					},
				];
				return store.dispatch(getUsers()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.get(`/api/users`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(getUsers()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('updateUser:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: users-array is returned', async () => {
				server.use(
					rest.put(`/api/users/${user.id}`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(user));
					})
				);
				const expectedActions = [
					{
						type: UPDATE_USER,
						payload: user,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'User updated.', isSuccess: true },
					},
				];
				return store.dispatch(updateUser(user)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.put(`/api/users/${user.id}`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(updateUser(user)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('removeUser:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: updated user from the backend is returned', async () => {
				server.use(
					rest.delete(`/api/users/${user.id}`, (req, res, ctx) => {
						return res(ctx.status(200), ctx.json(user));
					})
				);
				const expectedActions = [
					{
						type: REMOVE_USER,
						payload: user,
					},
					{
						type: NEW_NOTIFICATION,
						payload: {
							message: `${user.name} deleted successfully`,
							isSuccess: true,
						},
					},
				];
				return store.dispatch(removeUser(user.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.delete(`/api/users/${user.id}`, (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: testErrorMsg,
							})
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: testErrorMsg, isSuccess: false },
					},
				];
				return store.dispatch(removeUser(user.id)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
});
