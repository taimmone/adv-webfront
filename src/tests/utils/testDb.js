/** @format */

export const serverUsers = [];

const initialDb = {
  users: [
    {
      id: '2a3ce8106e2611ec9a4d71389ecfd6d9',
      name: 'Admin',
      email: 'admin@email.com',
      role: 'admin'
    },
    {
      id: '2a66de406e2611ec9a4d71389ecfd6d9',
      name: 'Customer2',
      email: 'customer2@email.com',
      role: 'customer'
    },
    {
      id: '2a74e8006e2611ec9a4d71389ecfd6d9',
      name: 'Admin3',
      email: 'admin3@email.com',
      role: 'admin'
    },
    {
      id: '2a82a3a06e2611ec9a4d71389ecfd6d9',
      name: 'Customer3',
      email: 'customer3@email.com',
      password: '$2a$10$WlKyUrUlKlwQumWDjRKMfumQX/nOXOWOiSMkKCidm0fhR6S7FQgwu',
      role: 'customer'
    },
    {
      id: '2a90ad606e2611ec9a4d71389ecfd6d9',
      name: 'Admin4',
      email: 'admin4@email.com',
      password: '$2a$10$A6Jurg06IPNpREqQnSRZM.tBC16Bi86weHqpEbeYXb2wvo4iT3TiC',
      role: 'admin'
    },
    {
      id: '2a9f53606e2611ec9a4d71389ecfd6d9',
      name: 'Customer4',
      email: 'customer4@email.com',
      password: '$2a$10$0Cj5wjFNONgz8ZvJIziMKuz3gkt46FC0qTE7ZgS2V3dFQ.Q5zHkt.',
      role: 'customer'
    },
    {
      id: '2aacc0e06e2611ec9a4d71389ecfd6d9',
      name: 'Admin5',
      email: 'admin5@email.com',
      password: '$2a$10$iR7oQOXG5BGC9K6C/ckKO.h66.qE3WWQrj.VL9ABY60Xy6AoB5mgK',
      role: 'admin'
    },
    {
      id: '2aba55706e2611ec9a4d71389ecfd6d9',
      name: 'Customer5',
      email: 'customer5@email.com',
      password: '$2a$10$rt.DEho7IvrS7zcQlzJDu.c5xcQwl0J1On7w5n3OdhZnaH07ai2HC',
      role: 'customer'
    },
    {
      id: '2a4b18e06e2611ec9a4d71389ecfd6d9',
      name: 'Customer',
      email: 'customer@email.com',
      password: '$2a$10$rd8kyeZkTg9x7SAx5uueEeHLCNBalNOeOsPzXsZXRj/PT6sZa3Nri',
      role: 'customer'
    },
    {
      id: '2a58fb906e2611ec9a4d71389ecfd6d9',
      name: 'Admin2',
      email: 'admin2@email.com',
      password: '$2a$10$sI2vs0ke5NX2oH8nnWg3m.iQffqG0u26Dsa6RoZFN9PfoxPuz85/a',
      role: 'customer'
    }
  ],
  products: [
    {
      id: '2abd89c06e2611ec9a4d71389ecfd6d9',
      name: 'Fantastic Cotton Chair',
      price: 102,
      image: 'http://placeimg.com/640/480/nature',
      description: 'The Football Is Good For Training And Recreational Purposes'
    },
    {
      id: '2abe26006e2611ec9a4d71389ecfd6d9',
      name: 'Lovely Marble Car',
      price: 909,
      image: 'http://placeimg.com/640/480/city',
      description:
        'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients'
    },
    {
      id: '2abe74206e2611ec9a4d71389ecfd6d9',
      name: 'Sleek Plastic Hat',
      price: 62.25,
      image: 'http://placeimg.com/640/480/city',
      description:
        'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive'
    },
    {
      id: '2abee9506e2611ec9a4d71389ecfd6d9',
      name: 'Awesome Wooden Shoes',
      price: 4.99,
      image: 'http://placeimg.com/640/480/food',
      description:
        'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals'
    },
    {
      id: '2abf85906e2611ec9a4d71389ecfd6d9',
      name: 'Small Cotton Chicken',
      price: 173.99,
      image: 'http://placeimg.com/640/480/fashion',
      description:
        'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive'
    },
    {
      id: '2abffac06e2611ec9a4d71389ecfd6d9',
      name: 'Ergonomic Metal Cheese',
      price: 83.1,
      image: 'http://placeimg.com/640/480/transport',
      description:
        'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J'
    },
    {
      id: '2ac06ff06e2611ec9a4d71389ecfd6d9',
      name: 'Ergonomic Granite Duck',
      price: 729,
      image: 'http://placeimg.com/640/480/business',
      description:
        'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
    },
    {
      id: '2ac0e5206e2611ec9a4d71389ecfd6d9',
      name: 'Beautiful Frozen Salad',
      price: 0.75,
      image: 'http://placeimg.com/640/480/fashion',
      description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit'
    },
    {
      id: '2ac15a506e2611ec9a4d71389ecfd6d9',
      name: 'Ergonomic Plastic Bike',
      price: 56,
      image: 'http://placeimg.com/640/480/city',
      description:
        'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
    },
    {
      id: '2ac1a8706e2611ec9a4d71389ecfd6d9',
      name: 'Generic Cotton Chips',
      price: 1351,
      image: 'http://placeimg.com/640/480/food',
      description:
        'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart'
    },
    {
      id: '2ac1f6906e2611ec9a4d71389ecfd6d9',
      name: 'Incredible Wooden Towels',
      price: 97,
      image: 'http://placeimg.com/640/480/cats',
      description:
        'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
    },
    {
      id: '2ac26bc06e2611ec9a4d71389ecfd6d9',
      name: 'Tasty Granite Gloves',
      price: 480,
      image: 'http://placeimg.com/640/480/technics',
      description:
        'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients'
    },
    {
      id: '2ac2b9e06e2611ec9a4d71389ecfd6d9',
      name: 'Practical Steel Chicken',
      price: 886,
      image: 'http://placeimg.com/640/480/sports',
      description:
        'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J'
    },
    {
      id: '2ac308006e2611ec9a4d71389ecfd6d9',
      name: 'Handcrafted Metal Mouse',
      price: 567,
      image: 'http://placeimg.com/640/480/business',
      description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit'
    },
    {
      id: '2ac356206e2611ec9a4d71389ecfd6d9',
      name: 'Sleek Metal Fish',
      price: 171,
      image: 'http://placeimg.com/640/480/sports',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design'
    },
    {
      id: '2ac3a4406e2611ec9a4d71389ecfd6d9',
      name: 'Awesome Cotton Computer',
      price: 137,
      image: 'http://placeimg.com/640/480/animals',
      description:
        'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
    },
    {
      id: '2ac3f2606e2611ec9a4d71389ecfd6d9',
      name: 'Practical Plastic Mouse',
      price: 566,
      image: 'http://placeimg.com/640/480/food',
      description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit'
    },
    {
      id: '2ac440806e2611ec9a4d71389ecfd6d9',
      name: 'Flammable Plastic Gloves',
      price: 795,
      image: 'http://placeimg.com/640/480/city',
      description:
        'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support'
    },
    {
      id: '2ac48ea06e2611ec9a4d71389ecfd6d9',
      name: 'Intelligent Concrete Salad',
      price: 789,
      image: 'http://placeimg.com/640/480/fashion',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design'
    },
    {
      id: '2ac52ae06e2611ec9a4d71389ecfd6d9',
      name: 'Rustic Metal Shoes',
      price: 309,
      image: 'http://placeimg.com/640/480/cats',
      description:
        'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
    },
    {
      id: '2ac579006e2611ec9a4d71389ecfd6d9',
      name: 'Generic Granite Sausages',
      price: 37.3,
      image: 'http://placeimg.com/640/480/sports',
      description: 'The Football Is Good For Training And Recreational Purposes'
    },
    {
      id: '2ac5c7206e2611ec9a4d71389ecfd6d9',
      name: 'Gorgeous Metal Towels',
      price: 93,
      image: 'http://placeimg.com/640/480/nature',
      description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit'
    },
    {
      id: '2ac615406e2611ec9a4d71389ecfd6d9',
      name: 'Awesome Soft Towels',
      price: 444,
      image: 'http://placeimg.com/640/480/sports',
      description:
        'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive'
    },
    {
      id: '2ac6b1806e2611ec9a4d71389ecfd6d9',
      name: 'Unbranded Soft Table',
      price: 8,
      image: 'http://placeimg.com/640/480/animals',
      description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit'
    },
    {
      id: '2ac6ffa06e2611ec9a4d71389ecfd6d9',
      name: 'Sleek Wooden Hat',
      price: 748,
      image: 'http://placeimg.com/640/480/sports',
      description:
        'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016'
    }
  ],
  orders: [
    {
      id: '07ab20a06ffc11ec8d6843b36b0672b6',
      items: [
        {
          product: {
            name: 'Fantastic Cotton Chair',
            price: 102,
            id: '2abd89c06e2611ec9a4d71389ecfd6d9',
            description: 'The Football Is Good For Training And Recreational Purposes'
          },
          quantity: 3
        },
        {
          product: {
            name: 'Lovely Marble Car',
            price: 909,
            id: '2abe26006e2611ec9a4d71389ecfd6d9',
            description:
              'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients'
          },
          quantity: 2
        }
      ],
      customerId: '2a4b18e06e2611ec9a4d71389ecfd6d9'
    }
  ]
};

export let db = JSON.parse(JSON.stringify(initialDb));

export const resetDb = () => {
  db = JSON.parse(JSON.stringify(initialDb));
};
