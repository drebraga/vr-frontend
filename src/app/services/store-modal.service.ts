import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreModalService {
  hidden: boolean = false;

  constructor() {}

  getStoreModal() {
    return this.hidden;
  }

  toggleStoreModal() {
    this.hidden = !this.hidden;
  }
}
