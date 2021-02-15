import * as Action from "./actions";
import initialState from "../store/initialState";

export const ProductsReducer = (state = initialState.products, action) => {
  switch (action.type) {
    case Action.FETCH_PRODUCTS:
      return {
        ...state,
        list: [...action.payload]
      };
    case Action.DELETE_PRODUCT:
      return {
        ...state,
        list: [...action.payload]
      };
    default:
      return state
  }
}
