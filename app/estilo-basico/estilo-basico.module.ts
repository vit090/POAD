import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstiloBasicoPageRoutingModule } from './estilo-basico-routing.module';

import { EstiloBasicoPage } from './estilo-basico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstiloBasicoPageRoutingModule
  ],
  declarations: [EstiloBasicoPage]
})
export class EstiloBasicoPageModule {}
