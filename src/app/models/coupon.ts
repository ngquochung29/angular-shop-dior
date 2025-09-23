import { CouponCondition } from "./coupon.condition";

export interface Coupon {
  id: number;
  code: string;
  active: boolean;
  conditions?: CouponCondition[];
}