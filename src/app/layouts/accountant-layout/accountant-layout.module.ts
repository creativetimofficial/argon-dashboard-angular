import { AccountantLayoutRoutes } from './accountant-layout.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ComponentsModule } from 'src/app/components/components.module';
import { OrderConfirmationComponent } from 'src/app/pages/accountant/order-confirmation/order-confirmation.component';


@NgModule({
  declarations: [
    OrderConfirmationComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(AccountantLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ]
})
export class AccountantLayoutModule { }
