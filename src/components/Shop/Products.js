import { useDispatch } from "react-redux";

import ProductItem from "./ProductItem";
import { deleteProductData } from "../../store/products-slice";
import classes from "./Products.module.css";

const Products = (props) => {
  const dispatch = useDispatch();
  const isUser = props.userType === "user";

  const onDeleteHandler = (id) => {
    dispatch(deleteProductData(id));
  };

  return (
    <section className={classes.products}>
      {isUser ? (
        <h2>Let's buy some products</h2>
      ) : (
        <h2>Added products to your shop</h2>
      )}
      <ul>
        {props.products.map((product) => (
          <ProductItem
            onDelete={onDeleteHandler}
            title={product.title}
            key={product.id}
            id={product.id}
            price={+product.price}
            description={product.description}
            img={product.img}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
