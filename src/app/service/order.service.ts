import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../responses/api.response';
import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { OrderListResponse } from '../responses/order/order.list.response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 private apiUrl = `${environment.apiBaseUrl}/api/v1/orders`;
  constructor(private http: HttpClient) { }

  placeOrder(orderData:OrderDTO): Observable<any>{
    //gui yc dat hang
    return this.http.post(this.apiUrl,orderData);
  }
    placeOrderEmployee(orderData:OrderDTO): Observable<any>{
    //gui yc dat hang
    return this.http.post(`${this.apiUrl}/employee`,orderData);
  }
  getOrderById(orderId:number):Observable<any>{
    const url =`${this.apiUrl}/${orderId}`;
    return this.http.get(url);
  }
getAllOrders(
  keyword: string,
  page: number,
  limit: number
): Observable<OrderListResponse> {
  const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());
  return this.http.get<OrderListResponse>(`${this.apiUrl}/get-orders-by-keyword`, { params });
}
getAllBills(
  keyword: string,
  page: number,
  limit: number
): Observable<OrderListResponse> {
  const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());
  return this.http.get<OrderListResponse>(`${this.apiUrl}/get-bills-by-keyword`, { params });
}
getAllBillsToCounter(
  keyword: string,
  page: number,
  limit: number
): Observable<OrderListResponse> {
  const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());
  return this.http.get<OrderListResponse>(`${this.apiUrl}/counter/get-bills-by-keyword`, { params });
}
getAllBillsOnline(
  keyword: string,
  page: number,
  limit: number
): Observable<OrderListResponse> {
  const params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('limit', limit.toString());
  return this.http.get<OrderListResponse>(`${this.apiUrl}/online/get-bills-by-keyword`, { params });
}

updateOrder(orderId: number,orderData: OrderDTO): Observable<any>{
  const url =  `${this.apiUrl}/${orderId}`;
  return this.http.put(url,orderData);
}
deleteOrder(orderId:number): Observable<any>{
  const url =  `${this.apiUrl}/${orderId}`;
  return this.http.delete(url,{responseType:'text'});
}
  updateOrderStatus(orderId: number, status: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${orderId}/status`;
    const params = new HttpParams().set('status', status); // Thêm tham số status vào query params
    return this.http.put<ApiResponse>(url, null, { params }); // Gửi yêu cầu PUT với tham số status
  }
getAllOrdersByCurrentUser(token: string): Observable<OrderListResponse> {
  return this.http.get<OrderListResponse>(
    `${this.apiUrl}/find-order-by-user`,
    {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    }
  );
}



}
