import { useContext, useEffect, createContext, useReducer } from "react";

import {
  CLEAR_CART,
  INCREASE,
  REMOVE,
  DECREASE,
  LOADING,
  DISPLAY_ITEMS,
} from "./actions";

import reducer from "./reducer";
import { getTotalAmount } from "./utils";

const AppContext = createContext();

const url = "https://www.course-api.com/react-useReducer-cart-project";

const initialState = {
  loading: false,
  cart: new Map(),
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { totalAmount, totalCost } = getTotalAmount(state.cart);

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const removeItem = (id) => {
    dispatch({ type: REMOVE, payload: { id } });
  };

  const increaseAmount = (id) => {
    dispatch({ type: INCREASE, payload: { id } });
  };

  const decreaseAmount = (id) => {
    dispatch({ type: DECREASE, payload: { id } });
  };

  const fetchData = async () => {
    dispatch({ type: LOADING });
    const response = await fetch(url);
    const cartItem = await response.json();
    dispatch({ type: DISPLAY_ITEMS, payload: { cartItem } });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        clearCart,
        removeItem,
        increaseAmount,
        decreaseAmount,
        totalAmount,
        totalCost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
