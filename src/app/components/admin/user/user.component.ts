import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from 'src/app/responses/user/user.response';
import { ToastService } from 'src/app/service/toast.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
route = inject(ActivatedRoute);
  
  users: UserResponse[] = [];        
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;
  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private router : Router
  ) {
    this.localStorage = document.defaultView?.localStorage;
   }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentUserAdminPage')) || 0;
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }
  roleLabels: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  EMPLOYEE: 'Nhân viên',
  user: 'Khách hàng'
};

  

    searchUsers() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getUsers(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  getUsers(keyword: string, page: number, limit: number) {
    this.userService.getUsers({ keyword, page, limit }).subscribe({      
      next: (apiResponse: any) => {        
        debugger
        this.users = apiResponse.users;
        this.totalPages = apiResponse.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        // Handle complete event
        debugger
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách người dùng',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }
    });
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
      onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentUserAdminPage', String(this.currentPage));
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }  
  
resetPassword(userId: number) {
  this.userService.resetPassword(userId).subscribe({
    next: (newPassword: string) => {
      this.toastService.showToast({
        error: null,
        defaultMsg: `Mật khẩu mới: ${newPassword}`,
        title: 'Reset thành công'
      });
      console.log("Mật khẩu mới: ",newPassword)
    },
    error: (error: HttpErrorResponse) => {
      this.toastService.showToast({
        error: error,
        defaultMsg: 'Lỗi reset mật khẩu',
        title: 'Lỗi hệ thống'
      });
    }
  });
}

    trackByUserId(index: number, user: UserResponse): number {
  return user.id;
}

     toggleUserStatus(user: UserResponse) {
      let confirmation: boolean;
      if (user.is_active) {
        confirmation = window.confirm('Are you sure you want to block this user?');
      } else {
        confirmation = window.confirm('Are you sure you want to enable this user?');
      }
      
      if (confirmation) {
        const params = {
          userId: user.id,
          enable: !user.is_active
        };
    
        this.userService.toggleUserStatus(params).subscribe({
          next: (apiResponse: any) => {
            console.error('Block/unblock user successfully');
                this.toastService.showToast({
              error: null,
              defaultMsg: 'Thay đổi trạng thái người dùng thành cồng',
              title: 'Đã cập nhật trạng thái'
            });
              user.is_active = !user.is_active;          },
          complete: () => {
            // Handle complete event
          },
          error: (error: HttpErrorResponse) => {
            this.toastService.showToast({
              error: error,
              defaultMsg: 'Lỗi thay đổi trạng thái người dùng',
              title: 'Lỗi Hệ Thống'
            });
          }
        });
      }      
    }


}
