import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { clientReducer } from "./clientReducer.js";
import { productReducer } from "./productReducer.js";
import { shoppingCartReducer } from "./shoppingCartReducer.js";

const rootReducer = combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));
