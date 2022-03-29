/** @format */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { removeUser } from '../redux/actionCreators/usersActions';

const User = ({ providedUser }) => {
  const { auth, users } = useSelector(state => state);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, email, role } =
    providedUser ?? users.find(p => p.id === userId);

  const getId = () => providedUser?.id ?? userId;

  const handleModify = () => {
    navigate(userId ? 'modify' : `${getId()}/modify`);
  };

  const handleDelete = () => {
    dispatch(removeUser(getId()));
  };

  return (
    <div data-testid="user-component">
      <h2 data-testid="name-heading">{name}</h2>
      {!userId && (
        <Link to={providedUser.id} data-testid="inspect-link">
          Inspect
        </Link>
      )}
      <p data-testid="email-element">Email: {email}</p>
      <p data-testid="role-element">{role}</p>
      {auth?.id !== getId() && (
        <div>
          <button
            onClick={handleModify}
            data-testid={`modify-button-${getId()}`}
          >
            Modify
          </button>
          <button
            onClick={handleDelete}
            data-testid={`delete-button-${getId()}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const UserButton = ({ text, onClick, testId }) => (
  <button type="button" onClick={onClick} data-testid={testId}>
    {text}
  </button>
);

export default User;
