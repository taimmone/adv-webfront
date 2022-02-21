const db = {
  users: [
    {
      id: 'd735f2908d8011ecaf2dedf369a4cec0',
      name: 'Admin',
      email: 'admin@email.com',
      role: 'admin'
    },
    {
      id: 'd74275b08d8011ecaf2dedf369a4cec0',
      name: 'Customer',
      email: 'customer@email.com',
      role: 'customer'
    },
    {
      id: 'd74ed1c08d8011ecaf2dedf369a4cec0',
      name: 'Admin2',
      email: 'admin2@email.com',
      role: 'admin'
    },
    {
      id: 'd75b06c08d8011ecaf2dedf369a4cec0',
      name: 'Customer2',
      email: 'customer2@email.com',
      role: 'customer'
    },
    {
      id: 'f9daf8808b2911ec9cbb9fd11be29a90',
      name: 'Customer3',
      email: 'customer3@email.com',
      role: 'customer'
    }
  ],
  products: [
    {
      id: 'd7a68eb08d8011ecaf2dedf369a4cec0',
      name: 'Fantastic Cotton Chair',
      price: 102,
      image: 'http://placeimg.com/640/480/nature',
      description: 'The Football Is Good For Training And Recreational Purposes'
    },
    {
      id: 'd7a703e08d8011ecaf2dedf369a4cec0',
      name: 'Lovely Marble Car',
      price: 909,
      image: 'http://placeimg.com/640/480/city',
      description:
        'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients'
    },
    {
      id: 'd7a779108d8011ecaf2dedf369a4cec0',
      name: 'Sleek Plastic Hat',
      price: 62.25,
      image: 'http://placeimg.com/640/480/city',
      description:
        'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive'
    },
    {
      id: 'd7a7c7308d8011ecaf2dedf369a4cec0',
      name: 'Awesome Wooden Shoes',
      price: 4.99,
      image: 'http://placeimg.com/640/480/food',
      description:
        'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals'
    },
    {
      id: 'd7a815508d8011ecaf2dedf369a4cec0',
      name: 'Small Cotton Chicken',
      price: 173.99,
      image: 'http://placeimg.com/640/480/fashion',
      description:
        'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive'
    },
    {
      id: 'd7a8b1908d8011ecaf2dedf369a4cec0',
      name: 'Ergonomic Metal Cheese',
      price: 83.1,
      image: 'http://placeimg.com/640/480/transport',
      description:
        'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J'
    },
    {
      id: 'd7a8ffb08d8011ecaf2dedf369a4cec0',
      name: 'Ergonomic Granite Duck',
      price: 729,
      image: 'http://placeimg.com/640/480/business',
      description:
        'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
    },
    {
      id: 'd7b0a0d08d8011ecaf2dedf369a4cec0',
      name: 'Sleek Wooden Hat',
      price: 748,
      image: 'http://placeimg.com/640/480/sports',
      description:
        'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
    }
  ],
  orders: [
    {
      id: 'cd2dc8308d8111eca2fd51c91f49727c',
      items: [
        {
          product: {
            name: 'Sleek Plastic Hat',
            price: 62.25,
            id: 'd7a779108d8011ecaf2dedf369a4cec0',
            description:
              'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive'
          },
          quantity: 3
        },
        {
          product: {
            name: 'Ergonomic Granite Duck',
            price: 729,
            id: 'd7a8ffb08d8011ecaf2dedf369a4cec0',
            description:
              'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
          },
          quantity: 1
        }
      ],
      customerId: 'd74275b08d8011ecaf2dedf369a4cec0'
    },
    {
      id: '48600fd08d8311eca2fd51c91f49727c',
      items: [
        {
          product: {
            name: 'Awesome Wooden Shoes',
            price: 4.99,
            id: 'd7a7c7308d8011ecaf2dedf369a4cec0',
            description:
              'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals'
          },
          quantity: 6
        },
        {
          product: {
            name: 'Ergonomic Metal Cheese',
            price: 83.1,
            id: 'd7a8b1908d8011ecaf2dedf369a4cec0',
            description:
              'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J'
          },
          quantity: 1
        }
      ],
      customerId: 'd75b06c08d8011ecaf2dedf369a4cec0'
    }
  ]
};

// do not allow direct editing, use map to return copies of the original products
export const getAllProducts = () => db.products.map(product => ({ ...product }));

// do not allow direct editing, return copy of the original product
export const getProductById = id => {
  const product = db.products.find(product => id === product.id);
  return product ? { ...product } : null;
};

// do not allow direct editing, use map to return copies of the original users
export const getAllUsers = () => db.users.map(user => ({ ...user }));

// do not allow direct editing, return copy of the original user
export const getUserById = id => {
  const user = db.users.find(user => user.id === id);
  return user ? { ...user } : null;
};

// do not allow direct editing, return copy of the original user
export const getUserByEmail = email => {
  const user = db.users.find(user => user.email === email);
  return user ? { ...user } : null;
};

// do not allow direct editing, use map to return copies of the original orders
export const getAllOrders = (customerId = null) => {
  // deep copy of orders
  const orders = JSON.parse(JSON.stringify(db.orders));
  if (!customerId) return orders;

  return orders.filter(order => order.customerId === customerId);
};

// do not allow direct editing, return copy of the original order
export const getOrderById = (id, customerId = null) => {
  const order = db.orders.find(order => order.id === id);
  if (!order) return null;

  // deep copy of order
  const orderCopy = JSON.parse(JSON.stringify(order));
  if (!customerId) return orderCopy;
  if (orderCopy.customerId !== customerId) return null;
  return orderCopy;
};
