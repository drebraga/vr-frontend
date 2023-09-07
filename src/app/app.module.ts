import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { NgIconsModule } from '@ng-icons/core';
import { heroPlusCircle } from '@ng-icons/heroicons/outline';
import { heroTrashSolid, heroPencilSolid } from '@ng-icons/heroicons/solid';
import { ProdutoComponent } from './pages/produto/produto.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { Error404Component } from './pages/error404/error404.component';
import { ItemProductComponent } from './components/item-product/item-product.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ProdutoComponent,
    CadastroComponent,
    Error404Component,
    ItemProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgIconsModule.withIcons({
      heroPlusCircle,
      heroTrashSolid,
      heroPencilSolid,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
