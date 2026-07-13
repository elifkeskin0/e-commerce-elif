import { toast } from "react-toastify";
import { api, setAuthToken } from "../api/api.js";
import {
  SET_ADDRESS,
  SET_ADDRESS_LIST,
  SET_CART,
  SET_CATEGORIES,
  SET_CREDIT_CARDS,
  SET_FETCH_STATE,
  SET_FILTER,
  SET_LANGUAGE,
  SET_LIMIT,
  SET_OFFSET,
  SET_PAYMENT,
  SET_PRODUCT_LIST,
  SET_ROLES,
  SET_SELECTED_PRODUCT,
  SET_THEME,
  SET_TOTAL,
  SET_USER,
} from "./actionTypes.js";

export const setUser = (payload) => ({ type: SET_USER, payload });
export const setRoles = (payload) => ({ type: SET_ROLES, payload });
export const setTheme = (payload) => ({ type: SET_THEME, payload });
export const setLanguage = (payload) => ({ type: SET_LANGUAGE, payload });
export const setAddressList = (payload) => ({ type: SET_ADDRESS_LIST, payload });
export const setCreditCards = (payload) => ({ type: SET_CREDIT_CARDS, payload });

export const setCategories = (payload) => ({ type: SET_CATEGORIES, payload });
export const setProductList = (payload) => ({ type: SET_PRODUCT_LIST, payload });
export const setTotal = (payload) => ({ type: SET_TOTAL, payload });
export const setFetchState = (payload) => ({ type: SET_FETCH_STATE, payload });
export const setLimit = (payload) => ({ type: SET_LIMIT, payload });
export const setOffset = (payload) => ({ type: SET_OFFSET, payload });
export const setFilter = (payload) => ({ type: SET_FILTER, payload });
export const setSelectedProduct = (payload) => ({ type: SET_SELECTED_PRODUCT, payload });

export const setCart = (payload) => ({ type: SET_CART, payload });
export const setPayment = (payload) => ({ type: SET_PAYMENT, payload });
export const setAddress = (payload) => ({ type: SET_ADDRESS, payload });

export const fetchRoles = () => async (dispatch, getState) => {
  if (getState().client.roles.length) return;
  try {
    const response = await api.get("/roles");
    dispatch(setRoles(response.data));
  } catch {
    toast.error("Roller yüklenemedi.");
  }
};

export const signupUser = (payload, history, fallback = "/") => async () => {
  try {
    await api.post("/signup", payload);
    toast.warn("You need to click link in email to activate your account!");
    history.push(fallback);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Kayıt işlemi başarısız.");
    throw error;
  }
};

export const loginUser = (payload, history, fallback = "/") => async (dispatch) => {
  try {
    const response = await api.post("/login", {
      email: payload.email,
      password: payload.password,
    });
    const token = response.data.token;
    if (payload.rememberMe) localStorage.setItem("token", token);
    setAuthToken(token);
    dispatch(setUser(response.data));
    toast.success("Giriş yapıldı.");
    history.push(fallback);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Giriş başarısız.");
    throw error;
  }
};

export const verifyToken = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    setAuthToken(token);
    const response = await api.get("/verify");
    const nextToken = response.data.token || token;
    localStorage.setItem("token", nextToken);
    setAuthToken(nextToken);
    dispatch(setUser(response.data));
  } catch {
    localStorage.removeItem("token");
    setAuthToken(null);
    dispatch(setUser(null));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  setAuthToken(null);
  dispatch(setUser(null));
  toast.info("Çıkış yapıldı.");
};

export const fetchCategories = () => async (dispatch, getState) => {
  if (getState().product.categories.length) return;
  try {
    const response = await api.get("/categories");
    dispatch(setCategories(response.data));
  } catch {
    toast.error("Kategoriler yüklenemedi.");
  }
};

export const fetchProducts = (params = {}) => async (dispatch, getState) => {
  const state = getState().product;
  const query = {
    limit: params.limit ?? state.limit,
    offset: params.offset ?? state.offset,
    category: params.category,
    sort: params.sort,
    filter: params.filter ?? state.filter,
  };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === "") delete query[key];
  });

  dispatch(setFetchState("FETCHING"));
  try {
    const response = await api.get("/products", { params: query });
    dispatch(setProductList(response.data.products || []));
    dispatch(setTotal(response.data.total || 0));
    dispatch(setFetchState("FETCHED"));
  } catch {
    dispatch(setFetchState("FAILED"));
    toast.error("Ürünler yüklenemedi.");
  }
};

export const fetchProductById = (productId) => async (dispatch) => {
  dispatch(setFetchState("FETCHING"));
  try {
    const response = await api.get(`/products/${productId}`);
    dispatch(setSelectedProduct(response.data));
    dispatch(setFetchState("FETCHED"));
  } catch {
    dispatch(setFetchState("FAILED"));
    toast.error("Ürün detayı yüklenemedi.");
  }
};

export const addToCart = (product) => (dispatch, getState) => {
  const cart = getState().shoppingCart.cart;
  const exists = cart.find((item) => item.product.id === product.id);
  const nextCart = exists
    ? cart.map((item) =>
        item.product.id === product.id ? { ...item, count: item.count + 1 } : item
      )
    : [...cart, { count: 1, checked: true, product }];
  dispatch(setCart(nextCart));
  toast.success("Ürün sepete eklendi.");
};

export const updateCartItem = (productId, updates) => (dispatch, getState) => {
  const nextCart = getState().shoppingCart.cart.map((item) =>
    item.product.id === productId ? { ...item, ...updates } : item
  );
  dispatch(setCart(nextCart.filter((item) => item.count > 0)));
};

export const removeCartItem = (productId) => (dispatch, getState) => {
  dispatch(setCart(getState().shoppingCart.cart.filter((item) => item.product.id !== productId)));
};

export const fetchAddressList = () => async (dispatch) => {
  try {
    const response = await api.get("/user/address");
    dispatch(setAddressList(response.data));
  } catch {
    toast.error("Adresler yüklenemedi.");
  }
};

export const saveAddress = (payload) => async (dispatch) => {
  try {
    await api[payload.id ? "put" : "post"]("/user/address", payload);
    toast.success("Adres kaydedildi.");
    dispatch(fetchAddressList());
  } catch {
    toast.error("Adres kaydedilemedi.");
  }
};

export const deleteAddress = (id) => async (dispatch) => {
  try {
    await api.delete(`/user/address/${id}`);
    toast.success("Adres silindi.");
    dispatch(fetchAddressList());
  } catch {
    toast.error("Adres silinemedi.");
  }
};

export const fetchCreditCards = () => async (dispatch) => {
  try {
    const response = await api.get("/user/card");
    dispatch(setCreditCards(response.data));
  } catch {
    toast.error("Kartlar yüklenemedi.");
  }
};

export const saveCreditCard = (payload) => async (dispatch) => {
  try {
    await api[payload.id ? "put" : "post"]("/user/card", payload);
    toast.success("Kart kaydedildi.");
    dispatch(fetchCreditCards());
  } catch {
    toast.error("Kart kaydedilemedi.");
  }
};

export const deleteCreditCard = (id) => async (dispatch) => {
  try {
    await api.delete(`/user/card/${id}`);
    toast.success("Kart silindi.");
    dispatch(fetchCreditCards());
  } catch {
    toast.error("Kart silinemedi.");
  }
};

export const createOrder = (payload, history) => async (dispatch) => {
  try {
    await api.post("/order", payload);
    dispatch(setCart([]));
    dispatch(setPayment({}));
    dispatch(setAddress({}));
    toast.success("Siparişiniz başarıyla oluşturuldu.");
    history.push("/orders");
  } catch {
    toast.error("Sipariş oluşturulamadı.");
  }
};
