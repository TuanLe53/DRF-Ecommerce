export const createCartSlice = (set) => ({
    cartItems: [],
    setCartItems: (cartItems) => set({ cartItems }),
    removeItem: (item_id) => set(state => ({
        cartItems: state.cartItems.filter(item => item.id !== item_id)
    }))
})