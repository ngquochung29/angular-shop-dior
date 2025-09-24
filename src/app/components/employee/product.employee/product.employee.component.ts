import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ApiResponse } from 'src/app/responses/api.response';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastService } from 'src/app/service/toast.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-product.employee',
  templateUrl: './product.employee.component.html',
  styleUrls: ['./product.employee.component.scss']
})
export class ProductEmployeeComponent implements OnInit {

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
    this.currentPage =Number(localStorage.getItem('currentProductDetailEmployeePage')) || 0;
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
   onProductClick(productId: number){
    this.router.navigate(['/employee/products',productId]);
  }
    updateQuantity(productId: number){
    this.router.navigate(['/employee/products/detail',productId]);
  }
  getProducts(keyword:string, selectedCategoryId:number,page: number,limit: number){
    this.productService.getProductsByActive(keyword,selectedCategoryId,page,limit).subscribe({
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
    localStorage.setItem('currentProductDetailEmployeePage',String(this.currentPage));
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



}
