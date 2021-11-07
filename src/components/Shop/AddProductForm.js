import { useDispatch } from "react-redux";

import { sendProductData } from "../../store/products-slice";
import { productActions } from "../../store/products-slice";
import useInput from "../hooks/use-input";
import classes from "./AddProductForm.module.css";

const AddProductForm = () => {
  const dispatch = useDispatch();

  const {
    value: enteredTitile,
    hasError: titleInputHasError,
    isValid: enteredTitleIsValid,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitileInput,
  } = useInput(
    (value) => value.trim() !== "" && value.length >= 4 && !/\d/g.test(value)
  );

  const {
    value: enteredPrice,
    hasError: priceInputHasError,
    isValid: enteredPriceIsValid,
    valueChangeHandler: priceChangeHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPriceInput,
  } = useInput((value) => isFinite(value) && value.trim() !== "");

  const {
    value: enteredDescription,
    hasError: descriptionInputHasError,
    isValid: enteredDescriptionIsValid,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput((value) => value.trim() !== "" && value.length >= 6);

  const {
    value: enteredImgURL,
    hasError: imgURLInputHasError,
    isValid: imgURLIsValid,
    valueChangeHandler: imgURLChangeHandler,
    inputBlurHandler: imgURLBlurHandler,
    reset: resetImgURLInput,
  } = useInput(
    (value) =>
      value.trim() !== "" &&
      value.length >= 4 &&
      /(https?:\/\/.*\.(?:png|jpg))/i.test(value)
  );

  let formIsValid = false;
  if (
    enteredDescriptionIsValid &&
    enteredPriceIsValid &&
    enteredTitleIsValid &&
    imgURLIsValid
  )
    formIsValid = true;

  const submitHandler = async (event) => {
    event.preventDefault();
    if (
      !enteredDescriptionIsValid &&
      !enteredPriceIsValid &&
      !enteredTitleIsValid &&
      !imgURLIsValid
    )
      return;

    const newProduct = {
      description: enteredDescription,
      title: enteredTitile,
      price: enteredPrice,
      img: enteredImgURL,
    };

    dispatch(productActions.addProduct(newProduct));
    dispatch(sendProductData(newProduct));

    resetTitileInput();
    resetPriceInput();
    resetDescriptionInput();
    resetImgURLInput();
  };

  const titleInputClasses = titleInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : `${classes["form-control"]}`;

  const descriptionInputClasses = descriptionInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : `${classes["form-control"]}`;

  const priceInputClasses = priceInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : `${classes["form-control"]}`;

  const imgURLInputClasses = imgURLInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : `${classes["form-control"]}`;

  return (
    <form onSubmit={submitHandler}>
      <h2 className={classes["auth-header"]}>Add a new product to your shop</h2>
      <div className={titleInputClasses}>
        <label htmlFor="title">Product title</label>
        <input
          type="text"
          id="title"
          onBlur={titleBlurHandler}
          onChange={titleChangeHandler}
          value={enteredTitile}
        />
        {titleInputHasError && (
          <p className={classes["error-text"]}>
            Product title field must be not less than 4 characters (without
            numbers)
          </p>
        )}
      </div>
      <div className={priceInputClasses}>
        <label htmlFor="price">Product price</label>
        <input
          type="text"
          id="price"
          onBlur={priceBlurHandler}
          onChange={priceChangeHandler}
          value={enteredPrice}
        />
        {priceInputHasError && (
          <p className={classes["error-text"]}>
            Product price field must not be empty and must contains only
            numbers.
          </p>
        )}
      </div>
      <div className={descriptionInputClasses}>
        <label htmlFor="description">Product description</label>
        <input
          type="text"
          id="description"
          onBlur={descriptionBlurHandler}
          onChange={descriptionChangeHandler}
          value={enteredDescription}
        />
        {descriptionInputHasError && (
          <p className={classes["error-text"]}>
            Product title field must be not less than 6 characters.
          </p>
        )}
      </div>
      <div className={imgURLInputClasses}>
        <label htmlFor="img">Product image</label>
        <input
          type="text"
          id="img"
          onBlur={imgURLBlurHandler}
          onChange={imgURLChangeHandler}
          value={enteredImgURL}
        />
        {imgURLInputHasError && (
          <p className={classes["error-text"]}>
            Product image field must be valid URL link.
          </p>
        )}
      </div>
      <div className={classes["form-actions"]}>
        <button disabled={!formIsValid}>Add New Product</button>
      </div>
    </form>
  );
};

export default AddProductForm;
