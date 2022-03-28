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

  // console.log(type, itemId, findItem());

  useEffect(() => {
    if (!findItem()) {
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
        <Outlet context={findItem()} />
      </div>
    );
};

export default Finder;
