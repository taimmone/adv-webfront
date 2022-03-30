/** @format */

import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const Order = ({ providedOrder }) => {
  const { orders } = useSelector(state => state);
  const { orderId } = useParams();

  const { id, customerId, items } =
    providedOrder ?? orders.find(o => o.id === orderId);

  const getId = () => id ?? orderId;

  return (
    <div data-testid="order-component">
      <h2 data-testid="orderId-heading">{getId()}</h2>
      <h2 data-testid="customerId-heading">{customerId}</h2>
      {!orderId && (
        <Link to={providedOrder.id} data-testid="inspect-link">
          Inspect
        </Link>
      )}
      <ol data-testid="order-list">
        {items.map(({ product, quantity }) => (
          <li key={product.id} data-testid="order-listitem">
            <h3 data-testid="name-heading">{product.name}</h3>
            <p data-testid="price-element">{product.price}</p>
            <p data-testid="description-element">{product.description}</p>
            <p data-testid="quantity-element">{quantity}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Order;
