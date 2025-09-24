import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItemView } from 'src/app/models/cart.item.view';
import { Color } from 'src/app/models/color';
import { Product } from 'src/app/models/product';
import { ProductDetails } from 'src/app/models/product.detail';
import { ProductImage } from 'src/app/models/product.image';
import { Size } from 'src/app/models/size';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastService } from 'src/app/service/toast.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-detail-product-employee',
  templateUrl: './detail-product-employee.component.html',
  styleUrls: ['./detail-product-employee.component.scss']
})
export class DetailProductEmployeeComponent implements OnInit {


   product?: Product;
   productId: number = 0;
   currentImageIndex: number = 0;
   quantity: number = 1;

   productDetail: ProductDetails[] = [];
   sizes: Size[] = [];
   selectedSizeId: number = 0;
   colors: Color[] = [];
   selectedColorId: number = 0;
   colorError: boolean | undefined;

   constructor(
     private productService: ProductService,
     private cartService: CartService,
     private router: Router,
     private route: ActivatedRoute,
     private toastService: ToastService
   ) {}

   ngOnInit() {
     const idParam = this.route.snapshot.paramMap.get('id');
     this.productId = idParam ? +idParam : 0;

     if (this.productId > 0) {
       this.productService.getDetailProduct(this.productId)
         .subscribe({
           next: (response: any) => {
             // Map full image URLs
             // if (response.product_images) {
             //   response.product_images.forEach((productImages: ProductImage) => {
             //     productImages.image_url = `${environment.apiBaseUrl}/api/v1/products/images/${productImages.image_url}`;
             //   });
             // }
             this.product = response;

             // Use returned product_details (already filtered quantity > 0)
             this.productDetail = response.product_details
              .filter((detail: ProductDetails) => detail.quantity > 0);

             // Build unique sizes with names (cast id to number)
             this.sizes = Array.from(
               new Map(
                 this.productDetail.map(detail => [
                   +detail.size_id,
                   { id: +detail.size_id, name: detail.size_name }
                 ])
               ).values()
             );

             if (this.sizes.length) {
               this.selectedSizeId = this.sizes[0].id;
               this.onSizeChange();
             }

             this.showImage(0);
           },
           error: (error: any) => console.error('Error fetching detail:', error)
         });
     } else {
       console.log('Invalid productId:', idParam);
     }
   }

 onSizeChange() {
   this.colors = Array.from(
     new Map(
       this.productDetail
         .filter(detail => detail.size_id === this.selectedSizeId)
         .map(detail => [detail.color_id, { id: detail.color_id, name: detail.color_name }])
     ).values()
   );
   this.selectedColorId = this.colors.length ? this.colors[0].id : 0;
 }




   showImage(index: number): void {
     if (this.product?.product_images?.length) {
       if (index < 0) index = 0;
       else if (index >= this.product.product_images.length)
         index = this.product.product_images.length - 1;

       this.currentImageIndex = index;
     }
   }

   thumbnailClick(index: number) {
     this.showImage(index);
   }

   nextImage(): void {
     this.showImage(this.currentImageIndex + 1);
   }

   previousImage(): void {
     this.showImage(this.currentImageIndex - 1);
   }


 addToCart(): void {
   // BẮT BUỘC chọn màu
   if (!this.selectedColorId) {
     this.colorError = true;
     return;
   }
   this.colorError = false;

   if (!this.product) {
     console.error('Cannot add to cart, product invalid');
     return;
   }

   // Tìm đúng biến thể theo (size_id, color_id)
   const detail = this.productDetail.find(
     d => d.size_id === this.selectedSizeId && d.color_id === this.selectedColorId
   );
   if (!detail) {
     console.error('Không tìm thấy biến thể này!');
     return;
   }

   // ⬇️ THÊM MỚI: không cho vượt tồn theo dữ liệu hiện có + số đang có trong giỏ
   const key = `${this.product.id}-${this.selectedSizeId}-${this.selectedColorId}`;
   const existing = this.cartService.getCart().get(key);
   const currentInCart = existing?.quantity ?? 0;
   const availableNow = Math.max(0, (detail.quantity ?? 0) - currentInCart);
   const toAdd = Math.min(this.quantity, availableNow);

   if (toAdd <= 0) {
     this.toastService.showToast({
       error: null,
       defaultMsg: 'Số lượng đã đạt tối đa theo tồn hiện tại',
       title: 'Thông báo'
     });
     return;
   }

   // Chuẩn bị object cho giỏ hàng
   const cartItem: CartItemView = {
     product_detail_id: detail.product_detail_id,
     product_id: this.product.id,
     product_name: this.product.name,
     image_url: this.product.product_images?.[0]?.image_url || '',
     size_id: this.selectedSizeId,
     size_name: detail.size_name,
     color_id: this.selectedColorId,
     color_name: detail.color_name,
     price: this.product.price,
     quantity: toAdd
   };

   // Gọi CartService (bên đó sẽ gọi BE getAvailable để clamp lần cuối)
   this.cartService.addToCart(cartItem);

   // Toast sau khi thêm thành công
   this.toastService.showToast({
     error: null,
     defaultMsg: `Đã thêm x${toAdd} vào giỏ hàng`,
     title: 'Thành công'
   });
 }
 private getAvailableNow(): number {
   const detail = this.productDetail.find(
     d => d.size_id === this.selectedSizeId && d.color_id === this.selectedColorId
   );
   if (!detail) return 0; // chưa chọn biến thể hoặc không tồn tại

   const key = `${this.product?.id}-${this.selectedSizeId}-${this.selectedColorId}`;
   const currentInCart = this.cartService.getCart().get(key)?.quantity ?? 0;

   const available = (detail.quantity ?? 0) - currentInCart;
   return Math.max(0, available);
 }



   decreaseQuantity() {
     if (this.quantity > 1) this.quantity--;
   }
   increaseQuantity() {
   // Không cho tăng quá tồn còn lại
   const max = this.getAvailableNow();
   if (max <= 0) {
     // (tuỳ chọn) báo người dùng: hết hàng với biến thể đang chọn
     this.toastService.showToast({
       error: null,
       defaultMsg: 'Biến thể này tạm hết hàng',
       title: 'Thông báo'
     });
     return;
   }

   if (this.quantity < max) {
     this.quantity++;
   } else {
     // clamp + (tuỳ chọn) thông báo đã đạt tối đa
     this.quantity = max;
     this.toastService.showToast({
       error: null,
       defaultMsg: 'Đã đạt số lượng tối đa theo tồn hiện tại',
       title: 'Thông báo'
     });
   }
 }

   // increaseQuantity() {
   //   this.quantity++;
   // }


   buyNow(): void {
     this.router.navigate(['/employee/orders']);
   }

}
