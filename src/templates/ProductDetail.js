import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {db, FirebaseTimestamp} from '../firebase';
import {makeStyles} from '@material-ui/styles';
import HTMLReactParser from 'html-react-parser';
import {ImageSwiper, SizeTable} from '../components/Products';
import {addProductToCart} from '../reducks/users/operations';

const useStyles = makeStyles(theme => ({
  sliderBox: {
    [theme.breakpoints.down("sm")]: {
      margin: "0 auto 24px",
      height: 320,
      width: 320
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      height: 400,
      width: 400
    }
  },
  detail: {
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      margin: "0 auto 16px",
      height: "auto",
      width: 320
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      height: "auto",
      width: 400
    }
  },
  price: {
     fontSize: 36
  }
}));

const returnCodeToBr = text => {
  if (!text) {
    return text;
  } else {
    return HTMLReactParser(text.replace(/\r?\n/g, "<br/>"));
  }
}

const ProductDetail = () => {
  const selector = useSelector(state => state);
  const dispatch = useDispatch();
  const id = selector.router.location.pathname.split("/product/")[1];
  const [product, setProduct] = useState(null);
  const classes = useStyles();

  const addProduct = useCallback(selectedSize => {
    dispatch(addProductToCart({
      added_at: FirebaseTimestamp.now(),
      description: product.description,
      gender: product.gender,
      images: product.images,
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 1,
      size: selectedSize
    }));
  }, [product]);

  useEffect(() => {
    db.collection("products").doc(id).get().then(doc => {
      setProduct(doc.data());
    });
  }, []);

  return (
    <section className="c-section-wrapin">
      {product && (
        <div className="p-grid__row">
          <div className={classes.sliderBox}>
            <ImageSwiper images={product.images} />
          </div>
          <div className={classes.detail}>
            <h2 className="u-text__headline">{product.name}</h2>
            <p className={classes.price}>{product.price.toLocaleString()}</p>
            <div className="module-spacer--small"></div>
            <SizeTable sizes={product.sizes} addProduct={addProduct} />
            <div className="module-spacer--small"></div>
            <p>{returnCodeToBr(product.description)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetail;
