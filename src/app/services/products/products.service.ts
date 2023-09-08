import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url = 'http://localhost:3000/products';
  private product: Product;

  constructor(private httpClient: HttpClient) {
    this.product = {
      id: 0,
      descricao: '',
      custo: '',
      imagem: '',
    };
  }

  setProduct(item: Product) {
    this.product = item;
  }

  getProduct() {
    return this.product;
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.url)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.url + '/id/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProductBySearch(params: {
    id: string;
    descricao: string;
    custo: string;
    precoVenda: string;
  }): Observable<Product[]> {
    console.log(params);
    let paramsString = '';
    if (params.id && !isNaN(+params.id)) {
      paramsString = paramsString + 'id=' + params.id + '&';
    }
    if (params.descricao) {
      paramsString = paramsString + 'descricao=' + params.descricao + '&';
    }
    if (params.custo && !isNaN(+params.custo.replace(',', '.'))) {
      paramsString =
        paramsString + 'custo=' + params.custo.replace(',', '.') + '&';
    }
    if (params.precoVenda && !isNaN(+params.precoVenda.replace(',', '.'))) {
      paramsString =
        paramsString + 'precoVenda' + params.precoVenda.replace(',', '.');
    }

    return this.httpClient
      .get<Product[]>(this.url + '/search?' + paramsString)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteProduct(product: Product) {
    return this.httpClient
      .delete<Product>(this.url + '/' + product.id)
      .pipe(retry(1), catchError(this.handleError));
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
