/** @format */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/actionCreators/authActions';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setConfirmation] = useState('');

  const dispatch = useDispatch();

  const handleRegister = event => {
    event.preventDefault();
    dispatch(register({ name, email, password, passwordConfirmation }));
  };

  return (
    <div data-testid="register-component">
      <h1>Register</h1>
      <form onSubmit={e => handleRegister(e)} data-testid="register-form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="name-input"
            required
          />
        </div>
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
        <div>
          <label htmlFor="passwordConfirmation">Password confirmation</label>
          <input
            type="password"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={e => setConfirmation(e.target.value)}
            data-testid="passwordConfirmation-input"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
