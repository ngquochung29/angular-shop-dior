import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { FavoriteService } from 'src/app/service/favorite.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  products: Product[] = [];
  favorites: any[] = [];
  userId: number = 0; // giữ nguyên để không đổi cấu trúc

  constructor(
    private favoriteService: FavoriteService,
                private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }
   onProductClick(productId: number){
    this.router.navigate(['products',productId]);
  }

  loadFavorites() {
    // ✅ Không truyền userId nữa – token đã nằm trong header ở FavoriteService
    this.favoriteService.getFavorites().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.favorites ?? data?.content ?? []);
        this.favorites = list.map((favorite: any) => {
          const p = favorite.product ? favorite.product : favorite; // BE trả Favorite -> lấy product; nếu trả thẳng Product thì dùng p
          return {
            ...p,
            url: `http://localhost:8080/api/v1/products/images/${p.thumbnail}`
          };
        });
      },
      error: (err) => {
        this.toastService.showToast({
          error: err,
          defaultMsg: 'Không tải được danh sách yêu thích',
          title: 'Lỗi'
        });
      }
    });
  }

  removeFromFavorites(productId: number) {
    // ✅ Không truyền userId nữa
    this.favoriteService.removeFavorite(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== productId);
        this.toastService.showToast({
          error: null,
          defaultMsg: 'Đã xoá khỏi danh sách yêu thích',
          title: 'Xoá thành công'
        });
      },
      error: (err) => {
        this.toastService.showToast({
          error: err,
          defaultMsg: 'Không thể xoá',
          title: 'Lỗi'
        });
      }
    });
  }
}
