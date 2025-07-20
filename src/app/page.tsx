"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Package,
    Factory,
    Clock,
    AlertTriangle,
    CheckCircle,
    Calendar,
    Users,
    Target,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import {
    selectLines,
    selectUnits,
    selectOrders,
    selectScheduledBlocks,
} from "@/store/selectors";

const AnalyticsDashboard = () => {
    const lines = useAppSelector(selectLines);
    const units = useAppSelector(selectUnits);
    const orders = useAppSelector(selectOrders);
    const scheduledBlocks = useAppSelector(selectScheduledBlocks);

    // Calculate key metrics
    const analytics = useMemo(() => {
        const totalOrders = orders.length;
        const totalQuantity = orders.reduce(
            (sum, order) => sum + order.quantity,
            0
        );
        const scheduledOrderIds = new Set(
            scheduledBlocks.map((block) => block.orderId)
        );
        const scheduledOrders = orders.filter((order) =>
            scheduledOrderIds.has(order.id)
        );
        const unscheduledOrders = orders.filter(
            (order) => !scheduledOrderIds.has(order.id)
        );

        // Calculate total capacity
        const totalDailyCapacity = lines.reduce(
            (sum, line) => sum + line.dailyCapacity,
            0
        );

        // Calculate utilization by line
        const lineUtilization = lines.map((line) => {
            const lineBlocks = scheduledBlocks.filter(
                (block) => block.lineId === line.id
            );
            const totalAllocated = lineBlocks.reduce(
                (sum, block) => sum + block.allocatedQuantity,
                0
            );
            const utilizationRate =
                line.dailyCapacity > 0
                    ? (totalAllocated / (line.dailyCapacity * 30)) * 100
                    : 0; // Assuming 30 days

            return {
                name: line.name,
                capacity: line.dailyCapacity,
                allocated: totalAllocated,
                utilization: Math.min(utilizationRate, 100),
                unit:
                    units.find((u) => u.id === line.unitId)?.name || "Unknown",
            };
        });

        // Calculate orders by status
        const ordersByStatus = [
            {
                name: "Scheduled",
                value: scheduledOrders.length,
                color: "#10B981",
            },
            {
                name: "Unscheduled",
                value: unscheduledOrders.length,
                color: "#F59E0B",
            },
        ];

        // Calculate delivery timeline
        const currentDate = new Date();
        const deliveryTimeline = orders
            .map((order) => {
                const deliveryDate = new Date(order.deliveryDate);
                const daysUntilDelivery = Math.ceil(
                    (deliveryDate.getTime() - currentDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                );

                return {
                    orderNo: order.orderNo,
                    styleName: order.styleName,
                    quantity: order.quantity,
                    daysUntilDelivery,
                    status: scheduledOrderIds.has(order.id)
                        ? "Scheduled"
                        : "Unscheduled",
                    isOverdue: daysUntilDelivery < 0,
                    isUrgent: daysUntilDelivery <= 7 && daysUntilDelivery >= 0,
                };
            })
            .sort((a, b) => a.daysUntilDelivery - b.daysUntilDelivery);

        // Calculate production by unit
        const productionByUnit = units.map((unit) => {
            const unitLines = lines.filter((line) => line.unitId === unit.id);
            const unitCapacity = unitLines.reduce(
                (sum, line) => sum + line.dailyCapacity,
                0
            );
            const unitBlocks = scheduledBlocks.filter((block) =>
                unitLines.some((line) => line.id === block.lineId)
            );
            const unitProduction = unitBlocks.reduce(
                (sum, block) => sum + block.allocatedQuantity,
                0
            );

            return {
                name: unit.name,
                capacity: unitCapacity,
                production: unitProduction,
                lines: unitLines.length,
                utilization:
                    unitCapacity > 0
                        ? (unitProduction / (unitCapacity * 30)) * 100
                        : 0,
            };
        });

        // Calculate weekly production trend (mock data for demonstration)
        const weeklyTrend = Array.from({ length: 8 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (7 - i) * 7);
            const weekStart = date.toISOString().split("T")[0];

            return {
                week: `Week ${i + 1}`,
                date: weekStart,
                planned: Math.floor(Math.random() * 5000) + 3000,
                actual: Math.floor(Math.random() * 4500) + 2500,
            };
        });

        return {
            totalOrders,
            totalQuantity,
            scheduledOrders: scheduledOrders.length,
            unscheduledOrders: unscheduledOrders.length,
            totalDailyCapacity,
            lineUtilization,
            ordersByStatus,
            deliveryTimeline,
            productionByUnit,
            weeklyTrend,
            overallUtilization:
                totalDailyCapacity > 0
                    ? (scheduledBlocks.reduce(
                          (sum, block) => sum + block.allocatedQuantity,
                          0
                      ) /
                          (totalDailyCapacity * 30)) *
                      100
                    : 0,
        };
    }, [lines, units, orders, scheduledBlocks]);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        trend,
        trendValue,
        color = "blue",
    }: {
        title: string;
        value: string | number;
        icon: React.ElementType;
        trend?: "up" | "down";
        trendValue?: string;
        color?: string;
    }) => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                        {trend && trendValue && (
                            <div
                                className={`flex items-center mt-1 text-sm ${
                                    trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {trend === "up" ? (
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 mr-1" />
                                )}
                                {trendValue}
                            </div>
                        )}
                    </div>
                    <Icon className={`w-8 h-8 text-${color}-600`} />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="w-full h-full flex flex-col gap-6 py-6 px-3 bg-gray-50 min-h-screen overflow-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Orders"
                    value={analytics.totalOrders}
                    icon={Package}
                    trend="up"
                    trendValue="+12%"
                    color="blue"
                />
                <StatCard
                    title="Total Quantity"
                    value={analytics.totalQuantity.toLocaleString()}
                    icon={Target}
                    trend="up"
                    trendValue="+8%"
                    color="green"
                />
                <StatCard
                    title="Scheduled Orders"
                    value={analytics.scheduledOrders}
                    icon={CheckCircle}
                    color="emerald"
                />
                <StatCard
                    title="Overall Utilization"
                    value={`${analytics.overallUtilization.toFixed(1)}%`}
                    icon={Factory}
                    trend={analytics.overallUtilization > 75 ? "up" : "down"}
                    trendValue={
                        analytics.overallUtilization > 75 ? "Optimal" : "Low"
                    }
                    color="purple"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Utilization Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Factory className="w-5 h-5" />
                            Line Utilization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.lineUtilization}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number | string, name: string) => [
                                        name === "utilization"
                                            ? `${Number(value).toFixed(1)}%`
                                            : value,
                                        name === "utilization"
                                            ? "Utilization"
                                            : "Capacity",
                                    ]}
                                />
                                <Bar dataKey="utilization" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Order Status Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Status Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.ordersByStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name} ${((percent || 0) * 100).toFixed(
                                            0
                                        )}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.ordersByStatus.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Weekly Production Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="planned"
                                    stackId="1"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stackId="2"
                                    stroke="#10B981"
                                    fill="#10B981"
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Unit Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Unit Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.productionByUnit.map((unit, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                            {unit.name}
                                        </span>
                                        <Badge
                                            variant={
                                                unit.utilization > 75
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {unit.utilization.toFixed(1)}%
                                        </Badge>
                                    </div>
                                    <Progress
                                        value={unit.utilization}
                                        className="h-2"
                                    />
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{unit.lines} lines</span>
                                        <span>
                                            {unit.production.toLocaleString()} /{" "}
                                            {(
                                                unit.capacity * 30
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delivery Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Delivery Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {analytics.deliveryTimeline
                            .slice(0, 10)
                            .map((order, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {order.orderNo}
                                            </span>
                                            <Badge
                                                variant={
                                                    order.status === "Scheduled"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                            {order.isOverdue && (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Overdue
                                                </Badge>
                                            )}
                                            {order.isUrgent &&
                                                !order.isOverdue && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-orange-500 text-orange-600"
                                                    >
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Urgent
                                                    </Badge>
                                                )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {order.styleName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {order.quantity.toLocaleString()}{" "}
                                            pcs
                                        </p>
                                        <p
                                            className={`text-sm ${
                                                order.isOverdue
                                                    ? "text-red-600"
                                                    : order.isUrgent
                                                    ? "text-orange-600"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {order.isOverdue
                                                ? `${Math.abs(
                                                      order.daysUntilDelivery
                                                  )} days overdue`
                                                : `${order.daysUntilDelivery} days left`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;