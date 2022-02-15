/** @format */

function randomId () {
  return JSON.stringify(Math.floor(Math.random() * 1000000000));
}

const names = ['Bob', 'John', 'Steve', 'Jack', 'James', 'Sergei', 'Timo', 'Topi'];
const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

const emails = [
  'google.com',
  'gmail.com',
  'hotmail.com',
  'yahoo.com',
  'tuni.fi',
  'tampere.fi',
  'uta.fi',
  'gov.us'
];

const descriptions = [
  'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
  'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
  'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
  'Beautiful plastic playing cards',
  'Lego racing car (Green)',
  'Chocolate candy bar with hazelnuts',
  'Search billions of records. Get results in seconds!',
  'Elm is a functional language that compiles to JavaScript'
];
let nameRand;
let surnameRand;
function randomName () {
  nameRand = Math.floor(Math.random() * 8);
  surnameRand = Math.floor(Math.random() * 8);
  return names[nameRand] + ' ' + surnames[surnameRand];
}

function randomEmail () {
  return (
    names[nameRand] + '.' + surnames[surnameRand] + '@' + emails[Math.floor(Math.random() * 8)]
  );
}

function randomUser (role) {
  return {
    id: randomId(),
    name: randomName(),
    email: randomEmail(),
    role
  };
}

const itemNames = [
  "Fish'n'chips",
  'Bacon bandages',
  'Lesters Fixins Outrageous Wild Crazy Unique Flavor Soda',
  'Yesito Chicken Harness',
  'Potato Pal',
  'Finger Puppets',
  'Universal Car French Fry Holder',
  'The Buttress Pillow'
];

function randomProduct () {
  return {
    id: randomId(),
    name: itemNames[Math.floor(Math.random() * 8)],
    price: Math.floor(Math.random() * 1000),
    description: descriptions[Math.floor(Math.random() * 8)]
  };
}

const customer1 = randomUser('customer');
const customer2 = randomUser('customer');
const admin1 = randomUser('admin');
const admin2 = randomUser('admin');
// const product1 = randomProduct();

function randomOrderItems () {
  const length = Math.floor(Math.random() * 10) + 1;
  const items = [];
  for (let index = 0; index < length; index++) {
    items.push({
      product: randomProduct(),
      quantity: Math.floor(Math.random() * 10) + 1
    });
  }
  return items;
}

function randomOrder (customer) {
  const length = Math.floor(Math.random() * 10) + 1;
  const orders = [];
  for (let index = 0; index < length; index++) {
    orders.push({
      id: randomId(),
      customerId: customer?.id || randomId(),
      items: randomOrderItems()
    });
  }
  return orders;
}

function randomProducts () {
  const length = Math.floor(Math.random() * 100) + 1;
  const products = [];
  for (let index = 0; index < length; index++) {
    products.push(randomProduct());
  }
  return products;
}

const state = {
  visitor: {},
  customer: customer1,
  guest: {
    role: 'guest'
  },
  admin: admin1,
  customerOrders: randomOrder(customer1),
  orders: randomOrder(),
  products: randomProducts(),
  users: [customer1, customer2, admin1, admin2],
  cart: [
    {
      product: randomProduct(),
      quantity: 2
    },
    {
      product: randomProduct(),
      quantity: 4
    },
    {
      product: randomProduct(),
      quantity: 1
    }
  ]
};

export default state;
