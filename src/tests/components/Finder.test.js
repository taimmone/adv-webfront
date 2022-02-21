/** @format */
// Needed modules:
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';

//Own utils for testing

import {
	config,
	dispatch,
	display,
	displayNot,
	elements,
} from '../utils/tools';

//Component(s) to test:

//Dispatched Actions
import { getProduct } from '../../redux/actionCreators/productsActions';
import { getOrder } from '../../redux/actionCreators/ordersActions';
import { getUser } from '../../redux/actionCreators/usersActions';

//App-store:
import state from '../utils/testStoreState';
import Finder from '../../components/Finder';
const { products, orders, users } = state;

const product = products[0];
const user = users[0];
const order = orders[0];

const userFinderWithUsers = config({
	component: (
		<Route
			path=':userId'
			element={<Finder type='user' findHandler={getUser} />}
		/>
	),
	preloadedState: { users },
	needsRoutes: true,
	startingPath: `/${user.id}`,
});
const orderFinderWithOrders = config({
	component: (
		<Route
			path=':orderId'
			element={<Finder type='order' findHandler={getOrder} />}
		/>
	),
	preloadedState: { orders },
	needsRoutes: true,
	startingPath: `/${order.id}`,
});
const productFinderWithProducts = config({
	component: (
		<Route
			path=':productId'
			element={<Finder type='product' findHandler={getProduct} />}
		/>
	),
	preloadedState: { products },
	needsRoutes: true,
	startingPath: `/${product.id}`,
});
const orderFinderEmptyState = config({
	component: (
		<Route
			path=':orderId'
			element={<Finder type='order' findHandler={getOrder} />}
		/>
	),
	preloadedState: {},
	needsRoutes: true,
	startingPath: `/${order.id}`,
});
const usersFinderEmptyState = config({
	component: (
		<Route
			path=':userId'
			element={<Finder type='user' findHandler={getUser} />}
		/>
	),
	preloadedState: {},
	needsRoutes: true,
	startingPath: `/${user.id}`,
});
const productFinderEmptyState = config({
	component: (
		<Route
			path=':productId'
			element={<Finder type='product' findHandler={getProduct} />}
		/>
	),
	preloadedState: {},
	needsRoutes: true,
	startingPath: `/${product.id}`,
});
const configCases = {
	product: {
		withState: productFinderWithProducts,
		withoutState: productFinderEmptyState,
		action: getProduct,
	},
	order: {
		withState: orderFinderWithOrders,
		withoutState: orderFinderEmptyState,
		action: getOrder,
	},
	user: {
		withState: userFinderWithUsers,
		withoutState: usersFinderEmptyState,
		action: getUser,
	},
};
describe('Finder-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		for (const item in configCases) {
			describe(`In /:${item}Id path, when state has ${item}s`, () => {
				display([`${item}-found-component`], configCases[item].withState);
				displayNot([`no-${item}-found-component`], configCases[item].withState);
			});
			describe(`In /:${item}Id path, when state has no ${item}s`, () => {
				display([`no-${item}-found-component`], configCases[item].withoutState);
				displayNot([`${item}-found-component`], configCases[item].withoutState);
			});
		}
	});
	describe('Displaying correct data in elements', () => {
		for (const item in configCases) {
			describe(`In /:${item}Id path, when state has no ${item}s`, () => {
				elements(
					[`no-${item}-found-component`],
					configCases[item].withoutState
				).shouldHaveTextContent({
					[`no-${item}-found-component`]: item + ' not found.',
				});
			});
		}
	});
	describe('Updating values correctly', () => {});
	describe('Dispatching correct actions', () => {
		for (const item in configCases) {
			describe(`In /:${item}Id path, when state has no ${item}s`, () => {
				dispatch({
					action: configCases[item].action,
					usesThunk: true,
				}).when({
					caseNum: 1,
					situation: `No such ${item} found in ${item}s-state.`,
					config: configCases[item].withoutState,
				});
			});
		}
	});
});
