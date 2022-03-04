/** @format */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/actionCreators/authActions';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    setEmail('');
    setPassword('');
    dispatch(logIn());
  };

  return (
    <div data-testid="login-component">
      <form onSubmit={e => handleSubmit(e)} data-testid="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            data-testid="email-input"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            data-testid="password-input"
            required
          />
        </div>
        <button type="submit" data-testid="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
