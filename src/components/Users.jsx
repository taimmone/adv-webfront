/** @format */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../redux/actionCreators/usersActions';
import User from './User';

const Users = () => {
  const { users } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!users.length) dispatch(getUsers());
  }, []);

  return (
    <div data-testid="users-component">
      <ul data-testid="users-container">
        {users?.map(user => (
          <li key={user.id}>
            <User providedUser={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
