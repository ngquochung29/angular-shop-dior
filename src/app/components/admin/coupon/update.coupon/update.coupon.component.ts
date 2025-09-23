import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Coupon } from 'src/app/models/coupon';
import { CouponCondition } from 'src/app/models/coupon.condition';
import { CouponConditionResponse } from 'src/app/responses/coupon/coupon-condition.response';
import { CouponService } from 'src/app/service/coupon.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-update.coupon',
  templateUrl: './update.coupon.component.html',
  styleUrls: ['./update.coupon.component.scss']
})
export class UpdateCouponComponent implements OnInit {
coupons: Coupon[] = [];
  selectedCouponId: number | null = null;
  loading = false;

  // model đang bind vào form
  couponConditionResponse: any = {
    id: null,
    attribute: '',
    operator: '>=',
    value: '',
    discountAmount: null
  };

  constructor(
    private couponService: CouponService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // load danh sách coupon để user chọn
    this.loadCoupons();
  }

  loadCoupons() {
    // lấy 1 page đủ to để hiển thị trong select (tuỳ bạn)
    this.couponService.getListCoupon(0, 100).subscribe({
      next: (res: any) => this.coupons = res.content ?? [],
      error: (e) => this.toast.showToast({ error: e, defaultMsg: 'Lỗi tải danh sách coupon', title: 'Lỗi' })
    });
  }

  // Ấn "Tìm condition"
  loadFirstConditionByCoupon() {
    if (!this.selectedCouponId) {
      this.toast.showToast({ error: null, defaultMsg: 'Hãy chọn coupon trước', title: 'Thiếu dữ liệu' });
      return;
    }

    this.loading = true;
    this.couponService.getCouponConditionByIdCoupon(this.selectedCouponId).subscribe({
      next: (res: any) => {
        // BE của bạn nên trả về mảng. Lấy cái đầu để edit 
        const list = Array.isArray(res) ? res : (res?.content ?? []);
        if (!list || list.length === 0) {
          this.toast.showToast({ error: null, defaultMsg: 'Coupon này chưa có condition', title: 'Thông báo' });
          this.couponConditionResponse = { id: null, attribute: '', operator: '>=', value: '', discountAmount: null };
          return;
        }
        const first = list[0];
        this.couponConditionResponse = { ...first };
      },
      error: (err) => {
        this.toast.showToast({ error: err, defaultMsg: 'Lỗi tải điều kiện', title: 'Lỗi' });
      },
      complete: () => this.loading = false
    });
  }
// onSubmit trong UpdateCouponComponent
onSubmit(form: NgForm) {
  if (form.invalid) return;

  const conditionId = this.couponConditionResponse?.id;
  const couponId = this.selectedCouponId;

  if (!couponId || !conditionId) {
    this.toast.showToast({
      error: null,
      defaultMsg: 'Thiếu couponId hoặc conditionId',
      title: 'Thiếu dữ liệu'
    });
    return;
  }

  const payload = {
    attribute: this.couponConditionResponse.attribute,
    operator: this.couponConditionResponse.operator,
    value: this.couponConditionResponse.value,
    discountAmount: this.couponConditionResponse.discountAmount
  };

  this.loading = true;
  this.couponService.updateCondition(couponId, conditionId, payload).subscribe({
    next: () => this.toast.showToast({ error: null, defaultMsg: 'Cập nhật thành công', title: 'Thành công' }),
    error: (err:any) => 
      this.toast.showToast({ error: err, defaultMsg: 'Cập nhật thất bại', title: 'Lỗi' }),
    complete: () => (this.loading = false)
  });
}

}