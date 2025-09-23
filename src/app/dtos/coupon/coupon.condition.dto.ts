// src/coupons/dto/coupon-condition.dto.ts
import { IsString, IsIn, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CouponConditionDTO {
  // attribute mặc định "0"
  @IsString()
  @Transform(({ value }) => value ?? '0')
  attribute: string;

  // operator mặc định ">="
  @IsString()
  @IsIn(['>=', '>', '=', '<=', '<'])
  @Transform(({ value }) => value ?? '>=')
  operator: string;

  // value mặc định "0" (để đồng nhất với kiểu string bạn đang lưu trong DB)
  @IsString()
  @Transform(({ value }) => value ?? '0')
  value: string;

  // discountAmount mặc định "0.00" (lưu ý: nếu backend lưu DECIMAL, ta vẫn nhận string)
  @IsString()
  @Transform(({ value }) => value ?? '0.00')
  discountAmount: string;
      constructor(data:any){
        this.attribute = data.attribute;
                this.operator = data.operator;
                this.value = data.value;
                                this.discountAmount = data.discountAmount;
    }
}
