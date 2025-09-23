import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { ProductAdminComponent } from "./product/product.admin/product.admin.component";
import { OrderAdminComponent } from "./order/order.admin/order.admin.component";
import { DetailOrderComponent } from "./detail-order/detail-order.component";
import { InsertProductAdminComponent } from "./product/insert/insert.product.admin/insert.product.admin.component";
import { UpdateProductAdminComponent } from "./product/update/update.product.admin/update.product.admin.component";
import { QuantiyProductComponent } from "./product/update.quantity/quantiy.product/quantiy.product.component";
import { CategoriesComponent } from "./categories/categories.component";
import { UpdateCategoriesComponent } from "./categories/update.categories/update.categories.component";
import { InsertCategoriesComponent } from "./categories/insert.categories/insert.categories.component";
import { BrandsComponent } from "./brands/brands.component";
import { UpdateBrandComponent } from "./brands/update.brand/update.brand.component";
import { InsertBrandComponent } from "./brands/insert.brand/insert.brand.component";
import { StyleComponent } from "./style/style.component";
import { UpdateStyleComponent } from "./style/update.style/update.style.component";
import { InsertStyleComponent } from "./style/insert.style/insert.style.component";
import { MaterialComponent } from "./material/material.component";
import { UpdateMaterialComponent } from "./material/update.material/update.material.component";
import { InsertMaterialComponent } from "./material/insert.material/insert.material.component";
import { OriginComponent } from "./origin/origin.component";
import { UpdateOriginComponent } from "./origin/update.origin/update.origin.component";
import { InsertOriginComponent } from "./origin/insert.origin/insert.origin.component";
import { ColorComponent } from "./color/color.component";
import { UpdateColorComponent } from "./color/update.color/update.color.component";
import { InsertColorComponent } from "./color/insert.color/insert.color.component";
import { UserComponent } from "./user/user.component";
import { EmployeeComponent } from "./employee/employee.component";
import { UpdateEmployeeComponent } from "./employee/update.employee/update.employee.component";
import { InsertEmployeeComponent } from "./employee/insert.employee/insert.employee.component";
import { AdminGuardFn } from "src/app/guards/admin.guard";
import { StatisticsComponent } from "./statistics/statistics.component";
import { CouponComponent } from "./coupon/coupon.component";
import { BillComponent } from "./bill/bill.component";
import { DetailBillComponent } from "./detail-bill/detail-bill.component";
import { InsertCouponComponent } from "./coupon/insert.coupon/insert.coupon.component";
import { UpdateCouponComponent } from "./coupon/update.coupon/update.coupon.component";

const routes: Routes =[
    {
        path: 'admin',
        component: AdminComponent,
        children: [
    {
                path: 'products',
                component: ProductAdminComponent,canActivate:[AdminGuardFn]
    },    
    {
                path: 'orders',
                component: OrderAdminComponent,canActivate:[AdminGuardFn]
            },
                {
                path: 'orders/:id',
                component: DetailOrderComponent,canActivate:[AdminGuardFn]
            },
              {
                path:'products/insert',
                component: InsertProductAdminComponent,canActivate:[AdminGuardFn]
            },
                  {
                path:'products/update/:id',
                component: UpdateProductAdminComponent,canActivate:[AdminGuardFn]
            },
              {
                path:'products/detail/:id',
                component: QuantiyProductComponent,canActivate:[AdminGuardFn]
            },
                     {
                path:'categories',
                component: CategoriesComponent,canActivate:[AdminGuardFn]
            },
            {
                path: 'categories/update/:id',
                component: UpdateCategoriesComponent,canActivate:[AdminGuardFn]
            },
            {
                  path:'categories/insert',
                component: InsertCategoriesComponent,canActivate:[AdminGuardFn]
            },
                      {
                path:'brands',
                component: BrandsComponent,canActivate:[AdminGuardFn]
            },
             {
                path: 'brand/update/:id',
                component: UpdateBrandComponent,canActivate:[AdminGuardFn]
            },
                    {
                path: 'brand/insert',
                component: InsertBrandComponent,canActivate:[AdminGuardFn]
            },
                         {
                path:'coupons',
                component: CouponComponent,canActivate:[AdminGuardFn]
            },
            {
                path: 'coupons/insert',
                component: InsertCouponComponent,canActivate:[AdminGuardFn]
            },
               {
                path: 'coupons/update',
                component: UpdateCouponComponent,canActivate:[AdminGuardFn]
            }, 
                                 {
                path:'styles',
                component: StyleComponent,canActivate:[AdminGuardFn]
            },       
            {
                path: 'styles/update/:id',
                component: UpdateStyleComponent,canActivate:[AdminGuardFn]
            },
            {
                path: 'styles/insert',
                component: InsertStyleComponent,canActivate:[AdminGuardFn]
            },
            {
                path:'materials',
                component: MaterialComponent,canActivate:[AdminGuardFn]
            },  
            {
                path: 'materials/update/:id',
                component: UpdateMaterialComponent,canActivate:[AdminGuardFn]
            },
                    {
                path: 'materials/insert',
                component: InsertMaterialComponent,canActivate:[AdminGuardFn]
            },
                             {
                path:'origins',
                component: OriginComponent,canActivate:[AdminGuardFn]
            },  
                  {
                path: 'origins/update/:id',
                component: UpdateOriginComponent,canActivate:[AdminGuardFn]
            },
                    {
                path: 'origins/insert',
                component: InsertOriginComponent,canActivate:[AdminGuardFn]
            },
                                {
                path:'colors',
                component: ColorComponent,canActivate:[AdminGuardFn]
            },  
                  {
                path: 'colors/update/:id',
                component: UpdateColorComponent,canActivate:[AdminGuardFn]
            },
                    {
                path: 'colors/insert',
                component: InsertColorComponent,canActivate:[AdminGuardFn]
            },{
                path: 'users',
                component: UserComponent,canActivate:[AdminGuardFn]
            },{
                path:'employees',
                component: EmployeeComponent,canActivate:[AdminGuardFn]
            },  
                  {
                path: 'employees/update/:id',
                component: UpdateEmployeeComponent,canActivate:[AdminGuardFn]
            },
                    {
                path: 'employees/insert',
                component: InsertEmployeeComponent,canActivate:[AdminGuardFn]
            },
             {
                path: 'statisticals',
                component: StatisticsComponent,canActivate:[AdminGuardFn]
    },  
               {
                path: 'bills',
                component: BillComponent,canActivate:[AdminGuardFn]
    },  
                 {
                path: 'bills/:id',
                component: DetailBillComponent,canActivate:[AdminGuardFn]
            },
            
        ]
    }
];
@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule]
})
export class AdminRoutingModule{}