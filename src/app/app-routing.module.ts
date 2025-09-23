import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthCallbackComponent } from "./components/auth-callback/auth-callback.component";
import { DetailProductComponent } from "./components/detail-product/detail-product.component";
import { OrderComponent } from "./components/order/order.component";
import { AuthGuardFn } from "./guards/auth.guard";
import { PaymentCallbackComponent } from "./components/payment-callback/payment-callback.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminGuardFn } from "./guards/admin.guard";
import { OrderHistoryComponent } from "./components/order-history/order-history.component";
import { OrderHistoryDetailComponent } from "./components/order-history-detail/order-history-detail.component";
import { ContacComponent } from "./components/contac/contac.component";
import { IntroducesComponent } from "./components/introduces/introduces.component";
import { EmployeeComponent } from "./components/employee/employee.component";
import { EmployeeGuardFn } from "./guards/employee.guard";
import { FavoriteComponent } from "./components/favorite/favorite.component";
import { PromoModalComponent } from "./components/promo-modal/promo-modal.component";

const routes: Routes =[
    {path: '', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    { path: 'auth/google/callback', component: AuthCallbackComponent },
    { path: 'auth/facebook/callback', component: AuthCallbackComponent },
        {path:'products/:id', component: DetailProductComponent},
            {path:'orders', component: OrderComponent,canActivate:[AuthGuardFn]},
                { path: 'payments/payment-callback', component: PaymentCallbackComponent },
    {path:'user-profile', component: UserProfileComponent,canActivate:[AuthGuardFn]},// bảo mật chỉ đăng nhập mới order được
    {path:'admin', component: AdminComponent,canActivate:[AdminGuardFn]},
        {path:'employee', component: EmployeeComponent,canActivate:[EmployeeGuardFn]},
    {path:'orders-history', component: OrderHistoryComponent,canActivate:[AuthGuardFn]},
        {path:'orders-detail-history/:id', component: OrderHistoryDetailComponent,canActivate:[AuthGuardFn]},
            {path:'contact', component: ContacComponent},
                        {path:'introduces', component: IntroducesComponent},
                                                {path:'favorites', component: FavoriteComponent,canActivate:[AuthGuardFn]},
     {path:'promo', component: PromoModalComponent,canActivate:[AuthGuardFn]},

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        CommonModule
    ],
    exports:[RouterModule]
})
export class AppRoutingModule{}