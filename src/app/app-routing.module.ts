import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoComponent } from './pages/produto/produto.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { Error404Component } from './pages/error404/error404.component';

const routes: Routes = [
  { path: 'produto/cadastro', component: CadastroComponent },
  { path: 'produto/cadastro/:id', component: CadastroComponent },
  { path: 'produto', component: ProdutoComponent },
  { path: '', redirectTo: '/produto', pathMatch: 'full' },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
