// coupon.dto.ts
import { CouponCondition } from "src/app/models/coupon.condition";

export interface CouponDTO {
  code: string;
  active: boolean;
  coupon_condition: CouponCondition[]; // snake_case như BE đang yêu cầu
}
