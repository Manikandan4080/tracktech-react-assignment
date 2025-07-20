import { Order } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface OrdersState {
  orders: Order[]
}

const initialState: OrdersState = {
  orders: [],
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload)
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((order) => order.id === action.payload.id)
      if (index !== -1) {
        state.orders[index] = action.payload
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((order) => order.id !== action.payload)
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
    },
  },
})

export const { addOrder, updateOrder, deleteOrder, setOrders } = ordersSlice.actions
export default ordersSlice.reducer
