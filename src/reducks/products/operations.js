import {fetchProductsAction, deleteProductAction} from './actions';
import {push} from 'connected-react-router';
import {FirebaseTimestamp, db} from '../../firebase';

export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    let products = [],
        soldOutProducts = [];
    const batch = db.batch();

    for (const product of productsInCart) {
      const snapshot = await db.collection("products").doc(product.productId).get();
      const updatedSizes = snapshot.data().sizes.map(size => {
        if (size.size === product.size) {
          if (!size.quantity) {
            soldOutProducts.push(product.name);
            return size;
          } else {
            return {
              size: size.size,
              quantity: size.quantity - 1
            }
          }
        } else {
          return size;
        }
      });

      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      });

      batch.update(
        db.collection("products").doc(product.productId),
        {sizes: updatedSizes}
      );
      batch.delete(db.collection("users").doc(getState().users.uid).collection("cart").doc(product.cart_id));
    }

    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) ? soldOutProducts.join("と") : soldOutProducts[0];
      alert(errorMessage + "が在庫切れのため注文処理を中断しました");
      return false;
    }
    batch.commit().then(() => {
      const date = FirebaseTimestamp.now().toDate();
      const orderRef = db.collection("users").doc(getState().users.uid).collection("orders").doc();
      const history = {
        amount: amount,
        created_at: FirebaseTimestamp.now(),
        updated_at: FirebaseTimestamp.now(),
        id: orderRef.id,
        products: products,
        shipping_date: FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)))
      };

      orderRef.set(history);
      dispatch(push("/order/complete"));
    }).catch(() => {
      alert("注文処理に失敗しました");
      return false;
    });
  }
}

export const deleteProduct = id => {
  return async (dispatch, getState) => {
    db.collection("products").doc(id).delete().then(() => {
      const newProducts = getState().products.list.filter(product => id !== product.id);
      dispatch(deleteProductAction(newProducts));
    });
  }
}

export const fetchProducts = () => {
  return async dispatch => {
    db.collection("products").orderBy("updated_at", "DESC").get().then(snapshot => {
      const products = [];
      snapshot.forEach(snapshot => {
        products.push(snapshot.data());
      });
      dispatch(fetchProductsAction(products));
    });
  }
}

export const saveProduct = (id, images, name, description, category, gender, price, sizes) => {
  return async dispatch => {
    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: FirebaseTimestamp.now()
    }

    data.id = id;
    if (id === "") {
      data.id = db.collection("products").doc().id;
      data.created_at = FirebaseTimestamp.now();
    }

    return db.collection("products").doc(data.id).set(data, {merge: true}).then(() => {
      dispatch(push("/"));
    }).catch(error => {
      throw new Error(error);
    });
  }
}
