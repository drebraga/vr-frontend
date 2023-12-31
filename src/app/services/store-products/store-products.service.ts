import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, catchError, retry, throwError } from 'rxjs';
import { FullProduct } from 'src/app/models/full-product';
import { RegisterProductObj } from 'src/app/models/register-product-obj';
import { StorePriced } from 'src/app/models/store';

@Injectable({
  providedIn: 'root',
})
export class StoreProductsService {
  url = 'http://localhost:3000/store-products';
  requisitionObject = {
    descricao: '',
    lojas: [],
  } as RegisterProductObj;
  storesPrices = [] as StorePriced[];
  private updateStoreProducts = new Subject<void>();
  updateStoreProducts$ = this.updateStoreProducts.asObservable();

  constructor(private httpClient: HttpClient) {}

  getProduct(id: number): Observable<FullProduct> {
    return this.httpClient
      .get<FullProduct>(this.url + '/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getStorePrices(): StorePriced[] {
    return this.storesPrices;
  }

  clearStorePrices(): void {
    this.storesPrices = [];
    this.requisitionObject = {
      descricao: '',
      lojas: [],
    };
  }

  saveRequisitionProductObj(productForm: FormGroup): RegisterProductObj | null {
    if (this.requisitionObject.lojas.length < 1) return null;
    if (productForm.value.descricao) {
      this.requisitionObject.descricao = productForm.value.descricao;
    }
    if (
      productForm.value?.custo &&
      !isNaN(+productForm.value.custo.replace(',', '.'))
    ) {
      this.requisitionObject.custo = +productForm.value.custo.replace(',', '.');
    }

    return this.requisitionObject;
  }

  saveImageProductObj(image: string): void {
    if (image) {
      this.requisitionObject.imagem = image;
    }
  }

  insertStoreRequisitionObj(store: {
    loja: {
      id: number;
      descricao: string;
    };
    precoVenda: string;
  }): void {
    if (
      store.loja.id &&
      !isNaN(store.loja.id) &&
      store.precoVenda &&
      !isNaN(+store.precoVenda.replace(',', '.'))
    ) {
      this.requisitionObject.lojas = [
        ...this.requisitionObject.lojas,
        { id: store.loja.id, precoVenda: +store.precoVenda.replace(',', '.') },
      ];
      this.storesPrices = [...this.storesPrices, store];
    }
  }

  updateStoreRequisitionObj(
    id: number,
    store: {
      loja: {
        id: number;
        descricao: string;
      };
      precoVenda: string;
    }
  ): void {
    this.requisitionObject.lojas = this.requisitionObject.lojas.map((s) => {
      if (s.id === store.loja.id) {
        return {
          id: store.loja.id,
          precoVenda: +store.precoVenda.replace(',', '.'),
        };
      } else {
        return s;
      }
    });

    this.storesPrices = this.storesPrices.map((s) => {
      if (s.loja.id === store.loja.id) {
        return {
          loja: { id: store.loja.id, descricao: store.loja.descricao },
          precoVenda: store.precoVenda,
        };
      } else {
        return s;
      }
    });
  }

  deleteStoreProduct(id: number): void {
    const filter1 = this.requisitionObject.lojas.filter((e) => e.id !== id);
    const filter2 = this.storesPrices.filter((e) => e.loja.id !== id);

    if (!id) return;
    this.requisitionObject.lojas = [...filter1];
    this.storesPrices = [...filter2];
  }

  notifyUpdateStoreProducts(): void {
    this.updateStoreProducts.next();
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
