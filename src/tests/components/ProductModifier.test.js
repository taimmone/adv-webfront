/** @format */
// Needed modules:
import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';

//Own utils for testing
import {
	change,
	clicking,
	config,
	dispatch,
	display,
	elements,
} from '../utils/tools';

//Component(s) to test:
import ProductModifier from '../../components/ProductModifier';

//Dispatched Actions
import { updateProduct } from '../../redux/actionCreators/productsActions';

//App-store:
import state from '../utils/testStoreState';
const { products } = state;

// console.log('STATEEE PRODUCTS', products);
const product = products[0];

const setupConfig = config({
	component: <Route path=':productId' element={<ProductModifier />} />,
	preloadedState: { products },
	needsRoutes: true,
	startingPath: `/${product.id}`,
});

describe('ProductModifier-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		display(
			[
				'product-modifier-component',
				'id-input',
				'name-input',
				'price-input',
				'image-input',
				'description-input',
				'update-button',
				'cancel-button',
			],
			setupConfig
		);
	});
	describe('Displaying correct data in elements', () => {
		const valueFields = {
			'id-input': product.id,
			'name-input': product.name,
			'price-input': `${product.price}`,
			'description-input': product.description,
		};
		elements(
			['id-input', 'name-input', 'price-input', 'description-input'],
			setupConfig
		).shouldHaveValue(valueFields);
		elements(['id-input'], setupConfig).shouldHaveAttribute('disabled', true);
	});
	describe('Updating values correctly', () => {
		change(setupConfig)
			.inputs(['name-input', 'price-input', 'description-input'])
			.toValues([
				'313',
				'31300',
				"The car is a roadster, meaning it doesn't have windows, but has a retractable roof. Despite looking like it has only two seats, the trunk is fitted with a third one",
			]);
	});
	describe('Dispatching correct actions', () => {
		describe('Clicking the update-button', () => {
			dispatch({ action: updateProduct, usesThunk: true }).when({
				caseNum: 1,
				situation: 'Updating the product details',
				config: setupConfig,
				userClickTarget: 'update-button',
			});
		});
	});
	describe('Other events', () => {
		clicking('cancel-button', setupConfig).navigatesTo('/products');
		clicking('update-button', setupConfig).navigatesTo('/products');
	});
});
