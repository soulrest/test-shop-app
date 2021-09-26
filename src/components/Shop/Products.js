import { useSelector } from "react-redux";

import ProductItem from "./ProductItem";
import classes from "./Products.module.css";

const Products = () => {
  const { products } = useSelector((state) => state.products);
  const isUser = useSelector((state) => state.auth.userType) === "user";

  return (
    <section className={classes.products}>
      {isUser ? (
        <h2>let's buy some products</h2>
      ) : (
        <h2>added products to your shop</h2>
      )}
      <ul>
        {products.map((product) => (
          <ProductItem
            title={product.title}
            key={product.id}
            id={product.id}
            price={+product.price}
            description={product.description}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
