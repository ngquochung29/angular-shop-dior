import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { Product } from 'src/app/models/product';
import { ApiResponse } from 'src/app/responses/api.response';
import { ProductResponse } from 'src/app/responses/product/product.response';
import { ProductService } from 'src/app/service/product.service';
import { ToastService } from 'src/app/service/toast.service';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: ['./product.admin.component.scss']
})
export class ProductAdminComponent implements OnInit {


  products: Product[]=[];
  selectedCategoryId: number =0;
  currentPage: number =0;
  itemsPerpage: number =8;
  pages: number[] =[];
  totalPages: number =0;
  visiblePages: number[]=[];
  keyword: string ="";

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService:ToastService
  ) { }

  ngOnInit() {
    this.currentPage =Number(localStorage.getItem('currentProductAdminPage')) || 0;
 this.getProducts(this.keyword,
  this.selectedCategoryId,
  this.currentPage,this.itemsPerpage
 );
  }
  searchProducts(){
    this.currentPage =0;
    this.itemsPerpage =8;
    this.getProducts(this.keyword.trim(),this.selectedCategoryId,this.currentPage,this.itemsPerpage);
  }
  getProducts(keyword:string, selectedCategoryId:number,page: number,limit: number){
    this.productService.getProducts(keyword,selectedCategoryId,page,limit).subscribe({
      next:(response: any)=>{
        response.products.forEach((product: Product)=>{
          if(product){
            product.url =product.thumbnail
          }
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage,this.totalPages)
      },
      complete:()=>{},
      error:(error:any)=>{
        console.log('Error fetching products:',error);
      }
    });
  }
  onPageChange(page: number){
    this.currentPage = page < 0?0:page;
    localStorage.setItem('currentProductAdminPage',String(this.currentPage));
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage,this.itemsPerpage);
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

  insertProduct(){
    this.router.navigate(['/admin/products/insert']);
  }

  updateProduct(productId: number){
    this.router.navigate(['/admin/products/update',productId]);
  }
  updateQuantity(productId: number){
    this.router.navigate(['/admin/products/detail',productId]);
  }

  deleteProduct(product: Product){
    const confirmation = window.confirm('Are you sure you want to delete this product?');
    if(confirmation){
       this.productService.deleteProduct(product.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            this.toastService.showToast({
              error: null,
              defaultMsg: 'Xóa sản phẩm thành công',
              title: 'Thành Công'
            });
this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerpage);
          },
          complete: () => {
            debugger;
          },
          error: (error: HttpErrorResponse) => {
            this.toastService.showToast({
              error: error,
              defaultMsg: 'Lỗi khi xóa sản phẩm',
              title: 'Lỗi Xóa'
            });
          }
        });
    }
  }

       toggleProductStatus(product: Product) {
      let confirmation: boolean;
      if (product.is_active) {
        confirmation = window.confirm('Bạn có muốn ẩn sản phẩm này ?');
      } else {
        confirmation = window.confirm('Bạn có muốn triển khai sản phẩm này ?');
      }

      if (confirmation) {
        const params = {
          productId: product.id,
          enable: !product.is_active
        };

        this.productService.toggleProductStatus(params).subscribe({
          next: (apiResponse: any) => {
            console.error('Block/unblock product successfully');
                this.toastService.showToast({
              error: null,
              defaultMsg: 'Thay đổi trạng thái sản phẩm thành cồng',
              title: 'Đã cập nhật trạng thái'
            });
              product.is_active = !product.is_active;          },
          complete: () => {
            // Handle complete event
          },
          error: (error: HttpErrorResponse) => {
            this.toastService.showToast({
              error: error,
              defaultMsg: 'Lỗi thay đổi trạng thái sản phẩm',
              title: 'Lỗi Hệ Thống'
            });
          }
        });
      }
    }


}
