import { OrderDetail } from "src/app/models/order.detail";
export interface OrderResponse{
    id: number;
    user_id:number;
    fullname: string;
    email: string;
    phone_number: string;
    address: string;
    note: string;
    order_date: Date | null;
    status: string;
    total_money: number;
    shipping_method: string;
    shipping_address: string;
    shipping_date: Date | null;
    delivery_date: Date | null;
    payment_method: string;
    order_details: OrderDetail[];//Dam bao co 1 interface OrderDetail tuong ung
}