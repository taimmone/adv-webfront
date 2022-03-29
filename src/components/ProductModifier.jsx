/** @format */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateProduct } from '../redux/actionCreators/productsActions';
import { useNavigate, useParams } from 'react-router-dom';

const ProductModifier = () => {
  const { productId } = useParams();
  const { products } = useSelector(state => state);

  const oldProduct = products.find(p => p.id === productId);
  const [updatedProduct, setProduct] = useState({
    ...oldProduct,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = event => {
    const { name, value } = event.target;
    setProduct({ ...updatedProduct, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(updateProduct(updatedProduct));
    navigate('/products');
  };

  const handleCancel = () => navigate('/products');

  return (
    <div>
      <h1>Modify product {oldProduct.name}</h1>
      <form onSubmit={handleSubmit} data-testid="product-modifier-component">
        <ModifierInput name="id" value={oldProduct.id} disabled />
        <ModifierInput
          name="name"
          value={updatedProduct.name}
          onChange={handleInput}
          required
        />
        <ModifierInput
          name="price"
          value={updatedProduct.price}
          onChange={handleInput}
          required
        />
        <ModifierInput
          name="image"
          value={updatedProduct.image}
          onChange={handleInput}
        />
        <ModifierInput
          name="description"
          value={updatedProduct.description}
          onChange={handleInput}
          required
        />
        <button type="submit" data-testid="update-button">
          Update
        </button>
        <button
          type="button"
          data-testid="cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

const ModifierInput = ({ name, ...rest }) => (
  <input
    type="text"
    name={name}
    id={`${name}-input`}
    data-testid={`${name}-input`}
    {...rest}
  />
);

export default ProductModifier;
