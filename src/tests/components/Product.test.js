/** @format */
// Needed modules:
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';

//Own utils for testing
import {
	config,
	display,
	dispatch,
	clicking,
	displayNot,
	elements,
} from '../utils/tools';

//Component(s) to test:
import Product from '../../components/Product';

//Dispatched Actions:
import {
	addCartItem,
	incrementCartItem,
} from '../../redux/actionCreators/cartActions';

//App-store:
import state from '../utils/testStoreState';
import { deleteProduct } from '../../redux/actionCreators/productsActions';
const { products, admin, guest } = state;

const product = products[0];

const setupConfigPropAdmin = config({
	component: <Route path='/' element={<Product providedProduct={product} />} />,
	preloadedState: { products, auth: admin },
	startingPath: `/`,
	needsRoutes: true,
});

const setupConfigPropGuest = config({
	component: <Route path='/' element={<Product providedProduct={product} />} />,
	preloadedState: { products, auth: guest },
	startingPath: `/`,
	needsRoutes: true,
});

const setupConfigPropGuestExistingCart = config({
	component: <Route path='/' element={<Product providedProduct={product} />} />,
	preloadedState: { products, auth: guest, cart: [{ product, quantity: 1 }] },
	startingPath: `/`,
	needsRoutes: true,
});

const setupConfigPathAdmin = config({
	component: <Route path='/:productId' element={<Product />} />,
	preloadedState: { products, auth: admin },
	startingPath: `/${product.id}`,
	needsRoutes: true,
});

afterEach(() => {
	cleanup();
});
describe('Product-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('auth.role === admin', () => {
			display(
				[
					'product-component',
					'name-header',
					'description-element',
					'price-element',
					`modify-button-${product.id}`,
					`delete-button-${product.id}`,
				],
				setupConfigPropAdmin
			);
			displayNot([`add-cart-button-${product.id}`], setupConfigPropAdmin);
		});
		describe('auth.role !== admin', () => {
			display(
				[
					'product-component',
					'name-header',
					'description-element',
					'price-element',
					`add-cart-button-${product.id}`,
				],
				setupConfigPropGuest
			);
			displayNot(
				[`modify-button-${product.id}`, `delete-button-${product.id}`],
				setupConfigPropGuest
			);
		});
	});
	describe('Displaying correct data in elements', () => {
		const valueFields = {
			'name-header': product.name,
			'price-element': product.price,
			'description-element': product.description,
		};
		elements(
			['name-header', 'price-element', 'description-element'],
			setupConfigPropGuest
		).shouldHaveTextContent(valueFields);
	});
	describe('Updating values correctly', () => {});
	describe('Dispatching correct actions', () => {
		dispatch({
			action: addCartItem,
			value: { product, quantity: 1 },
			usesThunk: true,
		}).when({
			caseNum: 1,
			situation: 'Want to add a product to cart',
			config: setupConfigPropGuest,
			userClickTarget: `add-cart-button-${product.id}`,
		});
		dispatch({
			action: incrementCartItem,
			value: product.id,
			usesThunk: true,
		}).when({
			caseNum: 2,
			situation: 'Trying to add an item that already exists in cart',
			config: setupConfigPropGuestExistingCart,
			userClickTarget: `add-cart-button-${product.id}`,
		});
		dispatch({
			action: deleteProduct,
			value: product.id,
			usesThunk: true,
		}).when({
			caseNum: 2,
			situation: 'Trying to delete a product',
			config: setupConfigPathAdmin,
			userClickTarget: `delete-button-${product.id}`,
		});
	});
	describe('Other events', () => {
		describe(`Admin viewing a single product (/products/${product.id}):`, () => {
			clicking(`modify-button-${product.id}`, setupConfigPathAdmin).navigatesTo(
				'modify'
			);
		});
		describe(`Admin viewing all products (/products):`, () => {
			clicking(`modify-button-${product.id}`, setupConfigPropAdmin).navigatesTo(
				`${product.id}/modify`
			);
		});
	});
});
