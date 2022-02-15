/** @format */

import jwt from 'jsonwebtoken';
import { rest } from 'msw';
import { v1 as uuidV1 } from 'uuid';
import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getOrderById,
  getProductById,
  getUserByEmail,
  getUserById
} from './db';

const JWT_SECRET = 'test-secret';
const LOGIN_PASSWORD = '1234567890';

const validateOrderItem = item => {
  if (!('product' in item)) return false;
  if (!Number.isSafeInteger(item?.quantity) || item.quantity <= 0) return false;
  if (!item?.product?.id) return false;
  if (!item?.product?.name || typeof item.product.name !== 'string') return false;
  if (!item?.product?.price || typeof item.product.price !== 'number') return false;
  if (item.product.name.trim() === '') return false;
  if (item.product.price <= 0) return false;
  if (!getProductById(item.product.id)) return false;

  return true;
};

// return always a user or guest
const getUserFromCookie = req => {
  const guest = { role: 'guest' };
  const token = req?.cookies?.token;
  if (!token) return guest;

  const decodedToken = jwt.verify(token, JWT_SECRET);
  if (!decodedToken) return guest;

  return { ...decodedToken };
};

const isAdmin = user => user?.role === 'admin';
const isCustomer = user => user?.role === 'customer';
const isGuest = user => user?.role === 'guest';

const respondWithError = (res, ctx, content, status = 400) => {
  const error = typeof content === 'string' ? content : { ...content };
  return res(ctx.status(status), ctx.json({ error }));
};

const respondNotFound = (res, ctx) => res(ctx.status(404));

const respondUnauthorized = (res, ctx, message) => {
  return respondWithError(res, ctx, message, 401);
};

const respondForbidden = (res, ctx, message) => {
  return respondWithError(res, ctx, message, 403);
};

const getToken = user => {
  return jwt.sign({ ...user }, JWT_SECRET);
};

const getRandomID = () => {
  return uuidV1().replaceAll('-', '');
};

const checkStatus = (req, res, ctx) => {
  const user = getUserFromCookie(req);
  return res(ctx.cookie('token', getToken(user)), ctx.json({ user }));
};

const registerUser = (req, res, ctx) => {
  if (!isGuest(getUserFromCookie(req))) {
    return respondForbidden(res, ctx, 'Only for guests');
  }

  const { name, email, password } = req.body;
  if (name.trim() === '') return respondWithError(res, ctx, { name: 'name is required' });
  if (email.trim() === '') return respondWithError(res, ctx, { email: 'email is required' });

  if (password.trim().lenth < 10) {
    return respondWithError(res, ctx, {
      password: 'password is required and must be at least 10 characters long'
    });
  }

  if (getUserByEmail(email)) {
    return respondWithError(res, ctx, {
      email: 'User with the same email address already exists.'
    });
  }

  const user = {
    id: getRandomID(),
    name,
    email,
    role: 'customer'
  };

  return res(ctx.cookie('token', getToken(user)), ctx.status(201), ctx.json({ user }));
};

const loginUser = (req, res, ctx) => {
  if (!isGuest(getUserFromCookie(req))) {
    return respondForbidden(res, ctx, 'Only for guests');
  }

  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (!user || password !== LOGIN_PASSWORD) {
    return respondForbidden(res, ctx, 'Login failed. Check email and password.');
  }

  return res(ctx.cookie('token', getToken(user)), ctx.status(200), ctx.json({ user }));
};

const getProducts = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getAllProducts()));
};

const getProduct = (req, res, ctx) => {
  const product = getProductById(req.params.productId);
  if (!product) return respondNotFound(res, ctx);
  return res(ctx.status(200), ctx.json(product));
};

const getUsers = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  return res(ctx.status(200), ctx.json(getAllUsers()));
};

const getUser = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  const user = getUserById(req.params.userId);
  if (!user) return respondNotFound(res, ctx);
  return res(ctx.status(200), ctx.json(user));
};

const updateUserRole = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  if (currentUser.id === req.params.userId) {
    return respondWithError(res, ctx, 'Modifying own data is not allowed');
  }

  const { role } = req.body;
  if (role !== 'customer' && role !== 'admin') {
    return respondWithError(res, ctx, { role: `Unknown role ${role}` });
  }

  const user = getUserById(req.params.userId);
  if (!user) return respondNotFound(res, ctx);

  return res(ctx.status(200), ctx.json({ ...user, role }));
};

const deleteUser = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  if (currentUser.id === req.params.userId) {
    return respondWithError(res, ctx, 'Modifying own data is not allowed');
  }

  const user = getUserById(req.params.userId);
  if (!user) return respondNotFound(res, ctx);

  return res(ctx.status(200), ctx.json(user));
};

const getOrders = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');

  // show all orders for admin
  if (isAdmin(currentUser)) {
    return res(ctx.status(200), ctx.json(getAllOrders()));
  }

  // customers can see only their own orders
  return res(ctx.status(200), ctx.json(getAllOrders(currentUser.id)));
};

const getOrder = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');

  const order = isAdmin(currentUser)
    ? getOrderById(req.params.orderId)
    : getOrderById(req.params.orderId, currentUser.id);
  if (!order) return respondNotFound(res, ctx);

  return res(ctx.status(200), ctx.json(order));
};

const createOrder = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (isGuest(currentUser)) return respondUnauthorized(res, ctx, 'Login required');
  if (!isCustomer(currentUser)) return respondForbidden(res, ctx, 'Customer rights required');

  const { items } = req.body;

  if (!Array.isArray(items)) {
    return respondWithError(res, ctx, { items: '"items" is missing or not an array' });
  }

  if (!items.every(validateOrderItem)) {
    return respondWithError(res, ctx, 'One or more order item are invalid');
  }

  const order = {
    id: getRandomID(),
    customerId: currentUser.id,
    ...items
  };

  return res(ctx.status(201), ctx.json(order));
};

export const handlers = [
  // login and registration
  rest.get(/\/api\/check-status/, checkStatus),
  rest.post(/\/api\/register/, registerUser),
  rest.post(/\/api\/login/, loginUser),

  // products
  rest.get(/\/api\/products/, getProducts),
  rest.get('/api/products/:productId', getProduct),
  rest.get('http://localhost:3001/api/products/:productId', getProduct),

  // users
  rest.get(/\/api\/users/, getUsers),
  rest.get('/api/users/:userId', getUser),
  rest.get('http://localhost:3001/api/users/:userId', getUser),
  rest.put('/api/users/:userId', updateUserRole),
  rest.put('http://localhost:3001/api/users/:userId', updateUserRole),
  rest.delete('/api/users/:userId', deleteUser),
  rest.delete('http://localhost:3001/api/users/:userId', deleteUser),

  // orders
  rest.get(/\/api\/users/, getOrders),
  rest.post(/\/api\/users/, createOrder),
  rest.get('/api/users/:userId', getOrder),
  rest.get('http://localhost:3001/api/users/:userId', getOrder)
];
