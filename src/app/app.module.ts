import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { NgIconsModule } from '@ng-icons/core';
import { heroPlusCircle, heroXMark } from '@ng-icons/heroicons/outline';
import { heroTrashSolid, heroPencilSolid } from '@ng-icons/heroicons/solid';
import { featherSave } from '@ng-icons/feather-icons';

import { ProdutoComponent } from './pages/produto/produto.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { Error404Component } from './pages/error404/error404.component';
import { ItemProductComponent } from './components/item-product/item-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { StoreModalComponent } from './components/store-modal/store-modal.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ProdutoComponent,
    CadastroComponent,
    Error404Component,
    ItemProductComponent,
    StoreModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgIconsModule.withIcons({
      featherSave,
      heroPlusCircle,
      heroTrashSolid,
      heroPencilSolid,
      heroXMark,
    }),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [DecimalPipe, StoreModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
