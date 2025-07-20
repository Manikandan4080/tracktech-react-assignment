"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Factory,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    addScheduledBlocks,
    moveOrderBlock,
} from "@/store/slices/scheduleBlockSlice";
import {
    selectLines,
    selectUnits,
    selectOrders,
    selectScheduledBlocks,
} from "@/store/selectors";
import { ScheduledBlock } from "@/types/types";

const SchedulerCalendar = () => {
    const dispatch = useAppDispatch();
    const lines = useAppSelector(selectLines);
    const units = useAppSelector(selectUnits);
    const orders = useAppSelector(selectOrders);
    const scheduledBlocks = useAppSelector(selectScheduledBlocks);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedLineId, setSelectedLineId] = useState<string>("");
    const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

    // Memoize unscheduled orders to prevent unnecessary recalculations
    const [processedOrderIds, setProcessedOrderIds] = useState<Set<string>>(
        new Set()
    );

    // Memoize color palette to prevent recreation on every render
    const colorPalette = useMemo(() => [
        {
            bg: "bg-blue-100",
            border: "border-blue-300",
            text: "text-blue-700",
            textSecondary: "text-blue-600",
        },
        {
            bg: "bg-green-100",
            border: "border-green-300",
            text: "text-green-700",
            textSecondary: "text-green-600",
        },
        {
            bg: "bg-purple-100",
            border: "border-purple-300",
            text: "text-purple-700",
            textSecondary: "text-purple-600",
        },
        {
            bg: "bg-orange-100",
            border: "border-orange-300",
            text: "text-orange-700",
            textSecondary: "text-orange-600",
        },
        {
            bg: "bg-pink-100",
            border: "border-pink-300",
            text: "text-pink-700",
            textSecondary: "text-pink-600",
        },
        {
            bg: "bg-indigo-100",
            border: "border-indigo-300",
            text: "text-indigo-700",
            textSecondary: "text-indigo-600",
        },
        {
            bg: "bg-red-100",
            border: "border-red-300",
            text: "text-red-700",
            textSecondary: "text-red-600",
        },
        {
            bg: "bg-yellow-100",
            border: "border-yellow-300",
            text: "text-yellow-700",
            textSecondary: "text-yellow-600",
        },
        {
            bg: "bg-teal-100",
            border: "border-teal-300",
            text: "text-teal-700",
            textSecondary: "text-teal-600",
        },
        {
            bg: "bg-cyan-100",
            border: "border-cyan-300",
            text: "text-cyan-700",
            textSecondary: "text-cyan-600",
        },
        {
            bg: "bg-emerald-100",
            border: "border-emerald-300",
            text: "text-emerald-700",
            textSecondary: "text-emerald-600",
        },
        {
            bg: "bg-violet-100",
            border: "border-violet-300",
            text: "text-violet-700",
            textSecondary: "text-violet-600",
        },
    ], []);

    // Create a stable color mapping for orders
    const orderColorMap = useMemo(() => {
        const map = new Map<string, (typeof colorPalette)[0]>();
        const uniqueOrderIds = Array.from(
            new Set(scheduledBlocks.map((block) => block.orderId))
        );

        uniqueOrderIds.forEach((orderId, index) => {
            map.set(orderId, colorPalette[index % colorPalette.length]);
        });

        return map;
    }, [scheduledBlocks, colorPalette]);

    // Function to get color for a specific order
    const getOrderColor = useCallback(
        (orderId: string) => {
            return orderColorMap.get(orderId) || colorPalette[0];
        },
        [orderColorMap, colorPalette]
    );

    // Update the unscheduledOrders to exclude already processed ones
    const unscheduledOrders = useMemo(() => {
        const scheduledOrderIds = new Set(
            scheduledBlocks.map((block) => block.orderId)
        );
        return orders.filter(
            (order) =>
                !scheduledOrderIds.has(order.id) &&
                !processedOrderIds.has(order.id)
        );
    }, [orders, scheduledBlocks, processedOrderIds]);

    // Reset processed orders when orders are deleted
    useEffect(() => {
        const currentOrderIds = new Set(orders.map((order) => order.id));
        const updatedProcessedIds = new Set(
            Array.from(processedOrderIds).filter((id) =>
                currentOrderIds.has(id)
            )
        );
        if (updatedProcessedIds.size !== processedOrderIds.size) {
            setProcessedOrderIds(updatedProcessedIds);
        }
    }, [orders, processedOrderIds]);

    // Set default selected line
    useEffect(() => {
        if (!selectedLineId && lines.length > 0) {
            setSelectedLineId(lines[0].id);
        }
    }, [lines, selectedLineId]);

    // Generate calendar days for the current month
    const generateCalendarDays = useCallback(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentDate]);

    const calendarDays = generateCalendarDays();

    // Auto-schedule orders when they are created (with duplicate prevention)
    useEffect(() => {
        if (unscheduledOrders.length === 0) return;

        const newBlocks: ScheduledBlock[] = [];

        unscheduledOrders.forEach((order) => {
            // Double-check that this order doesn't already have scheduled blocks
            const existingBlocks = scheduledBlocks.filter(
                (block) => block.orderId === order.id
            );
            if (existingBlocks.length > 0) {
                return; // Skip if already scheduled
            }

            const totalCapacityPerDay = order.assignedLines.reduce(
                (total, lineId) => {
                    const line = lines.find((l) => l.id === lineId);
                    return total + (line?.dailyCapacity || 0);
                },
                0
            );

            if (totalCapacityPerDay > 0) {
                const requiredDays = Math.ceil(
                    order.quantity / totalCapacityPerDay
                );
                const startDate = new Date();

                for (let day = 0; day < requiredDays; day++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + day);

                    order.assignedLines.forEach((lineId) => {
                        const line = lines.find((l) => l.id === lineId);
                        if (line) {
                            const remainingQuantity =
                                order.quantity -
                                newBlocks
                                    .filter((b) => b.orderId === order.id)
                                    .reduce(
                                        (sum, b) => sum + b.allocatedQuantity,
                                        0
                                    );

                            if (remainingQuantity > 0) {
                                const allocatedQuantity = Math.min(
                                    line.dailyCapacity,
                                    remainingQuantity
                                );

                                // Create unique block ID with timestamp and random component
                                const blockId = `${order.id}-${lineId}-${
                                    currentDate.toISOString().split("T")[0]
                                }-${Date.now()}-${Math.random()
                                    .toString(36)
                                    .substr(2, 9)}`;

                                // Check if a similar block already exists in newBlocks
                                const duplicateExists = newBlocks.some(
                                    (block) =>
                                        block.orderId === order.id &&
                                        block.lineId === lineId &&
                                        block.date ===
                                            currentDate
                                                .toISOString()
                                                .split("T")[0]
                                );

                                if (!duplicateExists) {
                                    newBlocks.push({
                                        blockId,
                                        orderId: order.id,
                                        lineId: lineId,
                                        date: currentDate
                                            .toISOString()
                                            .split("T")[0],
                                        allocatedQuantity,
                                        styleName: order.styleName,
                                        orderNo: order.orderNo,
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });

        if (newBlocks.length > 0) {
            dispatch(addScheduledBlocks(newBlocks));

            // Mark these orders as processed
            const newProcessedIds = new Set(processedOrderIds);
            unscheduledOrders.forEach((order) => {
                newProcessedIds.add(order.id);
            });
            setProcessedOrderIds(newProcessedIds);
        }
    }, [
        unscheduledOrders,
        lines,
        dispatch,
        scheduledBlocks,
        processedOrderIds,
    ]);

    const navigateMonth = useCallback((direction: "prev" | "next") => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (direction === "prev") {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    }, []);

    const getBlocksForDate = useCallback(
        (date: string) => {
            return scheduledBlocks.filter(
                (block) =>
                    block.lineId === selectedLineId && block.date === date
            );
        },
        [scheduledBlocks, selectedLineId]
    );

    const getCapacityUsage = useCallback(
        (date: string) => {
            const blocks = getBlocksForDate(date);
            const usedCapacity = blocks.reduce(
                (sum, block) => sum + block.allocatedQuantity,
                0
            );
            const line = lines.find((l) => l.id === selectedLineId);
            const totalCapacity = line?.dailyCapacity || 0;
            return { used: usedCapacity, total: totalCapacity };
        },
        [getBlocksForDate, lines, selectedLineId]
    );

    const isWeekend = useCallback((date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    }, []);

    const handleDragStart = useCallback(
        (e: React.DragEvent, blockId: string) => {
            setDraggedBlock(blockId);
            e.dataTransfer.effectAllowed = "move";
            e.stopPropagation();
        },
        []
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, date: string) => {
            e.preventDefault();
            e.stopPropagation();
            if (draggedBlock && selectedLineId) {
                dispatch(
                    moveOrderBlock({
                        blockId: draggedBlock,
                        newLineId: selectedLineId,
                        newDate: date,
                    })
                );
                setDraggedBlock(null);
            }
        },
        [draggedBlock, selectedLineId, dispatch]
    );

    const formatDate = useCallback((date: Date) => {
        return date.toISOString().split("T")[0];
    }, []);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const selectedLine = useMemo(() => {
        return lines.find((line) => line.id === selectedLineId);
    }, [lines, selectedLineId]);

    const getUnitName = useCallback(
        (unitId: string) => {
            const unit = units.find((u) => u.id === unitId);
            return unit?.name || "Unknown Unit";
        },
        [units]
    );

    return (
        <div className="w-full h-full p-4 md:p-6 bg-gray-50 min-h-screen overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mt-18 md:mt-0">
                {/* Left Sidebar - Production Lines */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                <Factory className="w-4 h-4 md:w-5 md:h-5" />
                                Production Lines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {lines.map((line) => (
                                <Button
                                    key={line.id}
                                    variant={
                                        selectedLineId === line.id
                                            ? "default"
                                            : "outline"
                                    }
                                    className="w-full justify-start h-auto p-2 md:p-3 cursor-pointer"
                                    onClick={() => setSelectedLineId(line.id)}
                                >
                                    <div className="text-left">
                                        <div className="font-medium text-sm md:text-base">
                                            {line.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {getUnitName(line.unitId)} •{" "}
                                            {line.dailyCapacity}/day
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Selected Line Info */}
                    {selectedLine && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-base md:text-lg">
                                    Line Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm md:text-base">
                                    <div>
                                        <span className="font-medium">
                                            Name:
                                        </span>{" "}
                                        {selectedLine.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Unit:
                                        </span>{" "}
                                        {getUnitName(selectedLine.unitId)}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Daily Capacity:
                                        </span>{" "}
                                        {selectedLine.dailyCapacity} pieces
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Color Legend */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="text-base md:text-lg">
                                Order Colors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {Array.from(orderColorMap.entries()).map(
                                    ([orderId, colors]) => {
                                        const order = orders.find(
                                            (o) => o.id === orderId
                                        );
                                        return (
                                            <div
                                                key={orderId}
                                                className="flex items-center gap-2"
                                            >
                                                <div
                                                    className={`w-4 h-4 ${colors.bg} ${colors.border} border rounded`}
                                                ></div>
                                                <span className="text-xs truncate">
                                                    {order?.orderNo ||
                                                        `Order ${orderId.slice(
                                                            0,
                                                            8
                                                        )}`}
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side - Calendar */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <CardTitle className="text-base md:text-lg">
                                Schedule for {selectedLine?.name} -{" "}
                                {monthNames[currentDate.getMonth()]}{" "}
                                {currentDate.getFullYear()}
                            </CardTitle>
                            <div className="flex space-x-2">
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateMonth("prev")}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateMonth("next")}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Calendar Grid with horizontal scroll */}
                            <div className="overflow-x-auto">
                                <div className="min-w-[700px]">
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Day headers */}
                                        {dayNames.map((day) => (
                                            <div
                                                key={day}
                                                className="p-2 text-center font-medium text-sm bg-muted rounded min-w-[100px]"
                                            >
                                                {day}
                                            </div>
                                        ))}

                                        {/* Calendar days */}
                                        {calendarDays.map((date, index) => {
                                            if (!date) {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="p-2 h-24 min-w-[100px]"
                                                    ></div>
                                                );
                                            }

                                            const dateStr = formatDate(date);
                                            const blocks =
                                                getBlocksForDate(dateStr);
                                            const capacity =
                                                getCapacityUsage(dateStr);
                                            const isOverbooked =
                                                capacity.used > capacity.total;
                                            const weekend = isWeekend(date);

                                            return (
                                                <div
                                                    key={dateStr}
                                                    className={`min-h-[96px] min-w-[100px] p-2 border rounded relative ${
                                                        weekend
                                                            ? "bg-yellow-50"
                                                            : "bg-white"
                                                    } ${
                                                        isOverbooked
                                                            ? "bg-red-50 border-red-200"
                                                            : "border-gray-200"
                                                    }`}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) =>
                                                        handleDrop(e, dateStr)
                                                    }
                                                >
                                                    {/* Date number */}
                                                    <div className="font-medium text-sm mb-1">
                                                        {date.getDate()}
                                                    </div>

                                                    {/* Capacity indicator */}
                                                    <div className="text-xs text-muted-foreground mb-1 flex items-center">
                                                        {capacity.used}/
                                                        {capacity.total}
                                                        {isOverbooked && (
                                                            <AlertTriangle className="w-3 h-3 text-red-500 ml-1" />
                                                        )}
                                                    </div>

                                                    {/* Scheduled blocks with different colors */}
                                                    <div className="space-y-1">
                                                        {blocks.map((block) => {
                                                            const colors =
                                                                getOrderColor(
                                                                    block.orderId
                                                                );
                                                            return (
                                                                <div
                                                                    key={
                                                                        block.blockId
                                                                    }
                                                                    className={`${colors.bg} border ${colors.border} rounded p-1 cursor-move text-xs transition-all hover:shadow-sm`}
                                                                    draggable
                                                                    onDragStart={(
                                                                        e
                                                                    ) =>
                                                                        handleDragStart(
                                                                            e,
                                                                            block.blockId
                                                                        )
                                                                    }
                                                                >
                                                                    <div
                                                                        className={`font-medium truncate ${colors.text}`}
                                                                    >
                                                                        {
                                                                            block.styleName
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`${colors.text}`}
                                                                    >
                                                                        Qty:{" "}
                                                                        {
                                                                            block.allocatedQuantity
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`truncate ${colors.textSecondary}`}
                                                                    >
                                                                        {
                                                                            block.orderNo
                                                                        }
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                                    <span>
                                        Scheduled Orders (Various Colors)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                                    <span>Weekend</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                                    <span>Overbooked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span>Capacity Exceeded</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SchedulerCalendar;