/** @format */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { addProduct } from '../redux/actionCreators/productsActions';

const ProductAdder = ({ open, openHandler }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(addProduct(product));
    openHandler();
  };

  const handleInput = event => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  if (!open) return null;

  return (
    <form onSubmit={e => handleSubmit(e)} data-testid="product-adder-component">
      <AdderInput
        name="name"
        value={product.name}
        onChange={handleInput}
        required
      />
      <AdderInput
        name="price"
        value={product.price}
        onChange={handleInput}
        required
      />
      <AdderInput name="image" value={product.image} onChange={handleInput} />
      <AdderInput
        name="description"
        value={product.description}
        onChange={handleInput}
        required
      />
      <button type="submit" data-testid="add-button">
        Add product
      </button>
      <button
        type="button"
        onClick={() => openHandler()}
        data-testid="cancel-button"
      >
        Cancel
      </button>
    </form>
  );
};

const AdderInput = ({ name, ...rest }) => (
  <input
    type="text"
    name={name}
    id={`${name}-input`}
    data-testid={`${name}-input`}
    {...rest}
  />
);

export default ProductAdder;
