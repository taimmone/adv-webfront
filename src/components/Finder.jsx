/** @format */

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';

const Finder = ({ type, findHandler }) => {
  const state = useSelector(state => state[`${type}s`]);
  const itemId = useParams()[`${type}Id`];
  const dispatch = useDispatch();

  const findItem = () => state?.find(item => item.id === itemId);

  useEffect(() => {
    if (!findItem()) {
      console.log('find item:', itemId);
      dispatch(findHandler(itemId));
    }
  }, [itemId]);

  if (!findItem())
    return (
      <div data-testid={`no-${type}-found-component`}>{type} not found.</div>
    );
  else
    return (
      <div data-testid={`${type}-found-component`}>
        <Outlet />
      </div>
    );
};

export default Finder;
