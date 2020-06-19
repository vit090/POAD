import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'selecao',
    loadChildren: () => import('./selecao/selecao.module').then( m => m.SelecaoPageModule)
  },
  {
    path: 'opcoes',
    loadChildren: () => import('./opcoes/opcoes.module').then( m => m.OpcoesPageModule)
  },
  {
    path: 'estilo',
    loadChildren: () => import('./estilo/estilo.module').then( m => m.EstiloPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
