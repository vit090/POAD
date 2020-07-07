import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelecaoPageRoutingModule } from './selecao-routing.module';

import { SelecaoPage } from './selecao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelecaoPageRoutingModule
  ],
  declarations: [SelecaoPage]
})
export class SelecaoPageModule {}
