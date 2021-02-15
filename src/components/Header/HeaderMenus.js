import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getProductsInCart, getUserId} from '../../reducks/users/selectors';
import {fetchProductsInCart} from '../../reducks/users/operations';
import {db} from '../../firebase';
import {push} from 'connected-react-router';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MenuIcon from '@material-ui/icons/Menu';

const HeaderMenus = props => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const uid = getUserId(selector);
  let productsInCart = getProductsInCart(selector);

  useEffect(() => {
    const unsubscribe = db.collection("users").doc(uid).collection("cart").onSnapshot(snapshots => {
      snapshots.docChanges().forEach(change => {
        switch (change.type) {
          case "added":
            productsInCart.push(change.doc.data());
            break;
          case "modified":
            const index = productsInCart.findIndex(product => product.cart_id === change.doc.id);
            productsInCart[index] = change.doc.data();
            break;
          case "removed":
            productsInCart = productsInCart.filter(product => product.cart_id !== change.doc.id);
            break;
          default:
            break;
        }
      });
      dispatch(fetchProductsInCart(productsInCart));
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <IconButton onClick={() => dispatch(push("/cart"))}>
        <Badge badgeContent={productsInCart.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <IconButton>
        <FavoriteBorderIcon />
      </IconButton>
      <IconButton onClick={event => props.handleDrawerToggle(event)}>
        <MenuIcon />
      </IconButton>
    </>
  )
}

export default HeaderMenus;
