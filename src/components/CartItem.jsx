/** @format */

import React from 'react';
import { useDispatch } from 'react-redux';
import {
  decrementCartItem,
  incrementCartItem,
  removeCartItem,
} from '../redux/actionCreators/cartActions';

const CartItem = ({ item }) => {
  const { product, quantity } = item;
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(incrementCartItem(product.id));
  };
  const handleDecrement = () => {
    quantity - 1
      ? dispatch(decrementCartItem(product.id))
      : dispatch(removeCartItem(product));
  };

  return (
    <div data-testid="cart-item-component">
      <p data-testid="item-name">{product.name}</p>
      <p data-testid="item-price">{product.price}</p>
      <p data-testid="item-amount">quantity: {quantity}</p>
      <div>
        <button
          onClick={handleIncrement}
          data-testid={`plus-btn-${product.id}`}
        >
          +
        </button>
        <button
          onClick={handleDecrement}
          data-testid={`minus-btn-${product.id}`}
        >
          -
        </button>
      </div>
      product
    </div>
  );
};

export default CartItem;
