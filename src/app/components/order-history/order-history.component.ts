import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { UserResponse } from 'src/app/responses/user/user.response';
import { OrderService } from 'src/app/service/order.service';
import { ToastService } from 'src/app/service/toast.service';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
    orders: OrderResponse[]=[];
    userId: number=0;
    token:string ='';
    userProfileForm: FormGroup;
    userResponse?:UserResponse;
  

  constructor(
        private formBuilder: FormBuilder,
            private orderService: OrderService,   
            private router: Router,
            private tokenService: TokenService,
            private toastService: ToastService,
            private userService:UserService
  ) {
     this.userProfileForm = this.formBuilder.group({
            fullname:[''],
            address:[''],
            phone_number:[''],
            date_of_birth:[Date.now()],
          });
   }

  ngOnInit(): void {
    this.getAllOrdersByCurrentUser();
    this.getProfileUser();
  }
getProfileUser(){
      this.userService.getUserDetail(this.token).subscribe({
next: (response: any) =>{
  this.userResponse ={
    ...response,
    date_of_birth: new Date(response.date_of_birth),
  };
  this.userProfileForm.patchValue({
    fullname: this.userResponse?.fullname?? '',
    address: this.userResponse?.address?? '',
    date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0,10),
  });
  this.userService.saveUserResponseToLocalStorage(this.userResponse);
},
complete:()=>{},
error: (error: any) =>{
  alert(error.error.message);
}
    })
}

getAllOrdersByCurrentUser() {
      this.token = this.tokenService.getToken()!;
  this.orderService.getAllOrdersByCurrentUser(this.token).subscribe({
    next: (response: any) => {
      // Tuỳ backend trả về mảng hay object, chọn cách gán đúng!
      this.orders = response.orders ?? response;
      
    },
    error: (error: any) => {
      this.toastService.showToast({
        error: error,
        defaultMsg: 'Lỗi tải dữ liệu',
        title: 'Lỗi',
      });
    }
  });
}
  viewDetails(order: OrderResponse) {
this.router.navigate(['/orders-detail-history',order.id]);
}


}
