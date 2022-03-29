/** @format */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/actionCreators/authActions';

const Register = () => {
  const [newUser, setUser] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const dispatch = useDispatch();

  const handleInput = event => {
    const { name, value } = event.target;
    setUser({ ...newUser, [name]: value });
  };

  const handleRegister = event => {
    event.preventDefault();
    dispatch(register(newUser));
  };

  return (
    <div data-testid="register-component">
      <h1>Register</h1>
      <form onSubmit={e => handleRegister(e)} data-testid="register-form">
        <FormInput
          name="name"
          value={newUser.name}
          onChange={handleInput}
          required
        />
        <FormInput
          name="email"
          value={newUser.email}
          onChange={handleInput}
          required
        />
        <FormInput
          name="password"
          type="password"
          value={newUser.password}
          onChange={handleInput}
          required
        />
        <FormInput
          name="passwordConfirmation"
          type="password"
          value={newUser.passwordConfirmation}
          onChange={handleInput}
          required
        />
        <input type="submit" value="Register" data-testid="register-button" />
      </form>
    </div>
  );
};

const FormInput = ({ name, type = 'text', ...rest }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={name.toUpperCase()}
      id={`${name}-input`}
      data-testid={`${name}-input`}
      {...rest}
    />
  </div>
);

export default Register;
