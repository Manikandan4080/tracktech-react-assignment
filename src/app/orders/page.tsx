"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addOrder, deleteOrder } from "@/store/slices/orderSlice";
import { removeScheduledBlocksByOrderId } from "@/store/slices/scheduleBlockSlice";
import {
    selectUnits,
    selectLines,
    selectShifts,
    selectOrders,
} from "@/store/selectors";
import { Order } from "@/types/types";

const OrderCreation = () => {
    const dispatch = useAppDispatch();
    const units = useAppSelector(selectUnits);
    const lines = useAppSelector(selectLines);
    const shifts = useAppSelector(selectShifts);
    const orders = useAppSelector(selectOrders);

    const [formData, setFormData] = useState({
        orderNo: "",
        styleName: "",
        quantity: "",
        deliveryDate: "",
        unitId: "",
        assignedLines: [] as string[],
        shiftId: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newOrder: Order = {
            id: Date.now().toString(),
            orderNo: formData.orderNo || `ORD-${Date.now()}`,
            styleName: formData.styleName,
            quantity: Number.parseInt(formData.quantity),
            deliveryDate: formData.deliveryDate,
            unitId: formData.unitId,
            assignedLines: formData.assignedLines,
            shiftId: formData.shiftId,
        };

        dispatch(addOrder(newOrder));

        // Reset form
        setFormData({
            orderNo: "",
            styleName: "",
            quantity: "",
            deliveryDate: "",
            unitId: "",
            assignedLines: [],
            shiftId: "",
        });
    };

    const handleLineSelection = (lineId: string, checked: boolean) => {
        if (checked) {
            setFormData({
                ...formData,
                assignedLines: [...formData.assignedLines, lineId],
            });
        } else {
            setFormData({
                ...formData,
                assignedLines: formData.assignedLines.filter(
                    (id) => id !== lineId
                ),
            });
        }
    };

    const handleDelete = (orderId: string) => {
        dispatch(deleteOrder(orderId));
        dispatch(removeScheduledBlocksByOrderId(orderId));
    };

    const getUnitName = (unitId: string) => {
        const unit = units.find((u) => u.id === unitId);
        return unit?.name || "Unknown Unit";
    };

    const getLineName = (lineId: string) => {
        const line = lines.find((l) => l.id === lineId);
        return line?.name || "Unknown Line";
    };

    const getShiftName = (shiftId: string) => {
        const shift = shifts.find((s) => s.id === shiftId);
        return shift?.name || "Unknown Shift";
    };

    const availableLines = lines.filter(
        (line) => line.unitId === formData.unitId
    );

    return (
        <div className="w-full h-full flex flex-col gap-6 py-6 px-3 bg-gray-50 min-h-screen overflow-auto">
            <Card className="mt-16 md:mt-0">
                <CardHeader>
                    <CardTitle>Create New Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="orderNo" className="truncate">
                                    Order No (Optional)
                                </Label>
                                <Input
                                    id="orderNo"
                                    value={formData.orderNo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            orderNo: e.target.value,
                                        })
                                    }
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="styleName">Style Name</Label>
                                <Input
                                    id="styleName"
                                    value={formData.styleName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            styleName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            quantity: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="deliveryDate">
                                    Delivery Date
                                </Label>
                                <Input
                                    id="deliveryDate"
                                    type="date"
                                    value={formData.deliveryDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            deliveryDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex justify-between gap-3">
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select
                                        value={formData.unitId}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                unitId: value,
                                                assignedLines: [],
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a unit" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {units.map((unit) => (
                                                <SelectItem
                                                    key={unit.id}
                                                    value={unit.id}
                                                >
                                                    {unit.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="shift">Shift</Label>
                                    <Select
                                        value={formData.shiftId}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                shiftId: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a shift" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {shifts.map((shift) => (
                                                <SelectItem
                                                    key={shift.id}
                                                    value={shift.id}
                                                >
                                                    {shift.name} (
                                                    {shift.startTime} -{" "}
                                                    {shift.endTime})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {formData.unitId && (
                            <div>
                                <Label>Lines Required (Multi-select)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    {availableLines.map((line) => (
                                        <div
                                            key={line.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={line.id}
                                                checked={formData.assignedLines.includes(
                                                    line.id
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleLineSelection(
                                                        line.id,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={line.id}
                                                className="text-sm"
                                            >
                                                {line.name} (
                                                {line.dailyCapacity}/day)
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full cursor-pointer">
                            Create Order
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Created Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order No</TableHead>
                                <TableHead>Style Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Lines</TableHead>
                                <TableHead>Shift</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.orderNo}</TableCell>
                                    <TableCell>{order.styleName}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            order.deliveryDate
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {getUnitName(order.unitId)}
                                    </TableCell>
                                    <TableCell>
                                        {order.assignedLines
                                            .map((lineId) =>
                                                getLineName(lineId)
                                            )
                                            .join(", ")}
                                    </TableCell>
                                    <TableCell>
                                        {getShiftName(order.shiftId)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            className="cursor-pointer"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(order.id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderCreation;
