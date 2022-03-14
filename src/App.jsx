/** @format */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router';
import Cart from './components/Cart';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import Notification from './components/Notification';
import Register from './components/Register';
import User from './components/User';
import UserModifier from './components/UserModifier';
import Users from './components/Users';
import Auth from './components/Auth';
import Order from './components/Order';
import Orders from './components/Orders';
import Products from './components/Products';
import Product from './components/Product';
import ProductModifier from './components/ProductModifier';
import Finder from './components/Finder';
import { getOrder } from './redux/actionCreators/ordersActions';
import { getProduct } from './redux/actionCreators/productsActions';
import { getUser } from './redux/actionCreators/usersActions';
import { initApp } from './redux/actionCreators/appActions';

const App = () => {
  const dispatch = useDispatch();

  const authRoles = {
    any: ['guest', 'customer', 'admin'],
    cart: ['guest', 'customer'],
    orders: ['admin', 'customer'],
    productModifier: ['admin'],
    register: ['guest'],
    users: ['admin'],
  };

  useEffect(() => {
    console.log('Dispatch initApp()');
    dispatch(initApp());
  }, []);

  return (
    <div data-testid="app-component">
      <Navbar />
      <Notification />
      <main>
        <Routes>
          <Route index element={<Home />} />

          <Route path="products" element={<Products />}>
            <Route path=":productId" element={<Product />}>
              <Route
                path="modify"
                element={<Auth authRoles={authRoles.productModifier} />}
              >
                <Route index element={<ProductModifier />} />
              </Route>
            </Route>
          </Route>

          <Route path="cart" element={<Auth authRoles={authRoles.cart} />}>
            <Route index element={<Cart />} />
          </Route>

          <Route path="orders" element={<Auth authRoles={authRoles.orders} />}>
            <Route index element={<Orders />} />
            <Route path=":orderId" element={<Order />} />
          </Route>

          <Route
            path="register"
            element={<Auth authRoles={authRoles.register} />}
          >
            <Route index element={<Register />} />
          </Route>

          <Route path="login" element={<Login />} />

          <Route path="users" element={<Auth authRoles={authRoles.users} />}>
            <Route index element={<Users />} />
            <Route path=":userId" element={<User />}>
              <Route path="modify" element={<UserModifier />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <p>Copyright &copy; 2022</p>
      </footer>
    </div>
  );
};

export default App;
