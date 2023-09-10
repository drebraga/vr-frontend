//angular
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// icons
import { NgIconsModule } from '@ng-icons/core';
import { heroPlusCircle, heroXMark } from '@ng-icons/heroicons/outline';
import { heroTrashSolid, heroPencilSolid } from '@ng-icons/heroicons/solid';
import { featherSave } from '@ng-icons/feather-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// modules
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';

//components
import { StoreModalComponent } from './components/store-modal/store-modal.component';
import { ItemProductComponent } from './components/item-product/item-product.component';
import { AppComponent } from './app.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { Error404Component } from './pages/error404/error404.component';

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
    BrowserAnimationsModule,
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
    ToastrModule.forRoot(),
  ],
  providers: [DecimalPipe, StoreModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
