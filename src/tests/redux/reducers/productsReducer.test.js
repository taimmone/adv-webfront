/** @format */

import {
	ADD_PRODUCT,
	DELETE_PRODUCT,
	GET_PRODUCT,
	GET_PRODUCTS,
	UPDATE_PRODUCT,
} from '../../../redux/constants';

import productsReducer from '../../../redux/reducers/productsReducer';
import { db } from '../../utils/testDb';

const newProduct = {
	name: 'test product',
	price: '999',
	id: 'testIdProduct',
	description: 'test description',
};

const { products } = db;
const product = products[1];
const oldProducts = [...products, newProduct];

describe('productsReducer', () => {
	it('should return the initial state', () => {
		expect(productsReducer(undefined, {})).toEqual([]);
	});
	it('should handle ADD_PRODUCT', () => {
		const addAction = {
			type: ADD_PRODUCT,
			payload: newProduct,
		};
		expect(productsReducer(products, addAction)).toEqual([
			newProduct,
			...products,
		]);
	});
	it('should handle GET_PRODUCT', () => {
		const addAction = {
			type: GET_PRODUCT,
			payload: product,
		};
		expect(productsReducer(undefined, addAction)).toEqual([product]);
	});
	it('should handle GET_PRODUCTS', () => {
		const addAction = {
			type: GET_PRODUCTS,
			payload: products,
		};
		expect(productsReducer(undefined, addAction)).toEqual(products);
	});
	it('should handle UPDATE_PRODUCT', () => {
		const updatedProduct = newProduct;
		updatedProduct.price = 0;
		const updatedProducts = [...products, updatedProduct];

		const incrementAction = {
			type: UPDATE_PRODUCT,
			payload: updatedProduct,
		};

		expect(productsReducer(oldProducts, incrementAction)).toEqual(
			updatedProducts
		);
	});
	it('should handle DELETE_PRODUCT', () => {
		const removeAction = {
			type: DELETE_PRODUCT,
			payload: { id: newProduct.id },
		};
		expect(productsReducer(oldProducts, removeAction)).toEqual(products);
	});
});
