import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {listenAuthState} from './reducks/users/operations';
import {getIsSignedIn} from './reducks/users/selectors';

const Auth = ({children}) => {
  const selector = useSelector(state => state);
  const isSignedIn = getIsSignedIn(selector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSignedIn) {
      dispatch(listenAuthState());
    }
  }, []);

  if (!isSignedIn) {
    return <></>
  } else {
    return children;
  }
}

export default Auth;
