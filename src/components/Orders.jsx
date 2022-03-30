/** @format */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../redux/actionCreators/ordersActions';
import Order from './Order';

const Orders = () => {
  const { orders } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders.length) dispatch(getOrders());
  }, []);

  console.table(orders);
  console.log(orders.length);

  if (!orders.length)
    return <div data-testid="no-order-component">No orders</div>;
  return (
    <div data-testid="orders-component">
      <ul data-testid="orders-container">
        {orders.map(order => (
          <li key={order.id}>
            <Order providedOrder={order} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
