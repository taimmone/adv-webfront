/** @format */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
	initAuth,
	invalidAuth,
	logIn,
	logOut,
	register,
	validAuth,
} from '../../../redux/actionCreators/authActions';
import {
	CLEAR_ORDERS,
	CLEAR_USERS,
	INIT_AUTH,
	NEW_NOTIFICATION,
	REMOVE_AUTH,
} from '../../../redux/constants';

import { db } from '../../utils/testDb';
import { server } from '../../mocks/server';
import { rest } from '../../mocks/server';
const user = db.users[0];

let store;
beforeEach(() => {
	store = mockStore({});
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Testing thunk action creators', () => {
	describe('initAuth:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: user-object is returned', async () => {
				server.use(
					rest.get('/api/check-status', (req, res, ctx) => {
						return res(
							ctx.status(200),
							ctx.json({
								user,
							})
						);
					})
				);
				const expectedActions = [
					{
						type: INIT_AUTH,
						payload: user,
					},
				];
				return store.dispatch(initAuth()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it('Case 2: user-object is not returned', async () => {
				server.use(
					rest.get('/api/check-status', (req, res, ctx) => {
						return res(ctx.status(200), ctx.json({}));
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: INIT_AUTH,
					},
				];
				return store.dispatch(initAuth()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful requests', () => {
			it('Case 1: Error caught -> NEW_NOTIFICATION', async () => {
				server.use(
					rest.get('/api/check-status', (req, res, ctx) => {
						return res(ctx.status(400), ctx.json({ error: 'test-error' }));
					})
				);
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'test-error', isSuccess: false },
					},
				];
				return store.dispatch(initAuth()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('logIn:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: user-object is returned', async () => {
				const logInCreds = {
					email: user.email,
					password: 'correctpassword',
				};
				// mock.onPost('/api/login').reply(200, { user });
				server.use(
					rest.post('/api/login', (req, res, ctx) => {
						return res(
							ctx.status(200),
							ctx.json({
								user,
							})
						);
					})
				);
				const expectedActions = [
					{
						type: INIT_AUTH,
						payload: user,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: validAuth.welcomeBack, isSuccess: true },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful attempts', () => {
			it('Case 1: Backend Error response caught -> NEW_NOTIFICATION', async () => {
				const logInCreds = {
					email: user.email,
					password: 'correctpassword',
				};
				server.use(
					rest.post('/api/login', (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({
								error: 'test-error',
							})
						);
					})
				);
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'test-error', isSuccess: false },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 2: ${invalidAuth.email} -> NEW_NOTIFICATION`, async () => {
				const logInCreds = {
					email: 'invalid',
					password: 'correctpassword',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuth.email, isSuccess: false },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 3: ${invalidAuth.password} -> NEW_NOTIFICATION`, async () => {
				const logInCreds = {
					email: user.email,
					password: 'inc',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuth.password, isSuccess: false },
					},
				];
				return store.dispatch(logIn(logInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('logOut:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: Logged out -> REMOVE_AUTH, CLEAR_ORDERS, CLEAR_USERS, NEW_NOTIFICATION', async () => {
				server.use(
					rest.get('/api/logout', (req, res, ctx) => {
						return res(ctx.status(200), ctx.json({ message: 'Logged out.' }));
					})
				);
				const expectedActions = [
					{
						type: REMOVE_AUTH,
					},
					{
						type: CLEAR_ORDERS,
					},
					{
						type: CLEAR_USERS,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'Logged out.', isSuccess: true },
					},
				];
				return store.dispatch(logOut()).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
	describe('register:', () => {
		describe('expected actions should be dispatched on successful requests', () => {
			it('Case 1: user-object is returned', async () => {
				server.use(
					rest.post('/api/register', (req, res, ctx) => {
						return res(ctx.status(200), ctx.json({ user }));
					})
				);
				// authService.checkStatus.mockResolvedValueOnce({ user });
				const expectedActions = [
					{
						type: INIT_AUTH,
						payload: user,
					},
					{
						type: NEW_NOTIFICATION,
						payload: { message: validAuth.welcome(user.name), isSuccess: true },
					},
				];
				return store.dispatch(register(user)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
		describe('expected actions should be dispatched on unsuccessful attempts', () => {
			it('Case 1: Backend Response Error caught -> NEW_NOTIFICATION (Hint: error is object)', async () => {
				server.use(
					rest.post('/api/register', (req, res, ctx) => {
						return res(
							ctx.status(400),
							ctx.json({ error: { email: 'test-error' } })
						);
					})
				);
				const store = mockStore({});
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: 'test-error', isSuccess: false },
					},
				];
				return store.dispatch(register(user)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 2: ${invalidAuth.email} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					email: 'invalid',
					password: 'correctpassword',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuth.email, isSuccess: false },
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 3: ${invalidAuth.password} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					email: user.email,
					password: 'inc',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuth.password, isSuccess: false },
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 4: ${invalidAuth.name} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					name: 'foo',
					email: user.email,
					password: 'correctpassword',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: { message: invalidAuth.name, isSuccess: false },
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
			it(`Case 5: ${invalidAuth.passwordMismatch} -> NEW_NOTIFICATION`, async () => {
				const registerInCreds = {
					name: user.name,
					email: user.email,
					password: 'correctpassword',
					passwordConfirmation: 'notthesame',
				};
				const expectedActions = [
					{
						type: NEW_NOTIFICATION,
						payload: {
							message: invalidAuth.passwordMismatch,
							isSuccess: false,
						},
					},
				];
				return store.dispatch(register(registerInCreds)).then(() => {
					const actualActions = store.getActions();
					expect(actualActions).toEqual(expectedActions);
				});
			});
		});
	});
});
