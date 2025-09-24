import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/service/category.service';
import { FavoriteService } from 'src/app/service/favorite.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastService } from 'src/app/service/toast.service';
import { TokenService } from 'src/app/service/token.service';
import { any } from 'underscore';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] =[];
  currentPage: number =0;
  itemsPerPage: number =12;
  pages: number[] =[];
  totalPages: number=0;
  visiblePages: number[]=[];
  keyword: string = "";
  selectedCategoryId: number = 0;
  categories: Category[]=[];
  categoryId: number = 0;
    styleId: number = 0;
        brandId: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getProducts(this.keyword,
       this.selectedCategoryId,
        this.currentPage,
         this.itemsPerPage);
         this.onProductClick;


  this.route.queryParams.subscribe(params => {
        this.keyword = params['keyword'] || '';
  if (params['categoryId']) {
     this.categoryId = +params['categoryId'] || 0;
    this.loadProductByCategory();
  } else if(params['styleId']) {
        this.styleId = +params['styleId'] || 0;
    this.loadProductByStyle();
  }else if(params['brandId']) {
        this.brandId = +params['brandId'] || 0;
    this.loadProductByBrand();
  } else if (this.keyword) {
      this.searchByKeyword();
  }else {
   this.getProducts(this.keyword,
       this.selectedCategoryId,
        this.currentPage,
         this.itemsPerPage);   }
});
  }


   getCategorys(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  searchProducts(){
    this.currentPage =0;
    this.itemsPerPage=12;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage,this.itemsPerPage);
  }
  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number){
    this.productService.getProductsByActive(keyword,selectedCategoryId,page,limit).subscribe({
      next:(response:any)=>{
        response.products.forEach((product: Product)=>{
          product.url=product.thumbnail
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete:()=>{
        debugger;
      },
      error:(error:any) => {
        debugger;
        console.error('Error fetching products:',error);
      }
    });
  }

  onPageChage(page: number){
    debugger;
    this.currentPage =page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
toggleFavorite(productId: number) {
  const token = this.tokenService.getToken();
  if (!token) {
    this.toastService.showToast({
      error: null,
      defaultMsg: 'Bạn cần đăng nhập để thêm vào yêu thích',
      title: 'Chưa đăng nhập',
    });
    return;
  }

  this.favoriteService.addFavoriteByCurrentUser(productId, token).subscribe({
    next: (res: any) => {
      this.toastService.showToast({
        error: null,
        defaultMsg: 'Đã thêm vào danh sách yêu thích',
        title: 'Thêm thành công',
      });
    },
    error: (error: any) => {
      this.toastService.showToast({
        error,
        defaultMsg: 'Không thể thêm vào yêu thích',
        title: 'Lỗi',
      });
    }
  });
}




generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
  const maxVisible = 5;
  if (totalPages <= 0) return []; // không có sản phẩm thì không hiện gì
  // Tính toán cửa sổ trang
  let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 0);
  let endPage = Math.min(startPage + maxVisible - 1, totalPages - 1);
  // Nếu số trang chưa đủ maxVisible thì dịch ngược startPage về 0
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(endPage - maxVisible + 1, 0);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

  onProductClick(productId: number){
    this.router.navigate(['products',productId]);
  }

loadProductByCategory() {
  this.productService.getProductsByCategoryId(this.categoryId, this.currentPage, this.itemsPerPage).subscribe({
    next: (response: any) => {
      // Lấy mảng sản phẩm (chuẩn Spring Data Page là 'content')
      const products = response.content || [];
      products.forEach((product: Product) => {
        product.url = `${environment.apiBaseUrl}/api/v1/products/images/${product.thumbnail}`;
      });
      this.products = products;
      this.totalPages = response.totalPages;
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    error: (error: any) => {
      console.error('Error fetching products:', error);
    }
  });
}
loadProductByStyle() {
  this.productService.getProductsByStyleId(this.styleId, this.currentPage, this.itemsPerPage).subscribe({
    next: (response: any) => {
      // Lấy mảng sản phẩm (chuẩn Spring Data Page là 'content')
      const products = response.content || [];
      products.forEach((product: Product) => {
        product.url = `${environment.apiBaseUrl}/api/v1/products/images/${product.thumbnail}`;
      });
      this.products = products;
      this.totalPages = response.totalPages;
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    error: (error: any) => {
      console.error('Error fetching products:', error);
    }
  });
}
loadProductByBrand() {
  this.productService.getProductsByBrandId(this.brandId, this.currentPage, this.itemsPerPage).subscribe({
    next: (response: any) => {
      // Lấy mảng sản phẩm (chuẩn Spring Data Page là 'content')
      const products = response.content || [];
      products.forEach((product: Product) => {
        product.url = `${environment.apiBaseUrl}/api/v1/products/images/${product.thumbnail}`;
      });
      this.products = products;
      this.totalPages = response.totalPages;
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    error: (error: any) => {
      console.error('Error fetching products:', error);
    }
  });
}
searchByKeyword() {
  this.productService.getProductsBySearch(this.keyword, this.currentPage, this.itemsPerPage).subscribe({
    next: (response: any) => {
      // Lấy mảng sản phẩm (chuẩn Spring Data Page là 'content')
      const products = response.content || [];
      products.forEach((product: Product) => {
        product.url = `${environment.apiBaseUrl}/api/v1/products/images/${product.thumbnail}`;
      });
      this.products = products;
      this.totalPages = response.totalPages;
      this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
    },
    error: (error: any) => {
      console.error('Error fetching products:', error);
    }
  });
}


}
