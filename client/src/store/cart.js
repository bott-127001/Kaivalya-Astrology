import { create } from 'zustand'
import { API_ENDPOINTS } from '../config/api'

const useCart = create(set => ({
  items: [],
  lastAddedId: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API_ENDPOINTS.CART, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch cart')
      const data = await res.json()
      set({ items: data.cart || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addToCart: async (product, quantity = 1) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API_ENDPOINTS.CART_ADD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId: product._id || product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity
        })
      })
      if (!res.ok) throw new Error('Failed to add to cart')
      const data = await res.json()
      set({ items: data.cart, lastAddedId: product._id || product.id, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  removeFromCart: async id => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API_ENDPOINTS.CART_REMOVE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: id })
      })
      if (!res.ok) throw new Error('Failed to remove from cart')
      const data = await res.json()
      set({ items: data.cart, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  updateQuantity: async (id, quantity) => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API_ENDPOINTS.CART_UPDATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: id, quantity })
      })
      if (!res.ok) throw new Error('Failed to update cart')
      const data = await res.json()
      set({ items: data.cart, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API_ENDPOINTS.CART_CLEAR, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to clear cart')
      set({ items: [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  clearLastAdded: () => set({ lastAddedId: null })
}))

export default useCart 