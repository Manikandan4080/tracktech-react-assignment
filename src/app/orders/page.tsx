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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Plus, Trash2 } from "lucide-react";
import { Order } from "@/types/types";
import { addOrder, deleteOrder } from "@/store/slices/orderSlice";

const OrderCreation = () => {
    const dispatch = useAppDispatch();
    const orders = useAppSelector((state) => state.orders.orders);
    const units = useAppSelector((state) => state.units.units);
    const lines = useAppSelector((state) => state.lines.lines);
    const shifts = useAppSelector((state) => state.shifts.shifts);

    const [formData, setFormData] = useState({
        orderNo: "",
        styleName: "",
        quantity: "",
        deliveryDate: "",
        unitId: "",
        lineIds: [] as string[],
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
            lineIds: formData.lineIds,
            shiftId: formData.shiftId,
        };

        dispatch(addOrder(newOrder));

        setFormData({
            orderNo: "",
            styleName: "",
            quantity: "",
            deliveryDate: "",
            unitId: "",
            lineIds: [],
            shiftId: "",
        });
    };

    const handleLineToggle = (lineId: string) => {
        setFormData((prev) => ({
            ...prev,
            lineIds: prev.lineIds.includes(lineId)
                ? prev.lineIds.filter((id) => id !== lineId)
                : [...prev.lineIds, lineId],
        }));
    };

    const handleDelete = (id: string) => {
        dispatch(deleteOrder(id));
    };

    const getUnitName = (unitId: string) => {
        const unit = units.find((u) => u.id === unitId);
        return unit?.name || "Unknown Unit";
    };

    const getLineNames = (lineIds: string[]) => {
        return lineIds
            .map((id) => {
                const line = lines.find((l) => l.id === id);
                return line?.name || "Unknown Line";
            })
            .join(", ");
    };

    const getShiftName = (shiftId: string) => {
        const shift = shifts.find((s) => s.id === shiftId);
        return shift?.name || "Unknown Shift";
    };

    const availableLines = lines.filter(
        (line) => line.unitId === formData.unitId
    );

    return (
        <div className="w-full h-hull p-3 py-6 flex flex-col gap-3">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="orderNo">Order No</Label>
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
                                <Label htmlFor="styleName">Style Name *</Label>
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
                                <Label htmlFor="quantity">Quantity *</Label>
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
                                    Delivery Date *
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
                                    <Label htmlFor="unit">Unit *</Label>
                                    <Select
                                        value={formData.unitId}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                unitId: value,
                                                lineIds: [],
                                            })
                                        }
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a unit" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    <Label htmlFor="shift">Shift *</Label>
                                    <Select
                                        value={formData.shiftId}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                shiftId: value,
                                            })
                                        }
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a shift" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                            <div className="">
                                <Label>Lines Required *</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    {availableLines.map((line) => (
                                        <div
                                            key={line.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={line.id}
                                                checked={formData.lineIds.includes(
                                                    line.id
                                                )}
                                                onCheckedChange={() =>
                                                    handleLineToggle(line.id)
                                                }
                                            />
                                            <Label htmlFor={line.id}>
                                                {line.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={formData.lineIds.length === 0}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Order
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div>
                <CardHeader>
                    <CardTitle>Orders List</CardTitle>
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
                                    <TableCell>{order.deliveryDate}</TableCell>
                                    <TableCell>
                                        {getUnitName(order.unitId)}
                                    </TableCell>
                                    <TableCell>
                                        {getLineNames(order.lineIds)}
                                    </TableCell>
                                    <TableCell>
                                        {getShiftName(order.shiftId)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
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
            </div>
        </div>
    );
};

export default OrderCreation;
