import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProductsComponent } from 'src/app/pages/custodian/products/products.component';
import { CustodianLayoutRoutes } from './custodian-layout.routing';
import { ClipboardModule } from 'ngx-clipboard';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from 'src/app/components/table/table.component';
import { OrderPickupComponent } from 'src/app/pages/custodian/order-pickup/order-pickup.component';



@NgModule({
  declarations: [
    ProductsComponent,
    OrderPickupComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(CustodianLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ]
})

export class CustodianLayoutModule { }
