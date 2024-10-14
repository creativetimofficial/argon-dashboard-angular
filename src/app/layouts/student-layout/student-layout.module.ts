import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentLayoutRoutes } from "./student-layout.routing";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ClipboardModule } from "ngx-clipboard";
import { ProductsComponent } from "src/app/pages/student/products/products.component";
import { ComponentsModule } from "src/app/components/components.module";
import { TransactionsComponent } from "src/app/pages/student/transactions/transactions.component";
import { OrderDetailsComponent } from "src/app/pages/student/transactions/order-details/order-details.component";
import { ShoppingcartComponent } from "src/app/pages/student/shoppingcart/shoppingcart.component";
import { CheckoutComponent } from "src/app/pages/student/checkout/checkout.component";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    ProductsComponent,
    TransactionsComponent,
    OrderDetailsComponent,
    ShoppingcartComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(StudentLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgxSpinnerModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudentLayoutModule {}
