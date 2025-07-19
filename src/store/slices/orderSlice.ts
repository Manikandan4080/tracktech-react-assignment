import { Order } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Extended Order type for scheduling
interface ScheduledOrder extends Order {
  scheduledDate?: string
  scheduledLineId?: string
}

interface OrdersState {
  orders: Order[]
  scheduledOrders: ScheduledOrder[]
}

// Helper functions for localStorage
const loadOrdersFromStorage = (): Order[] => {
  try {
    const stored = localStorage.getItem('orders')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading orders from localStorage:', error)
    return []
  }
}

const loadScheduledOrdersFromStorage = (): ScheduledOrder[] => {
  try {
    const stored = localStorage.getItem('scheduledOrders')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading scheduled orders from localStorage:', error)
    return []
  }
}

const saveOrdersToStorage = (orders: Order[]) => {
  try {
    localStorage.setItem('orders', JSON.stringify(orders))
  } catch (error) {
    console.error('Error saving orders to localStorage:', error)
  }
}

const saveScheduledOrdersToStorage = (scheduledOrders: ScheduledOrder[]) => {
  try {
    localStorage.setItem('scheduledOrders', JSON.stringify(scheduledOrders))
  } catch (error) {
    console.error('Error saving scheduled orders to localStorage:', error)
  }
}

const initialState: OrdersState = {
  orders: loadOrdersFromStorage(),
  scheduledOrders: loadScheduledOrdersFromStorage(),
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload)
      saveOrdersToStorage(state.orders)
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((order) => order.id === action.payload.id)
      if (index !== -1) {
        state.orders[index] = action.payload
        saveOrdersToStorage(state.orders)
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((order) => order.id !== action.payload)
      // Also remove from scheduled orders
      state.scheduledOrders = state.scheduledOrders.filter((order) => order.id !== action.payload)
      saveOrdersToStorage(state.orders)
      saveScheduledOrdersToStorage(state.scheduledOrders)
    },
    scheduleOrder: (state, action: PayloadAction<{orderId: string, lineId: string, date: string}>) => {
      const { orderId, lineId, date } = action.payload
      const order = state.orders.find(o => o.id === orderId)
      
      if (order) {
        // Remove existing schedule for this order
        state.scheduledOrders = state.scheduledOrders.filter(so => so.id !== orderId)
        
        // Add new schedule
        const scheduledOrder: ScheduledOrder = {
          ...order,
          scheduledDate: date,
          scheduledLineId: lineId
        }
        state.scheduledOrders.push(scheduledOrder)
        saveScheduledOrdersToStorage(state.scheduledOrders)
      }
    },
    unscheduleOrder: (state, action: PayloadAction<string>) => {
      state.scheduledOrders = state.scheduledOrders.filter(order => order.id !== action.payload)
      saveScheduledOrdersToStorage(state.scheduledOrders)
    },
    loadOrders: (state) => {
      state.orders = loadOrdersFromStorage()
      state.scheduledOrders = loadScheduledOrdersFromStorage()
    },
  },
})

export const { addOrder, updateOrder, deleteOrder, scheduleOrder, unscheduleOrder, loadOrders } = ordersSlice.actions
export default ordersSlice.reducer