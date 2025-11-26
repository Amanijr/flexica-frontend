import { apiRequest } from './apiGateway';

export interface CartItemDto {
  productId: number;
  quantity: number;
}

export async function addToCart(items: CartItemDto[]) {
  return apiRequest('/cart/addToCart', {
    method: 'POST',
    data: { cartItemsDtos: items },
  });
}

export async function removeFromCart(productId: number) {
  try {
    return await apiRequest('/cart/removeFromCart', {
      method: 'DELETE',
      data: { productId },
    });
  } catch (err: any) {
    // Backend may not support removal endpoint; fallback to refresh cart
    console.warn('removeFromCart failed, refreshing cart instead', err?.message || err);
    await viewMyCart();
    throw err;
  }
}

export async function clearCart() {
  try {
    return await apiRequest('/cart/clearCart', {
      method: 'DELETE',
    });
  } catch (err: any) {
    // Backend may not have clearCart endpoint; fallback to returning current cart
    console.warn('clearCart failed, refreshing cart instead', err?.message || err);
    return await viewMyCart();
  }
}

export async function viewMyCart() {
  return apiRequest('/cart/viewMyCart', {
    method: 'GET',
  });
}

export async function fetchProduct(productId: number) {
  return apiRequest(`/product/public/fetchOneProduct/${productId}`, {
    method: 'GET',
  });
}

export default {
  addToCart,
  removeFromCart,
  clearCart,
  viewMyCart,
  fetchProduct,
};
