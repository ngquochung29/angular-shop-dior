import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateProductDetailDTO } from 'src/app/dtos/update.product.detail.dto';
import { ProductDetails } from 'src/app/models/product.detail';
import { ProductDetailService } from 'src/app/service/product.detail.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss']
})
export class QuantityComponent implements OnInit {

  currentPage: number =0;
  itemsPerpage: number =9;
    pages: number[] =[];
  totalPages: number =0;
  visiblePages: number[]=[];
  keyword: string ="";
productDetails: ProductDetails[]=[];
productId: number = 0;


  constructor(
    private productDetailService: ProductDetailService,
    private route: ActivatedRoute,
        private router: Router,
        private toastService:ToastService
  ) { }

  ngOnInit(): void {
        this.currentPage =Number(localStorage.getItem('currentProductDetailAdminPage')) || 0;
   this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.getProductDetailsByIdProduct();
    });  
        this.getProductDetailsByIdProduct();
}


onPageChange(page: number){
      this.currentPage = page < 0?0:page;
          localStorage.setItem('currentProductDetailAdminPage',String(this.currentPage));
this.getProductDetailsByIdProduct();
  }

getProductDetailsByIdProduct(): void {
  this.productDetailService.getProductDetailsByIdProduct(
    this.productId,
    this.keyword,
    this.currentPage,
    this.itemsPerpage
  ).subscribe({
    next: (response) => {
      this.productDetails = response.productDetails ?? [];
      this.totalPages = response.totalPages ?? 0;
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    error: (error: any) => {
      this.toastService.showToast({
        error: error,
        defaultMsg: 'Lỗi hiển thị',
        title: 'Lỗi hiển thị biến thể sản phẩm',
      });
    }
  });
}



plusQuantity(productDetailId: number, quantity: number) {
    const ok = confirm('Bạn có muốn thêm '+ quantity+' sản phẩm mới?');
  if(!ok) return;
    if (quantity < 0) {
    this.toastService.showToast({
      error: { message: 'Số lượng phải lớn hơn hoặc bằng 0' },
      defaultMsg: 'Không được nhập số âm',
      title: 'Không thể cập nhật',
    });
    return;
  }
  const dto: UpdateProductDetailDTO = { quantity };
  this.productDetailService.plusQuantity(productDetailId, dto).subscribe({
    next: () => { 
        this.toastService.showToast({
        error: null,
        defaultMsg: 'Thêm số lượng thành công',
        title: 'Thành Công',
      });
      this.searchProductDetails();
    }
  });
}
minusQuantity(productDetailId: number, quantity: number) {
    const ok = confirm('Bạn có muốn bỏ '+ quantity+' sản phẩm?');
  if(!ok) return;
    if (quantity < 0) {
    this.toastService.showToast({
      error: { message: 'Số lượng phải lớn hơn hoặc bằng 0' },
      defaultMsg: 'Không được nhập số âm',
      title: 'Không thể cập nhật',
    });
    return;
  }
  const dto: UpdateProductDetailDTO = { quantity };
  this.productDetailService.minusQuantity(productDetailId, dto).subscribe({
    next: () => { 
        this.toastService.showToast({
        error: null,
        defaultMsg: 'Giảm số lượng thành công',
        title: 'Thành Công',
      });
      this.searchProductDetails();
    },
    complete:() =>{},
        error: (error: HttpErrorResponse) => {
                this.toastService.showToast({
                  error: error,
                  defaultMsg: 'Tổng lượng sản phẩm trong kho không đưọc âm',
                  title: 'Lỗi Xóa'
                });
              }
  });
}




searchProductDetails(page: number = 0) {
  this.currentPage = 0;
    this.itemsPerpage =9;
        this.currentPage =Number(localStorage.getItem('currentProductDetailAdminPage')) || 0;
this.getProductDetailsByIdProduct();
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

}
