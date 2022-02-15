/** @format */

import {
	ADD_ORDER,
	CLEAR_ORDERS,
	GET_ORDER,
	GET_ORDERS,
} from '../../../redux/constants';

import ordersReducer from '../../../redux/reducers/ordersReducer';
import { db } from '../../utils/testDb';

const newOrder = {
	id: 'testIdOrder',
	items: [
		{
			product: {
				name: 'test product',
				price: '999',
				id: 'testIdProduct',
				description: 'test description',
			},
			quantity: 1,
		},
	],
	customerId: 'testIdCustomer',
};

const { orders } = db;
const order = orders[1];

describe('ordersReducer', () => {
	it('should return the initial state', () => {
		expect(ordersReducer(undefined, {})).toEqual([]);
	});
	it('should handle ADD_ORDER', () => {
		const addAction = {
			type: ADD_ORDER,
			payload: newOrder,
		};
		expect(ordersReducer(orders, addAction)).toEqual([...orders, newOrder]);
	});
	it('should handle GET_ORDER', () => {
		const addAction = {
			type: GET_ORDER,
			payload: order,
		};
		expect(ordersReducer(undefined, addAction)).toEqual([order]);
	});
	it('should handle GET_ORDERS', () => {
		const addAction = {
			type: GET_ORDERS,
			payload: orders,
		};
		expect(ordersReducer(undefined, addAction)).toEqual(orders);
	});
	it('should handle CLEAR_ORDERS', () => {
		const removeAction = {
			type: CLEAR_ORDERS,
		};
		expect(ordersReducer(orders, removeAction)).toEqual([]);
	});
});
