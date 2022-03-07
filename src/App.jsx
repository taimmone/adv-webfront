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
  return (
    <div data-testid="app-component">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />}>
          <Route path=":productId" element={<Product />}>
            <Route path="modify" element={<ProductModifier />} />
          </Route>
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />}>
          <Route path=":orderId" element={<Order />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />}>
          <Route path=":userId" element={<User />}>
            <Route path="modify" element={<UserModifier />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer>
        <p>Copyright &copy; 2022</p>
      </footer>
    </div>
  );
};

export default App;
