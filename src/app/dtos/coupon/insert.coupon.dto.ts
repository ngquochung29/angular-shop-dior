import { IsNotEmpty, IsString } from "class-validator";
import { CouponCondition } from "src/app/models/coupon.condition";
import { CouponConditionDTO } from "./coupon.condition.dto";


export class InsertCouponDTO{
    @IsString()
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
active:boolean;
 coupon_condition?: CouponCondition[];
     constructor(data:any){
        this.code = data.code;
                this.active = data.active;
                this.coupon_condition = data.coupon_condition;
    }
}