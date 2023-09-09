import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorePriced } from 'src/app/models/store';

@Injectable({
  providedIn: 'root',
})
export class StoreModalService {
  hidden: boolean = false;
  private updateStorePriced = new Subject<void>();
  updateStorePriced$ = this.updateStorePriced.asObservable();

  constructor() {}

  getStoreModal() {
    return this.hidden;
  }

  notifyUpdateStorePriced() {
    this.updateStorePriced.next();
  }

  toggleStoreModal() {
    this.hidden = !this.hidden;
  }
}
