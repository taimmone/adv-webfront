/** @format */

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createNotification } from '../redux/actionCreators/notificationsActions';
import { addOrder } from '../redux/actionCreators/ordersActions';
import CartItem from './CartItem';

const Cart = () => {
  const { auth, cart } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrder = () => {
    if (auth.role === 'guest') {
      dispatch(
        createNotification({
          message: 'Authentication required',
          isSuccess: false,
        })
      );
      navigate('/login');
    } else {
      dispatch(addOrder(cart));
    }
  };

  return (
    <div data-testid="cart-component">
      {!cart.length ? (
        <div data-testid="empty-cart">Empty cart</div>
      ) : (
        <div>
          <ul data-testid="cart-item-container">
            {cart.map(item => (
              <li key={item.product.id}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleOrder}
            data-testid="order-button"
          >
            Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
