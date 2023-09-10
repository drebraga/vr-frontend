import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
