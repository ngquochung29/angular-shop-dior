import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/responses/user/user.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userResponse?:UserResponse | null;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
      const url = this.router.url;
  const isAdminRoot = url === '/admin' || url === '/admin/';
  if (isAdminRoot) {
    this.router.navigate(['/admin/orders']);
  }}
  
  logout() {
this.userService.removeUserFromLocalStorage();
this.tokenService.removeToken();
this.userResponse = this.userService.getUserResponseFromLocalStorage();
this.router.navigate(['/'])
}

showAdminComponent(componentName: string):void {
if(componentName =='orders'){
  this.router.navigate(['/admin/orders']);
}else if(componentName=='categories'){
  this.router.navigate(['/admin/categories']);
}else if(componentName=='products'){
  this.router.navigate(['/admin/products']);
}else if (componentName == 'users') {
  this.router.navigate(['/admin/users']);
    }else if (componentName == 'coupons') {
  this.router.navigate(['/admin/coupons']);
    }else if (componentName == 'brands') {
  this.router.navigate(['/admin/brands']);
    }else if (componentName == 'styles') {
  this.router.navigate(['/admin/styles']);
    }else if (componentName == 'materials') {
  this.router.navigate(['/admin/materials']);
    }else if (componentName == 'origins') {
  this.router.navigate(['/admin/origins']);
    }else if (componentName == 'colors') {
  this.router.navigate(['/admin/colors']);
    }else if (componentName == 'users') {
  this.router.navigate(['/admin/users']);
    }else if (componentName == 'employees') {
  this.router.navigate(['/admin/employees']);
    }else if (componentName == 'statisticals') {
  this.router.navigate(['/admin/statisticals']);
    }else if (componentName == 'bills') {
  this.router.navigate(['/admin/bills']);
    }
    
}

}
