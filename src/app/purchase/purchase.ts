import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule,FormsModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.css',
})
export class Purchase implements OnInit {
 constructor(
  private api:Api,
  private cdr:ChangeDetectorRef,
  private router:Router
 ){}


  products: any[] = []
  suppliers: any[] = []
  productId:string = ''
  supplierId:string = ''
  description:string = ''
  quantity:string = ''
  message:string = ''


  ngOnInit(): void {
    this.fetchProductsAndSuppliers();
  }

   fetchProductsAndSuppliers():void{
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

    this.api.getAllSuppliers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.suppliers = res.suppliers;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get suppliers' + error
        );
      },
    })
  }

  //Handle form submission
  handleSubmit():void{
    if (!this.productId || !this.supplierId || !this.quantity) {
      this.showMessage("Please fill all fields")
      return;
    }
    const body = {
      productId: this.productId,
      supplierId: this.supplierId,
      quantity:  parseInt(this.quantity, 10),
      description: this.description
    }

    this.api.purchaseProduct(body).subscribe({
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
            'Unable to get purchase a product' + error
        );
      },
    })

  }


  resetForm():void{
    this.productId = '';
    this.supplierId = '';
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
