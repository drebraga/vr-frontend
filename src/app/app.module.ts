import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroPlusCircle } from '@ng-icons/heroicons/outline';
import { heroTrashSolid, heroPencilSolid } from '@ng-icons/heroicons/solid';

@NgModule({
  declarations: [AppComponent, ProductsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
