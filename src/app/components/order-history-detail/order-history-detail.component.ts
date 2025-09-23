import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { OrderService } from 'src/app/service/order.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-order-history-detail',
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.scss']
})
export class OrderHistoryDetailComponent implements OnInit {


 orderId: number =0;
 orderResponse: OrderResponse ={
   id: 0,
   user_id: 0,
   fullname: '',
   email: '',
   phone_number: '',
   address: '',
   note: '',
   order_date: null,
   status: '',
   total_money: 0,
   shipping_method: '',
   shipping_address: '',
   shipping_date: null,
   delivery_date: null,
   payment_method: '',
   order_details: [] = [],
 }
   totalOriginMoney: number=0;
   couponMoney: number=0;
     shippingFee: number = 0;    
  shippingLabel: string = '';    
  loadingId: number | null = null;


   constructor(
     private orderService: OrderService,
     private route: ActivatedRoute,
     private router: Router,
     private toastService: ToastService
   ) { }
 
   ngOnInit(): void {
         this.getOrderDetails();
   }
  private calcShipping(method?: string): { fee: number; label: string } {
    const m = (method || '').toLowerCase();
    if (m === 'express') return { fee: 70_000, label: 'Giao hàng Nhanh' };
       else if (m === 'counter') return { fee: 0, label: 'Thanh toán tại quầy' };
    return { fee: 35_000, label: 'Giao hàng Tiết Kiệm' }; // default
  }
   
 
     getOrderDetails(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        // 1) Gán thẳng các trường
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address;
        this.orderResponse.note = response.note;
        this.orderResponse.total_money = Number(response.total_money || 0);
        this.orderResponse.status = response.status;
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_method = response.shipping_method;
        this.orderResponse.shipping_address = response.shipping_address;

        // 2) Ngày tháng
        this.orderResponse.order_date = response.order_date ? new Date(response.order_date) : null;
        if (response.shipping_date) {
          const [y, m, d] = String(response.shipping_date).split('-').map(Number);
          this.orderResponse.shipping_date = new Date(y, m - 1, d);
        } else {
          this.orderResponse.shipping_date = null;
        }
        // delivery
        //         if (response.delivery_date) {
        //   const [y, m, d] = String(response.delivery_date).split('-').map(Number);
        //   this.orderResponse.delivery_date = new Date(y, m - 1, d);
        // } else {
        //   this.orderResponse.delivery_date = null;
        // }
        this.orderResponse.delivery_date = response.delivery_date ? new Date(response.delivery_date) : null;
        // 3) Chi tiết đơn
        this.orderResponse.order_details = response.order_details || [];

        // 4) Subtotal
        this.totalOriginMoney = (this.orderResponse.order_details ?? []).reduce(
          (sum: number, od: any) => sum + Number(od.price) * Number(od.number_of_products),
          0
        );

        // 5) Phí ship theo phương thức 
        const { fee, label } = this.calcShipping(this.orderResponse.shipping_method);
        this.shippingFee = fee;
        this.shippingLabel = label;

        // 6) Cộng ship trước rồi mới trừ coupon
        const totalBeforeCoupon = this.totalOriginMoney + this.shippingFee;
        const totalPay = this.orderResponse.total_money;
        this.couponMoney = Math.max(0, totalBeforeCoupon - totalPay);
      },
      error: (error: any) => {
        console.log('Error fetching detail:', error);
      }
    });
  }



 
cancelOrder(orderResponse: { id: number; status: string }) {
  const ok = confirm('Bạn có muốn hủy đơn này không ?');
  if(!ok) return;
  this.orderService.updateOrderStatus(orderResponse.id, 'cancelled').subscribe({
    next: (res: any) => {
      orderResponse.status = res?.status ?? 'cancelled';
      this.toastService.showToast({ error: null, defaultMsg: 'Hủy thành công', title: 'Thành Công' });
this.router.navigate(['/orders-detail-history', orderResponse.id]);
    },
    complete(){},
    error: (error:any) => {
           this.toastService.showToast({
              error: error,
              defaultMsg: '',
              title: 'Thất bại'
            });
    }
  });
}

 
}
