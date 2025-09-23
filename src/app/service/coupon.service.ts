import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../responses/api.response";
import { HttpUtilService } from "./http.util.service";
import { CouponDTO } from "../dtos/coupon/coupon.dto";
import { Coupon } from "../models/coupon";
import { CouponConditionDTO } from "../dtos/coupon/coupon.condition.dto";
import { InsertCouponDTO } from "../dtos/coupon/insert.coupon.dto";
import { PageResponse } from "../responses/page.response";
import {environment} from "../environments/environment";
@Injectable({
    providedIn: 'root'
})
export class CouponService{
  private apiCoupon = `${environment.apiBaseUrl}/api/v1/coupons`;
     private apiConfig={
    headers:this.httpUtilService.createHeaders(),
  }
    constructor(private http: HttpClient,
        private httpUtilService:HttpUtilService
    ){}
  calculateCouponValue(couponCode: string, totalAmount: number):Observable<ApiResponse>{
        const url = `${this.apiCoupon}/calculate`;
        const params = new HttpParams().set('couponCode',couponCode).set('totalAmount',totalAmount.toString());
        return this.http.get<ApiResponse>(url,{params});
    }
  toggleCouponStatus(params: { couponId: number, enable: boolean }): Observable<any> {
    const url = `${this.apiCoupon}/block/${params.couponId}/${params.enable ? '1' : '0'}`;
     return this.http.put(url, null, {
    ...this.apiConfig,
    responseType: 'text' as 'json' // thêm dòng này nếu backend trả string
  });
  }
getListCoupon(page: number, limit: number):Observable<PageResponse<Coupon>> {
  const params = new HttpParams()
    .set('page', String(page))
    .set('limit', String(limit));
  return this.http.get<PageResponse<Coupon>>(this.apiCoupon, { params });
}
  insertCoupon(insertCouponDTO: InsertCouponDTO): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.apiCoupon}`,
      insertCouponDTO,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
    getCouponConditionByIdCoupon(couponId:number):Observable<any>{
    const url =`${this.apiCoupon}/${couponId}/conditions`;
    return this.http.get(url);
  }
// coupon.service.ts
updateCondition(couponId: number, conditionId: number, dto: any) {
  const url = `${this.apiCoupon}/${couponId}/conditions/${conditionId}`;
  return this.http.put(url, dto, this.apiConfig);
}



}
