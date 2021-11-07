import { useDispatch, useSelector } from "react-redux";

import { cartActions } from "../../store/cart-slice";
import Card from "../UI/Card";
import classes from "./ProductItem.module.css";

const ProductItem = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userType);

  const { title, price, description, id, img } = props;

  const addToCartHandler = () => {
    dispatch(
      cartActions.addItemToCart({
        id,
        title,
        price,
      })
    );
  };

  return (
    <li className={classes.item} key={id}>
      <Card>
        <img src={img} alt={title} />
        <header>
          <h3>{title}</h3>

          <div className={classes.price}>£{price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          {user === "user" && (
            <button onClick={addToCartHandler}>Add to Cart</button>
          )}
        </div>
        {user === "admin" && (
          <button onClick={() => props.onDelete(id)}>Delete</button>
        )}
      </Card>
    </li>
  );
};

export default ProductItem;
