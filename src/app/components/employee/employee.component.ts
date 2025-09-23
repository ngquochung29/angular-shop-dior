import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/responses/user/user.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
 userResponse?:UserResponse | null;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) { }
    ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
      const url = this.router.url;
  const isEmployeeRoot = url === '/employee' || url === '/employee/';
  if (isEmployeeRoot) {
    this.router.navigate(['/employee/products']);
  }}
  
  logout() {
this.userService.removeUserFromLocalStorage();
this.tokenService.removeToken();
this.userResponse = this.userService.getUserResponseFromLocalStorage();
this.router.navigate(['/'])
}

showEmployeeComponent(componentName: string):void {
if(componentName =='products'){
  this.router.navigate(['/employee/products']);
}else if(componentName=='orders'){
  this.router.navigate(['/employee/orders']);
}else if(componentName=='list-orders'){
  this.router.navigate(['/employee/list-orders']);
}else if(componentName=='bills'){
  this.router.navigate(['/employee/bills']);
}else if(componentName=='bills-online'){
  this.router.navigate(['/employee/bills-online']);
}
}}
