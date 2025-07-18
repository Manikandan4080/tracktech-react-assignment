"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    Package,
} from "lucide-react";
import { Order } from "@/types/types";
import { scheduleOrder, unscheduleOrder } from "@/store/slices/orderSlice";

const SchedulerCalendar = () => {
    const dispatch = useAppDispatch();
    const orders = useAppSelector((state) => state.orders.orders);
    const scheduledOrders = useAppSelector(
        (state) => state.orders.scheduledOrders
    );
    const lines = useAppSelector((state) => state.lines.lines);
    const units = useAppSelector((state) => state.units.units);
    const shifts = useAppSelector((state) => state.shifts.shifts);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure client-side rendering for dates
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Generate dates for the current week
    const getWeekDates = (date: Date) => {
        const week = [];
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const weekDates = getWeekDates(currentDate);

    const navigateWeek = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        newDate.setDate(
            currentDate.getDate() + (direction === "next" ? 7 : -7)
        );
        setCurrentDate(newDate);
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    // Consistent date formatting function
    const formatDisplayDate = (date: Date) => {
        if (!isClient) return "";
        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric"
        });
    };

    // Consistent weekday formatting function
    const formatWeekday = (date: Date) => {
        if (!isClient) return "";
        return date.toLocaleDateString("en-US", {
            weekday: "short",
        });
    };

    const getScheduledOrdersForLineAndDate = (lineId: string, date: string) => {
        return scheduledOrders.filter(
            (order) =>
                order.scheduledLineId === lineId && order.scheduledDate === date
        );
    };

    const getUnscheduledOrders = () => {
        const scheduledOrderIds = scheduledOrders.map((order) => order.id);
        return orders.filter((order) => !scheduledOrderIds.includes(order.id));
    };

    const handleDragStart = (order: Order) => {
        setDraggedOrder(order);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, lineId: string, date: string) => {
        e.preventDefault();
        if (draggedOrder) {
            dispatch(
                scheduleOrder({
                    orderId: draggedOrder.id,
                    lineId,
                    date,
                })
            );
            setDraggedOrder(null);
        }
    };

    const handleUnschedule = (orderId: string) => {
        dispatch(unscheduleOrder(orderId));
    };

    const getUnitName = (unitId: string) => {
        const unit = units.find((u) => u.id === unitId);
        return unit?.name || "Unknown Unit";
    };

    const getShiftName = (shiftId: string) => {
        const shift = shifts.find((s) => s.id === shiftId);
        return shift?.name || "Unknown Shift";
    };

    const hasConflict = (lineId: string, date: string) => {
        const ordersOnDate = getScheduledOrdersForLineAndDate(lineId, date);
        return ordersOnDate.length > 1;
    };

    // Show loading state during hydration
    if (!isClient) {
        return (
            <div className="w-full h-hull p-3 py-6 flex flex-col gap-3">
                <div className="animate-pulse">
                    <Card>
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-hull p-3 py-6 flex flex-col gap-3">
            {/* Unscheduled Orders */}
            <Card className="">
                <CardHeader>
                    <CardTitle className="flex items-center ">
                        <Package className="w-5 h-5" />
                        Unscheduled Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap ">
                        {getUnscheduledOrders().map((order) => (
                            <div
                                key={order.id}
                                draggable
                                onDragStart={() => handleDragStart(order)}
                                className="p-3 bg-blue-100 border border-blue-300 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
                            >
                                <div className="font-medium">
                                    {order.orderNo}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {order.styleName}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Qty: {order.quantity}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Due: {order.deliveryDate}
                                </div>
                            </div>
                        ))}
                        {getUnscheduledOrders().length === 0 && (
                            <p className="text-gray-500">
                                All orders are scheduled
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Calendar Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Production Schedule
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek("prev")}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="font-medium">
                                {formatDisplayDate(weekDates[0])} -{" "}
                                {formatDisplayDate(weekDates[6])}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateWeek("next")}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Calendar Grid */}
                    <div className="overflow-x-auto">
                        {lines.length === 0 ? (
                                <div className="text-center text-gray-500 py-10 col-span-8">
                                    No lines available.
                                </div>
                            ) : <div className="min-w-[800px]">
                            {/* Header Row */}
                            <div className="grid grid-cols-8 gap-1 mb-2">
                                <div className="p-2 font-medium">Line</div>
                                {weekDates.map((date) => (
                                    <div
                                        key={date.toISOString()}
                                        className="p-2 text-center font-medium bg-gray-50 rounded"
                                    >
                                        <div>
                                            {formatWeekday(date)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {date.getDate()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Line Rows */}
                            {lines.length === 0 ? (
                                <div className="text-center text-gray-500 py-10 col-span-8">
                                    No lines available.
                                </div>
                            ) : (
                                lines.map((line) => (
                                    <div
                                        key={line.id}
                                        className="grid grid-cols-8 gap-1 mb-2"
                                    >
                                        <div className="p-2 bg-gray-50 rounded flex flex-col">
                                            <div className="font-medium">
                                                {line.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {getUnitName(line.unitId)}
                                            </div>
                                        </div>
                                        {weekDates.map((date) => {
                                            const dateStr = formatDate(date);
                                            const scheduledOrdersForDate =
                                                getScheduledOrdersForLineAndDate(
                                                    line.id,
                                                    dateStr
                                                );
                                            const hasConflictOnDate =
                                                hasConflict(line.id, dateStr);

                                            return (
                                                <div
                                                    key={dateStr}
                                                    className={`p-2 min-h-[80px] border-2 border-dashed border-gray-200 rounded hover:border-gray-300 transition-colors ${
                                                        hasConflictOnDate
                                                            ? "bg-red-50 border-red-300"
                                                            : ""
                                                    }`}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) =>
                                                        handleDrop(
                                                            e,
                                                            line.id,
                                                            dateStr
                                                        )
                                                    }
                                                >
                                                    {scheduledOrdersForDate.map(
                                                        (order) => (
                                                            <div
                                                                key={order.id}
                                                                className={`p-2 mb-1 rounded text-xs cursor-pointer ${
                                                                    hasConflictOnDate
                                                                        ? "bg-red-200 border border-red-400"
                                                                        : "bg-green-200 border border-green-400"
                                                                }`}
                                                                onClick={() =>
                                                                    handleUnschedule(
                                                                        order.id
                                                                    )
                                                                }
                                                                title="Click to unschedule"
                                                            >
                                                                <div className="font-medium">
                                                                    {
                                                                        order.orderNo
                                                                    }
                                                                </div>
                                                                <div className="truncate">
                                                                    {
                                                                        order.styleName
                                                                    }
                                                                </div>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>
                                                                        {getShiftName(
                                                                            order.shiftId
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {hasConflictOnDate && (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="text-xs mt-1"
                                                                    >
                                                                        Conflict!
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>}
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                            <span>Unscheduled Order</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                            <span>Scheduled Order</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                            <span>Scheduling Conflict</span>
                        </div>
                        <div className="text-gray-600">
                            • Drag orders from unscheduled to calendar slots
                        </div>
                        <div className="text-gray-600">
                            • Click scheduled orders to unschedule them
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SchedulerCalendar;