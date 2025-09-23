import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coupon } from 'src/app/models/coupon';
import { CouponConditionResponse } from 'src/app/responses/coupon/coupon-condition.response';
import { CouponService } from 'src/app/service/coupon.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
 coupons:Coupon[]=[];
  currentPage: number =0;
  itemsPerpage: number =12;
  pages: number[] =[];
  totalPages: number =0;
  visiblePages: number[]=[];  constructor(
    private couponService: CouponService,
    private router:Router,
    private toastService:ToastService
  ) { }

  ngOnInit(): void {
    this.currentPage =Number(localStorage.getItem('currentCouponAdminPage')) || 0;
    this.getCoupons(0,12);
  }
  getCoupons(page:number,limit:number){
    this.couponService.getListCoupon(page,limit).subscribe({
      next:(response:any)=>{
        this.coupons = response.content;
         this.totalPages = response.totalPages;     
      this.currentPage = response.number;       
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete:()=>{},
      error:(error: any)=>{
        console.error('Error fetching coupon:',error);
      }
    });
  }

       toggleCouponStatus(coupon: Coupon) {
        let confirmation: boolean;
        if (coupon.active) {
          confirmation = window.confirm('Bạn có muốn dừng coupon này ?');
        } else {
          confirmation = window.confirm('Bạn có muốn triển khai coupon này ?');
        }
        
        if (confirmation) {
          const params = {
            couponId: coupon.id,
            enable: !coupon.active
          };
      
          this.couponService.toggleCouponStatus(params).subscribe({
            next: (apiResponse: any) => {
              console.error('Block/unblock coupon successfully');
                  this.toastService.showToast({
                error: null,
                defaultMsg: 'Thay đổi trạng thái thành công',
                title: 'Đã cập nhật'
              });
                coupon.active = !coupon.active;          
              },
            complete: () => {
              // Handle complete event
            },
            error: (error: HttpErrorResponse) => {
              this.toastService.showToast({
                error: error,
                defaultMsg: 'Lỗi thay đổi trạng thái',
                title: 'Lỗi Hệ Thống'
              });
            }
          });
        }      
      }
      
        generateVisiblePageArray(curentPage: number, totalPages: number):number[]{
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages/2);

    let startPage = Math.max(curentPage -  halfVisiblePages,1);
    let endPage = Math.min(startPage+maxVisiblePages -1,totalPages);

    if(endPage - startPage +1 < maxVisiblePages){
      startPage = Math.max(endPage -maxVisiblePages +1,1);
    }
    return new Array(endPage - startPage +1).fill(0)
    .map((_,index)=>startPage +index);
  }
   onPageChange(page: number){
    this.currentPage = page < 0?0:page;
    localStorage.setItem('currentCouponAdminPage',String(this.currentPage));
    this.getCoupons(this.currentPage,this.itemsPerpage);
  }
updateDetail(){
    this.router.navigate(['/admin/coupons/update']);
  }
insertCoupon() {
      this.router.navigate(['/admin/coupons/insert']);
}
  }


