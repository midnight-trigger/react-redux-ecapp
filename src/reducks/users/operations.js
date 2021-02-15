import {signInAction, signOutAction, fetchProductsInCartAction, fetchOrdersHistoryAction} from './actions';
import {push} from 'connected-react-router';
import {auth, FirebaseTimestamp, db} from '../../firebase';

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
    const list = [];

    db.collection("users").doc(getState().users.uid).collection("orders").orderBy("updated_at", "DESC").get().then(snapshots => {
      snapshots.forEach(snapshot => {
        console.log("a");
        list.push(snapshot.data());
      });
      dispatch(fetchOrdersHistoryAction(list));
    });
  }
}

export const fetchProductsInCart  = products => {
  return async dispatch => {
    dispatch(fetchProductsInCartAction(products));
  }
}

export const addProductToCart = addedProduct => {
  return async (dispatch, getState) => {
    const cartRef = db.collection("users").doc(getState().users.uid).collection("cart").doc();
    addedProduct["cart_id"] = cartRef.id;

    await cartRef.set(addedProduct);
    dispatch(push("/"));
  }
}

export const listenAuthState = () => {
  return async dispatch => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        db.collection("users").doc(user.uid).get().then(snapshot => {
          dispatch(signInAction({
            isSignedIn: true,
            role: snapshot.data().role,
            uid: user.uid,
            username: snapshot.data().username
          }));
        });
      } else {
        dispatch(push("/signin"));
      }
    });
  }
}

export const signIn = (email, password) => {
  return async dispatch => {
    // バリデーション
    if (email === "" || password === "") {
      alert("必須項目が未入力です");
      return false;
    }

    return auth.signInWithEmailAndPassword(email, password).then(result => {
      if (result.user) {
        db.collection("users").doc(result.user.uid).get().then(snapshot => {
          dispatch(signInAction({
            isSignedIn: true,
            role: snapshot.data().role,
            uid: result.user.uid,
            username: snapshot.data().username
          }));
        });
        dispatch(push("/"));
      }
    });
  }
}

export const signOut = () => {
  return async dispatch => {
    auth.signOut().then(() => {
      dispatch(signOutAction());
      dispatch(push("/signin"));
    })
  }
}

export const signUp = (username, email, password, confirmPassword) => {
  return async dispatch => {
    // バリデーション
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です");
      return false;
    }
    if (password !== confirmPassword) {
      alert("パスワードが一致していません");
      return false;
    }

    return auth.createUserWithEmailAndPassword(email, password).then(result => {
      if (result.user) {
        const userInitialData = {
          uid: result.user.uid,
          username: username,
          email: email,
          password: password,
          role: "customer",
          created_at: FirebaseTimestamp.now(),
          updated_at: FirebaseTimestamp.now()
        }

        db.collection("users").doc(result.user.uid).set(userInitialData).then(() => {
          dispatch(push("/"));
        });
      }
    });
  }
}

export const resetPassword = email => {
  return async dispatch => {
    // バリデーション
    if (email === "") {
      alert("必須項目が未入力です");
      return false;
    }

    auth.sendPasswordResetEmail(email).then(() => {
      alert("入力されたアドレス宛にパスワードリセット用のメールを送りました。");
      dispatch(push("/signin"));
    }).catch(() => {
      alert("パスワードリセットに失敗しました。");
    });
  }
}
