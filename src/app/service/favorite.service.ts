import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from '../models/favorite';
import { HttpUtilService } from './http.util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
   private apiUrl = 'http://localhost:8080/api/v1/favorites';

  constructor(private http: HttpClient) {}
private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // ví dụ: bạn lưu token vào localStorage
    return new HttpHeaders({
 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`    });
  }

  // Thêm sản phẩm vào favorites
  addFavorite(productId: number, token: any): Observable<Favorite> {
    return this.http.post<Favorite>(
      `${this.apiUrl}/${productId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Lấy danh sách favorites của user trong token
  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(
      `${this.apiUrl}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Xóa sản phẩm khỏi favorites
  removeFavorite(productId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${productId}`,
      { headers: this.getAuthHeaders() }
    );
  }
  addFavoriteByCurrentUser(productId: number, token: string) {
  return this.http.post(
      `${this.apiUrl}/${productId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

}
