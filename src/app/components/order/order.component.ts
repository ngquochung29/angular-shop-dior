import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { catchError, throwError } from 'rxjs';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { CartItemView } from 'src/app/models/cart.item.view';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { ApiResponse } from 'src/app/responses/api.response';
import { CartService } from 'src/app/service/cart.service';
import { CouponService } from 'src/app/service/coupon.service';
import { OrderService } from 'src/app/service/order.service';
import { PaymentService } from 'src/app/service/payment.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastService } from 'src/app/service/toast.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  orderForm!: FormGroup;
cartItems: CartItemView[] = [];  preDiscountTotal: number = 0;
  totalAmount: number = 0;
  couponDiscount: number = 0;
  couponApplied: boolean = false;
  cart: Map<string, CartItemView> = new Map(); 
shippingFee: number = 0;

  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    status: 'pending',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: [],
    shipping_address: '',
  };
  loading: boolean | undefined;

  constructor(
    private toastService: ToastService,
    private couponService: CouponService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      shipping_address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['vnpay'],
    });
  }
  readonly SHIPPING_FEES: Record<'express' | 'normal', number> = {
  express: 70_000,
  normal: 35_000,
};

private getShippingFee(): number {
  const method = this.orderForm.get('shipping_method')?.value as 'express' | 'normal';
  return this.SHIPPING_FEES[method] ?? 0;
}

  ngOnInit(): void {
  this.orderData.user_id = this.tokenService.getUserId();

  // Lấy cart đã lưu (Map<string, CartItemView>)
  const cartMap = this.cartService.getCart();
  this.cartItems = Array.from(cartMap.values()); // Mỗi item đã đủ: ảnh, tên, size, color, quantity, ...

  if (this.cartItems.length === 0) return;

    this.orderForm.get('shipping_method')?.valueChanges.subscribe(() => {
    // nếu đã áp mã, cần tính lại giảm giá trên tổng mới (subtotal + ship)
    if (this.couponApplied) {
      this.recalculateCoupon(); // gọi API coupon lại với base mới
    } else {
      this.calculateTotal();
    }
  });

  this.calculateTotal();
}
//tinh lại tiền nếu thay đổi ship
private recalculateCoupon(): void {
  const couponCode = this.orderForm.get('couponCode')?.value;
  if (!this.couponApplied || !couponCode) {
    this.calculateTotal();
    return;
  }
  // base = subtotal + shipping (áp coupon SAU khi cộng ship)
  const base = Math.max(0, this.preDiscountTotal) + this.getShippingFee(); 

  this.couponService.calculateCouponValue(couponCode, base).subscribe({
    next: (apiResponse: ApiResponse) => {
      const discountedTotal = apiResponse.data.result; // tổng sau giảm (theo BE của bạn)
      this.shippingFee = this.getShippingFee();
      this.couponDiscount = base - discountedTotal;
      this.totalAmount = discountedTotal;
    },
    error: (err) => {
      // nếu có lỗi, coi như chưa áp được mã (không phá luồng)
      this.toastService.showToast({
        error: err,
        defaultMsg: 'Mã giảm giá không hợp lệ',
        title: 'Lỗi Coupon',
      });
      this.couponApplied = false;
      this.couponDiscount = 0;
      this.calculateTotal();
    },
  });
}



calculateTotal(): void {
  this.preDiscountTotal = this.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

    this.shippingFee = this.getShippingFee();


  // Chỉ trừ khi đã áp dụng thành công coupon
  const discount = this.couponApplied ? (this.couponDiscount || 0) : 0;

  const afterDiscount = Math.max(0, this.preDiscountTotal - discount);

    const totalBeforeCoupon = Math.max(0, this.preDiscountTotal) + this.shippingFee;
  if (this.couponApplied) {
    // Không tự tính bừa ở client vì logic mã nằm ở BE => gọi hàm chuyên dụng
    // (hàm này sẽ set couponDiscount và totalAmount)
    return this.recalculateCoupon();
  }


  // Tổng cuối để hiển thị
 this.couponDiscount = 0;
  this.totalAmount = totalBeforeCoupon;}


private updateCartFromCartItems(): void {
  this.cart.clear();
  this.cartItems.forEach((item) => {
    // Key hóa theo biến thể
    const key = `${item.product_id}-${item.size_id}-${item.color_id}`;
    this.cart.set(key, { ...item });
  });
  this.cartService.setCart(this.cart);
}


  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      this.cartItems.splice(index, 1);
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  applyCoupon(): void {
    const couponCode = this.orderForm.get('couponCode')?.value;
    if (!this.couponApplied && couponCode) {
      this.couponService
        .calculateCouponValue(couponCode, this.preDiscountTotal)
        .subscribe({
          next: (apiResponse: ApiResponse) => {
            const discountedTotal = apiResponse.data.result;
            this.totalAmount = discountedTotal;
            this.couponDiscount = this.preDiscountTotal - discountedTotal;
            this.couponApplied = true;
            this.calculateTotal();
            this.toastService.showToast({
              defaultMsg: 'Đã áp dụng mã giảm giá',
              title: 'Success',
            });
          },
          error: (error) => {
            this.toastService.showToast({
              error: error,
              defaultMsg: 'Mã giảm giá không hợp lệ',
              title: 'Lỗi Coupon',
            });
          },
        });
    }
  }
  

  placeOrder() {
    this.loading = true;
    debugger;
      if (this.totalAmount <= 70000) {
    this.loading = false;
    this.toastService.showToast({
      error: 'Bạn chưa có sản phẩm nào trong giỏ hàng',
      defaultMsg: 'Bạn chưa có sản phẩm nào trong giỏ hàng',
      title: 'Không thể đặt hàng',
    });
    return;
  }
    if (this.orderForm.valid) {
      // Gán giá trị form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
      };
      // Gán cart_items
      this.orderData.coupon_code = this.orderForm.get('couponCode')?.value;
      this.orderData.cart_items = this.cartItems.map((item) => ({
        product_id: item.product_id,         // hoặc product_detail_id nếu BE nhận
  size_id: item.size_id,
  color_id: item.color_id,
  quantity: item.quantity,
      }));
            console.log(this.cartItems);
      this.orderData.total_money = this.totalAmount;

      // Kiểm tra: Nếu payment_method = 'vnpay' => Gọi createPaymentUrl,
      // ngược lại => placeOrder
      if (this.orderData.payment_method === 'vnpay') {
        debugger;
        const amount = this.orderData.total_money || 0;

        // Bước 1: Gọi API tạo link thanh toán
        this.paymentService
          .createPaymentUrl({ amount, language: 'vn' })
          .subscribe({
            next: (res: ApiResponse) => {
              // res.data là URL thanh toán, ví dụ:
              // https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=49800&...&vnp_TxnRef=18425732&...
              const paymentUrl = res.data;
              console.log('URL thanh toán:', paymentUrl);
              // Bước 2: Tách vnp_TxnRef từ URL vừa trả về
              const vnp_TxnRef =
                new URL(paymentUrl).searchParams.get('vnp_TxnRef') || '';

              // Bước 3: Gọi placeOrder kèm theo vnp_TxnRef
              this.orderService
                .placeOrder({
                  ...this.orderData,
                  vnp_txn_ref: vnp_TxnRef,
                })
                .subscribe({
                  next: (apiResponse: ApiResponse) => {
                    // Bước 4: Nếu đặt hàng thành công, điều hướng sang trang thanh toán VNPAY
                    debugger;
                    window.location.href = paymentUrl;
                  },
                  error: (err: HttpErrorResponse) => {
                    debugger;
                    this.toastService.showToast({
                      error: err,
                      defaultMsg: 'Lỗi trong quá trình đặt hàng',
                      title: 'Lỗi Đặt Hàng',
                    });
                  },
                });
            },
            error: (err: HttpErrorResponse) => {
              this.toastService.showToast({
                error: err,
                defaultMsg: 'Lỗi kết nối đến cổng thanh toán',
                title: 'Lỗi Thanh Toán',
              });
            },
          });
      } else {
        debugger;
        // Chọn COD => Gọi this.orderService.placeOrder
        this.orderService.placeOrder(this.orderData).subscribe({
          next: (response: ApiResponse) => {
            debugger;
            this.toastService.showToast({
              error: null,
              defaultMsg: 'Đặt hàng thành công',
              title: 'Thành công',
            });

            // Xoá giỏ hàng, về trang chủ
            setTimeout(() => {
              this.cartService.clearCart();
              this.router.navigate(['/']);
            }, 3000);
          },
          error: (err: HttpErrorResponse) => {
            debugger;
            this.toastService.showToast({
              error: err,
              defaultMsg: 'Lỗi trong quá trình đặt hàng',
              title: 'Lỗi Đặt Hàng',
            });
          },
        });
      }
    } else {
      this.toastService.showToast({
        error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        defaultMsg: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        title: 'Lỗi Dữ Liệu',
      });
      this.orderForm.markAllAsTouched();
    }
  }
  
}
