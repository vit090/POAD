import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstiloPageRoutingModule } from './estilo-routing.module';

import { EstiloPage } from './estilo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstiloPageRoutingModule
  ],
  declarations: [EstiloPage]
})
export class EstiloPageModule {}
