import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: any = null; // Stores the selected product for detailed view

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      console.log(this.products);
    });
  }


  getProductByCode(code: string): void {
    this.productService.getProductByCode(code).subscribe(product => {
      this.selectedProduct = product;
    });
  }


  selectProduct(product: any): void {
    this.router.navigate(['/student/products', product.code]);
  }

  // Method to go back to the product list
  backToProducts(): void {
    this.router.navigate(['/student/products'], {
      queryParams: {} 
    });
  }
}
