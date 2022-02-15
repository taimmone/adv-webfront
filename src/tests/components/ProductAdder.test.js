/** @format */
// Needed modules:
import '@testing-library/jest-dom';

//Own utils for testing
import {
	change,
	clicking,
	config,
	dispatch,
	display,
	displayNot,
} from '../utils/tools';

//Component(s) to test:
import ProductAdder from '../../components/ProductAdder';

//Dispatched Actions
import { addProduct } from '../../redux/actionCreators/productsActions';

const openHandler = jest.fn();

const setupConfigOpen = config({
	component: <ProductAdder open={true} openHandler={openHandler} />,
});
const setupConfigClosed = config({
	component: <ProductAdder open={false} openHandler={openHandler} />,
});
describe('ProductAdder-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Case 1: Open===true, ie component visible', () => {
			display(
				[
					'product-adder-component',
					'name-input',
					'price-input',
					'description-input',
					'add-button',
					'cancel-button',
				],
				setupConfigOpen
			);
		});
		describe('Case 2: Open===false, ie component not visible', () => {
			displayNot(
				[
					'product-adder-component',
					'name-input',
					'price-input',
					'description-input',
					'add-button',
					'cancel-button',
				],
				setupConfigClosed
			);
		});
	});

	describe('Updating values correctly', () => {
		change(setupConfigOpen)
			.inputs(['name-input', 'price-input', 'description-input'])
			.toValues([
				'313',
				'31300',
				"The car is a roadster, meaning it doesn't have windows, but has a retractable roof. Despite looking like it has only two seats, the trunk is fitted with a third one",
			]);
	});
	describe('Dispatching correct actions', () => {
		describe('Clicking the add-button', () => {
			dispatch({ action: addProduct, usesThunk: true }).when({
				caseNum: 1,
				situation: 'Updating the product details',
				config: setupConfigOpen,
				userClickTarget: 'add-button',
				FilledInputs: {
					'name-input': '313',
					'price-input': '31300',
					'description-input':
						"The car is a roadster, meaning it doesn't have windows, but has a retractable roof. Despite looking like it has only two seats, the trunk is fitted with a third one",
				},
			});
		});
	});
	describe('Other events', () => {
		clicking('cancel-button', setupConfigOpen).callsMock({ openHandler });
		clicking('add-button', setupConfigOpen).callsMock({ openHandler });
	});
});
