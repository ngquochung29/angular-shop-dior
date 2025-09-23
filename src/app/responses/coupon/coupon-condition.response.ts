// src/app/models/coupon.condition.ts
export interface CouponConditionResponse {
  id?: number;
  attribute: string;       // "minimum_amount" ...
  operator: string;        // >=, >, =, <=, <
  value: string;           // "0" ...
  discountAmount: string | number; // 0.00
}
