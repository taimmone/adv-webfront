import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { rest, server } from '../mocks/server';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import App from '../../App';
import { getAllOrders, getAllProducts, getAllUsers } from '../mocks/db';
import { rest, server } from '../mocks/server';
import { storeCreator } from '../utils/testStores';

let history;
let ui;
let store;

const credentials = getAllUsers().reduce((credentials, user) => {
  if (user.role === 'customer') {
    credentials[user.name.toLowerCase()] = {
      id: user.id,
      email: user.email,
      password: '1234567890'
    };
  }

  return credentials;
}, {});

const testNavigationIsCorrect = (role = 'guest') => {
  const links = ['home', 'products'];

  switch (role) {
    case 'customer':
      links.push('orders', 'cart', 'logout');
      break;
    case 'admin':
      links.push('orders', 'logout');
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
  // Clear localStorage and sessionStorage to empty the shopping cart before each test
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

describe('End-To-End - Customer', () => {
  describe('Navigation and Other UI Elements', () => {
    test('Navigation is shown correctly after successful customer login', async () => {
      render(ui);

      testNavigationIsCorrect('guest');
      await login(credentials.customer);
      testNavigationIsCorrect('customer');
      await logOut();
    });

    test('Navigation is shown correctly after successful customer logout', async () => {
      render(ui);

      await login(credentials.customer);
      testNavigationIsCorrect('customer');
      await logOut();
      testNavigationIsCorrect('guest');
    });

    test('Navigation is not updated if login fails due to incorrect credentials', async () => {
      render(ui);

      testNavigationIsCorrect('guest');
      const email = 'fake@email.com';
      const password = '1234567890';

      await navigateToPage('login');

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      await userEvent.type(emailInput, email, { delay: 5 });
      await userEvent.type(passwordInput, password, { delay: 5 });

      userEvent.click(screen.getByTestId('login-button'), 'click');
      expect(await screen.findByTestId('notification-component')).toBeInTheDocument();
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      expect(history.location.pathname).toEqual('/login');
      testNavigationIsCorrect('guest');
    });
  });

  describe('Products and shopping cart', () => {
    test('Shopping cart is initially empty', async () => {
      render(ui);

      testNavigationIsCorrect('guest');
      await login(credentials.customer);
      await navigateToPage('cart');
      expect(screen.getByText(/empty/i)).toBeInTheDocument();
      expect(screen.queryByTestId('cart-item-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('order-button')).not.toBeInTheDocument();
      await logOut();
    });

    test('Customer is able to view all products', async () => {
      render(ui);

      await login(credentials.customer);
      await navigateToPage('products');

      const products = getAllProducts();
      const productItems = await screen.findAllByTestId('product-component');
      const addToCartButtons = screen.getAllByRole('button');

      // Test that all products are shown correctly.
      expect(screen.getByTestId('products-container')).toBeInTheDocument();
      expect(productItems).toHaveLength(products.length);
      expect(addToCartButtons).toHaveLength(products.length);

      // Test that adding new products is not available for customer
      expect(screen.queryByTestId('product-adder-component')).not.toBeInTheDocument();
      expect(screen.queryByTestId('open-adder-button')).not.toBeInTheDocument();

      // Test that buttons are actually for adding a product to cart and not modifying it
      addToCartButtons.forEach(button => {
        const testId = button.dataset.testid;
        expect(testId).toContain('add-cart-button-');

        const productId = testId.split('-').pop();
        expect(products.some(p => p.id === productId)).toBeTruthy();
      });

      await logOut();
    });

    test('Customer is able to add product to cart', async () => {
      render(ui);

      await login(credentials.customer);
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

      await logOut();
    });

    test('Adding same product to cart multiple times updates its quantity in the cart', async () => {
      render(ui);

      await login(credentials.customer);
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

      await logOut();
    });

    test("Customer is able to increase product's quantity in the cart", async () => {
      render(ui);

      await login(credentials.customer);
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
      await logOut();
    });

    test("Customer is able to decrease product's quantity in the cart", async () => {
      render(ui);

      await login(credentials.customer);
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
      await logOut();
    });

    test('Customer is able to remove a product from the cart', async () => {
      render(ui);

      await login(credentials.customer);
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
      await logOut();
    });
  });

  describe('Orders', () => {
    test('No orders are listed if customer has no orders', async () => {
      render(ui);

      await login(credentials.customer3);
      await navigateToPage('orders', getAllOrders(credentials.customer3.id));

      expect(screen.getByTestId('no-order-component')).toBeInTheDocument();
      expect(screen.queryByTestId('orders-component')).not.toBeInTheDocument();
      expect(screen.queryByTestId('orders-container')).not.toBeInTheDocument();

      await logOut();
    });

    test('Customer is able to list only their own orders', async () => {
      render(ui);

      const orders = getAllOrders(credentials.customer.id);
      const { id: orderId, customerId } = orders[0];

      await login(credentials.customer);
      await navigateToPage('orders', orders);

      expect(await screen.findByTestId('orders-container')).toBeInTheDocument();

      const orderComponents = screen.getAllByTestId('order-component');
      expect(orderComponents).toHaveLength(orders.length);

      orderComponents.forEach(component => {
        expect(within(component).getByText(new RegExp(orderId))).toBeInTheDocument();
        expect(within(component).getByText(new RegExp(customerId))).toBeInTheDocument();
      });

      await logOut();
    });

    test('Customer is able to inspect their own orders', async () => {
      render(ui);

      const orders = getAllOrders(credentials.customer.id);
      const { id: orderId, customerId } = orders[0];

      await login(credentials.customer);
      await navigateToPage('orders', orders);

      expect(await screen.findByTestId('orders-container')).toBeInTheDocument();

      const orderComponents = screen.getAllByTestId('order-component');
      expect(orderComponents).toHaveLength(orders.length);

      const inspectLink = within(orderComponents[0]).getByTestId('inspect-link');
      await userEvent.click(inspectLink);
      expect(history.location.pathname).toEqual(`/orders/${orderId}`);

      expect(screen.getByText(new RegExp(orderId))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(customerId))).toBeInTheDocument();

      await logOut();
    });

    test('Shopping cart is emptied after successful placing of an order', async () => {
      render(ui);

      await login(credentials.customer);
      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId } = products.pop();
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);
      expect(await screen.findByTestId('notification-component')).toBeInTheDocument();

      await navigateToPage('cart');
      userEvent.click(screen.getByTestId('order-button'));
      expect(await screen.findByText(/empty/i)).toBeInTheDocument();
      expect(screen.queryByTestId('cart-item-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('order-button')).not.toBeInTheDocument();

      await logOut();
    });

    test('After placing an order the new order is listed on the orders page', async () => {
      render(ui);

      await login(credentials.customer);
      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId, name, price } = products.pop();
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);
      expect(await screen.findByTestId('notification-component')).toBeInTheDocument();

      await navigateToPage('cart');
      userEvent.click(screen.getByTestId('order-button'));
      expect(await screen.findByText(/empty/i)).toBeInTheDocument();
      expect(screen.queryByTestId('cart-item-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('order-button')).not.toBeInTheDocument();

      await navigateToPage('orders', [productId]);
      expect(await screen.findByTestId('orders-container')).toBeInTheDocument();

      const orderComponents = screen.getAllByTestId('order-component');
      expect(orderComponents).toHaveLength(1);

      // Test that the info of the latest order is shown correctly
      const latestOrderComponent = orderComponents[0];
      expect(within(latestOrderComponent).getByText(new RegExp(name))).toBeInTheDocument();
      expect(within(latestOrderComponent).getByText(new RegExp(`${price}`))).toBeInTheDocument();
      expect(
        within(latestOrderComponent).getByText(new RegExp(credentials.customer.id))
      ).toBeInTheDocument();

      await logOut();
    });

    test('New order is not created if backend respond is not OK', async () => {
      server.use(
        rest.post(/\/api\/orders/, (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'One or more order items are invalid' }));
        })
      );

      render(ui);

      await login(credentials.customer);
      await navigateToPage('products');

      const products = getAllProducts();
      // wait for all products to be fetched before proceeding
      await screen.findAllByTestId('product-component');

      const { id: productId, name, price } = products.pop();
      const cartButton = screen.getByTestId(`add-cart-button-${productId}`);
      userEvent.click(cartButton);
      expect(await screen.findByTestId('notification-component')).toBeInTheDocument();

      await navigateToPage('cart');
      await userEvent.click(screen.getByTestId('order-button'));
      expect(await screen.findByTestId('notification-component')).toBeInTheDocument();

      // expect cart not to be emptied if placing an order failed
      expect(screen.getByTestId('cart-item-container')).toBeInTheDocument();
      expect(screen.getByTestId('order-button')).toBeInTheDocument();
      expect(screen.getByText(new RegExp(name))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${price}`))).toBeInTheDocument();
      expect(screen.getAllByTestId('cart-item-component')).toHaveLength(1);

      await logOut();
    });
  });
});
