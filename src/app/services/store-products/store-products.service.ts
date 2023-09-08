import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { FullProduct } from 'src/app/models/full-product';

@Injectable({
  providedIn: 'root',
})
export class StoreProductsService {
  url = 'http://localhost:3000/store-products';

  constructor(private httpClient: HttpClient) {}

  getProduct(id: number) {
    return this.httpClient
      .get<FullProduct>(this.url + '/' + id)
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
