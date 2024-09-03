import { ProductBasicInfo } from "./product";

export interface Order {
    id: string;
    total_price: number;
    address: string;
    payment_type: "COD" | "CREDIT_CARD";
    payment: string;
    status: "PROCESSING" | "DELIVERING" | "RECEIVED" | "CANCEL";
    created_at: string;
    updated_at: string;
    items: OrderItemBasicInfo[];
}

export type OrderBasicInfo = Pick<Order, "id" | "status" | "created_at" | "payment_type" | "total_price">

export interface OrderItem{
    id: string;
    order: string;
    quantity: number;
    total_price: number;
    created_at: string;
    order_status: "PROCESSING" | "DELIVERING" | "RECEIVED" | "CANCEL";
    product: ProductBasicInfo;
}

export type OrderItemBasicInfo = Pick<OrderItem, "quantity" | "total_price" | "product">;