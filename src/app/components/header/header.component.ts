import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { Style } from 'src/app/models/style';
import { UserResponse } from 'src/app/responses/user/user.response';
import { BrandService } from 'src/app/service/brand.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { StyleService } from 'src/app/service/style.service';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?:UserResponse |null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  categories: Category[]=[];
  selectedCategoryId: number |null = null;
  selectedStyleId: number |null = null;
    selectedBrandId: number |null = null;
    styles: Style[]=[];
      keyword: string = '';
brands: Brand[]=[];
    resetAll() {
  this.selectedCategoryId = null;
  this.selectedStyleId = null;
  this.selectedBrandId = null;

}

  constructor(private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private styleService: StyleService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private brandService:BrandService
  ) { }

   togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index:number):void{
    if(index ===0){
      this.router.navigate(['/user-profile']);
    }else if(index===1){
      this.router.navigate(['/orders-history']);
    }
    else if(index===2){
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }
    this.isPopoverOpen = false;
  }

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.getCategories(1,12);
    this.getStyles(1,12);
    this.getBrands(1,12)
  }
  setActiveNavItem(index: number){
    this.activeNavItem = index;
  }
  
  getCategories(page: number, limit: number) {
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
    getBrands(page: number, limit: number) {
    this.brandService.getBrands(page, limit).subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching brands:', error);
      }
    });
  }
  
    getStyles(page: number, limit: number) {
    this.styleService.getStyles(page, limit).subscribe({
      next: (styles: Style[]) => {
        this.styles = styles;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching styles:', error);
      }
    });
  }
  searchHeader() {
  if (this.keyword && this.keyword.trim() !== '') {
    this.router.navigate(['/'], { queryParams: { keyword: this.keyword.trim() } });
  }
  }
onChange(type: string) {
  if (type === 'category') {
    this.selectedStyleId = null;
    this.selectedBrandId = null;
    this.router.navigate(['/'], { queryParams: { categoryId: this.selectedCategoryId } });
  } else if (type === 'style') {
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.router.navigate(['/'], { queryParams: { styleId: this.selectedStyleId } });
  } else if (type === 'brand') {
    this.selectedCategoryId = null;
    this.selectedStyleId = null;
    this.router.navigate(['/'], { queryParams: { brandId: this.selectedBrandId } });
  }
}

}
