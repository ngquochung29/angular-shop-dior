import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-bill-counter',
  templateUrl: './bill-counter.component.html',
  styleUrls: ['./bill-counter.component.scss']
})
export class BillCounterComponent implements OnInit {

orders: OrderResponse[]=[];
  currentPage: number =0;
  itemsPerPage: number =12;
  pages: number[] = [];
  totalPages: number =0;
  keyword: string ="";
  visiblePages: number[]=[];
  trackByOrderId(index: number, order: any) {
  return order.id;
}

  constructor(
    private orderService: OrderService,   
    private router: Router
) { }

  ngOnInit(): void {
        this.currentPage =Number(localStorage.getItem('currentOrdersAdminPage')) || 0;
    this.getAllOrders(this.keyword,this.currentPage,this.itemsPerPage);
  }
  searchOrders() {
  this.currentPage =0;
    this.itemsPerPage =12;
      this.getAllOrders(this.keyword.trim(),this.currentPage,this.itemsPerPage);
}

  
   getAllOrders(keyword: string, page: number, limit: number){
      this.orderService.getAllBillsToCounter(keyword,page,limit).subscribe({
        next:(response:any)=>{
          debugger
          this.orders = response.orders;
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

    deleteOrder(id: number) {
const confirmation = window.confirm('Are you sure you want to delete this order?');
if(confirmation){
  this.orderService.deleteOrder(id).subscribe({
    next:(response: any) =>{
      location.reload();
    },
    complete:()=>{},
      error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        }
  })
}
    }
onPageChange(page: number) {
this.currentPage = page<0?0:page;
    localStorage.setItem('currentOrdersAdminPage',String(this.currentPage));
  this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage); 
}


  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
  }

  viewDetails(order: OrderResponse) {
this.router.navigate(['/employee/bills',order.id]);
}

}
