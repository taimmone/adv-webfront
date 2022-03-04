/** @format */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../redux/actionCreators/notificationsActions';

const Notification = () => {
  const { notification } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (notification.message) {
      const notificationTimer = setTimeout(() => {
        dispatch(removeNotification());
      }, 5000);
      return () => clearTimeout(notificationTimer);
    }
  }, [notification]);

  if (!notification.message) {
    return <div data-testid="no-notification-component" />;
  } else {
    return (
      <div
        data-testid="notification-component"
        style={{
          backgroundColor: `${notification.isSuccess ? 'green' : 'red'}`,
        }}
      >
        {notification.message}
      </div>
    );
  }
};

export default Notification;
