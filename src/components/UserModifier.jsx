/** @format */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/actionCreators/usersActions';
import { useNavigate, useParams } from 'react-router-dom';

const UserModifier = () => {
  const { userId } = useParams();
  const { users } = useSelector(state => state);

  const oldUser = users.find(u => u.id === userId);
  const [updatedUser, setUser] = useState({
    ...oldUser,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(updateUser(updatedUser));
    navigate('/users');
  };

  return (
    <div>
      <h1>Modify user</h1>
      <form onSubmit={handleSubmit} data-testid="user-modifier-component">
        <h2 data-testid="name-heading">{oldUser.name}</h2>
        <select
          name="role-select"
          value={updatedUser.role}
          onChange={e => setUser({ updateUser, role: e.target.value })}
          data-testid="role-select"
        >
          <option value="customer">customer</option>
          <option value="admin">admin</option>
        </select>
        <button
          type="submit"
          data-testid="update-button"
          disabled={updatedUser.role === oldUser.role}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserModifier;
