import { NgModule } from "@angular/core";
import { EmployeeComponent } from "./employee.component";
import { EmployeeRoutingModule } from "./employee-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProductEmployeeComponent } from './product.employee/product.employee.component';
import { DetailProductEmployeeComponent } from './detail-product-employee/detail-product-employee.component';
import { OrderEmployeeComponent } from './order-employee/order-employee.component';
import { ListOrdersEmployeeComponent } from './list-orders-employee/list-orders-employee.component';
import { DetailOrderEmployeeComponent } from './detail-order-employee/detail-order-employee.component';
import { BillCounterComponent } from './bill-counter/bill-counter.component';
import { DetailBillCounterComponent } from './detail-bill-counter/detail-bill-counter.component';
import { BillOnlineComponent } from './bill-online/bill-online.component';
import { DetailBillOnlineComponent } from './detail-bill-online/detail-bill-online.component';
import { QuantityComponent } from './product.employee/quantity/quantity.component';


@NgModule({
    declarations: [
        EmployeeComponent,
        ProductEmployeeComponent,
        DetailProductEmployeeComponent,
        OrderEmployeeComponent,
        ListOrdersEmployeeComponent,
        DetailOrderEmployeeComponent,
        BillCounterComponent,
        DetailBillCounterComponent,
        BillOnlineComponent,
        DetailBillOnlineComponent,
        QuantityComponent
    ],
    imports:[
        EmployeeRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class EmployeeModule{}