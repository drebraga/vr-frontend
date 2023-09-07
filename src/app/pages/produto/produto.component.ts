import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
  products: Product[] = [];
  product = {} as Product;

  constructor(private ProductsService: ProductsService) {}
  ngOnInit() {
    this.ProductsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  getProducts() {
    this.ProductsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}
