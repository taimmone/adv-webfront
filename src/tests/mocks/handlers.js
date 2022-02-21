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
const cookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'strict',
  secure: false
};

const expires = new Date('2020-01-01');

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
  return res(
    ctx.cookie('token', getToken(user), cookieOptions),
    ctx.status(200),
    ctx.json({ user })
  );
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

  return res(
    ctx.cookie('token', getToken(user), cookieOptions),
    ctx.status(201),
    ctx.json({ user })
  );
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

  return res(
    ctx.cookie('token', getToken(user), cookieOptions),
    ctx.status(200),
    ctx.json({ user })
  );
};

const logOut = (req, res, ctx) => {
  // Not exactly the same as in the real backend but should be effectively same
  return res(
    // reset the cookie value to empty string and set to expire in the past
    ctx.cookie('token', '', { ...cookieOptions, expires }),
    ctx.status(200),
    ctx.json({ message: 'User logged out!' })
  );
};

const getProducts = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getAllProducts()));
};

const getProduct = (req, res, ctx) => {
  const product = getProductById(req.params.productId);
  if (!product) return respondNotFound(res, ctx);
  return res(ctx.status(200), ctx.json(product));
};

const deleteProduct = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  const product = getProductById(req.params.productId);
  if (!product) return respondNotFound(res, ctx);
  return res(ctx.status(200), ctx.json(product));
};

const createProduct = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  const name = req.body?.name ?? null;
  const price = req.body?.price ?? null;
  const image = req.body?.image ?? null;
  const description = req.body?.description ?? null;

  if (name === null) return respondWithError(res, ctx, { name: 'name is required' });
  if (name.trim() === '') return respondWithError(res, ctx, { name: 'name cannot be empty' });
  if (price === null) return respondWithError(res, ctx, { price: 'price is required' });

  if (Number.parseFloat(price) <= 0) {
    return respondWithError(res, ctx, { price: 'price must be a positive number' });
  }

  const product = { id: getRandomID(), name: name.trim(), price: Number.parseFloat(price) };
  if (description !== null) product.description = description;
  if (image !== null) product.image = image;

  return res(ctx.status(201), ctx.json(product));
};

const updateProduct = (req, res, ctx) => {
  const currentUser = getUserFromCookie(req);
  if (!isAdmin(currentUser)) return respondForbidden(res, ctx, 'Admin rights required');

  const product = getProductById(req.params.productId);
  if (!product) return respondNotFound(res, ctx);

  const name = req.body?.name ?? null;
  const price = req.body?.price ?? null;
  const image = req.body?.image ?? null;
  const description = req.body?.description ?? null;

  if (name !== null && name.trim() === '') {
    return respondWithError(res, ctx, { name: 'name cannot be empty' });
  }

  if (price !== null && Number.parseFloat(price) <= 0) {
    return respondWithError(res, ctx, { price: 'price must be a positive number' });
  }

  if (name !== null) product.name = name.trim();
  if (price !== null) product.price = Number.parseFloat(price);
  if (description !== null) product.description = description;
  if (image !== null) product.image = image;

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
    return respondWithError(res, ctx, 'One or more order items are invalid');
  }

  const order = {
    id: getRandomID(),
    customerId: currentUser.id,
    items
  };

  return res(ctx.status(201), ctx.json(order));
};

export const handlers = [
  // login and registration
  rest.get(/\/api\/check-status/, checkStatus),
  rest.post(/\/api\/register/, registerUser),
  rest.post(/\/api\/login/, loginUser),
  rest.get(/\/api\/logout/, logOut),

  // products
  rest.get(/\/api\/products/, getProducts),
  rest.post(/\/api\/products/, createProduct),
  rest.get('/api/products/:productId', getProduct),
  rest.get('http://localhost:3001/api/products/:productId', getProduct),
  rest.put('/api/products/:productId', updateProduct),
  rest.put('http://localhost:3001/api/products/:productId', updateProduct),
  rest.delete('/api/products/:productId', deleteProduct),
  rest.delete('http://localhost:3001/api/products/:productId', deleteProduct),

  // users
  rest.get(/\/api\/users/, getUsers),
  rest.get('/api/users/:userId', getUser),
  rest.get('http://localhost:3001/api/users/:userId', getUser),
  rest.put('/api/users/:userId', updateUserRole),
  rest.put('http://localhost:3001/api/users/:userId', updateUserRole),
  rest.delete('/api/users/:userId', deleteUser),
  rest.delete('http://localhost:3001/api/users/:userId', deleteUser),

  // orders
  rest.get(/\/api\/orders/, getOrders),
  rest.post(/\/api\/orders/, createOrder),
  rest.get('/api/orders/:orderId', getOrder),
  rest.get('http://localhost:3001/api/orders/:orderId', getOrder)
];
