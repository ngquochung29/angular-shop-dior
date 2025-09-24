import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';
import { PaymentCallbackComponent } from './components/payment-callback/payment-callback.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { BannerComponent } from './components/banner/banner.component';
import { AdminModule } from './components/admin/admin.module';
import { EmployeeModule } from './components/employee/employee.module';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderHistoryDetailComponent } from './components/order-history-detail/order-history-detail.component';
import { ContacComponent } from './components/contac/contac.component';
import { IntroducesComponent } from './components/introduces/introduces.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { PromoModalComponent } from './components/promo-modal/promo-modal.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxSpinnerModule} from "ngx-spinner";
import {LoadingInterceptor} from "./app/loading.interceptor";
import {LoadingSpinnerComponent} from "./app/loading-spinner.component";




@NgModule({
  declarations: [
    AppComponent,
       DetailProductComponent,
       FooterComponent,
       HeaderComponent,
       HomeComponent,
       LoginComponent,
       OrderComponent,
       PaymentCallbackComponent,
       RegisterComponent,
       UserProfileComponent,
       AuthCallbackComponent,
       BannerComponent,
       OrderHistoryComponent,
       OrderHistoryDetailComponent,
       ContacComponent,
       IntroducesComponent,
       FavoriteComponent,
       PromoModalComponent,
    LoadingSpinnerComponent
  ],
  imports: [
        BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    AdminModule,
    EmployeeModule,
    BrowserAnimationsModule,  // bắt buộc để spinner chạy animation
    NgxSpinnerModule.forRoot({ type: 'ball-spin-clockwise' }) // chọn style spinner
  ],
  providers: [
    {
    provide:HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi:true,
  },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
