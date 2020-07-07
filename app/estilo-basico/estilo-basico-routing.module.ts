import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstiloBasicoPage } from './estilo-basico.page';

const routes: Routes = [
  {
    path: '',
    component: EstiloBasicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstiloBasicoPageRoutingModule {}
