/** @format */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCartItem,
  incrementCartItem,
} from '../redux/actionCreators/cartActions';
import { deleteProduct } from '../redux/actionCreators/productsActions';

const Product = ({ providedProduct }) => {
  const { auth, products, cart } = useSelector(state => state);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, image, description, price } =
    providedProduct ?? products.find(p => p.id === productId);

  const getId = () => providedProduct?.id ?? productId;

  const handleDelete = () => {
    dispatch(deleteProduct(getId()));
  };
  const handleModify = () => {
    navigate(productId ? 'modify' : `${getId()}/modify`);
  };
  const handleAddToCart = () => {
    cart.find(({ product }) => product?.id === getId())
      ? dispatch(incrementCartItem(getId()))
      : dispatch(
          addCartItem({
            product: { id: getId(), name, description, price },
            quantity: 1,
          })
        );
  };

  return (
    <div data-testid="product-component">
      <h2 data-testid="name-header">{name}</h2>
      {/* {image ?? <img src={image} alt={name} />} */}
      <p data-testid="description-element">{description}</p>
      <p data-testid="price-element">{price}</p>
      {auth.role === 'admin' ? (
        <div>
          <ProductButton
            text="Delete"
            onClick={handleDelete}
            testId={`delete-button-${getId()}`}
          />

          <ProductButton
            text="Modify"
            onClick={handleModify}
            testId={`modify-button-${getId()}`}
          />
        </div>
      ) : (
        <ProductButton
          text="Add to cart"
          onClick={handleAddToCart}
          testId={`add-cart-button-${getId()}`}
        />
      )}
    </div>
  );
};

const ProductButton = ({ text, onClick, testId }) => (
  <button type="button" onClick={onClick} data-testid={testId}>
    {text}
  </button>
);

export default Product;
