/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOut } from '../redux/actionCreators/authActions';

const AllLinks = {
  admin: ['Orders', 'Users'],
  customer: ['Orders', 'Cart'],
  guest: ['Cart', 'Login', 'Register'],
};
/**
 * @component
 *
 */
const Navbar = () => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();

  const logoutHandler = () => dispatch(logOut());

  return (
    <nav data-testid="navbar-component">
      <Link to="/" data-testid="home-link">
        Home
      </Link>
      <Link to="/products" data-testid="products-link">
        Products
      </Link>
      {auth.role &&
        AllLinks[auth.role].map(section => {
          const path = section.toLowerCase();
          return (
            <Link key={path} to={`/${path}`} data-testid={`${path}-link`}>
              {section}
            </Link>
          );
        })}
      {auth.role && auth.role !== 'guest' && (
        <Link to="/" onClick={logoutHandler} data-testid="logout-link">
          Logout
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
