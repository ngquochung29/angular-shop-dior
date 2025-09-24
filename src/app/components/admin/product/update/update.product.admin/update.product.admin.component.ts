import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateProductDTO } from 'src/app/dtos/product/update.product.dto';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { Material } from 'src/app/models/material';
import { Origin } from 'src/app/models/origin';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { Style } from 'src/app/models/style';
import { BrandService } from 'src/app/service/brand.service';
import { CategoryService } from 'src/app/service/category.service';
import { MaterialService } from 'src/app/service/material.service';
import { OriginService } from 'src/app/service/origin.service';
import { ProductService } from 'src/app/service/product.service';
import { StyleService } from 'src/app/service/style.service';
import { ToastService } from 'src/app/service/toast.service';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-update.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss']
})
export class UpdateProductAdminComponent implements OnInit {
  productId: number;
  product: Product;
  updatedProduct: Product;
  categories: Category[] = [];
  currentImageIndex: number = 0;
  images: File[] = [];
  brands: Brand[]=[];
  materials: Material[]=[];
  styles: Style[]=[];
  origins: Origin[]=[];
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastService: ToastService,
      private brandService: BrandService,
      private materialService: MaterialService,
      private styleService: StyleService,
      private originService: OriginService    )
    {
    this.productId = 0;
    this.product = {} as Product;
    this.updatedProduct = {} as Product;
  }

  ngOnInit(): void {
       this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.getProductDetails();
    });
    this.getCategories(1, 100);
    this.getBrands(1,100);
    this.getMaterials(1,100);
    this.getOrigins(1,100);
    this.getStyles(1,100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
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
        complete: () => {},
        error: (error: any) => {
          console.log('Error fetching brands', error);
        },
      });
    }
          getMaterials(page: number, limit: number) {
      this.materialService.getMaterials(page, limit).subscribe({
        next: (materials: Material[]) => {
          this.materials = materials;
        },
        complete: () => {},
        error: (error: any) => {
          console.log('Error fetching material', error);
        },
      });
    }
        getStyles(page: number, limit: number) {
      this.styleService.getStyles(page, limit).subscribe({
        next: (styles: Style[]) => {
          this.styles = styles;
        },
        complete: () => {},
        error: (error: any) => {
          console.log('Error fetching style', error);
        },
      });
    }
        getOrigins(page: number, limit: number) {
      this.originService.getOrigins(page, limit).subscribe({
        next: (origins: Origin[]) => {
          this.origins = origins;
        },
        complete: () => {},
        error: (error: any) => {
          console.log('Error fetching origins', error);
        },
      });
    }
    getProductDetails(): void {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.updatedProduct = { ...product };
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }
    updateProduct() {
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id,
      brand_id: this.updatedProduct.brand_id,
      material_id: this.updatedProduct.material_id,
      style_id: this.updatedProduct.style_id,
      origin_id: this.updatedProduct.origin_id,
    };
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: (response: any) => {
        debugger
        this.toastService.showToast({
             error: null,
                defaultMsg: 'Sửa sản phẩm thành công',
                title: 'Thành công',
        })
      },
      complete: () => {
        debugger;
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
              this.toastService.showToast({
                error: error,
                defaultMsg: 'Lỗi update sản phẩm',
                title: 'Thất bại',
              });
      }
    });
  }
    showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
        this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
   thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
 onFileChange(event: any) {
  const files: FileList = event.target.files;

  if (files.length > 5) {
    alert('Please select a maximum of 5 images.');
    return;
  }

  const fileArray: File[] = Array.from(files);
  const formData = new FormData();

  for (const file of fileArray) {
    formData.append('files', file); // key phải trùng với backend: @RequestParam("files")
  }

  this.productService.uploadImage(this.productId, formData).subscribe({
    next: (imageResponse) => {
      console.log('Images uploaded successfully:', imageResponse);
      this.images = [];
      this.getProductDetails();
    },
    error: (error) => {
      alert(error.error);
      console.error('Error uploading images:', error);
    }
  });
}

   deleteImage(productImage: ProductImage) {
    if (confirm('Are you sure you want to remove this image?')) {
      this.productService.deleteProductImage(productImage.id).subscribe({
        next:(productImage: ProductImage) => {

        this.getProductDetails();
        },
        error: (error) => {
              this.toastService.showToast({
                error: error,
                defaultMsg: 'Lỗi khi xóa ảnh sản phẩm',
                title: 'Lỗi Xóa Ảnh',
              });
          alert(error.error)
          console.error('Error deleting images:', error);
        }
      });
    }
  }

}
