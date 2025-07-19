"use client"
import { useAppSelector } from "@/store/hooks"
import { useAppDispatch } from "@/store/hooks"
import { loadLines } from "@/store/slices/lineSlices"
import { loadOrders } from "@/store/slices/orderSlice"
import { loadShifts } from "@/store/slices/shiftSlices"
import { loadUnits } from "@/store/slices/unitSlice"
import { useEffect, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { Calendar, Clock, Factory, Package, TrendingUp, AlertCircle } from 'lucide-react'

  // Helper function to calculate shift duration
  const calculateShiftDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    let diff = end.getTime() - start.getTime()
    if (diff < 0) diff += 24 * 60 * 60 * 1000 // Handle overnight shifts
    return diff / (1000 * 60 * 60) // Convert to hours
  }

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function Home() {
  const dispatch = useAppDispatch()
  const units = useAppSelector(state => state.units.units)
  const lines = useAppSelector(state => state.lines.lines)
  const shifts = useAppSelector(state => state.shifts.shifts)
  const orders = useAppSelector(state => state.orders.orders)
  const scheduledOrders = useAppSelector(state => state.orders.scheduledOrders)

  useEffect(() => {
    // Load all data from localStorage on app initialization
    dispatch(loadUnits())
    dispatch(loadLines())
    dispatch(loadShifts())
    dispatch(loadOrders())
  }, [dispatch])

  // Calculate analytics
  const analytics = useMemo(() => {
    // Lines by unit
    const linesByUnit = units.map(unit => ({
      name: unit.name,
      lines: lines.filter(line => line.unitId === unit.id).length,
      id: unit.id
    }))

    // Total quantity by style name (using styleName instead of product)
    const styleQuantity = orders.reduce<Array<{style: string, quantity: number, orders: number}>>((acc, order) => {
      const existing = acc.find(item => item.style === order.styleName)
      if (existing) {
        existing.quantity += order.quantity
        existing.orders += 1
      } else {
        acc.push({
          style: order.styleName,
          quantity: order.quantity,
          orders: 1
        })
      }
      return acc
    }, [])

    // Orders by unit
    const ordersByUnit = units.map(unit => ({
      name: unit.name,
      orders: orders.filter(order => order.unitId === unit.id).length,
      quantity: orders.filter(order => order.unitId === unit.id)
        .reduce((sum, order) => sum + order.quantity, 0)
    }))

    // Scheduled vs unscheduled orders
    const schedulingData = [
      { name: 'Scheduled', value: scheduledOrders.length },
      { name: 'Unscheduled', value: orders.length - scheduledOrders.length }
    ]

    // Shifts distribution
    const shiftsData = shifts.map(shift => ({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      duration: calculateShiftDuration(shift.startTime, shift.endTime)
    }))

    // Monthly delivery distribution (based on deliveryDate)
    const deliveryByMonth = orders.reduce<Record<string, number>>((acc, order) => {
      const month = new Date(order.deliveryDate).toLocaleString('default', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    return {
      linesByUnit,
      ordersByUnit,
      styleQuantity: styleQuantity.sort((a, b) => b.quantity - a.quantity).slice(0, 10),
      schedulingData,
      shiftsData,
      deliveryByMonth: Object.entries(deliveryByMonth).map(([month, count]) => ({ month, count }))
    }
  }, [units, lines, shifts, orders, scheduledOrders])

  // Key metrics
  const metrics = {
    totalUnits: units.length,
    totalLines: lines.length,
    totalOrders: orders.length,
    scheduledOrders: scheduledOrders.length,
    totalShifts: shifts.length,
    avgLinesPerUnit: units.length > 0 ? (lines.length / units.length).toFixed(1) : 0
  }

  return (
    <div className="w-full h-full p-6 bg-gray-50 min-h-screen overflow-auto">
      <div className="max-w-7xl mx-auto py-16 md:py-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Production Dashboard</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalUnits}</p>
              </div>
              <Factory className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lines</p>
                <p className="text-2xl font-bold text-green-600">{metrics.totalLines}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.scheduledOrders}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-indigo-600">{metrics.totalShifts}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Lines/Unit</p>
                <p className="text-2xl font-bold text-teal-600">{metrics.avgLinesPerUnit}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Orders by Unit */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Orders by Unit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ordersByUnit}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Distribution by Month */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Deliveries by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.deliveryByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Lines per Unit */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Lines per Unit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.linesByUnit}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lines" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scheduling Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Order Scheduling Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.schedulingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {analytics.schedulingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Large Charts */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Style Quantities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Top Styles by Quantity</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.styleQuantity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="style" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="quantity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quantity by Unit and Shift Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Total Quantity by Unit</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.ordersByUnit}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Shift Durations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.shiftsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Duration']} />
                  <Bar dataKey="duration" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Production Capacity:</p>
              <p className="text-gray-600">{metrics.totalUnits} units with {metrics.totalLines} production lines</p>
            </div>
            <div>
              <p className="font-medium">Order Management:</p>
              <p className="text-gray-600">{metrics.totalOrders} orders, {metrics.scheduledOrders} scheduled ({((metrics.scheduledOrders / Math.max(metrics.totalOrders, 1)) * 100).toFixed(1)}%)</p>
            </div>
            <div>
              <p className="font-medium">Shift Planning:</p>
              <p className="text-gray-600">{metrics.totalShifts} shifts configured across all units</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}