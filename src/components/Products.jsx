/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/actionCreators/productsActions';
import Product from './Product';
import ProductAdder from './ProductAdder';

const Products = () => {
  const { auth, products } = useSelector(state => state);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleAdderOpen = () => setOpen(!open);

  useEffect(() => {
    if (!products.length) dispatch(getProducts());
  }, []);

  return (
    <div data-testid="products-component">
      <h1>Products</h1>
      {auth.role === 'admin' && (
        <div>
          <h2>ProductAdder</h2>
          <button
            type="button"
            onClick={handleAdderOpen}
            data-testid="open-adder-button"
          >
            {!open ? 'Open' : 'Close'}
          </button>
          <ProductAdder open={open} openHandler={handleAdderOpen} />
        </div>
      )}
      <ul data-testid="products-container">
        {products?.map(product => (
          <li key={product.id}>
            <Product providedProduct={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
