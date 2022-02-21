/** @format */
//Component(s) to test:
import App from '../../App';

import { storeCreator } from '../utils/testStores';
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { getAllOrders, getAllProducts, getAllUsers } from '../mocks/db';
import { productMsg } from '../../redux/actionCreators/productsActions';

let orders = getAllOrders();
let users = getAllUsers();
let products = getAllProducts();
let history;
let ui;
let store;

const credentials = getAllUsers().reduce((credentials, user) => {
	credentials[user.name.toLowerCase()] = {
		name: user.name,
		id: user.id,
		email: user.email,
		password: '1234567890',
	};

	return credentials;
}, {});

const testNavigationIsCorrect = (role = 'guest') => {
	const links = ['home', 'products'];

	switch (role) {
		case 'customer':
			links.push('orders', 'cart', 'logout');
			break;
		case 'admin':
			links.push('orders', 'users', 'logout');
			break;
		default:
			links.push('login', 'cart');
	}

	links.forEach((link) => {
		expect(screen.getByTestId(`${link}-link`)).toBeInTheDocument();
	});
};

const navigateToPage = (pageName) => {
	userEvent.click(screen.getByTestId(`${pageName}-link`));
	if (pageName === 'home') pageName = '';
	expect(history.location.pathname).toEqual(`/${pageName}`);
};

const expectComponent = async (pageName) => {
	expect(
		await screen.findByTestId(`${pageName}-component`)
	).toBeInTheDocument();
};

const expectMany = async (compName, items) => {
	//There are 2 orders in the backend, so there should be 2 order-components.
	await screen.findAllByTestId(`${compName}-component`);
	const components = screen.getAllByTestId(`${compName}-component`);
	expect(components.length).toEqual(items.length);
};

const login = async ({ email, password }) => {
	navigateToPage('login');
	await expectComponent('login');

	const emailInput = screen.getByTestId('email-input');
	const passwordInput = screen.getByTestId('password-input');

	await userEvent.type(emailInput, email, { delay: 5 });
	await userEvent.type(passwordInput, password, { delay: 5 });

	userEvent.click(screen.getByTestId('login-button'), 'click');
	expect(await screen.findByTestId('home-component')).toBeInTheDocument();
	expect(history.location.pathname).toEqual('/');
	await expectNotification('Welcome back!', true);
};

const inspectSingle = async (itemName, items, itemToInspect = items[0]) => {
	// Finding the desired component
	const index = screen.getAllByTestId('inspect-link').findIndex((element) => {
		const pathArray = element.href.split('/');
		const id = pathArray[pathArray.length - 1];
		return id === itemToInspect.id;
	});
	//Clicking the desired components inspect-link
	userEvent.click(screen.getAllByTestId('inspect-link')[index]);

	//We should now be viewing a page with a single item without its list component.
	expect(
		screen.queryByTestId(`${itemName}s-component`)
	).not.toBeInTheDocument();
	// Let's make sure the path is correct
	expect(history.location.pathname).toEqual(
		`/${itemName}s/${itemToInspect.id}`
	);
	// And a single order component is rendered
	expect(
		await screen.findByTestId(`${itemName}-component`)
	).toBeInTheDocument();
};

const expectNotification = async (message, isSuccess) => {
	expect(
		await screen.findByTestId('notification-component')
	).toBeInTheDocument();

	await waitFor(async () =>
		expect(
			await screen.findByTestId('notification-component')
		).toHaveTextContent(message)
	);

	const style = isSuccess ? 'green' : 'red';
	expect(screen.getByTestId('notification-component')).toHaveStyle(
		'backgroundColor:' + style
	);
};

const logOut = async () => {
	userEvent.click(screen.getByTestId('logout-link'));
	await waitForElementToBeRemoved(() => screen.queryByTestId('logout-link'));
};

beforeEach(() => {
	orders = getAllOrders();
	users = getAllUsers();
	products = getAllProducts();

	history = createMemoryHistory();
	store = storeCreator();
	ui = (
		<Provider store={store}>
			<HistoryRouter history={history}>
				<App />
			</HistoryRouter>
		</Provider>
	);
});
// afterEach(async () => {
// 	await logOut();
// });

describe('END-TO-END - ADMIN', () => {
	describe("Navigation and Other UI Elements'", () => {
		test('Role in state is "admin" after successful login', async () => {
			render(ui);

			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			expect(store.getState().auth.role.toLowerCase()).toEqual('admin');
			// expect(screen.getByText(/role: admin/i)).toBeInTheDocument();
			await logOut();
		});
		test('Navigation is shown correctly after successful admin login', async () => {
			render(ui);
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			await logOut();
		});
		test('Navigation is shown correctly after successful admin logout', async () => {
			render(ui);

			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			await logOut();
			testNavigationIsCorrect('guest');
		});
	});
	describe('Orders (CORS)', () => {
		test('Should be able to look at all orders from the backend.', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('orders');
			await expectComponent('orders');
			await expectMany('order', orders);
			await logOut();
		});
		test('Should be able to look at a single order from the backend.', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('orders');
			await expectComponent('orders');
			await inspectSingle('order', orders);
			await logOut();
		});
	});
	describe('Users (CORS)', () => {
		test('Should be able to look at all users from the backend.', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('users');
			await expectComponent('users');
			await expectMany('user', users);
			await logOut();
		});
		test('Should be able to look at a single user from the backend.', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('users');
			await expectComponent('users');
			await expectMany('user', users);
			await inspectSingle('user', users);
			await logOut();
		});
		test('Should be able to delete a user from the backend.', async () => {
			render(ui);

			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('users');
			await expectComponent('users');
			await expectMany('user', users);

			userEvent.click(
				screen.getByTestId(`delete-button-${credentials.customer.id}`)
			);

			users = users.filter((user) => user.id !== credentials.customer.id);
			await waitFor(async () => {
				await expectMany('user', users);
			});
			await expectNotification(
				`${credentials.customer.name} deleted successfully`,
				true
			);
			await logOut();
		});
		test('Should be able to modify an existing users role', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('users');
			await expectComponent('users');
			await expectMany('user', users);
			userEvent.click(
				screen.getByTestId(`modify-button-${credentials.customer.id}`)
			);
			//We should now be viewing a page with a single item without its list component.
			expect(screen.queryByTestId(`user-component`)).not.toBeInTheDocument();
			// Let's make sure the path is correct
			expect(history.location.pathname).toEqual(
				`/users/${credentials.customer.id}/modify`
			);

			userEvent.selectOptions(
				await screen.findByTestId('role-select'),
				['admin'],
				{ delay: 2 }
			);
			userEvent.click(screen.getByTestId(`update-button`));
			expect(history.location.pathname).toEqual(`/users`);
			await inspectSingle('user', users, credentials.customer);
			await expectNotification('User updated.', true);
			// Check that the role has been updated.
			expect(screen.getByTestId('role-element')).toHaveTextContent('admin');
			await logOut();
		});
		test('Should be unable to delete or modify their own user-details', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('users');
			await expectComponent('users');
			await expectMany('user', users);
			await inspectSingle('user', users, credentials.admin);
			expect(
				screen.queryByTestId(`delete-button-${credentials.admin.id}`)
			).not.toBeInTheDocument();
			expect(
				screen.queryByTestId(`modify-button-${credentials.admin.id}`)
			).not.toBeInTheDocument();
			await logOut();
		});
	});
	describe('Products (CORS)', () => {
		test('Should be able to look at all products from the backend', async () => {
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('products');
			await expectComponent('products');
			await expectMany('product', products);
			// await inspectSingle('product', users, credentials.admin);
			await logOut();
		});
		test('Should be able to update existing products from the backend', async () => {
			const product = products[0];
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('products');
			await expectComponent('products');
			await expectMany('product', products);
			userEvent.click(screen.getByTestId(`modify-button-${product.id}`));
			expect(history.location.pathname).toEqual(
				`/products/${product.id}/modify`
			);
			const nameInput = screen.getByTestId('name-input');
			const priceInput = screen.getByTestId('price-input');

			await userEvent.type(nameInput, '-test-change', { delay: 5 });
			await userEvent.type(priceInput, '99', { delay: 5 });
			userEvent.click(screen.getByTestId(`update-button`));
			expect(history.location.pathname).toEqual(`/products`);
			await expectNotification(productMsg.updated, true);
			userEvent.click(screen.getByTestId(`modify-button-${product.id}`));
			expect(screen.getByTestId('name-input')).toHaveValue(
				product.name + '-test-change'
			);
			expect(screen.getByTestId('price-input')).toHaveValue(
				product.price + '99'
			);
			await logOut();
		});
		test('Should be able to delete existing product from the backend', async () => {
			const product = products[0];
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('products');
			await expectComponent('products');
			await expectMany('product', products);
			userEvent.click(screen.getByTestId(`delete-button-${product.id}`));
			products = products.filter((p) => p.id !== product.id);
			await waitFor(async () => {
				await expectMany('product', products);
			});

			await logOut();
		});
		test('Should be able to add a new product to the backend', async () => {
			const newProduct = {
				name: 'test-name',
				price: '99',
				description: 'Test description',
			};
			render(ui);
			await expectComponent('app');
			testNavigationIsCorrect('guest');
			await login(credentials.admin);
			testNavigationIsCorrect('admin');
			navigateToPage('products');
			await expectComponent('products');
			await expectMany('product', products);
			userEvent.click(screen.getByTestId(`open-adder-button`));
			expect(
				await screen.findByTestId('product-adder-component')
			).toBeInTheDocument();
			userEvent.type(screen.getByTestId('name-input'), newProduct.name, {
				delay: 5,
			});
			userEvent.type(screen.getByTestId('price-input'), newProduct.price, {
				delay: 5,
			});
			userEvent.type(
				screen.getByTestId('description-input'),
				newProduct.description,
				{ delay: 5 }
			);
			userEvent.click(screen.getByTestId(`add-button`));
			expect(history.location.pathname).toEqual(`/products`);

			products.push(newProduct);
			await waitFor(async () => {
				await expectMany('product', products);
			});

			await logOut();
		});
	});
	test.todo('Should be able to add new product to the backend');
	test.todo('Should be able to delete a product from the backend');
});
