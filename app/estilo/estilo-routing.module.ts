import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstiloPage } from './estilo.page';

const routes: Routes = [
  {
    path: '',
    component: EstiloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstiloPageRoutingModule {}
