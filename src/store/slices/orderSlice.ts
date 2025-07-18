import { Order, OrdersState, ScheduledOrder } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"


const initialState: OrdersState = {
  orders: [],
  scheduledOrders: [],
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
      state.scheduledOrders = state.scheduledOrders.filter((order) => order.id !== action.payload)
    },
    scheduleOrder: (state, action: PayloadAction<{ orderId: string; lineId: string; date: string }>) => {
      const orderToSchedule = state.orders.find((order) => order.id === action.payload.orderId)
      if (!orderToSchedule) return

      const scheduledOrder: ScheduledOrder = {
        ...orderToSchedule,
        scheduledDate: action.payload.date,
        scheduledLineId: action.payload.lineId,
      }

      // Remove existing scheduled version if any
      state.scheduledOrders = state.scheduledOrders.filter((order) => order.id !== action.payload.orderId)
      // Add new scheduled version
      state.scheduledOrders.push(scheduledOrder)
    },
    unscheduleOrder: (state, action: PayloadAction<string>) => {
      state.scheduledOrders = state.scheduledOrders.filter((order) => order.id !== action.payload)
    },
  },
})

export const { addOrder, updateOrder, deleteOrder, scheduleOrder, unscheduleOrder } = ordersSlice.actions
export default ordersSlice.reducer
