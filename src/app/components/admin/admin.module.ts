import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminRoutingModule } from "./admin-routing.module";
import { ProductAdminComponent } from './product/product.admin/product.admin.component';
import { OrderAdminComponent } from './order/order.admin/order.admin.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { InsertProductAdminComponent } from './product/insert/insert.product.admin/insert.product.admin.component';
import { UpdateProductAdminComponent } from './product/update/update.product.admin/update.product.admin.component';
import { QuantiyProductComponent } from './product/update.quantity/quantiy.product/quantiy.product.component';
import { CategoriesComponent } from './categories/categories.component';
import { UpdateCategoriesComponent } from './categories/update.categories/update.categories.component';
import { InsertCategoriesComponent } from './categories/insert.categories/insert.categories.component';
import { BrandsComponent } from './brands/brands.component';
import { UpdateBrandComponent } from './brands/update.brand/update.brand.component';
import { InsertBrandComponent } from './brands/insert.brand/insert.brand.component';
import { StyleComponent } from './style/style.component';
import { UpdateStyleComponent } from './style/update.style/update.style.component';
import { InsertStyleComponent } from './style/insert.style/insert.style.component';
import { MaterialComponent } from './material/material.component';
import { InsertMaterialComponent } from './material/insert.material/insert.material.component';
import { UpdateMaterialComponent } from './material/update.material/update.material.component';
import { OriginComponent } from './origin/origin.component';
import { InsertOriginComponent } from './origin/insert.origin/insert.origin.component';
import { UpdateOriginComponent } from './origin/update.origin/update.origin.component';
import { ColorComponent } from './color/color.component';
import { InsertColorComponent } from './color/insert.color/insert.color.component';
import { UpdateColorComponent } from './color/update.color/update.color.component';
import { UserComponent } from './user/user.component';
import { EmployeeComponent } from './employee/employee.component';
import { InsertEmployeeComponent } from './employee/insert.employee/insert.employee.component';
import { UpdateEmployeeComponent } from './employee/update.employee/update.employee.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { CouponComponent } from './coupon/coupon.component';
import { BillComponent } from './bill/bill.component';
import { DetailBillComponent } from './detail-bill/detail-bill.component';
import { InsertCouponComponent } from './coupon/insert.coupon/insert.coupon.component';
import { UpdateCouponComponent } from './coupon/update.coupon/update.coupon.component';

@NgModule({
    declarations: [
        AdminComponent,
        ProductAdminComponent,
        OrderAdminComponent,
        DetailOrderComponent,
        InsertProductAdminComponent,
        UpdateProductAdminComponent,
        QuantiyProductComponent,
        CategoriesComponent,
        UpdateCategoriesComponent,
        InsertCategoriesComponent,
        BrandsComponent,
        UpdateBrandComponent,
        InsertBrandComponent,
        StyleComponent,
        UpdateStyleComponent,
        InsertStyleComponent,
        MaterialComponent,
        InsertMaterialComponent,
        UpdateMaterialComponent,
        OriginComponent,
        InsertOriginComponent,
        UpdateOriginComponent,
        ColorComponent,
        InsertColorComponent,
        UpdateColorComponent,
        UserComponent,
        EmployeeComponent,
        InsertEmployeeComponent,
        UpdateEmployeeComponent,
        StatisticsComponent,
        CouponComponent,
        BillComponent,
        DetailBillComponent,
        InsertCouponComponent,
        UpdateCouponComponent,
    ],
    imports:[
        AdminRoutingModule,
        CommonModule,
        FormsModule
    ]
})
export class AdminModule{}