import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecaoPage } from './selecao.page';

const routes: Routes = [
  {
    path: '',
    component: SelecaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecaoPageRoutingModule {}
