import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CouponConditionDTO } from 'src/app/dtos/coupon/coupon.condition.dto';
import { InsertCouponDTO } from 'src/app/dtos/coupon/insert.coupon.dto';
import { CouponService } from 'src/app/service/coupon.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-insert.coupon',
  templateUrl: './insert.coupon.component.html',
  styleUrls: ['./insert.coupon.component.scss']
})
export class InsertCouponComponent implements OnInit {

insertCouponDTO: InsertCouponDTO ={
  code: '',
  active: false,
  coupon_condition: undefined,
};
  constructor(
    private router:Router,
    private couponService: CouponService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  insertCoupon() {
    const ok = confirm('Bạn có muốn thêm coupon mới không ?');
  if(!ok) return;
this.couponService.insertCoupon(this.insertCouponDTO).subscribe({
  next:(response)=>{
       this.toastService.showToast({
              error: null,
              defaultMsg: 'Thêm coupon thành công',
              title: 'Success'
            });
    this.router.navigate(['/admin/coupons']);
  },
  error:(error:any)=>{
   this.toastService.showToast({
              error: error,
              defaultMsg: 'Thêm mới thất bại',
              title: 'Fail'
            });  }
});
  }

}
