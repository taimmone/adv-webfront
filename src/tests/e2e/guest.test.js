import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import App from '../../App';
import { getAllProducts } from '../mocks/db';
import { storeCreator } from '../utils/testStores';
import configureMockStore from 'redux-mock-store';
/** @format */

import thunk from 'redux-thunk';
import {
	getProducts,
	getProduct
}
	from '../../redux/actionCreators/productsActions';
import {
	GET_PRODUCTS,
	GET_PRODUCT,
} from '../../redux/constants';

import { db } from '../utils/testDb';
import { rest, server } from '../mocks/server';
// import { rest } from '../../mocks/server';
const user = db.users[0];

let store;
let history;
let ui;


const URL = "http://localhost:3001/api/products";

const PRODUCTS = [{ "id": "b71d1c408e5711ecbdc229272a4702d4", "name": "Fantastic Cotton Chair", "price": 102, "image": "http://placeimg.com/640/480/nature", "description": "The Football Is Good For Training And Recreational Purposes" }, { "id": "b71d6a608e5711ecbdc229272a4702d4", "name": "Lovely Marble Car", "price": 909, "image": "http://placeimg.com/640/480/city", "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients" }, { "id": "b71d91708e5711ecbdc229272a4702d4", "name": "Sleek Plastic Hat", "price": 62.25, "image": "http://placeimg.com/640/480/city", "description": "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive" }, { "id": "b71db8808e5711ecbdc229272a4702d4", "name": "Awesome Wooden Shoes", "price": 4.99, "image": "http://placeimg.com/640/480/food", "description": "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals" }, { "id": "b71ddf908e5711ecbdc229272a4702d4", "name": "Small Cotton Chicken", "price": 173.99, "image": "http://placeimg.com/640/480/fashion", "description": "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive" }, { "id": "b71e2db08e5711ecbdc229272a4702d4", "name": "Ergonomic Metal Cheese", "price": 83.1, "image": "http://placeimg.com/640/480/transport", "description": "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J" }, { "id": "b71e7bd08e5711ecbdc229272a4702d4", "name": "Ergonomic Granite Duck", "price": 729, "image": "http://placeimg.com/640/480/business", "description": "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support" }, { "id": "b71ea2e08e5711ecbdc229272a4702d4", "name": "Beautiful Frozen Salad", "price": 0.75, "image": "http://placeimg.com/640/480/fashion", "description": "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" }, { "id": "b71ec9f08e5711ecbdc229272a4702d4", "name": "Ergonomic Plastic Bike", "price": 56, "image": "http://placeimg.com/640/480/city", "description": "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support" }, { "id": "b71f18108e5711ecbdc229272a4702d4", "name": "Generic Cotton Chips", "price": 1351, "image": "http://placeimg.com/640/480/food", "description": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart" }, { "id": "b71f66308e5711ecbdc229272a4702d4", "name": "Incredible Wooden Towels", "price": 97, "image": "http://placeimg.com/640/480/cats", "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016" }, { "id": "b71fb4508e5711ecbdc229272a4702d4", "name": "Tasty Granite Gloves", "price": 480, "image": "http://placeimg.com/640/480/technics", "description": "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients" }, { "id": "b71fdb608e5711ecbdc229272a4702d4", "name": "Practical Steel Chicken", "price": 886, "image": "http://placeimg.com/640/480/sports", "description": "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J" }, { "id": "b72002708e5711ecbdc229272a4702d4", "name": "Handcrafted Metal Mouse", "price": 567, "image": "http://placeimg.com/640/480/business", "description": "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" }, { "id": "b72029808e5711ecbdc229272a4702d4", "name": "Sleek Metal Fish", "price": 171, "image": "http://placeimg.com/640/480/sports", "description": "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design" }, { "id": "b72050908e5711ecbdc229272a4702d4", "name": "Awesome Cotton Computer", "price": 137, "image": "http://placeimg.com/640/480/animals", "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016" }, { "id": "b72077a08e5711ecbdc229272a4702d4", "name": "Practical Plastic Mouse", "price": 566, "image": "http://placeimg.com/640/480/food", "description": "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" }, { "id": "b720c5c08e5711ecbdc229272a4702d4", "name": "Flammable Plastic Gloves", "price": 795, "image": "http://placeimg.com/640/480/city", "description": "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support" }, { "id": "b720ecd08e5711ecbdc229272a4702d4", "name": "Intelligent Concrete Salad", "price": 789, "image": "http://placeimg.com/640/480/fashion", "description": "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design" }, { "id": "b72113e08e5711ecbdc229272a4702d4", "name": "Rustic Metal Shoes", "price": 309, "image": "http://placeimg.com/640/480/cats", "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016" }, { "id": "b7213af08e5711ecbdc229272a4702d4", "name": "Generic Granite Sausages", "price": 37.3, "image": "http://placeimg.com/640/480/sports", "description": "The Football Is Good For Training And Recreational Purposes" }, { "id": "b72162008e5711ecbdc229272a4702d4", "name": "Gorgeous Metal Towels", "price": 93, "image": "http://placeimg.com/640/480/nature", "description": "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" }, { "id": "b72189108e5711ecbdc229272a4702d4", "name": "Awesome Soft Towels", "price": 444, "image": "http://placeimg.com/640/480/sports", "description": "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive" }, { "id": "b721d7308e5711ecbdc229272a4702d4", "name": "Unbranded Soft Table", "price": 8, "image": "http://placeimg.com/640/480/animals", "description": "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit" }, { "id": "b72225508e5711ecbdc229272a4702d4", "name": "Sleek Wooden Hat", "price": 748, "image": "http://placeimg.com/640/480/sports", "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016" }];


beforeEach(() => {
	const middlewares = [];
	const mockStore = configureMockStore(middlewares);
	store = mockStore({});
});



const testNavigationIsCorrect = (role = 'guest') => {
  const links = ['home', 'products'];

  switch (role) {
    case 'guest':
      links.push( 'cart','login','register');
      break;
    default:
      links.push('login');
  }

  links.forEach(link => {
    expect(screen.getByTestId(`${link}-link`)).toBeInTheDocument();
  });
};

const navigateToPage = async (pageName, orders = []) => {
  userEvent.click(screen.getByTestId(`${pageName}-link`));

  if (pageName === 'orders' && orders.length === 0) {
    expect(await screen.findByTestId('no-order-component')).toBeInTheDocument();
  } else {
    expect(await screen.findByTestId(`${pageName}-component`)).toBeInTheDocument();
  }

  if (pageName === 'home') pageName = '';
  expect(history.location.pathname).toEqual(`/${pageName}`);
};

const login = async ({ email, password }) => {
  await navigateToPage('login');

  const emailInput = screen.getByTestId('email-input');
  const passwordInput = screen.getByTestId('password-input');

  await userEvent.type(emailInput, email, { delay: 5 });
  await userEvent.type(passwordInput, password, { delay: 5 });

  userEvent.click(screen.getByTestId('login-button'), 'click');
  expect(await screen.findByTestId('home-component')).toBeInTheDocument();
  expect(history.location.pathname).toEqual('/');
};

const logOut = async () => {
  await userEvent.click(screen.getByTestId('logout-link'));
  await waitForElementToBeRemoved(() => screen.queryByTestId('logout-link'));
};

beforeEach(() => {
  // Clear localStorage and sessionStorage to empty the shopping cart
  // Is it specified in the assignment instructions that the cart is saved to
  // localStorage/sessionStorage? Almost lost my mind when trying to debug why
  // shopping cart wasn't destroyed between tests!
  localStorage.clear();
  sessionStorage.clear();

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

describe('End-To-End - guest', () => {
  describe('Navigation and Other UI Elements', () => {
    test('No role is shown in opening the page', async () => {
      render(ui);
      testNavigationIsCorrect('guest');
      expect(screen.queryByText('role')).toBeNull();
    });

  });

  describe('Products and shopping cart', () => {
    test('Shopping cart is initially empty', async () => {
      render(ui);
      testNavigationIsCorrect('guest');
      await navigateToPage('cart');
      expect(screen.getByText(/empty/i)).toBeInTheDocument();
      expect(screen.queryByTestId('cart-item-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('order-button')).not.toBeInTheDocument();
    });

    test('guest is able to view all products', async () => {
      render(ui);

      await navigateToPage('products');

      const products = getAllProducts();
      const productItems = await screen.findAllByTestId('product-component');
      const addToCartButtons = screen.getAllByRole('button');

      // Test that all products are shown correctly.
      expect(screen.getByTestId('products-container')).toBeInTheDocument();
      expect(productItems).toHaveLength(products.length);
      expect(addToCartButtons).toHaveLength(products.length);

      // Test that adding new products is not available for guest
      expect(screen.queryByTestId('product-adder-component')).not.toBeInTheDocument();
      expect(screen.queryByTestId('open-adder-button')).not.toBeInTheDocument();

      // Test that buttons are actually for adding a product to cart and not modifying it
      addToCartButtons.forEach(button => {
        const testId = button.dataset.testid;
        expect(testId).toContain('add-cart-button-');

        const productId = testId.split('-').pop();
        expect(products.some(p => p.id === productId)).toBeTruthy();
      });


    });

    test('guest is able to add product to cart', async () => {
      render(ui);

      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId, name, price } = products[0];
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);
      expect(await screen.findByTestId('notification-component')).toBeInTheDocument();

      await navigateToPage('cart');
      expect(screen.getByTestId('cart-item-container')).toBeInTheDocument();
      expect(screen.getByTestId('order-button')).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item-component')).toHaveLength(1);
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(`${price}`)).toBeInTheDocument();


    });

    test('Adding same product to cart multiple times updates its quantity in the cart', async () => {
      render(ui);

      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId } = products[0];
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);
      userEvent.click(cartButton);

      await navigateToPage('cart');
      expect(screen.getByTestId('cart-item-container')).toBeInTheDocument();
      expect(screen.getByTestId('order-button')).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item-component')).toHaveLength(1);

      const quantity = screen.getByTestId('item-amount');
      expect(quantity.textContent).toMatch(/quantity: 2/i);


    });

    test("guest is able to increase product's quantity in the cart", async () => {
      render(ui);

      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId } = products[0];
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);

      await navigateToPage('cart');
      expect(screen.getByTestId('cart-item-container')).toBeInTheDocument();
      expect(screen.getByTestId('order-button')).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item-component')).toHaveLength(1);

      const quantity = screen.getByTestId('item-amount');
      expect(quantity.textContent).toMatch(/quantity: 1/i);

      const plusButton = screen.getByTestId(`plus-btn-${productId}`);
      userEvent.click(plusButton);
      await within(quantity).findByText(/2/);

      expect(quantity.textContent).toMatch(/quantity: 2/i);

    });

    test("guest is able to decrease product's quantity in the cart", async () => {
      render(ui);

      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId } = products[0];
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);
      userEvent.click(cartButton);

      await navigateToPage('cart');
      expect(screen.getByTestId('cart-item-container')).toBeInTheDocument();
      expect(screen.getByTestId('order-button')).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item-component')).toHaveLength(1);

      const quantity = screen.getByTestId('item-amount');
      expect(quantity.textContent).toMatch(/quantity: 2/i);

      const minusButton = screen.getByTestId(`minus-btn-${productId}`);
      userEvent.click(minusButton);
      await within(quantity).findByText(/1/);

      expect(quantity.textContent).toMatch(/quantity: 1/i);

    });

    test('guest is able to remove a product from the cart', async () => {
      render(ui);

      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId } = products[0];
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);

      await navigateToPage('cart');
      expect(screen.getByTestId('cart-item-container')).toBeInTheDocument();
      expect(screen.getByTestId('order-button')).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item-component')).toHaveLength(1);

      const quantity = screen.getByTestId('item-amount');
      expect(quantity.textContent).toMatch(/quantity: 1/i);

      const minusButton = screen.getByTestId(`minus-btn-${productId}`);
      userEvent.click(minusButton);

      expect(await screen.findByText(/empty/i)).toBeInTheDocument();
      expect(screen.queryByTestId('cart-item-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('order-button')).not.toBeInTheDocument();

    });
  });

});



beforeEach(() => {
	store = mockStore({});
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('guest', () => {
	describe('getting products', () => {
		it('must get all products with the call to /api/products', async () => {
			server.use(
				rest.get('/api/products', (req, res, ctx) => {
					return res(
						ctx.status(200),
						ctx.json(PRODUCTS)
					);
				})
			);
			const expectedActions = [
				{
					type: GET_PRODUCTS,
					payload: PRODUCTS,
				},
			];
			return store.dispatch(getProducts()).then(() => {
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});
		});
		it('must get one product with the call to /api/products/{product_id}', async () => {
			const product = PRODUCTS[0]
			const id = product["id"];
			server.use(
				rest.get(`/api/products/${id}`, (req, res, ctx) => {
					return res(
						ctx.status(200),
						ctx.json(product)
					);
				})
			);
			const expectedActions = [
				{
					type: GET_PRODUCT,
					payload: product,
				},
			];
			return store.dispatch(getProduct(id)).then(() => {
				const actualActions = store.getActions();
				expect(actualActions).toEqual(expectedActions);
			});

		});
	});
});