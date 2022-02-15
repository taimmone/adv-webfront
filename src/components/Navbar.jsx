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
const Navbar = () => {};

export default Navbar;
