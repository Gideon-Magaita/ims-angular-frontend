import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell',
  imports: [CommonModule,FormsModule],
  templateUrl: './sell.html',
  styleUrl: './sell.css',
})
export class Sell implements OnInit{

  constructor(
    private api:Api,
    private cdr:ChangeDetectorRef,
    private router:Router
  ){}

  products: any[] = []
  productId:string = ''
  description:string = ''
  quantity:string = ''
  message:string = ''

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts():void{
    this.api.getAllProducts().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.products = res.products;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get Products' + error
        );
      },
    });

  }

  //Handle form submission
  handleSubmit():void{
    if (!this.productId || !this.quantity) {
      this.showMessage("Please fill all fields")
      return;
    }
    const body = {
      productId: this.productId,
      quantity:  parseInt(this.quantity, 10),
      description: this.description
    }

    this.api.sellProduct(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage(res.message)
          this.resetForm();
          this.router.navigate(['/transaction'])
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to sell a product' + error
        );
      },
    })

  }


  resetForm():void{
    this.productId = '';
    this.description = '';
    this.quantity = '';
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
